use anyhow::Result;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug)]
pub struct CleanupSuggestion {
    pub path: PathBuf,
    pub size_bytes: u64,
    pub category: String,
    pub description: String,
}

/// Scan for cleanup opportunities. Non-destructive - only reports.
pub fn scan_cleanup(home: &Path) -> Result<Vec<CleanupSuggestion>> {
    let mut suggestions = Vec::new();

    // Check for node_modules directories
    scan_pattern(
        home,
        "node_modules",
        3,
        &mut suggestions,
        "npm cache",
        "Unused node_modules directory",
    );

    // Check common cache locations
    let cache_dirs = [
        (home.join(".cache"), "System cache"),
        (home.join(".npm/_cacache"), "npm cache"),
        (home.join(".cargo/registry/cache"), "Cargo cache"),
    ];
    for (path, desc) in &cache_dirs {
        if path.exists() {
            if let Ok(size) = dir_size(path) {
                if size > 100_000_000 {
                    // > 100MB
                    suggestions.push(CleanupSuggestion {
                        path: path.clone(),
                        size_bytes: size,
                        category: "cache".to_string(),
                        description: format!("{desc} ({:.1} GB)", size as f64 / 1_073_741_824.0),
                    });
                }
            }
        }
    }

    // Check /tmp for old files
    if let Ok(entries) = fs::read_dir("/tmp") {
        let mut tmp_size = 0u64;
        for entry in entries.flatten() {
            if let Ok(meta) = entry.metadata() {
                tmp_size += meta.len();
            }
        }
        if tmp_size > 500_000_000 {
            // > 500MB
            suggestions.push(CleanupSuggestion {
                path: PathBuf::from("/tmp"),
                size_bytes: tmp_size,
                category: "temp".to_string(),
                description: format!("Temp files ({:.1} GB)", tmp_size as f64 / 1_073_741_824.0),
            });
        }
    }

    suggestions.sort_by(|a, b| b.size_bytes.cmp(&a.size_bytes));
    Ok(suggestions)
}

fn scan_pattern(
    base: &Path,
    name: &str,
    max_depth: usize,
    out: &mut Vec<CleanupSuggestion>,
    category: &str,
    description: &str,
) {
    fn walk(
        dir: &Path,
        name: &str,
        depth: usize,
        max_depth: usize,
        out: &mut Vec<CleanupSuggestion>,
        category: &str,
        description: &str,
    ) {
        if depth > max_depth {
            return;
        }
        let Ok(entries) = fs::read_dir(dir) else {
            return;
        };
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if entry.file_name() == name {
                    if let Ok(size) = dir_size(&path) {
                        if size > 50_000_000 {
                            // > 50MB
                            out.push(CleanupSuggestion {
                                path: path.clone(),
                                size_bytes: size,
                                category: category.to_string(),
                                description: format!(
                                    "{description} ({:.1} MB)",
                                    size as f64 / 1_048_576.0
                                ),
                            });
                        }
                    }
                } else {
                    walk(
                        &path,
                        name,
                        depth + 1,
                        max_depth,
                        out,
                        category,
                        description,
                    );
                }
            }
        }
    }
    walk(base, name, 0, max_depth, out, category, description);
}

fn dir_size(path: &Path) -> Result<u64> {
    let mut size = 0u64;
    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let meta = entry.metadata()?;
            if meta.is_dir() {
                size += dir_size(&entry.path()).unwrap_or(0);
            } else {
                size += meta.len();
            }
        }
    }
    Ok(size)
}

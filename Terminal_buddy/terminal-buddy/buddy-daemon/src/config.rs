use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct BuddyConfig {
    pub behavior: BehaviorConfig,
    pub ai: AiConfig,
    pub storage: StorageConfig,
    pub cleanup: CleanupConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct BehaviorConfig {
    pub copilot_personality: String,
    pub explain_level: String,
    pub session_titling: String,
    pub teachable_moments: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct AiConfig {
    /// LLM provider: "claude", "gemini", or "openrouter"
    pub provider: String,
    /// Model override (uses provider default if not set)
    pub model: Option<String>,
    /// API key (env var takes precedence: ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY)
    pub api_key: Option<String>,
    pub privacy_mode: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct StorageConfig {
    pub data_dir: String,
    pub max_storage_gb: u64,
    /// Path to Memvid .mv2 memory file
    pub memory_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct CleanupConfig {
    pub auto_scan_interval: String,
    pub scan_paths: Vec<String>,
}

impl Default for BuddyConfig {
    fn default() -> Self {
        Self {
            behavior: BehaviorConfig::default(),
            ai: AiConfig::default(),
            storage: StorageConfig::default(),
            cleanup: CleanupConfig::default(),
        }
    }
}

impl Default for BehaviorConfig {
    fn default() -> Self {
        Self {
            copilot_personality: "active".into(),
            explain_level: "beginner".into(),
            session_titling: "suggest".into(),
            teachable_moments: "inline".into(),
        }
    }
}

impl Default for AiConfig {
    fn default() -> Self {
        Self {
            provider: "openrouter".into(),
            model: None,
            api_key: None,
            privacy_mode: false,
        }
    }
}

impl AiConfig {
    /// Resolve the API key: env var takes precedence over config file value.
    pub fn resolve_api_key(&self) -> Option<String> {
        let env_var = match self.provider.as_str() {
            "claude" => "ANTHROPIC_API_KEY",
            "gemini" => "GEMINI_API_KEY",
            "openrouter" => "OPENROUTER_API_KEY",
            _ => "ANTHROPIC_API_KEY",
        };
        std::env::var(env_var)
            .ok()
            .or_else(|| self.api_key.clone())
    }
}

impl Default for StorageConfig {
    fn default() -> Self {
        let data_dir = dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("terminal-buddy")
            .display()
            .to_string();
        Self {
            data_dir,
            max_storage_gb: 10,
            memory_path: None,
        }
    }
}

impl Default for CleanupConfig {
    fn default() -> Self {
        Self {
            auto_scan_interval: "weekly".into(),
            scan_paths: vec!["~".into()],
        }
    }
}

impl BuddyConfig {
    pub fn load() -> Result<Self> {
        let config_dir = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("terminal-buddy");

        let config_path = config_dir.join("buddy.toml");
        if config_path.exists() {
            let content = std::fs::read_to_string(&config_path)?;
            Ok(toml::from_str(&content)?)
        } else {
            Ok(Self::default())
        }
    }

    pub fn data_dir(&self) -> PathBuf {
        PathBuf::from(&self.storage.data_dir)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = BuddyConfig::default();
        assert_eq!(config.behavior.explain_level, "beginner");
        assert_eq!(config.ai.provider, "openrouter");
        assert!(config.ai.model.is_none());
        assert!(config.ai.api_key.is_none());
        assert!(!config.ai.privacy_mode);
    }

    #[test]
    fn test_parse_toml() {
        let toml_str = r#"
[behavior]
copilot_personality = "teacher"
explain_level = "expert"

[ai]
provider = "openrouter"
model = "anthropic/claude-sonnet-4-5"
privacy_mode = true
"#;
        let config: BuddyConfig = toml::from_str(toml_str).unwrap();
        assert_eq!(config.behavior.copilot_personality, "teacher");
        assert_eq!(config.behavior.explain_level, "expert");
        assert!(config.ai.privacy_mode);
        assert_eq!(config.ai.provider, "openrouter");
        assert_eq!(config.ai.model.as_deref(), Some("anthropic/claude-sonnet-4-5"));
    }
}

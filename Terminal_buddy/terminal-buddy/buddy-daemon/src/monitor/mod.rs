pub mod cleanup;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use shared::SystemSnapshot;
use sysinfo::{ProcessStatus, System};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::process::Command;

/// Detailed process information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub cmd: String,
    pub cpu_usage: f32,
    pub memory_bytes: u64,
    pub memory_percent: f32,
    pub parent_pid: Option<u32>,
    pub start_time: Option<u64>,
    pub status: String,
    pub user_id: Option<u32>,
}

/// Network port information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PortInfo {
    pub port: u16,
    pub protocol: String, // "tcp" or "udp"
    pub address: String,
    pub pid: Option<u32>,
    pub process_name: Option<String>,
    pub state: String,
}

/// Service information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceInfo {
    pub name: String,
    pub display_name: String,
    pub status: String, // "running", "stopped", "failed"
    pub enabled: bool,
    pub description: Option<String>,
}

/// Package installation info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PackageInfo {
    pub name: String,
    pub version: String,
    pub installed_at: Option<DateTime<Utc>>,
    pub package_type: String, // "apt", "cargo", "npm", "pip"
}

/// Boot item information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BootItem {
    pub name: String,
    pub command: String,
    pub item_type: String, // "systemd", "cron", "startup_app"
    pub enabled: bool,
}

/// Deep system health snapshot
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeepSystemSnapshot {
    // Basic metrics
    pub timestamp: DateTime<Utc>,
    pub cpu_usage_pct: f32,
    pub memory_used_bytes: u64,
    pub memory_total_bytes: u64,
    pub memory_usage_pct: f32,
    pub disk_used_bytes: u64,
    pub disk_total_bytes: u64,
    pub disk_usage_pct: f32,
    pub process_count: usize,

    // Deep awareness
    pub top_cpu_processes: Vec<ProcessInfo>,
    pub top_memory_processes: Vec<ProcessInfo>,
    pub open_ports: Vec<PortInfo>,
    pub running_services: Vec<ServiceInfo>,
    pub recently_installed_packages: Vec<PackageInfo>,
    pub boot_items: Vec<BootItem>,

    // Additional context
    pub hostname: String,
    pub uptime_seconds: u64,
    pub kernel_version: String,
}

pub struct SystemMonitor {
    sys: System,
}

impl SystemMonitor {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self { sys }
    }

    pub fn snapshot(&mut self) -> SystemSnapshot {
        self.sys.refresh_all();

        let disks = sysinfo::Disks::new_with_refreshed_list();
        let (disk_used, disk_total) = disks.list().iter().fold((0u64, 0u64), |acc, d| {
            (
                acc.0 + (d.total_space() - d.available_space()),
                acc.1 + d.total_space(),
            )
        });

        SystemSnapshot {
            timestamp: Utc::now(),
            cpu_usage_pct: self.sys.global_cpu_info().cpu_usage(),
            memory_used_bytes: self.sys.used_memory(),
            memory_total_bytes: self.sys.total_memory(),
            disk_used_bytes: disk_used,
            disk_total_bytes: disk_total,
            process_count: self.sys.processes().len(),
        }
    }

    /// Get deep system awareness snapshot
    pub fn deep_snapshot(&mut self) -> DeepSystemSnapshot {
        self.sys.refresh_all();
        self.sys.refresh_processes();

        // Get basic metrics
        let disks = sysinfo::Disks::new_with_refreshed_list();
        let (disk_used, disk_total) = disks.list().iter().fold((0u64, 0u64), |acc, d| {
            (
                acc.0 + (d.total_space() - d.available_space()),
                acc.1 + d.total_space(),
            )
        });

        let memory_usage_pct = (self.sys.used_memory() as f64 / self.sys.total_memory() as f64) * 100.0;
        let disk_usage_pct = (disk_used as f64 / disk_total as f64) * 100.0;

        // Get top processes by CPU
        let mut processes: Vec<_> = self.sys.processes().iter().collect();
        processes.sort_by(|a, b| {
            b.1.cpu_usage().partial_cmp(&a.1.cpu_usage()).unwrap()
        });
        let top_cpu_processes: Vec<ProcessInfo> = processes.iter()
            .take(10)
            .map(|(pid, proc)| self.process_to_info(pid.as_u32(), proc))
            .collect();

        // Get top processes by memory
        processes.sort_by(|a, b| {
            b.1.memory().partial_cmp(&a.1.memory()).unwrap()
        });
        let top_memory_processes: Vec<ProcessInfo> = processes.iter()
            .take(10)
            .map(|(pid, proc)| self.process_to_info(pid.as_u32(), proc))
            .collect();

        // Get open ports
        let open_ports = self.get_open_ports();

        // Get running services
        let running_services = self.get_running_services();

        // Get recently installed packages
        let recently_installed = self.get_recent_packages();

        // Get boot items
        let boot_items = self.get_boot_items();

        // Get system info
        let hostname = sysinfo::System::host_name().unwrap_or_else(|| "unknown".to_string());
        let uptime_seconds = sysinfo::System::uptime();
        let kernel_version = sysinfo::System::kernel_version().unwrap_or_else(|| "unknown".to_string());

        DeepSystemSnapshot {
            timestamp: Utc::now(),
            cpu_usage_pct: self.sys.global_cpu_info().cpu_usage(),
            memory_used_bytes: self.sys.used_memory(),
            memory_total_bytes: self.sys.total_memory(),
            memory_usage_pct: memory_usage_pct as f32,
            disk_used_bytes: disk_used,
            disk_total_bytes: disk_total,
            disk_usage_pct: disk_usage_pct as f32,
            process_count: self.sys.processes().len(),
            top_cpu_processes,
            top_memory_processes,
            open_ports,
            running_services,
            recently_installed_packages: recently_installed,
            boot_items,
            hostname,
            uptime_seconds,
            kernel_version,
        }
    }

    fn process_to_info(&self, pid: u32, proc: &sysinfo::Process) -> ProcessInfo {
        let parent_pid = proc.parent().map(|p| p.as_u32());
        let user_id = proc.user_id().map(|u| u.to_string());
        let status = match proc.status() {
            ProcessStatus::Run => "running",
            ProcessStatus::Sleep => "sleeping",
            ProcessStatus::Idle => "idle",
            ProcessStatus::Stop => "stopped",
            ProcessStatus::Zombie => "zombie",
            ProcessStatus::Dead => "dead",
            ProcessStatus::Wakekill => "wakekill",
            ProcessStatus::Waking => "waking",
            ProcessStatus::Parked => "parked",
            _ => "unknown",
        };

        let mem_percent = (proc.memory() as f64 / self.sys.total_memory() as f64) * 100.0;

        ProcessInfo {
            pid,
            name: proc.name().to_string(),
            cmd: proc.cmd().join(" "),
            cpu_usage: proc.cpu_usage(),
            memory_bytes: proc.memory(),
            memory_percent: mem_percent as f32,
            parent_pid,
            start_time: Some(proc.start_time()),
            status: status.to_string(),
            user_id: user_id.map(|id| id.parse::<u32>().unwrap_or(0)),
        }
    }

    /// Get open network ports using /proc/net
    fn get_open_ports(&self) -> Vec<PortInfo> {
        let mut ports = Vec::new();

        // Parse TCP ports
        if let Ok(tcp_content) = fs::read_to_string("/proc/net/tcp") {
            ports.extend(self.parse_proc_net_tcp(&tcp_content, "tcp"));
        }
        if let Ok(tcp6_content) = fs::read_to_string("/proc/net/tcp6") {
            ports.extend(self.parse_proc_net_tcp(&tcp6_content, "tcp"));
        }

        // Parse UDP ports
        if let Ok(udp_content) = fs::read_to_string("/proc/net/udp") {
            ports.extend(self.parse_proc_net_udp(&udp_content, "udp"));
        }
        if let Ok(udp6_content) = fs::read_to_string("/proc/net/udp6") {
            ports.extend(self.parse_proc_net_udp(&udp6_content, "udp"));
        }

        ports
    }

    fn parse_proc_net_tcp(&self, content: &str, protocol: &str) -> Vec<PortInfo> {
        let mut ports = Vec::new();
        for line in content.lines().skip(1) {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 12 {
                // local_address is in format AA.BB.BB.BB:PPPP (hex)
                if let Some(local_addr) = parts.get(1) {
                    if let Some(port_hex) = local_addr.split(':').nth(1) {
                        if let Ok(port) = u16::from_str_radix(port_hex, 16) {
                            let state = match parts.get(3) {
                                Some(&"01") => "LISTEN",
                                Some(&"08") => "CLOSE_WAIT",
                                Some(&"06") => "TIME_WAIT",
                                Some(&"02") => "SYN_SENT",
                                Some(&"04") => "FIN_WAIT1",
                                Some(&"05") => "FIN_WAIT2",
                                Some(&"09") => "LAST_ACK",
                                Some(&"0A") => "CLOSING",
                                Some(&"0B") => "CLOSED",
                                _ => "UNKNOWN",
                            };

                            // Get inode to find owning process
                            let inode = parts.get(9).and_then(|s| s.parse::<u32>().ok());
                            let (pid, process_name) = inode.and_then(|i| self.find_process_by_socket_inode(i)).map_or((None, None), |p| (Some(p.0), Some(p.1)));

                            ports.push(PortInfo {
                                port,
                                protocol: protocol.to_string(),
                                address: "0.0.0.0".to_string(), // Simplified
                                pid,
                                process_name,
                                state: state.to_string(),
                            });
                        }
                    }
                }
            }
        }
        ports
    }

    fn parse_proc_net_udp(&self, content: &str, protocol: &str) -> Vec<PortInfo> {
        let mut ports = Vec::new();
        for line in content.lines().skip(1) {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 8 {
                if let Some(local_addr) = parts.get(1) {
                    if let Some(port_hex) = local_addr.split(':').nth(1) {
                        if let Ok(port) = u16::from_str_radix(port_hex, 16) {
                            let inode = parts.get(7).and_then(|s| s.parse::<u32>().ok());
                            let (pid, process_name) = inode.and_then(|i| self.find_process_by_socket_inode(i)).map_or((None, None), |p| (Some(p.0), Some(p.1)));

                            ports.push(PortInfo {
                                port,
                                protocol: protocol.to_string(),
                                address: "0.0.0.0".to_string(),
                                pid,
                                process_name,
                                state: "UDP".to_string(),
                            });
                        }
                    }
                }
            }
        }
        ports
    }

    fn find_process_by_socket_inode(&self, target_inode: u32) -> Option<(u32, String)> {
        for (pid, proc) in self.sys.processes() {
            let pid_str = pid.as_u32().to_string();
            let fd_path = format!("/proc/{}/fd", pid_str);
            if let Ok(entries) = fs::read_dir(&fd_path) {
                for entry in entries.flatten() {
                    if let Ok(link) = fs::read_link(entry.path()) {
                        let link_str = link.to_string_lossy();
                        if link_str.contains("socket:") {
                            let inode_str = link_str.trim_start_matches("socket:[").trim_end_matches(']');
                            if let Ok(inode) = inode_str.parse::<u32>() {
                                if inode == target_inode {
                                    return Some((pid.as_u32(), proc.name().to_string()));
                                }
                            }
                        }
                    }
                }
            }
        }
        None
    }

    /// Get running systemd services
    fn get_running_services(&self) -> Vec<ServiceInfo> {
        let mut services = Vec::new();

        // Use systemctl to get service list
        if let Ok(output) = Command::new("systemctl")
            .args(["list-units", "--type=service", "--state=running", "--no-pager", "--no-legend"])
            .output()
        {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 1 {
                    let service_name = parts[0].trim_end_matches(".service");
                    services.push(ServiceInfo {
                        name: service_name.to_string(),
                        display_name: service_name.to_string(),
                        status: "running".to_string(),
                        enabled: true, // Would need separate call to check
                        description: None,
                    });
                }
            }
        }

        // Also get enabled services (not necessarily running)
        if let Ok(output) = Command::new("systemctl")
            .args(["list-unit-files", "--type=service", "--state=enabled", "--no-pager", "--no-legend"])
            .output()
        {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 1 {
                    let service_name = parts[0].trim_end_matches(".service");
                    // Avoid duplicates
                    if !services.iter().any(|s| s.name == service_name) {
                        services.push(ServiceInfo {
                            name: service_name.to_string(),
                            display_name: service_name.to_string(),
                            status: "stopped".to_string(),
                            enabled: true,
                            description: None,
                        });
                    }
                }
            }
        }

        services
    }

    /// Get recently installed packages
    fn get_recent_packages(&self) -> Vec<PackageInfo> {
        let mut packages = Vec::new();

        // APT packages
        if let Ok(output) = Command::new("apt")
            .args(["list", "--installed"])
            .output()
        {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines().skip(1) {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 2 {
                    let name = parts[0].split('/').next().unwrap_or("").to_string();
                    let version = parts.get(1).map(|s| s.to_string()).unwrap_or_default();
                    packages.push(PackageInfo {
                        name,
                        version,
                        installed_at: None, // Would need to parse /var/log/dpkg.log
                        package_type: "apt".to_string(),
                    });
                }
            }
        }

        // Cargo packages
        if let Ok(output) = Command::new("cargo")
            .args(["install", "--list"])
            .output()
        {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                if let Some(name) = line.split_whitespace().next() {
                    let version = line.split('v').nth(1).and_then(|s| s.split_whitespace().next()).unwrap_or("unknown");
                    packages.push(PackageInfo {
                        name: name.to_string(),
                        version: version.to_string(),
                        installed_at: None,
                        package_type: "cargo".to_string(),
                    });
                }
            }
        }

        // NPM global packages
        if let Ok(output) = Command::new("npm")
            .args(["list", "-g", "--depth=0"])
            .output()
        {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                if line.contains("@") && !line.contains("──") {
                    let parts: Vec<&str> = line.split('@').collect();
                    if parts.len() >= 2 {
                        packages.push(PackageInfo {
                            name: parts[0].trim().to_string(),
                            version: parts[1].trim().to_string(),
                            installed_at: None,
                            package_type: "npm".to_string(),
                        });
                    }
                }
            }
        }

        // Keep only last 10 (most recent would need timestamps)
        packages.truncate(10);
        packages
    }

    /// Get boot items (systemd, cron, startup apps)
    fn get_boot_items(&self) -> Vec<BootItem> {
        let mut items = Vec::new();

        // Systemd services enabled at boot
        if let Ok(output) = Command::new("systemctl")
            .args(["list-unit-files", "--type=service", "--state=enabled", "--no-pager", "--no-legend"])
            .output()
        {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines().take(10) {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 2 {
                    items.push(BootItem {
                        name: parts[0].trim_end_matches(".service").to_string(),
                        command: format!("systemctl start {}", parts[0].trim_end_matches(".service")),
                        item_type: "systemd".to_string(),
                        enabled: true,
                    });
                }
            }
        }

        // Cron jobs
        if let Ok(crontab) = fs::read_to_string("/etc/crontab") {
            for line in crontab.lines().filter(|l| !l.starts_with('#') && !l.trim().is_empty()) {
                items.push(BootItem {
                    name: "cron".to_string(),
                    command: line.to_string(),
                    item_type: "cron".to_string(),
                    enabled: true,
                });
            }
        }

        items
    }
}

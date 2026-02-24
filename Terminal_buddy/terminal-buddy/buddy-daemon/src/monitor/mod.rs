pub mod cleanup;

use chrono::Utc;
use shared::SystemSnapshot;
use sysinfo::System;

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
}

pub mod pty_runner;

pub fn start() {
    let runner = pty_runner::PtyRunner::new();
    match runner.start_shell() {
        Ok(_) => println!("Pty finished gracefully"),
        Err(e) => eprintln!("Pty exited with error: {}", e),
    }
}

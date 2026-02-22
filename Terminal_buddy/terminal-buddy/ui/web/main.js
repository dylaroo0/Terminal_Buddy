import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';

// Load xterm.js base CSS
import '@xterm/xterm/css/xterm.css';

// Initialize Terminal
const term = new Terminal({
    fontFamily: '"Fira Code", "Courier New", monospace',
    fontSize: 14,
    theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        cursorAccent: '#0d1117',
        selectionBackground: 'rgba(88, 166, 255, 0.3)',
    },
    cursorBlink: true,
});

// Fit Addon to automatically resize the terminal to its container
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

// Mount Terminal to DOM
const terminalContainer = document.getElementById('terminal-container');
term.open(terminalContainer);

// Initialize WebGL Addon for high performance rendering (120 FPS)
try {
    const webglAddon = new WebglAddon();
    // webglAddon.onContextLoss((e) => webglAddon.dispose());
    term.loadAddon(webglAddon);
    console.log("WebGL Addon loaded successfully.");
} catch (e) {
    console.warn("WebGL Addon Failed to load. Falling back to canvas/dom renderer.", e);
}

// Fit on window resize
window.addEventListener('resize', () => {
    fitAddon.fit();
});

// Initial fit
setTimeout(() => {
    fitAddon.fit();
    term.writeln('Welcome to \x1b[34mTerminal Buddy\x1b[0m \x1b[32mβ\x1b[0m');
    term.writeln('Engine: \x1b[36mRust Daemon\x1b[0m | Renderer: \x1b[36mWebGL 120FPS\x1b[0m');
    term.writeln('');
    term.write('\x1b[32mdylaroo@terminal-buddy\x1b[0m:~\x1b[34m$\x1b[0m ');
}, 0);

// Simple echo implementation for prototype
term.onData((data) => {
    // In actual implementation, data is sent to the PTY Rust Daemon over IPC/WebSocket.
    const code = data.charCodeAt(0);
    if (code === 13) { // Enter
        term.write('\r\n\x1b[32mdylaroo@terminal-buddy\x1b[0m:~\x1b[34m$\x1b[0m ');
    } else if (code === 127) { // Backspace
        // Provide minimal editing capabilities in echo mode
        term.write('\b \b');
    } else {
        term.write(data);
    }
});

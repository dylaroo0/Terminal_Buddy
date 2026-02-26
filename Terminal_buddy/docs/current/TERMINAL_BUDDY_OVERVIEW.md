# Terminal Buddy

**A terminal that remembers everything, explains what happened, and lets you talk to it in plain English.**

---

## The Problem

The terminal (that black screen where you type commands) is one of the most powerful tools on a computer. But it's also one of the most unfriendly:

- Commands are cryptic (`chmod 755`, `grep -rn`, `docker system prune -a`)
- When something breaks, the error messages are useless to most people
- There's no memory - you can't search "what did I do last Tuesday?"
- There's no undo, no explanation, no safety net

If you're new to programming, dyslexic, or just not a terminal power user, it feels like being handed the controls of an airplane with no labels.

## The Solution

Terminal Buddy is a **terminal app** (like iTerm, Windows Terminal, or any other terminal) but with a built-in AI assistant that:

1. **Translates plain English into commands**
   - You say: "clean up old Docker stuff and find big files I don't need"
   - Buddy shows you exactly what it will run, explains each step, and waits for your OK

2. **Remembers everything**
   - Every command, every output, every session - searchable forever
   - "What was that git command I ran last week?" - Buddy finds it instantly

3. **Explains what happened**
   - After every command, Buddy can tell you what changed on your computer
   - Files created, files deleted, errors, what it all means in plain English

4. **Watches your system health**
   - CPU, memory, disk space, running processes
   - Suggests cleanup when things get bloated (old caches, unused packages, temp files)

---

## What It Looks Like

```
+----------------------------------+-------------------------+
|                                  |                         |
|  Terminal                        |  Buddy Panel            |
|  (where commands run)            |                         |
|                                  |  [Voice/Chat Input]     |
|  $ npm install                   |  "What does this error  |
|  npm ERR! ERESOLVE unable to     |   mean?"                |
|  resolve dependency tree         |                         |
|  npm ERR! While resolving:       |  Buddy:                 |
|  app@1.0.0                       |  "Two packages need     |
|                                  |   different versions    |
|                                  |   of React. I can fix   |
|                                  |   this by running..."   |
|                                  |                         |
|                                  |  [Approve] [Edit] [No]  |
|                                  |                         |
|                                  |  --- Session History ---|
|                                  |  Today 9:15am - npm     |
|                                  |  Today 8:30am - git     |
|                                  |  Yesterday - docker     |
|                                  |                         |
+----------------------------------+-------------------------+
```

The left side is a normal terminal. The right side is Buddy - always there, always watching, ready to help.

---

## What's Built So Far

The "brain" of Terminal Buddy is already working. It runs as a background service and provides these capabilities:

| Feature | Status |
|---------|--------|
| Command history storage and search | Working |
| Session tracking | Working |
| System health monitoring (CPU, memory, disk) | Working |
| Disk cleanup scanner | Working |
| Command execution with output capture | Working |
| Filesystem change tracking (what a command did to your files) | Working |
| Configuration system | Working |
| AI command translation (English to shell) | Scaffolded (placeholder) |
| AI error explanation | Scaffolded (placeholder) |

All of this is written in Rust (fast, safe, low resource usage) and communicates over an open protocol called MCP, which means it can plug into different tools. Right now it works as a plugin inside Claude Code (an AI coding assistant), but the same brain will power the standalone app.

**6 automated tests pass. The release binary is 6.4 MB.**

---

## What's Next: The App

The brain exists. Now we build the body.

**The plan:**

1. **Terminal engine** - Fork WezTerm (an open-source, GPU-accelerated terminal). It's fast, cross-platform, and battle-tested. We don't need to build a terminal from scratch.

2. **Buddy Panel** - A sidebar built with React that shows the chat interface, session history, system dashboard, and approval flow. Wrapped in Tauri (lightweight native app framework).

3. **Deep integration** - Connect the brain directly to the terminal's internals so every command is automatically captured, explained, and searchable. No setup needed by the user.

4. **Voice input** - Talk to your terminal instead of typing. All voice processing happens on your machine (privacy first).

---

## Who Is This For?

**Primary audience:**
- People learning to code who find the terminal intimidating
- People with dyslexia or other accessibility needs
- Anyone who wants a terminal that actually helps instead of just displaying text

**Also useful for:**
- Experienced developers who want searchable command history across all their sessions
- DevOps engineers who want system correlation (what did this command do to my server?)
- Anyone who's ever thought "what was that command I ran 3 days ago?"

---

## Tech Stack (For the Curious)

| Layer | Technology | Why |
|-------|-----------|-----|
| Brain (daemon) | Rust | Fast, safe, tiny memory footprint |
| Terminal engine | WezTerm (fork) | GPU-rendered, cross-platform, open source |
| Desktop app | Tauri | Native app wrapper, much lighter than Electron |
| Buddy Panel UI | React | Rich interactive components |
| Storage | SQLite | Reliable, embedded, no server needed |
| Voice | whisper.cpp | Local speech-to-text, no cloud dependency |
| Protocol | MCP | Open standard for AI tool communication |

Everything runs locally on your machine. No cloud dependency required (though AI features can optionally use cloud APIs for higher quality responses).

---

## The Vision

Terminal Buddy turns the terminal from a tool you have to learn into a tool that learns with you. Every session builds your searchable history. Every error becomes a teaching moment. Every command is explained before and after it runs.

It's not about replacing the terminal - it's about making it actually work for humans.

---

*Project by Dylaroo. Brain built in Rust. App coming soon.*
*Current state: Foundation complete, app development starting.*

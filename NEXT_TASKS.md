# 🚀 YOUR NEXT TASKS

Based on our recent progress and the `PROJECT_STATUS.md` blueprints, here is exactly what is next on the roadmap:

## 1. TASK 5: Topics View

* **The Vision:** Right now, the Journal Timeline works (grouped by date). Next is grouping things by **Auto-Detected Subject/Topic**.
* **The Action:** Wire up the UI to take the correlation engine's metadata tags, and display a clean "Topics" sidebar view so you can filter history logically vs. chronologically.

## 2. TASK 9: Voice Input (Local Whisper)

* **The Vision:** "Voice-as-a-Peer" is a core pillar for accessibility and RSI.
* **The Action:** Begin the `whisper-rs` integration for true on-device, private voice dictation. We need to capture audio, send it to the local model, and drop the text into the Terminal input.

## 3. Tool Refinement (Post-Alpha Polish)

* **The Vision:** Deepen the utility of the backend MCP tools now that the surface application is visually rendering.
* **The Action:** Test edge cases on directory traversals, command explanations, and ensure the UI elegantly handles arbitrary JSON streams provided by daemon payloads.

*(Note: "Creator Corner" has been formally split into a separate project to keep this core Terminal Buddy app lean and focused.)*

***

**When you are ready:** Let the next AI know if you want to tackle **Task 5 (Topics)** or jump straight into **Task 9 (Voice/Whisper)**!

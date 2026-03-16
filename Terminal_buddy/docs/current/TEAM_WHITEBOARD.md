# Team Whiteboard (Single Source of Truth)

Updated: 2026-03-13
Owner: Dylaroo

## 0) Live Control Panel (Read in 20 seconds)

* Active Project: **Terminal Buddy Core**
* Active Task: **Verify journaling reliability end-to-end**
* Active Decision Needed: **Impact tracking default = OFF (recommended)**
* Next Owner Action: **Copilot runs reliability pass + reports in check-in format**
* Where to update: **This file only**

## 0) Command Center Rules (Read First)

* One active project at a time: **Terminal Buddy Core**
* One active task at a time: no parallel task switching unless Dylaroo says so
* This file is the source of truth; chats are temporary
* Any new idea goes to Parking Lot first, not into active work
* Every update must use the same 4-line check-in format

## 1) North Star

Build a reliable Terminal Buddy core:

* Terminal works every time
* Every command is journaled
* Optional impact tracking (safe + controllable)
* Voice after core stability

## 2) Active Queue (Now / Next / Later)

### NOW (Do these only)

1. Verify command journaling end-to-end (UI → daemon → DB → journal view)
2. Confirm terminal reliability path (`spawn/write/resize/kill`) with clear pass/fail
3. Add visible failure state when journaling/capture fails (no silent drops)

### NEXT (Only after NOW is complete)

1. Add explicit impact tracking switch (default OFF, user-controlled)
2. Implement Topics view (Task 5)

### LATER (Do not touch yet)

1. Voice integration polish
2. Creator Corner template expansion
3. Extra UI/library experiments

## 3) Decision Inbox (One at a Time)

* D-001: Should impact tracking default to OFF?
  * Recommendation: **YES (OFF by default)**
  * Why: safer startup, explicit consent, fewer surprises
  * Status: **Pending Dylaroo**

## 4) Stop Doing (for now)

* New library experiments
* Template expansion
* Extra UI polish not tied to core terminal reliability
* Multi-chat copy/paste coordination

## 5) Team Roles (working)

* Dylaroo: Product direction + final decisions
* Copilot: Technical execution + status updates
* Other agents: Only when assigned a specific task from this board

## 6) Assistant Protocol (How Copilot works beside Dylaroo)

* Dylaroo says one intent in plain language
* Copilot converts it into one concrete task from NOW queue
* Copilot executes and reports in check-in format
* If blocked, Copilot asks for one decision only

## 7) Current Blockers

* Overload from too many parallel ideas
* Possible machine storage/performance pressure
* Unclear "who does what next" in real time

## 8) Fast Decision Log

* 2026-03-13: Core terminal work is priority #1
* 2026-03-13: Shared board replaces scattered chats
* 2026-03-13: Single-thread execution mode enabled (one active task)
* 2026-03-13: Large whiteboard expansion paused; use command board + ship working core first

## 9) Next Check-in Format

When anyone checks in, use exactly:

* Done:
* Doing:
* Blocked:
* Need from Dylaroo:

## 10) Check-in Log (Newest first)

### 2026-03-13 — Copilot

* Done: Set up shared whiteboard and Beacon pointer; converted board to single-thread mode.
* Doing: Executing core terminal/journaling build while whiteboard expansion is on hold.
* Blocked: Need Dylaroo decision on D-001 (impact tracking default).
* Need from Dylaroo: Reply with **"Approve D-001"** or **"Change D-001"**.

## 11) Parking Lot (later)

* Team collaboration whiteboard integrations
* Cross-app sync automation
* Creator Corner deep template ecosystem

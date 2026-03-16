# *** PATENT RESEARCH: Correlation Engine — Prior Art Assessment ***

> **Date:** 2026-02-23
> **Status:** PRELIMINARY RESEARCH — Needs formal patent attorney review
> **Researcher:** AI-assisted prior art scan (Claude Code / Opus 4.6)
> **Subject:** Terminal Buddy's Correlation Engine — three-stream command correlation method
> **Priority:** HIGH — Potential provisional patent candidate

---

## 1. The Invention: The Correlation Triple

Terminal Buddy's core technical differentiator is the **Correlation Engine**, which synchronizes three distinct data streams to produce grounded, verifiable explanations of what a terminal command actually did to the system.

### The Three Streams

| Stream | Data Captured | Strategic Value |
|--------|--------------|-----------------|
| **Stream A: Terminal** | Raw stdout/stderr, exit codes | The **Result** — the visible output the user sees |
| **Stream B: Filesystem** | File deltas (created/modified/deleted), PIDs, network port bindings | The **Impact** — the actual physical changes made to the system |
| **Stream C: System Logs** | Kernel/OS logs filtered to the exact microsecond of execution | The **Root Cause** — the underlying "why" behind system behavior |

### What Makes This Novel

The specific method of:
1. Capturing all three streams **simultaneously** during command execution
2. **Correlating** them to a single user command with precise timestamps
3. Producing a **grounded explanation** (not probabilistic/LLM-guessed) based on verified system data
4. Storing the correlated result as a **searchable, replayable record** (Memvid .mv2 format)

This is NOT an LLM wrapper that guesses what went wrong from error text. This is a system that **knows** what happened because it observed it at the kernel level.

---

## 2. Prior Art Scan Results

### 2.1 Adjacent Patents Found (NOT the Same)

#### US Patent 10,963,363 — "Correlation based adaptive system monitoring"
- **Issued:** March 30, 2021
- **Source:** https://patents.justia.com/patent/10963363
- **What it does:** Generates time-varying correlation graphs between system parameters; uses graphs to identify monitoring logic
- **Why it's different:** Correlates system metrics with *each other* for infrastructure monitoring — NOT tying specific user commands to their system effects
- **Relevance:** Low — different domain (infra monitoring vs. per-command explanation)

#### US Patent 10,599,545 — "Correlation based adaptive system monitoring"
- **Issued:** March 24, 2020
- **Source:** https://patents.justia.com/patent/10599545
- **What it does:** Related to above — adaptive monitoring parameter selection
- **Why it's different:** Same distinction — system-to-system correlation, not command-to-impact correlation
- **Relevance:** Low

#### US Patent 7,774,657 — "Estimating correlation between hardware/software changes and problem events"
- **Issued:** August 10, 2010
- **Source:** https://patents.google.com/patent/US7774657
- **What it does:** Automated estimation that a hardware/software change caused a problem event using distance measures
- **Why it's different:** CLOSER to our concept, but operates at enterprise change management scale (software deployments, hardware swaps) — not individual terminal commands in real-time
- **Relevance:** Medium — worth discussing with patent attorney as nearest prior art

#### US Patent 8,898,101 — "Managing file systems and file-based data storage"
- **Source:** https://patents.google.com/patent/US8898101B2/en
- **What it does:** File system management and storage
- **Why it's different:** General filesystem management, not correlated with command execution
- **Relevance:** Low

#### US Patent 9,953,036 — "File system monitoring with incremental client updates"
- **Source:** https://patents.google.com/patent/US9953036B2/en
- **What it does:** Monitors filesystem changes in cloud collaboration platforms
- **Why it's different:** Cloud-based, event-driven for collaboration — not tied to terminal command correlation
- **Relevance:** Low

### 2.2 Competitor Analysis

#### Warp Terminal (closest competitor)
- **How they explain errors:** LLM-based (OpenAI) — sends error text to cloud, gets probabilistic explanation back
- **What they DON'T do:**
  - No filesystem delta tracking per command
  - No kernel log correlation per command
  - No "Correlation Triple" or three-stream synchronization
  - No local-first architecture (cloud-dependent)
  - No grounded/verifiable explanations
- **Patents found:** None specific to their explanation mechanism
- **Source:** https://docs.warp.dev/terminal/comparisons/terminal-features

#### GitHub Copilot CLI
- **How they explain:** LLM suggestions from context — no system-level correlation
- **What they DON'T do:** No history, no explanation grounding, no standalone product

#### Fig (acquired by AWS)
- **Focus:** Terminal autocomplete
- **What they DON'T do:** No journal, no session memory, no correlation

#### iTerm / WezTerm / Alacritty
- **Focus:** Fast text rendering
- **What they DON'T do:** No memory, no explanation, no AI, no accessibility

### 2.3 Gap Analysis Summary

| Capability | Warp | Copilot CLI | Fig | **Terminal Buddy** |
|-----------|------|-------------|-----|-------------------|
| Command explanation | LLM guess | LLM guess | No | **Grounded (3-stream)** |
| Filesystem delta tracking | No | No | No | **Yes** |
| Kernel log correlation | No | No | No | **Yes** |
| Per-command system impact | No | No | No | **Yes** |
| Local-first processing | No | No | N/A | **Yes** |
| Session journal | Partial (blocks) | No | No | **Yes** |
| Searchable history | Basic | No | No | **Semantic** |

**No existing product or patent combines these three streams (terminal output + filesystem deltas + kernel logs) correlated to individual user commands for the purpose of producing grounded explanations.**

---

## 3. Patentability Assessment (Preliminary)

### Strengths
1. **Novelty:** The three-stream correlation method tied to individual commands appears novel — no prior art found that combines all three
2. **Non-obvious:** Existing tools correlate system metrics with each other OR use LLMs to guess — nobody correlates kernel-level data with specific user commands for explanation
3. **Specific method:** This is a concrete technical method, not an abstract idea — it describes HOW data is captured, synchronized, and used
4. **Utility:** Clear practical application — transforms cryptic terminal errors into verifiable, trustworthy explanations

### Risks / Considerations
1. **Software patent landscape:** Software patents are harder to get post-*Alice Corp v. CLS Bank* (2014) — need to frame as a specific technical method, not an abstract concept
2. **Prior art depth:** This was a surface scan — a patent attorney should do a thorough USPTO search
3. **Combination patents:** Individual components (filesystem watching, log parsing, terminal capture) are well-known — the claim would need to focus on the *specific combination and synchronization method*
4. **International considerations:** Patent law varies by jurisdiction

### Recommended Claims to Explore

1. **Method claim:** A method for correlating terminal command execution with system state changes, comprising: (a) capturing terminal output streams, (b) simultaneously monitoring filesystem changes and process activity, (c) filtering kernel/OS logs to the precise execution window, and (d) synthesizing a grounded explanation from the correlated data
2. **System claim:** A system comprising a daemon process that performs the above correlation and exposes results via a protocol (MCP)
3. **Storage claim:** A binary recording format (.mv2) that stores correlated system snapshots at configurable intervals (100ms default) enabling temporal replay and semantic search

---

## 4. Evidence of Prior Art (Our Side)

Terminal Buddy's invention is documented with timestamps:

| Evidence | Location | Date |
|----------|----------|------|
| Original Master Spec (Correlation Engine design) | `docs/specs/2026-01_TERMINAL_BUDDY_MASTER_SPEC.md` | January 2026 |
| Product Spec v2 (refined Correlation Triple) | `docs/specs/PRODUCT_SPEC_V2.md` | February 22, 2026 |
| Strategic Deep-Dive (full technical description) | `docs/guides/Terminal Buddy: A Strategic Deep-Dive...` | February 22, 2026 |
| Working daemon with correlation (buddy-daemon) | `terminal-buddy/buddy-daemon/src/server.rs` | Phase A complete |
| Git history | Full commit log with timestamps | Ongoing |
| Blog article describing the method | `docs/guides/Why Your Terminal Is Finally Growing a Brain...` | February 2026 |

**Git history provides timestamped proof of invention.**

---

## 5. Recommended Next Steps

### Immediate (This Week)
- [ ] **Keep repo PRIVATE** — do not publish the Correlation Engine details publicly until IP is protected
- [ ] **Document the invention formally** — this document is a start; refine with specific technical implementation details from `server.rs`

### Short-Term (1-2 Weeks)
- [ ] **Consult a patent attorney** — specifically one experienced in software/AI patents
- [ ] **File a provisional patent application** (~$320 micro entity fee) — buys 12 months of "patent pending" status
- [ ] **Consider a BMAD specialist team** for deeper prior art research across USPTO, EPO, and WIPO databases

### Medium-Term (1-3 Months)
- [ ] **Full patent application** based on provisional filing and attorney feedback
- [ ] **Continue building** — a working product strengthens the patent case

### Cost Estimates
| Action | Estimated Cost |
|--------|---------------|
| Patentability opinion (attorney) | $500 - $2,000 |
| Provisional patent filing (micro entity) | $320 |
| Full patent application (with attorney) | $5,000 - $15,000 |
| Prior art search (professional) | $1,000 - $3,000 |

---

## 6. Sources

- [US Patent 10,963,363 - Correlation based adaptive system monitoring](https://patents.justia.com/patent/10963363)
- [US Patent 10,599,545 - Correlation based adaptive system monitoring](https://patents.justia.com/patent/10599545)
- [US Patent 7,774,657 - Estimating correlation between changes and problem events](https://patents.google.com/patent/US7774657)
- [US Patent 8,898,101 - Managing file systems and file-based data storage](https://patents.google.com/patent/US8898101B2/en)
- [US Patent 9,953,036 - File system monitoring with incremental updates](https://patents.google.com/patent/US9953036B2/en)
- [Warp Terminal Features Comparison](https://docs.warp.dev/terminal/comparisons/terminal-features)
- [Understanding How to Patent Agentic AI Systems (Mintz, 2025)](https://www.mintz.com/insights-center/viewpoints/2231/2025-03-19-understanding-how-patent-agentic-ai-systems)

---

*This document is a preliminary AI-assisted prior art scan. It is NOT legal advice. A formal patentability opinion from a registered patent attorney is required before filing.*

*Prepared for Dylaroo — February 23, 2026*

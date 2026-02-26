# Front-End & Design Governance Resources
> **Compiled & Reviewed:** 2026-02-25
> **Purpose:** A consolidated index of the full spectrum of UI/Front-End design methodologies, tools, and quality assurance systems currently available in the Terminal Buddy project space.

## Table of Contents
1. [Core Design Methodologies & Workflows](#1-core-design-methodologies--workflows)
2. [UI Systems & Design Memory](#2-ui-systems--design-memory)
3. [Design Quality Assurance (QA) & Organization](#3-design-quality-assurance-qa--organization)
4. [Additional UI Skills & Components](#4-additional-ui-skills--components)

---

## 1. Core Design Methodologies & Workflows

### **Whiteport Sketch-to-Code Method**
*Path:* `/whiteport-sketch-to-code-bmad-expansion-main`
* **What it is:** A comprehensive design-driven expansion pack for the BMad agent framework.
* **Why it matters:** It shifts development to a "design-first" approach, turning hand-drawn sketches (Trigger Maps, User Personas, Edge Cases) directly into production-ready App specs. 
* **Key Components:**
  * **Whiteport Business Analyst:** Facilitates collaborative workshops via multi-stage questioning.
  * **PM & UX Expert Agents:** Extract atomic UI components directly from drawings.
* **Current Status:** Tested & fully pushed into the core `_bmad/core` architecture. Ready for active use.

---

## 2. UI Systems & Design Memory

### **Interface Design plugin**
*Path:* `e.Front-end-Deposit-Resources/interface-design-main`
* **What it is:** The programmatic memory block for your user interfaces ("Craft · Memory · Consistency").
* **Why it matters:** When collaborating with AI to build the Terminal Buddy frontend, minor pixel values (spacing, card radiuses, border strokes) usually "drift" across sessions, causing inconsistent designs. This tool enforces rules and writes them automatically to `.interface-design/system.md`.
* **Key Components:**
  * Extracts UI component rules during initial generation.
  * Ensures precision boundaries limit the LLM from hallucinating new CSS tokens.
* **Current Status:** Consolidating into active UI flows; tested for adherence to Terminal Buddy's current Dyslexia/Focus aesthetic.

---

## 3. Design Quality Assurance (QA) & Organization

### **Forge Doc Manager & DocQA Integration**
*Paths:* 
- `/doc-org/payload/bmad-agent/core-system`
- `/doc-org/DocQA/DocumentationQAIntegration.ts`
* **What it is:** The universal "always-on" Documentation Manager and its underlying Typescript integration module.
* **Why it matters:** Ensures the repository has no 404s, standardizes naming, checks WCAG accessibility compliance on designs, verifies link integrity, checks technical document accuracy, and stamps everything with ISO 8601 timestamps so nothing gets lost.
* **Current Status:** Standalone code successfully analyzed & mapped. Provides enterprise-grade quality over all new UI components we build.

---

## 4. Additional UI Skills & Components

The following resources were consolidated into `e.Front-end-Deposit-Resources/` from the root level for cleaner workspace curation:

- **`frontend-design/`:** Base design blueprints & components.
- **`ui-design-prompts/`:** Structured prompts tailored to generative UI component creation.
- **`ui-ux-pro-max-skill/`:** Accessible UI/UX agent specialized in high-contrast/dyslexia-friendly interfaces.
- **`storybook-10.2.11/`:** Version-locked component visualizer for atomic component testing.

---

## Next Steps for the UI Pipeline
1. **Design Extraction:** Run the Whiteport sketching templates (or tablet drawing canvas) to pull Dashboard layouts.
2. **Apply Standards:** Use the Interface Design memory core to lock down our spacing, color tokens, and typographies for those extracted dashboard pieces.
3. **Verify Compliance:** Check output specifications against the DocQA integration to pass accessibility and code structure consistency grids.

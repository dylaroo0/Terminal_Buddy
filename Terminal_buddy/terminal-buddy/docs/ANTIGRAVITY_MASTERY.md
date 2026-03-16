# AntiGravity Mastery: The Infinity Stones Framework
*Based on Jack Roberts' 100 hours of AntiGravity lessons.*

## Level 1: Setup and Project Organization
- **One Project Per URL:** Maintain clear organization within the agent manager by ensuring each distinct project or feature has its own dedicated context/URL.
- **Customization (Global Rules):** Utilize `Gemini.md` or `claude.md` to define consistent rules (like debugging constraints).
- **Direct File Referencing:** Always point directly to files (`@filename` or path) when chatting to ground the context.
- **GitHub Checkpoints:** Push updates regularly to GitHub so you can always roll back.
- **Project Constitution:** Adhere to a defined blueprint/architecture framework (e.g., Blast Master System) through project phases.

## Level 2: Performance Enhancement
- **Context Management:** Recognize that deep conversation threads become bloated and expensive ("context rot"). Start fresh frequently.
- **Agent Manager & Inbox:** Handle approvals asynchronously and use the playground or new threads when appropriate.
- **Sub-agents:** Run disjointed tasks in parallel to save time.

## Level 3: Building Faster
- **One Task Per Message:** Resist prompt-stuffing. Doing one thing at a time results in a much higher quality output.
- **The Loop Breaker:** Break AI hallucinations by interrupting: *"Stop. We are in a loop. Summarize what we have tried, why it's failing, and give me a new approach."*
- **Visual Intelligence:** Use tools like MCP to visually track AI logic or application state.

## Level 4: Better Design
- **AI Studio Prototypes:** Mock up designs inside tools like AI Studio before integrating.
- **UI Snipping:** Find modern components (e.g., Codepen) to "snip" and adapt for quick aesthetic wins.
- **Visual Auditing:** Provide screenshots directly to the model for precise UI tightening instead of explaining CSS bugs with text.

## Level 5: Faster Deployment and Integrations
- **MCP Ecosystem:** Install specific MCP servers for quick integration with databases (e.g., Supabase) and tools.
- **Automations:** Tie in Zapier for logic flows or Vercel for single-click CI/CD deployments.
- **Remote Servers:** Modal and similar services are useful for long-running deployments so you don't depend entirely on your local machine.

## Level 6: Cost Savings
- **Prompt Economy:** Shorten system prompts and custom instructions to the absolute minimum needed. Every token counts in a persistent session.
- **Summarization Strategy:** Start new sessions by having the AI output a summary in the old session, then pass that summary to the new one.
- **Model Tiers:** Map task complexity to the correct model tier (e.g., fast/cheap vs reasoning/expensive).
- **Deactivate Unused Tools:** The agent reads the tool descriptions for *every* request. Turn off MCP tools you aren't actively using in `mcp_config.json`.

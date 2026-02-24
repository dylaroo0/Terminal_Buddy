# AntiGravity Mastery & Loop Breaking Limits

## Project Constitution and Context
1. **One Project Per URL:** Keep contexts isolated to prevent context rot.
2. **Short Prompts:** Maintain concise instructions in global files (like this one) to reduce token spend.
3. **File Referencing:** Always use the `@` symbol or provide exact file paths in your prompts to maintain precise context.
4. **Summarize Often:** At the start of a new session, or when the context gets too long, ask AntiGravity to succinctly summarize previous interactions before clearing the playground or starting a new thread.

## Interaction & Execution
5. **One Task Per Message:** Do not bundle multiple complex tasks into a single prompt. Address tasks one by one to improve performance and code quality.
6. **Cost Savings vs Complexity:** Use standard models for simpler, repetitive tasks and reserve Opus/Pro/Reasoning models for complex architectural thinking.
7. **Version Control Integration:** Commit changes to GitHub frequently during workflows to ensure a clean rollback state if a rabbit hole occurs.

## The Loop Breaking Prompt
If AntiGravity begins looping, hallucinating, or failing to break through a bug after 2-3 attempts, STOP and use the following loop-breaking prompt:

> "Stop. We are in a loop. Summarize what we have tried so far, explain specifically why it is failing based on the actual error logs, and propose a completely different approach to solve this problem."

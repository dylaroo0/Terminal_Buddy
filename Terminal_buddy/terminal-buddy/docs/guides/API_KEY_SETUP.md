# API Key Setup Guide

Terminal Buddy uses LLMs to power the **Explain** button and natural language commands. This guide shows you how to set up your API key.

## Quick Start (30 seconds)

**Recommended for most users:** Use OpenRouter for access to multiple models through one API key.

1. **Get your API key:**
   - Go to [OpenRouter](https://openrouter.ai/)
   - Sign up / log in
   - Go to [Keys](https://openrouter.ai/keys)
   - Click "Create Key"
   - Copy your key

2. **Set the environment variable:**

   **Linux/macOS:**
   ```bash
   export OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Windows (PowerShell):**
   ```powershell
   $env:OPENROUTER_API_KEY="sk-or-xxxxxxxxxxxxxxxxxxxxxxxx"
   ```

   **Windows (Command Prompt):**
   ```cmd
   set OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Launch Terminal Buddy** - you're done!

## Alternative Providers

### Anthropic (Claude)

Best for: High-quality explanations, complex reasoning

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Set the environment variable:
   ```bash
   export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Update your `buddy.toml`:
   ```toml
   [ai]
   provider = "claude"
   ```

### Google (Gemini)

Best for: Fast responses, cost-effective usage

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Set the environment variable:
   ```bash
   export GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Update your `buddy.toml`:
   ```toml
   [ai]
   provider = "gemini"
   ```

## Configuration File

Create or edit `~/.config/terminal-buddy/buddy.toml`:

```toml
[ai]
# Provider: "openrouter" (recommended), "claude", or "gemini"
provider = "openrouter"

# Optional: Override the default model
# OpenRouter: "anthropic/claude-sonnet-4-5", "google/gemini-2.0-flash"
# model = "anthropic/claude-sonnet-4-5"

# Privacy mode: prevent external API calls (requires local LLM)
privacy_mode = false
```

## Testing Your Setup

1. **Open Terminal Buddy**
2. **Run a command** in your terminal (e.g., `ls -la`)
3. **Click the [Explain] button** on the command card
4. **Wait for the explanation** - if it appears, your API key is working!

## Troubleshooting

### "Failed to get explanation"

**Cause:** API key not set or invalid

**Fix:**
1. Check your environment variable is set:
   ```bash
   echo $OPENROUTER_API_KEY  # Should show your key (not empty)
   ```
2. Verify the key in your `buddy.toml` matches your provider
3. Restart Terminal Buddy after setting the environment variable

### "Rate limit exceeded"

**Cause:** You've hit your API quota

**Fix:**
1. Check your usage on the provider's dashboard
2. Add credits to your account if needed
3. Wait for the rate limit to reset

### "Model not found"

**Cause:** Invalid model name in config

**Fix:**
1. Remove the `model` line from `buddy.toml` to use the default
2. Or use a valid model name:
   - OpenRouter: `anthropic/claude-sonnet-4-5`, `google/gemini-2.0-flash`
   - Claude: `claude-sonnet-4-5`
   - Gemini: `gemini-2.0-flash`

## Pricing (as of 2026)

| Provider | Model | Cost per 1K tokens | Typical cost per explanation |
|----------|-------|-------------------|------------------------------|
| OpenRouter | Claude Sonnet 4.5 | $0.003 | ~$0.01 |
| OpenRouter | Gemini 2.0 Flash | $0.00075 | ~$0.003 |
| Anthropic | Claude Sonnet 4.5 | $0.003 | ~$0.01 |
| Google | Gemini 2.0 Flash | $0.00075 | ~$0.003 |

**Typical usage:** 10-20 explanations per day = ~$0.10-0.30/day with Claude, ~$0.03-0.06/day with Gemini

## Privacy & Security

- **API keys are stored in environment variables**, not in config files
- **Commands are sent to the LLM provider** you choose
- **Privacy mode** (coming soon) will enable local LLM processing
- **No data is stored** by the LLM providers - each request is stateless

## Local LLM Setup (Advanced)

Local LLM support is planned for a future release. This will enable:
- 100% offline operation
- No API costs
- Complete privacy

Stay tuned for updates!

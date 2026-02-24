mod anthropic;
mod gemini;
mod openrouter;

use anyhow::{bail, Result};
use async_trait::async_trait;

use crate::config::AiConfig;

#[async_trait]
pub trait LlmClient: Send + Sync {
    /// Send a completion request with a system prompt and user message.
    async fn complete(&self, system: &str, user: &str) -> Result<String>;
}

/// Create an LLM client based on the config.
/// Returns None if no API key is available (graceful degradation).
pub fn create_client(config: &AiConfig) -> Result<Option<Box<dyn LlmClient>>> {
    let api_key = match config.resolve_api_key() {
        Some(key) if !key.is_empty() => key,
        _ => {
            tracing::warn!(
                "No API key found for provider '{}'. LLM features will return placeholder responses. \
                 Set {} env var or add api_key to [ai] in buddy.toml.",
                config.provider,
                env_var_for_provider(&config.provider),
            );
            return Ok(None);
        }
    };

    let client: Box<dyn LlmClient> = match config.provider.as_str() {
        "claude" => Box::new(anthropic::AnthropicClient::new(
            api_key,
            config.model.clone(),
        )),
        "gemini" => Box::new(gemini::GeminiClient::new(
            api_key,
            config.model.clone(),
        )),
        "openrouter" => Box::new(openrouter::OpenRouterClient::new(
            api_key,
            config.model.clone(),
        )),
        other => bail!("Unknown LLM provider '{}'. Supported: claude, gemini, openrouter", other),
    };

    Ok(Some(client))
}

fn env_var_for_provider(provider: &str) -> &'static str {
    match provider {
        "claude" => "ANTHROPIC_API_KEY",
        "gemini" => "GEMINI_API_KEY",
        "openrouter" => "OPENROUTER_API_KEY",
        _ => "ANTHROPIC_API_KEY",
    }
}

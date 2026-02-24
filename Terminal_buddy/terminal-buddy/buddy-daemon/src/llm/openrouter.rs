use anyhow::{Context, Result};
use async_trait::async_trait;
use serde_json::json;

use super::LlmClient;

const DEFAULT_MODEL: &str = "anthropic/claude-sonnet-4-5";
const API_URL: &str = "https://openrouter.ai/api/v1/chat/completions";

pub struct OpenRouterClient {
    api_key: String,
    model: String,
    http: reqwest::Client,
}

impl OpenRouterClient {
    pub fn new(api_key: String, model: Option<String>) -> Self {
        Self {
            api_key,
            model: model.unwrap_or_else(|| DEFAULT_MODEL.to_string()),
            http: reqwest::Client::new(),
        }
    }
}

#[async_trait]
impl LlmClient for OpenRouterClient {
    async fn complete(&self, system: &str, user: &str) -> Result<String> {
        let body = json!({
            "model": self.model,
            "max_tokens": 1024,
            "messages": [
                { "role": "system", "content": system },
                { "role": "user", "content": user }
            ]
        });

        let resp = self.http
            .post(API_URL)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("content-type", "application/json")
            .header("HTTP-Referer", "https://github.com/terminal-buddy")
            .header("X-Title", "Terminal Buddy")
            .json(&body)
            .send()
            .await
            .context("Failed to reach OpenRouter API")?;

        let status = resp.status();
        let json: serde_json::Value = resp.json().await
            .context("Failed to parse OpenRouter response")?;

        if !status.is_success() {
            let err_msg = json["error"]["message"]
                .as_str()
                .unwrap_or("Unknown error");
            anyhow::bail!("OpenRouter API error ({}): {}", status, err_msg);
        }

        // OpenAI-compatible response format
        json["choices"][0]["message"]["content"]
            .as_str()
            .map(|s| s.to_string())
            .context("No content in OpenRouter response")
    }
}

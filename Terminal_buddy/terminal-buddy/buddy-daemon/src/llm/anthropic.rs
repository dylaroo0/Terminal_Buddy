use anyhow::{Context, Result};
use async_trait::async_trait;
use serde_json::json;

use super::LlmClient;

const DEFAULT_MODEL: &str = "claude-sonnet-4-5-20250929";
const API_URL: &str = "https://api.anthropic.com/v1/messages";

pub struct AnthropicClient {
    api_key: String,
    model: String,
    http: reqwest::Client,
}

impl AnthropicClient {
    pub fn new(api_key: String, model: Option<String>) -> Self {
        Self {
            api_key,
            model: model.unwrap_or_else(|| DEFAULT_MODEL.to_string()),
            http: reqwest::Client::new(),
        }
    }
}

#[async_trait]
impl LlmClient for AnthropicClient {
    async fn complete(&self, system: &str, user: &str) -> Result<String> {
        let body = json!({
            "model": self.model,
            "max_tokens": 1024,
            "system": system,
            "messages": [
                { "role": "user", "content": user }
            ]
        });

        let resp = self.http
            .post(API_URL)
            .header("x-api-key", &self.api_key)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .json(&body)
            .send()
            .await
            .context("Failed to reach Anthropic API")?;

        let status = resp.status();
        let json: serde_json::Value = resp.json().await
            .context("Failed to parse Anthropic response")?;

        if !status.is_success() {
            let err_msg = json["error"]["message"]
                .as_str()
                .unwrap_or("Unknown error");
            anyhow::bail!("Anthropic API error ({}): {}", status, err_msg);
        }

        // Extract text from the first content block
        json["content"][0]["text"]
            .as_str()
            .map(|s| s.to_string())
            .context("No text in Anthropic response")
    }
}

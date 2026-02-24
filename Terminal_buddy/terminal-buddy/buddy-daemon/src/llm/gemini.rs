use anyhow::{Context, Result};
use async_trait::async_trait;
use serde_json::json;

use super::LlmClient;

const DEFAULT_MODEL: &str = "gemini-2.0-flash";
const API_BASE: &str = "https://generativelanguage.googleapis.com/v1beta/models";

pub struct GeminiClient {
    api_key: String,
    model: String,
    http: reqwest::Client,
}

impl GeminiClient {
    pub fn new(api_key: String, model: Option<String>) -> Self {
        Self {
            api_key,
            model: model.unwrap_or_else(|| DEFAULT_MODEL.to_string()),
            http: reqwest::Client::new(),
        }
    }
}

#[async_trait]
impl LlmClient for GeminiClient {
    async fn complete(&self, system: &str, user: &str) -> Result<String> {
        let url = format!("{}/{}:generateContent?key={}", API_BASE, self.model, self.api_key);

        let body = json!({
            "system_instruction": {
                "parts": [{ "text": system }]
            },
            "contents": [{
                "parts": [{ "text": user }]
            }]
        });

        let resp = self.http
            .post(&url)
            .header("content-type", "application/json")
            .json(&body)
            .send()
            .await
            .context("Failed to reach Gemini API")?;

        let status = resp.status();
        let json: serde_json::Value = resp.json().await
            .context("Failed to parse Gemini response")?;

        if !status.is_success() {
            let err_msg = json["error"]["message"]
                .as_str()
                .unwrap_or("Unknown error");
            anyhow::bail!("Gemini API error ({}): {}", status, err_msg);
        }

        // Extract text from first candidate's first part
        json["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .map(|s| s.to_string())
            .context("No text in Gemini response")
    }
}

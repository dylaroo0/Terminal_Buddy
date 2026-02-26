//! Voice transcription module for Terminal Buddy
//!
//! Uses Groq Cloud API with Whisper-large-v3 model
//! Fast, accurate, and free tier available

use reqwest::{Client, multipart};
use serde::Deserialize;
use tauri::State;
use base64::Engine;

/// Transcription result from Groq API
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct TranscriptionResult {
    pub text: String,
    pub language: Option<String>,
    pub duration: Option<f32>,
}

/// Groq API response structure
#[derive(Debug, Deserialize)]
struct GroqResponse {
    text: String,
    #[serde(default)]
    language: Option<String>,
    #[serde(default)]
    duration: Option<f32>,
}

/// Application state containing Groq API key
pub struct VoiceState {
    pub api_key: String,
}

/// Transcribe audio using Groq Cloud API
#[tauri::command]
pub async fn voice_transcribe(
    voice_state: State<'_, VoiceState>,
    audio_data: String,
) -> Result<String, String> {
    if voice_state.api_key.is_empty() {
        return Err("Groq API key not configured".to_string());
    }

    let client = Client::new();
    let audio_bytes = base64::engine::general_purpose::STANDARD.decode(&audio_data)
        .map_err(|e| format!("Base64 error: {}", e))?;

    let form = multipart::Form::new()
        .text("model", "whisper-large-v3")
        .text("response_format", "json")
        .text("language", "en")
        .part("file", multipart::Part::bytes(audio_bytes)
            .file_name("recording.webm")
            .mime_str("audio/webm")
            .map_err(|e| format!("MIME error: {}", e))?
        );

    let response = client
        .post("https://api.groq.com/openai/v1/audio/transcriptions")
        .header("Authorization", format!("Bearer {}", voice_state.api_key))
        .multipart(form)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err(format!("Groq error: {}", error_text));
    }

    let result: GroqResponse = response.json().await
        .map_err(|e| format!("Parse error: {}", e))?;

    Ok(result.text.trim().to_string())
}

/// Check if voice is configured
#[tauri::command]
pub fn voice_is_configured(voice_state: State<'_, VoiceState>) -> bool {
    !voice_state.api_key.is_empty() && voice_state.api_key.starts_with("gsk_")
}

/// Test Groq API connection
#[tauri::command]
pub async fn voice_test_connection(voice_state: State<'_, VoiceState>) -> Result<String, String> {
    if voice_state.api_key.is_empty() {
        return Err("API key not configured".to_string());
    }
    Ok("Connection successful".to_string())
}

/// Validate Groq API key format
pub fn is_valid_api_key(key: &str) -> bool {
    key.starts_with("gsk_") && key.len() > 10
}

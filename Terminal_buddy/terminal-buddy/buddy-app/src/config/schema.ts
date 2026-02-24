// shared/config-schema.ts
// This schema represents the structure of the buddy.toml configuration file.
// It serves as the source of truth for both validation and UI generation in the Creator Corner.

export interface BuddyAppearanceConfig {
    theme: string;
    font_family: string;
    font_size: number;
    line_height: number;
    letter_spacing: string;
    background?: string;
}

export interface BuddyInteractionConfig {
    default_input: "voice" | "keyboard" | "hybrid";
    push_to_talk: string;
    confirm_before_run: boolean;
    visual_command_cards: boolean;
}

export interface BuddyFeedbackConfig {
    text_to_speech: boolean;
    tts_provider: "local" | "elevenlabs" | "quen" | "none";
    error_icons: boolean;
    focus_mode: boolean;
}

export interface BuddySessionsConfig {
    auto_title: boolean;
    title_method: "heuristic" | "llm";
    auto_group_topics: boolean;
    prompt_for_notes: "on_close" | "never" | "always";
}

export interface BuddyConfig {
    appearance: BuddyAppearanceConfig;
    interaction: BuddyInteractionConfig;
    feedback: BuddyFeedbackConfig;
    sessions: BuddySessionsConfig;
}

export const defaultDyslexiaConfig: BuddyConfig = {
    appearance: {
        theme: "dyslexia-dark",
        font_family: "OpenDyslexic, Lexend, sans-serif",
        font_size: 18,
        line_height: 1.8,
        letter_spacing: "0.05em",
        background: "#0d1117",
    },
    interaction: {
        default_input: "voice",
        push_to_talk: "RightCtrl",
        confirm_before_run: true,
        visual_command_cards: true,
    },
    feedback: {
        text_to_speech: true,
        tts_provider: "local",
        error_icons: true,
        focus_mode: true,
    },
    sessions: {
        auto_title: true,
        title_method: "heuristic",
        auto_group_topics: true,
        prompt_for_notes: "on_close",
    },
};

// Next steps: Add Zod or JSON Schema definitions for strict runtime validation.

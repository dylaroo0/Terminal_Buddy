# Voice Widget UI Design

**Date:** 2026-02-24  
**Status:** ✅ UI Complete (Backend Placeholder)  
**Component:** `VoiceWidget.tsx`

---

## Overview

The Voice Widget provides **push-to-talk voice command** interface with live transcription feedback.

**Key Design Decisions:**
1. **Non-intrusive** - Mic button in title bar, doesn't block terminal
2. **Live feedback** - Transcription bubble follows cursor
3. **Privacy-first** - One-click privacy mode toggle
4. **History tracking** - All voice commands saved, reviewable

---

## UI Components

### 1. Mic Button (Always Visible)

```
┌─────────────────────────────────────────┐
│  Terminal Buddy              🎤 🔓 📋 [⚙️] │
└─────────────────────────────────────────┘
                              │
                              ├─ 🎤 = Mic button (click or hold Space)
                              ├─ 🔓 = Privacy toggle (click to disable)
                              └─ 📋 = History (shows when commands exist)
```

**States:**

| State | Appearance | Behavior |
|-------|------------|----------|
| **Idle** | Gray mic icon | Click to start listening |
| **Listening** | Green pulsing mic | Click to stop, or release Space |
| **Privacy Mode** | Mic with slash (disabled) | Click 🔓 to enable |

---

### 2. Transcription Bubble (Appears When Listening)

```
┌─────────────────────────────────────────────┐
│ 🔴 Listening...                      [✕]   │  ← Header (green)
├─────────────────────────────────────────────┤
│                                             │
│   docker-compose up                         │  ← Live transcription
│                                             │
├─────────────────────────────────────────────┤
│ Listening for 3s        [🔄] [✓]           │  ← Footer
└─────────────────────────────────────────────┘
                         │
                         ├─ 🔄 = Retry (re-listen)
                         └─ ✓ = Confirm (save to history)
```

**Features:**
- **Position:** Follows cursor (20px right, 60px above)
- **Animation:** Fades in with scale effect
- **Auto-scroll:** If transcription exceeds height
- **Real-time:** Text appears as you speak (simulated)

**Visual Design:**
- **Border:** 2px green (#22C55E)
- **Shadow:** Green glow (30% opacity)
- **Background:** Semi-transparent dark (98% opacity)
- **Backdrop blur:** 8px blur behind

---

### 3. Voice History Panel (Click 📋)

```
┌─────────────────────────────────────────────┐
│ Voice Commands              [Clear All] [✕] │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ⏳ 9:42 PM                              │ │
│ │                                         │ │
│ │ docker-compose up                       │ │
│ │                                         │ │
│ │ [▶️ Run] [🗑️]                          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ✓ 9:40 PM                               │ │
│ │                                         │ │
│ │ git status                              │ │
│ │                                         │ │
│ │ [▶️ Run] [🗑️]                          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🚫 9:38 PM                              │ │
│ │                                         │ │
│ │ rm -rf /tmp/*                           │ │
│ │                                         │ │
│ │ [▶️ Run] [🗑️]                          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

**Status Icons:**
- ⏳ = Executing (yellow background)
- ✓ = Ready (green check, shows confidence on hover)
- 🚫 = Error (red border)

**Actions:**
- **▶️ Run** - Execute command in terminal
- **🗑️** - Delete from history
- **Clear All** - Remove all history

---

### 4. Privacy Mode Banner

```
┌─────────────────────────────────────────────┐
│ 🎤 Voice input disabled (Privacy Mode) [Enable] │
└─────────────────────────────────────────────┘
```

Appears below mic button when privacy mode is enabled.

---

## Interaction Flows

### Flow 1: Push-to-Talk (Space Key)

```
1. User holds Space key
   ↓
2. Mic button turns green + pulses
   ↓
3. Transcription bubble appears near cursor
   ↓
4. User speaks → text appears in real-time
   ↓
5. User releases Space
   ↓
6. Transcription saved to history
   ↓
7. Bubble disappears
```

### Flow 2: Click-to-Talk

```
1. User clicks mic button
   ↓
2. Mic turns green + pulses
   ↓
3. Transcription bubble appears
   ↓
4. User speaks
   ↓
5. User clicks mic again (or ✓ button)
   ↓
6. Transcription saved to history
```

### Flow 3: Confirm & Execute

```
1. Transcription appears in bubble
   ↓
2. User clicks ✓ (confirm)
   ↓
3. Saved to history with "ready" status
   ↓
4. User clicks ▶️ Run in history
   ↓
5. Command executes in terminal
   ↓
6. Status changes to "executing" → "ready"
```

### Flow 4: Privacy Mode

```
1. User clicks 🔓 (unlock icon)
   ↓
2. Privacy banner appears
   ↓
3. Mic button disabled (gray, not clickable)
   ↓
4. Tooltip: "Voice disabled (Privacy Mode)"
   ↓
5. User clicks 🔒 (lock icon) or "Enable"
   ↓
6. Privacy mode off, mic re-enabled
```

---

## Accessibility Features

| Feature | Implementation |
|---------|----------------|
| **Keyboard navigation** | Space = push-to-talk, Escape = cancel |
| **Screen reader labels** | `aria-label` on all buttons |
| **High contrast** | Green (#22C55E) meets WCAG AAA on dark background |
| **Focus states** | 2px outline on all interactive elements |
| **Reduced motion** | Respects `prefers-reduced-motion` (no pulse animation) |
| **Touch targets** | All buttons ≥ 44px |

---

## CSS Variables Used

```css
--bg-deep: #0F172A       /* Deep background */
--bg-surface: #1E293B    /* Card background */
--bg-elevated: #334155   /* Elevated elements */
--primary: #3B82F6       /* Primary blue */
--success: #22C55E       /* Success green */
--warning: #F59E0B       /* Warning orange */
--error: #EF4444         /* Error red */
--border: #334155        /* Border color */
--text-primary: #F1F5F9  /* Primary text */
--text-secondary: #94A3B8 /* Secondary text */
```

---

## Props & Callbacks

```typescript
interface VoiceWidgetProps {
  /** Show widget (default: true) */
  visible?: boolean;
  
  /** Privacy mode - disables mic */
  privacyMode?: boolean;
  
  /** Callback when voice command is confirmed */
  onCommandConfirm?: (command: string) => void;
  
  /** Callback when widget state changes */
  onStateChange?: (state: 'idle' | 'listening' | 'processing') => void;
}
```

---

## Backend Integration (TODO)

### Current State: **Simulated**

The widget currently **simulates** voice recognition with mock commands:
```typescript
const mockCommands = [
  'docker-compose up',
  'npm install --legacy-peer-deps',
  'git status',
  // ...
];
```

### Future Integration: whisper-rs

```rust
// buddy-daemon/src/voice/mod.rs

use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};

pub struct VoiceRecognizer {
    ctx: Arc<WhisperContext>,
}

impl VoiceRecognizer {
    pub fn new() -> Self {
        // Load whisper model
    }
    
    pub fn transcribe(&self, audio: &[f32]) -> String {
        // Convert audio to text
    }
}
```

### Tauri Commands Needed

```rust
#[tauri::command]
pub fn voice_start_listening() -> Result<(), String> {
    // Start audio capture
}

#[tauri::command]
pub fn voice_stop_listening() -> Result<String, String> {
    // Stop capture, return transcription
}

#[tauri::command]
pub fn voice_get_status() -> Result<VoiceStatus, String> {
    // Ready, Listening, Error, etc.
}
```

---

## Testing Checklist

### Manual Testing

- [ ] Click mic button → starts listening
- [ ] Hold Space → starts listening
- [ ] Release Space → stops listening
- [ ] Transcription appears in bubble
- [ ] Bubble follows cursor
- [ ] Click ✓ → saves to history
- [ ] Click 🔄 → retries listening
- [ ] Click 📋 → opens history panel
- [ ] Click ▶️ Run → executes command
- [ ] Click 🗑️ → deletes from history
- [ ] Click 🔓 → enables privacy mode
- [ ] Privacy banner appears
- [ ] Mic disabled in privacy mode

### Accessibility Testing

- [ ] Tab to mic button → focus visible
- [ ] Space key → starts listening
- [ ] Escape key → cancels listening
- [ ] Screen reader announces button labels
- [ ] High contrast mode → still readable
- [ ] Reduced motion → no pulse animation

---

## Visual Design Notes

### Color Psychology

| Color | Meaning |
|-------|---------|
| **Green** (#22C55E) | Active, listening, safe |
| **Gray** (#334155) | Inactive, idle |
| **Blue** (#3B82F6) | Interactive, hover state |
| **Red** (#EF4444) | Error, privacy mode |
| **Orange** (#F59E0B) | Executing, processing |

### Animation Timing

| Animation | Duration | Easing |
|-----------|----------|--------|
| Bubble appear | 200ms | ease-out |
| Pulse (mic) | 1.5s | infinite |
| Slide down (history) | 200ms | ease-out |
| Fade in/out | 150ms | ease |

---

## Responsive Design

### Desktop (> 768px)
- Bubble follows cursor
- History panel: 360px width
- All features enabled

### Mobile (≤ 768px)
- Bubble centered (50% transform)
- History panel: 100% width (max 360px)
- Touch-optimized (larger targets)

---

## Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `VoiceWidget.tsx` | React component | ~350 |
| `VoiceWidget.css` | Styling | ~450 |
| `App.tsx` (modified) | Integration | +15 |

**Total:** ~815 lines of code

---

## Next Steps

### Immediate (You Can Test Now)

1. **Run the app:**
   ```bash
   cd /home/dylaroo/projects/Terminal_buddy/terminal-buddy/buddy-app
   npm run tauri dev
   ```

2. **Try these interactions:**
   - Click mic button (top right)
   - Hold Space key
   - Watch transcription bubble appear
   - Click history icon (📋)
   - Try privacy mode toggle

### Backend Integration (Future)

1. Install whisper-rs in buddy-daemon
2. Create Tauri commands for voice
3. Replace simulation with real STT
4. Add audio capture (cpal crate)
5. Test with actual voice commands

---

## Design Inspiration

- **macOS Dictation** - Clean bubble design
- **Google Assistant** - Pulsing mic indicator
- **Windows Voice Access** - History panel layout
- **Discord Push-to-Talk** - Space key shortcut

---

*Voice Widget UI complete. Backend integration pending whisper-rs.*

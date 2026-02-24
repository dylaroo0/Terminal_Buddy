import React, { useState } from 'react';
import { Mic, Keyboard, Settings, BookOpen, Zap, Check, AlertCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import * as mcp from '../utils/tauri-mcp';

interface OnboardingWizardProps {
  onComplete: () => void;
}

type Step = 'welcome' | 'ai-setup' | 'preferences';
type InteractionMode = 'voice' | 'keyboard' | 'hybrid';
type Provider = 'openrouter' | 'claude' | 'gemini';
type FontChoice = 'atkinson' | 'lexend' | 'system';
type TtsProvider = 'built-in' | 'elevenlabs' | 'none';
type ExplainLevel = 'beginner' | 'intermediate' | 'expert';

type ApiKeyStatus = 'idle' | 'testing' | 'valid' | 'invalid';

const STEPS: Step[] = ['welcome', 'ai-setup', 'preferences'];

const PROVIDER_INFO: Record<Provider, { name: string; description: string; envVar: string }> = {
  openrouter: {
    name: 'OpenRouter',
    description: 'Access multiple AI models through one API. Pay-as-you-go pricing.',
    envVar: 'OPENROUTER_API_KEY',
  },
  claude: {
    name: 'Anthropic Claude',
    description: 'Direct access to Claude models. Requires Anthropic API key.',
    envVar: 'ANTHROPIC_API_KEY',
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Access to Gemini models. Free tier available.',
    envVar: 'GEMINI_API_KEY',
  },
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [saving, setSaving] = useState(false);

  // Step 1: Interaction mode
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('keyboard');

  // Step 2: AI provider + API key
  const [provider, setProvider] = useState<Provider>('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>('idle');

  // Step 3: Preferences
  const [fontChoice, setFontChoice] = useState<FontChoice>('atkinson');
  const [ttsProvider, setTtsProvider] = useState<TtsProvider>('built-in');
  const [explainLevel, setExplainLevel] = useState<ExplainLevel>('beginner');

  const stepIndex = STEPS.indexOf(currentStep);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setCurrentStep(next);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setCurrentStep(prev);
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) return;
    setApiKeyStatus('testing');
    try {
      const result = await mcp.testApiKey(provider, apiKey.trim());
      setApiKeyStatus(result.valid ? 'valid' : 'invalid');
    } catch {
      setApiKeyStatus('invalid');
    }
  };

  const handleRecommendedSetup = async () => {
    setSaving(true);
    const config: mcp.BuddyConfig = {
      behavior: {
        copilot_personality: 'active',
        explain_level: 'beginner',
        session_titling: 'suggest',
        teachable_moments: 'inline',
      },
      ai: {
        provider: 'openrouter',
        privacy_mode: false,
      },
    };
    await mcp.saveConfig(config);
    setSaving(false);
    onComplete();
  };

  const handleFinish = async () => {
    setSaving(true);
    const config: mcp.BuddyConfig = {
      behavior: {
        copilot_personality: interactionMode === 'voice' ? 'active' : 'passive',
        explain_level: explainLevel,
        session_titling: 'suggest',
        teachable_moments: 'inline',
      },
      ai: {
        provider,
        api_key: apiKey.trim() || undefined,
        privacy_mode: false,
      },
    };
    await mcp.saveConfig(config);
    setSaving(false);
    onComplete();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-wizard">
        {/* Progress indicator */}
        <div className="wizard-progress">
          {STEPS.map((step, i) => (
            <div key={step} className={`progress-dot ${i <= stepIndex ? 'active' : ''} ${i < stepIndex ? 'completed' : ''}`}>
              {i < stepIndex ? <Check size={12} /> : <span>{i + 1}</span>}
            </div>
          ))}
          <div className="progress-line">
            <div className="progress-fill" style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {currentStep === 'welcome' && (
          <div className="wizard-step">
            <h2 className="wizard-title">Welcome to Terminal Buddy</h2>
            <p className="wizard-subtitle">A journal for your terminal that explains itself.</p>

            <div className="wizard-section">
              <h3>How do you want to interact?</h3>
              <div className="option-grid">
                <button onClick={() => setInteractionMode('voice')} className={`option-card ${interactionMode === 'voice' ? 'active' : ''}`}>
                  <Mic className="option-icon" />
                  <span className="option-label">Voice-first</span>
                  <span className="option-desc">Recommended for accessibility</span>
                </button>
                <button onClick={() => setInteractionMode('keyboard')} className={`option-card ${interactionMode === 'keyboard' ? 'active' : ''}`}>
                  <Keyboard className="option-icon" />
                  <span className="option-label">Keyboard-first</span>
                  <span className="option-desc">Traditional terminal workflow</span>
                </button>
                <button onClick={() => setInteractionMode('hybrid')} className={`option-card ${interactionMode === 'hybrid' ? 'active' : ''}`}>
                  <Settings className="option-icon" />
                  <span className="option-label">Hybrid</span>
                  <span className="option-desc">Best of both worlds</span>
                </button>
              </div>
            </div>

            <div className="wizard-actions">
              <button onClick={handleRecommendedSetup} className="wizard-btn secondary" disabled={saving}>
                {saving ? <Loader2 className="spin-icon" /> : <Zap size={16} />}
                Use Recommended Setup
              </button>
              <button onClick={goNext} className="wizard-btn primary">
                Customize
                <ArrowRight size={16} />
              </button>
            </div>

            <p className="wizard-hint">All choices can be changed later in Settings.</p>
          </div>
        )}

        {/* Step 2: AI Provider + API Key */}
        {currentStep === 'ai-setup' && (
          <div className="wizard-step">
            <h2 className="wizard-title">AI Provider Setup</h2>
            <p className="wizard-subtitle">Terminal Buddy uses AI to explain commands and answer questions.</p>

            <div className="wizard-section">
              <h3>Choose your AI provider</h3>
              <div className="provider-grid">
                {(Object.entries(PROVIDER_INFO) as [Provider, typeof PROVIDER_INFO[Provider]][]).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => { setProvider(key); setApiKeyStatus('idle'); }}
                    className={`provider-card ${provider === key ? 'active' : ''}`}
                  >
                    <span className="provider-name">{info.name}</span>
                    <span className="provider-desc">{info.description}</span>
                    {provider === key && <Check className="provider-check" size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="wizard-section">
              <h3>API Key</h3>
              <p className="field-hint">
                Your key is stored locally in <code>buddy.toml</code>. Never sent anywhere except {PROVIDER_INFO[provider].name}.
              </p>
              <div className="api-key-field">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setApiKeyStatus('idle'); }}
                  placeholder={`Paste your ${PROVIDER_INFO[provider].name} API key...`}
                  className="api-key-input"
                />
                <button
                  onClick={handleTestApiKey}
                  disabled={!apiKey.trim() || apiKeyStatus === 'testing'}
                  className={`test-key-btn ${apiKeyStatus === 'valid' ? 'valid' : ''} ${apiKeyStatus === 'invalid' ? 'invalid' : ''}`}
                >
                  {apiKeyStatus === 'testing' && <Loader2 className="spin-icon" size={14} />}
                  {apiKeyStatus === 'valid' && <Check size={14} />}
                  {apiKeyStatus === 'invalid' && <AlertCircle size={14} />}
                  {apiKeyStatus === 'idle' && 'Test'}
                  {apiKeyStatus === 'testing' && 'Testing...'}
                  {apiKeyStatus === 'valid' && 'Valid'}
                  {apiKeyStatus === 'invalid' && 'Invalid'}
                </button>
              </div>
              {apiKeyStatus === 'invalid' && (
                <p className="field-error">Key validation failed. Check the key and try again.</p>
              )}
              {apiKeyStatus === 'valid' && (
                <p className="field-success">API key verified. You're all set.</p>
              )}
              <p className="field-hint secondary">
                You can also set the <code>{PROVIDER_INFO[provider].envVar}</code> environment variable instead.
              </p>
            </div>

            <div className="wizard-actions">
              <button onClick={goBack} className="wizard-btn secondary">
                <ArrowLeft size={16} />
                Back
              </button>
              <button onClick={goNext} className="wizard-btn primary">
                {apiKey.trim() ? 'Next' : 'Skip for now'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reading Comfort + Behavior */}
        {currentStep === 'preferences' && (
          <div className="wizard-step">
            <h2 className="wizard-title">Reading Comfort</h2>
            <p className="wizard-subtitle">Customize how Terminal Buddy looks and feels.</p>

            <div className="wizard-section">
              <h3>Font</h3>
              <div className="option-grid">
                <button onClick={() => setFontChoice('atkinson')} className={`option-card ${fontChoice === 'atkinson' ? 'active' : ''}`}>
                  <BookOpen className="option-icon" />
                  <span className="option-label">Atkinson Hyperlegible</span>
                  <span className="option-desc">Designed for readability</span>
                </button>
                <button onClick={() => setFontChoice('lexend')} className={`option-card ${fontChoice === 'lexend' ? 'active' : ''}`}>
                  <BookOpen className="option-icon" />
                  <span className="option-label">Lexend</span>
                  <span className="option-desc">Modern accessible font</span>
                </button>
                <button onClick={() => setFontChoice('system')} className={`option-card ${fontChoice === 'system' ? 'active' : ''}`}>
                  <BookOpen className="option-icon" />
                  <span className="option-label">System Default</span>
                  <span className="option-desc">Your OS font</span>
                </button>
              </div>
            </div>

            <div className="wizard-section">
              <h3>Explanation Detail Level</h3>
              <div className="option-grid">
                <button onClick={() => setExplainLevel('beginner')} className={`option-card ${explainLevel === 'beginner' ? 'active' : ''}`}>
                  <span className="option-label">Beginner</span>
                  <span className="option-desc">Detailed, step-by-step</span>
                </button>
                <button onClick={() => setExplainLevel('intermediate')} className={`option-card ${explainLevel === 'intermediate' ? 'active' : ''}`}>
                  <span className="option-label">Intermediate</span>
                  <span className="option-desc">Concise explanations</span>
                </button>
                <button onClick={() => setExplainLevel('expert')} className={`option-card ${explainLevel === 'expert' ? 'active' : ''}`}>
                  <span className="option-label">Expert</span>
                  <span className="option-desc">Brief, technical</span>
                </button>
              </div>
            </div>

            <div className="wizard-section">
              <h3>Text-to-Speech</h3>
              <div className="option-grid">
                <button onClick={() => setTtsProvider('built-in')} className={`option-card ${ttsProvider === 'built-in' ? 'active' : ''}`}>
                  <span className="option-label">Built-in</span>
                  <span className="option-desc">Free, runs locally</span>
                </button>
                <button onClick={() => setTtsProvider('none')} className={`option-card ${ttsProvider === 'none' ? 'active' : ''}`}>
                  <span className="option-label">None</span>
                  <span className="option-desc">Text only</span>
                </button>
              </div>
            </div>

            <div className="wizard-actions">
              <button onClick={goBack} className="wizard-btn secondary">
                <ArrowLeft size={16} />
                Back
              </button>
              <button onClick={handleFinish} className="wizard-btn primary" disabled={saving}>
                {saving ? <Loader2 className="spin-icon" /> : null}
                {saving ? 'Saving...' : 'Get Started'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

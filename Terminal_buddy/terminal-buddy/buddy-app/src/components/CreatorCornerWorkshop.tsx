import { useState, useEffect } from 'react';
import { useMCP } from '@/hooks/useMCP';

import './CreatorCornerWorkshop.css';

export function CreatorCornerWorkshop() {
  const { callPencilTool: _callPencilTool } = useMCP();
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState<string>('');
  const [config, setConfig] = useState({
    template: 'dark-oled',
    font_size_ui: 16,
    contrast_mode: 'high',
    font_ui: 'Atkinson Hyperlegible',
    font_mono: 'JetBrains Mono'
  });

  // Step 1: Load template options
  useEffect(() => {
    if (step === 1) {
      // In real implementation, this would call Pencil
      setPreview('<div class="workshop-preview">Template gallery loading...</div>');
    }
  }, [step]);

  // Validate and enforce design system rules
  const validateStyleChanges = (changes: Record<string, any>) => {
    const validated = { ...changes };
    
    // Enforce accessibility defaults
    if (validated.font_size_ui && validated.font_size_ui < 16) {
      validated.font_size_ui = 16; // Minimum for dyslexia-friendly
    }
    
    // Enforce contrast ratios
    if (validated.contrast_mode === 'high') {
      validated.text_primary = '#F1F5F9';
      validated.bg_deep = '#0F172A';
    }
    
    // Enforce font choices
    validated.font_ui = 'Atkinson Hyperlegible';
    validated.font_mono = 'JetBrains Mono';
    
    return validated;
  };

  const updateConfig = (newConfig: Partial<typeof config>) => {
    const validated = validateStyleChanges(newConfig);
    setConfig(prev => ({ ...prev, ...validated }));
  };

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="creator-corner-workshop p-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">🛠️ Creator Corner Workshop</h2>
        <p className="text-lg text-gray-400">
          Let's build your perfect terminal UI — step by step
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex items-center ${s <= step ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                s === step 
                  ? 'bg-blue-500 border-blue-400' 
                  : s < step 
                    ? 'bg-blue-500 border-blue-400' 
                    : 'border-gray-600'
              }`}>
                {s}
              </div>
              {s < 4 && (
                <div className={`w-12 h-1 ${s < step ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        {step === 1 && (
          <TemplateSelector 
            onSelect={(template) => {
              updateConfig({ template });
              handleNextStep();
            }}
          />
        )}
        
        {step === 2 && (
          <AccessibilityTweaks 
            config={config}
            onChange={updateConfig}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        
        {step === 3 && (
          <ComponentCustomizer 
            config={config}
            preview={preview}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}
        
        {step === 4 && (
          <SaveAndShare 
            config={config}
            onExport={() => {
              // In real implementation, this would call Pencil export
              alert('Template saved! Ready to share or apply.');
            }}
            onPrev={handlePrevStep}
          />
        )}
      </div>

      {/* Preview Panel */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Live Preview</h3>
        <div className="bg-gray-900 rounded-lg p-4 min-h-[300px] overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: preview || '<div class="text-gray-400 p-8 text-center">Preview will appear here as you customize</div>' }} />
        </div>
      </div>
    </div>
  );
}

// Step Components
function TemplateSelector({ onSelect }: { onSelect: (template: string) => void }) {
  const templates = [
    { id: 'minimal-focus', name: 'Minimal Focus', description: 'Clean, distraction-free interface' },
    { id: 'power-user', name: 'Power User', description: 'Feature-rich with advanced controls' },
    { id: 'dark-oled', name: 'Dark OLED', description: 'Vibrant & block-based, WCAG AAA compliant' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Step 1: Pick a Starting Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600 transition-colors text-left"
          >
            <div className="font-semibold">{template.name}</div>
            <div className="text-sm text-gray-400 mt-1">{template.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AccessibilityTweaks({ 
  config, 
  onChange,
  onNext,
  onPrev 
}: { 
  config: any; 
  onChange: (changes: Partial<any>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Step 2: Adjust Accessibility Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 text-gray-300">Font Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">UI Font Size</label>
              <div className="flex space-x-2">
                {[16, 18, 20].map(size => (
                  <button
                    key={size}
                    onClick={() => onChange({ font_size_ui: size })}
                    className={`px-3 py-2 rounded ${
                      config.font_size_ui === size 
                        ? 'bg-blue-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Contrast Mode</label>
              <div className="flex space-x-2">
                {['high', 'medium', 'low'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => onChange({ contrast_mode: mode })}
                    className={`px-3 py-2 rounded capitalize ${
                      config.contrast_mode === mode 
                        ? 'bg-blue-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 text-gray-300">Visual Guidelines</h4>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">WCAG AAA Compliant</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Dyslexia-friendly fonts</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm">Keyboard navigable</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          onClick={onPrev}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          ← Back
        </button>
        <button 
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function ComponentCustomizer({
  config: _config,
  preview,
  onNext,
  onPrev
}: {
  config: any; 
  preview: string;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Step 3: Customize Components</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 text-gray-300">Command Card Preview</h4>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="font-mono text-gray-200">$ npm install</div>
                <div className="flex space-x-2 mt-2">
                  <button className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-500">
                    Explain
                  </button>
                  <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">
                    Re-run
                  </button>
                  <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">
                    Note
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-3 text-gray-300">Customization Options</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Card Background</label>
                <div className="flex space-x-2">
                  {['#1E293B', '#334155', '#0F172A'].map(color => (
                    <button
                      key={color}
                      onClick={() => {}}
                      className="w-8 h-8 rounded border-2"
                      style={{ backgroundColor: color, borderColor: color === '#1E293B' ? '#3B82F6' : '#444' }}
                    ></button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Primary Color</label>
                <div className="flex space-x-2">
                  {['#3B82F6', '#2563EB', '#1D4ED8'].map(color => (
                    <button
                      key={color}
                      onClick={() => {}}
                      className="w-8 h-8 rounded border-2"
                      style={{ backgroundColor: color, borderColor: color === '#3B82F6' ? '#3B82F6' : '#444' }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 text-gray-300">Live Preview</h4>
          <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-auto">
            <div className="text-gray-400 text-sm">
              {preview || "Your custom terminal UI will appear here in real-time"}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-3 text-gray-300">Design Principles</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>• Journal, not terminal</li>
              <li>• Explainable interactions</li>
              <li>• Local-first privacy</li>
              <li>• Block-based layout</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          onClick={onPrev}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          ← Back
        </button>
        <button 
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function SaveAndShare({ 
  config,
  onExport,
  onPrev 
}: { 
  config: any;
  onExport: () => void;
  onPrev: () => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Step 4: Save & Share</h3>
      
      <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
        <h4 className="font-medium mb-3 text-gray-300">Your Custom Template</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Template:</span>
              <span className="font-medium">{config.template}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Font Size:</span>
              <span className="font-medium">{config.font_size_ui}px</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Contrast:</span>
              <span className="font-medium capitalize">{config.contrast_mode}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">UI Font:</span>
              <span className="font-medium">{config.font_ui}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Mono Font:</span>
              <span className="font-medium">{config.font_mono}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="font-medium text-green-400">Ready to save</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={onExport}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save as My Template
        </button>
        
        <button 
          onClick={() => alert('Community sharing coming soon!')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share to Community
        </button>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          onClick={onPrev}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          ← Back
        </button>
        <button 
          onClick={() => alert('Workshop complete! Your template is ready.')}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
        >
          Finish ✅
        </button>
      </div>
    </div>
  );
}
const ModelSettings = (() => {
  const STORAGE_KEYS = { model: 'model', systemPrompt: 'systemPrompt' };
  const DEFAULT_MODEL = 'openrouter/auto';
  const DEFAULT_SYSTEM_PROMPT = 'You are a helpful prompt improver.';

  return {
    render() {
      return `
        <div class="settings-section" data-section="model">
          <div class="field-group">
            <label for="model" class="field-label">Model</label>
            <div class="select-wrapper">
              <select id="model" class="select-input">
                <option value="openrouter/auto">Auto (Recommended)</option>
                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                <option value="openai/gpt-4o">GPT-4o</option>
                <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
              </select>
            </div>
            <p class="field-help">Choose an AI model to improve your prompts</p>
          </div>

          <div class="field-group">
            <label for="systemPrompt" class="field-label">
              System Prompt
              <span class="char-count" id="promptCharCount">0/4000</span>
            </label>
            <textarea id="systemPrompt" class="textarea-input" rows="6" placeholder="How should the AI improve prompts?"></textarea>
            <p class="field-help">Customize how the AI analyzes and improves your prompts</p>
          </div>

          <div class="field-group">
            <label class="field-label">Quick Presets</label>
            <div class="preset-buttons">
              <button type="button" class="preset-btn" data-preset="concise">✨ Concise</button>
              <button type="button" class="preset-btn" data-preset="detailed">📝 Detailed</button>
              <button type="button" class="preset-btn" data-preset="creative">🎨 Creative</button>
              <button type="button" class="preset-btn" data-preset="technical">⚙️ Technical</button>
            </div>
          </div>
        </div>
      `;
    },

    init(container, state) {
      const systemPrompt = container.querySelector('#systemPrompt');
      const charCount = container.querySelector('#promptCharCount');
      const presetBtns = container.querySelectorAll('.preset-btn');

      const PROMPTS = {
        concise: 'Make prompts concise and clear.',
        detailed: 'Add specific details and context.',
        creative: 'Make prompts creative and engaging.',
        technical: 'Refine for technical accuracy.'
      };

      systemPrompt?.addEventListener('input', (e) => {
        charCount.textContent = `${e.target.value.length}/4000`;
      });

      presetBtns.forEach(btn => {
        btn?.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          if (PROMPTS[preset]) {
            systemPrompt.value = PROMPTS[preset];
            systemPrompt.dispatchEvent(new Event('input'));
            state.notifier.success(`Applied ${preset} preset`);
          }
        });
      });

      ExtensionState.getStorage(Object.values(STORAGE_KEYS), (data) => {
        if (data.model) container.querySelector('#model').value = data.model;
        if (data.systemPrompt) {
          systemPrompt.value = data.systemPrompt;
          systemPrompt.dispatchEvent(new Event('input'));
        }
      });
    },

    getValues(container) {
      return {
        model: container.querySelector('#model').value || DEFAULT_MODEL,
        systemPrompt: container.querySelector('#systemPrompt').value.trim() || DEFAULT_SYSTEM_PROMPT
      };
    }
  };
})();

// Demo Section Interactive Functionality - Minimalistic Version
class DemoEnhancer {
    constructor() {
        this.isEnhancing = false;
        this.enhancementExamples = {
            'How to learn JavaScript?': {
                enhanced: `I'm looking for a comprehensive JavaScript learning roadmap. Please provide:

• **Learning path**: Step-by-step progression from beginner to intermediate
• **Core concepts**: Essential topics to master (variables, functions, DOM, async)
• **Resources**: Best books, courses, and interactive platforms
• **Practice projects**: 3-4 beginner-friendly projects to build skills
• **Timeline**: Realistic expectations for reaching job-ready level
• **Common pitfalls**: Key mistakes to avoid and best practices

Background: [Your current programming experience]
Goal: [Web development/Node.js/React/etc.]
Time available: [Hours per week]

Please tailor recommendations for building a solid foundation while staying motivated.`
            },
            'Write a marketing email': {
                enhanced: `I need help creating a professional marketing email campaign:

**Campaign Details:**
• Objective: [Product launch/newsletter/promotion/etc.]
• Target audience: [Demographics and pain points]
• Key message: [Main value proposition]

**Please provide:**
• **Subject lines**: 3-5 compelling options (urgency, curiosity, benefit-focused)
• **Email structure**: Hook, value prop, social proof, clear CTA
• **Tone guidance**: [Professional/casual/friendly - specify preference]
• **Personalization**: Dynamic content suggestions
• **A/B testing**: Key variations to test

**Context:**
• Industry: [Your business sector]
• Brand voice: [Describe personality]
• Compliance: [GDPR/CAN-SPAM requirements]

Include a complete template with explanations for each section's purpose.`
            },
            'Plan a vacation': {
                enhanced: `I need comprehensive vacation planning assistance:

**Trip Specifications:**
• Destination: [Location or ask for recommendations]
• Dates: [Specific or flexible timeframe]
• Duration: [Days/weeks]
• Budget: [Total or daily limit]
• Group: [Solo/couple/family - include ages if relevant]

**Planning needs:**
• **Destination research**: Best time to visit, must-sees, hidden gems, cultural tips
• **Day-by-day itinerary**: Balanced activities, transportation, time allocation
• **Logistics**: Flight strategies, accommodation by area, packing lists
• **Budget breakdown**: Costs for flights, lodging, food, activities plus money-saving tips
• **Special interests**: [Photography/food/history/adventure/relaxation]

Please provide a structured plan with weather alternatives and budget-conscious options.`
            },
            'Explain quantum computing': {
                enhanced: `I'd like to understand quantum computing with an explanation tailored to my background:

**My Background:** [Beginner/some physics/computer science/etc.]
**Learning Goal:** [Academic interest/career/general curiosity]

**Please structure your explanation:**
• **Foundations**: Clear definitions, how it differs from classical computing
• **Key principles**: Superposition, entanglement, quantum interference (with analogies)
• **Technical details**: Qubits vs bits, quantum gates, major algorithms
• **Real-world context**: Current capabilities, practical applications, major breakthroughs
• **Learning path**: Recommended resources, simulators, communities

**Preferred style:** [Visual diagrams/mathematical formulas/analogies/hands-on examples]
**Specific interests:** [Theory/applications/programming/business implications]

Use clear examples and analogies while maintaining scientific accuracy.`
            }
        };
        
        this.defaultExamples = [
            'How to learn JavaScript?',
            'Write a marketing email',
            'Plan a vacation',
            'Explain quantum computing'
        ];
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        const enhanceBtn = document.getElementById('enhance-demo-btn');
        const demoInput = document.getElementById('demo-input');
        
        if (enhanceBtn) {
            enhanceBtn.addEventListener('click', () => this.enhancePrompt());
        }
        
        if (demoInput) {
            // Update placeholder and example on focus
            demoInput.addEventListener('focus', () => this.showInputSuggestions());
        }
        
        // Initialize with default example
        this.setRandomExample();
    }

    setRandomExample() {
        const demoInput = document.getElementById('demo-input');
        
        if (demoInput) {
            const randomExample = this.defaultExamples[Math.floor(Math.random() * this.defaultExamples.length)];
            demoInput.value = randomExample;
        }
    }

    showInputSuggestions() {
        // Placeholder for future enhancement
        console.log('Demo input focused');
    }

    async enhancePrompt() {
        if (this.isEnhancing) return;
        
        const demoInput = document.getElementById('demo-input');
        const enhanceBtn = document.getElementById('enhance-demo-btn');
        const enhancedResult = document.getElementById('enhanced-result');
        
        if (!demoInput || !enhanceBtn || !enhancedResult) {
            console.error('Demo elements not found');
            return;
        }
        
        const inputValue = demoInput.value.trim();
        if (!inputValue) {
            this.showError('Please enter a prompt to enhance');
            return;
        }
        
        this.isEnhancing = true;
        
        // Update UI to show loading state
        enhanceBtn.classList.add('loading');
        enhanceBtn.disabled = true;
        
        // Show typing animation
        enhancedResult.innerHTML = '<div class="typing-indicator">Analyzing and enhancing...</div>';
        
        try {
            // Simulate realistic processing delay
            await this.delay(1200 + Math.random() * 800);
            
            // Get enhanced version
            const enhanced = this.getEnhancedPrompt(inputValue);
            
            // Animate the enhanced prompt appearing
            await this.typeEnhancedPrompt(enhanced);
            
        } catch (error) {
            console.error('Enhancement error:', error);
            this.showError('Enhancement failed. Please try again.');
        } finally {
            // Reset UI
            enhanceBtn.classList.remove('loading');
            enhanceBtn.disabled = false;
            this.isEnhancing = false;
        }
    }

    getEnhancedPrompt(originalPrompt) {
        // Check for exact matches first
        if (this.enhancementExamples[originalPrompt]) {
            return this.enhancementExamples[originalPrompt].enhanced;
        }
        
        // Generate a contextual enhancement based on prompt type
        return this.generateContextualEnhancement(originalPrompt);
    }

    generateContextualEnhancement(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        // Learning/Education prompts
        if (lowerPrompt.includes('learn') || lowerPrompt.includes('how to') || lowerPrompt.includes('tutorial')) {
            return `I need comprehensive guidance on: "${prompt}"

Please provide a structured approach including:
• **Prerequisites**: Required background knowledge
• **Learning objectives**: Clear, measurable goals
• **Step-by-step roadmap**: Logical progression from basics to advanced
• **Practical applications**: Real-world examples and exercises
• **Resources**: Recommended books, courses, and communities
• **Assessment**: How to measure progress and validate understanding

**Context:**
• Current level: [Beginner/Intermediate/Advanced]
• Learning style: [Visual/hands-on/theoretical]
• Time available: [Hours per week]
• Specific goals: [Career/personal interest/academic]

Please tailor your response for an effective learning experience.`;
        }
        
        // Writing/Content prompts
        if (lowerPrompt.includes('write') || lowerPrompt.includes('email') || lowerPrompt.includes('content')) {
            return `I need assistance creating compelling content: "${prompt}"

Please help with:
• **Content strategy**: Target audience, key messaging, brand voice
• **Structure**: Optimal format, compelling headlines, logical flow
• **Development**: Opening hooks, supporting evidence, persuasive techniques
• **Optimization**: A/B testing opportunities, performance tracking

**Context:**
• Industry: [Your field]
• Platform: [Email/blog/social media]
• Goal: [Awareness/conversion/engagement]
• Brand tone: [Professional/casual/authoritative]

Provide both strategic guidance and practical examples.`;
        }
        
        // Planning/Strategy prompts
        if (lowerPrompt.includes('plan') || lowerPrompt.includes('strategy') || lowerPrompt.includes('organize')) {
            return `I need comprehensive planning for: "${prompt}"

Please create a detailed plan covering:
• **Objective definition**: Clear goals, success metrics, timeline
• **Strategic analysis**: Current situation, opportunities, challenges
• **Implementation roadmap**: Phased approach, deliverables, responsibilities
• **Monitoring**: Progress tracking, review protocols, optimization

**Project context:**
• Scope: [Size, complexity, duration]
• Resources: [Budget, time, team]
• Constraints: [Deadlines, regulations, limitations]
• Stakeholders: [Key people involved]

Provide actionable steps and helpful templates.`;
        }
        
        // Technical/Explanation prompts
        if (lowerPrompt.includes('explain') || lowerPrompt.includes('what is') || lowerPrompt.includes('how does')) {
            return `I'd like a comprehensive explanation of: "${prompt}"

Please structure your response with:
• **Foundation**: Clear definitions, core concepts, importance
• **Technical details**: Key components, processes, underlying principles
• **Practical context**: Real-world applications, examples, benefits
• **Learning resources**: Books, courses, tools, communities

**My background:** [Current knowledge level]
**Learning goal:** [Academic/professional/personal]
**Preferred style:** [Visual aids/analogies/technical details]

Use clear examples while maintaining accuracy and depth.`;
        }
        
        // Default enhancement
        return `I need comprehensive assistance with: "${prompt}"

Please provide a detailed response including:
• **Context analysis**: Understanding the scope and implications
• **Structured approach**: Logical framework for addressing this thoroughly
• **Practical guidance**: Actionable steps, examples, best practices
• **Resources**: Tools, references, additional learning materials
• **Success factors**: How to measure progress and validate results

**Additional context:**
• Background: [Your experience level]
• Objectives: [What you hope to achieve]
• Constraints: [Time, budget, resources]
• Preferences: [Specific approaches or requirements]

Please tailor your response for maximum value and actionable insights.`;
    }

    async typeEnhancedPrompt(text) {
        const enhancedResult = document.getElementById('enhanced-result');
        if (!enhancedResult) return;
        
        // Clear existing content
        enhancedResult.innerHTML = '';
        
        // Create a container for the typed text
        const textContainer = document.createElement('div');
        textContainer.className = 'enhanced-text';
        enhancedResult.appendChild(textContainer);
        
        // Type the text with realistic speed
        const words = text.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            textContainer.textContent = currentText;
            
            // Add cursor effect
            textContainer.innerHTML = currentText + '<span class="typing-cursor">|</span>';
            
            // Variable delay based on word length and punctuation
            let delay = 25 + Math.random() * 15; // Faster base delay
            
            if (words[i].endsWith('.') || words[i].endsWith('!') || words[i].endsWith('?')) {
                delay += 150; // Shorter pause after sentences
            } else if (words[i].endsWith(',') || words[i].endsWith(':')) {
                delay += 75; // Shorter pause after commas/colons
            }
            
            await this.delay(delay);
        }
        
        // Remove cursor after typing is complete
        textContainer.innerHTML = currentText;
        
        // Add completion animation
        enhancedResult.classList.add('typing-complete');
    }

    showError(message) {
        const enhancedResult = document.getElementById('enhanced-result');
        if (enhancedResult) {
            enhancedResult.innerHTML = `
                <div class="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    ${message}
                </div>
            `;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize demo enhancer when components are ready
document.addEventListener('componentsReady', () => {
    console.log('🎯 Initializing Demo Enhancer...');
    new DemoEnhancer();
});

// Fallback initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.demoEnhancer) {
            console.log('🎯 Fallback: Initializing Demo Enhancer...');
            window.demoEnhancer = new DemoEnhancer();
        }
    }, 2000);
});
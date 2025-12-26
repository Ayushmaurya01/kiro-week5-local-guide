class PrayagrajFoodGuide {
    constructor() {
        this.contextData = null;
        this.init();
    }

    async init() {
        await this.loadContext();
        this.setupEventListeners();
    }

    async loadContext() {
        try {
            const response = await fetch('.kiro/product.md');
            const contextText = await response.text();
            this.parseContext(contextText);
        } catch (error) {
            console.error('Failed to load context:', error);
            this.showError('Unable to load local context. Please check if product.md exists.');
        }
    }

    parseContext(contextText) {
        this.contextData = {
            slang: this.extractSlang(contextText),
            foods: this.extractFoods(contextText),
            areas: this.extractAreas(contextText),
            timeBasedRecs: this.extractTimeBasedRecs(contextText)
        };
    }

    extractSlang(text) {
        const slangSection = text.match(/## Local Slang & Phrases([\s\S]*?)##/);
        if (!slangSection) return {};
        
        const slangMap = {};
        const lines = slangSection[1].split('\n');
        
        lines.forEach(line => {
            const match = line.match(/- \*\*(.*?)\*\* - (.*)/);
            if (match) {
                slangMap[match[1].toLowerCase()] = match[2];
            }
        });
        
        return slangMap;
    }

    extractFoods(text) {
        const foods = {};
        const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
        
        timeSlots.forEach(timeSlot => {
            const regex = new RegExp(`### ${timeSlot}[\\s\\S]*?(?=###|## |$)`, 'g');
            const section = text.match(regex);
            
            if (section) {
                foods[timeSlot.toLowerCase()] = this.parseFoodItems(section[0]);
            }
        });
        
        return foods;
    }

    parseFoodItems(sectionText) {
        const items = [];
        const foodBlocks = sectionText.split('\n\n').filter(block => 
            block.includes('**') && block.includes('Description:')
        );
        
        foodBlocks.forEach(block => {
            const lines = block.split('\n');
            const nameMatch = lines[0].match(/\*\*(.*?)\*\*/);
            
            if (nameMatch) {
                const item = {
                    name: nameMatch[1],
                    description: '',
                    localStyle: '',
                    localTip: ''
                };
                
                lines.forEach(line => {
                    if (line.includes('Description:')) {
                        item.description = line.replace(/- Description: /, '');
                    } else if (line.includes('Local Style:')) {
                        item.localStyle = line.replace(/- Local Style: /, '');
                    } else if (line.includes('Local Tip:')) {
                        item.localTip = line.replace(/- Local Tip: /, '');
                    }
                });
                
                items.push(item);
            }
        });
        
        return items;
    }

    extractAreas(text) {
        const areas = {};
        const areaSection = text.match(/## Area-Specific Recommendations([\s\S]*?)## /);
        
        if (areaSection) {
            const areaBlocks = areaSection[1].split('### ').filter(block => block.trim());
            
            areaBlocks.forEach(block => {
                const lines = block.split('\n');
                const areaName = lines[0].trim();
                
                areas[areaName.toLowerCase()] = {
                    name: areaName,
                    famous: '',
                    bestFor: '',
                    specialties: '',
                    timing: ''
                };
                
                lines.forEach(line => {
                    if (line.includes('Famous for:')) {
                        areas[areaName.toLowerCase()].famous = line.replace(/- Famous for: /, '');
                    } else if (line.includes('Best for:')) {
                        areas[areaName.toLowerCase()].bestFor = line.replace(/- Best for: /, '');
                    } else if (line.includes('Specialties:')) {
                        areas[areaName.toLowerCase()].specialties = line.replace(/- Specialties: /, '');
                    } else if (line.includes('Timing:')) {
                        areas[areaName.toLowerCase()].timing = line.replace(/- Timing: /, '');
                    }
                });
            });
        }
        
        return areas;
    }

    extractTimeBasedRecs(text) {
        const timeRecs = {};
        const currentHour = new Date().getHours();
        
        if (currentHour >= 6 && currentHour < 11) {
            timeRecs.current = 'morning';
        } else if (currentHour >= 12 && currentHour < 17) {
            timeRecs.current = 'afternoon';
        } else if (currentHour >= 17 && currentHour < 21) {
            timeRecs.current = 'evening';
        } else {
            timeRecs.current = 'night';
        }
        
        return timeRecs;
    }

    setupEventListeners() {
        const askButton = document.getElementById('askButton');
        const userQuery = document.getElementById('userQuery');
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');

        askButton.addEventListener('click', () => this.handleQuery());
        userQuery.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleQuery();
        });

        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                userQuery.value = btn.dataset.query;
                this.handleQuery();
            });
        });
    }

    handleQuery() {
        const query = document.getElementById('userQuery').value.trim();
        if (!query) return;

        if (!this.contextData) {
            this.showError('Context not loaded yet. Please wait a moment and try again.');
            return;
        }

        const response = this.generateResponse(query);
        this.displayResponse(response);
    }

    generateResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        // Detect time preferences
        const timeKeywords = {
            'subah': 'morning',
            'morning': 'morning',
            'dopahar': 'afternoon',
            'afternoon': 'afternoon',
            'shaam': 'evening',
            'evening': 'evening',
            'raat': 'night',
            'night': 'night'
        };

        // Detect taste preferences
        const tasteKeywords = {
            'teekha': 'spicy',
            'spicy': 'spicy',
            'halka': 'light',
            'light': 'light',
            'meetha': 'sweet',
            'sweet': 'sweet'
        };

        // Detect area preferences
        const areaKeywords = {
            'kumbh': 'kumbh area',
            'sangam': 'sangam area',
            'chowk': 'chowk (old city)',
            'civil lines': 'civil lines'
        };

        let detectedTime = null;
        let detectedTaste = null;
        let detectedArea = null;

        // Check for time keywords
        Object.keys(timeKeywords).forEach(keyword => {
            if (lowerQuery.includes(keyword)) {
                detectedTime = timeKeywords[keyword];
            }
        });

        // Check for taste keywords
        Object.keys(tasteKeywords).forEach(keyword => {
            if (lowerQuery.includes(keyword)) {
                detectedTaste = tasteKeywords[keyword];
            }
        });

        // Check for area keywords
        Object.keys(areaKeywords).forEach(keyword => {
            if (lowerQuery.includes(keyword)) {
                detectedArea = areaKeywords[keyword];
            }
        });

        // Default to current time if no time specified
        if (!detectedTime) {
            detectedTime = this.contextData.timeBasedRecs.current;
        }

        return this.buildRecommendation(detectedTime, detectedTaste, detectedArea, query);
    }

    buildRecommendation(time, taste, area, originalQuery) {
        const timeSlot = this.contextData.foods[time] || [];
        let recommendations = [...timeSlot];

        // Filter by taste preference
        if (taste === 'spicy') {
            recommendations = recommendations.filter(item => 
                item.name.toLowerCase().includes('chhole') ||
                item.name.toLowerCase().includes('kebab') ||
                item.description.toLowerCase().includes('spicy')
            );
        } else if (taste === 'light') {
            recommendations = recommendations.filter(item => 
                item.name.toLowerCase().includes('dahi') ||
                item.name.toLowerCase().includes('lassi') ||
                item.description.toLowerCase().includes('light')
            );
        } else if (taste === 'sweet') {
            recommendations = recommendations.filter(item => 
                item.name.toLowerCase().includes('jalebi') ||
                item.name.toLowerCase().includes('kulfi') ||
                item.name.toLowerCase().includes('rabri') ||
                item.description.toLowerCase().includes('sweet')
            );
        }

        // If no specific matches, get top items for the time
        if (recommendations.length === 0) {
            recommendations = timeSlot.slice(0, 2);
        }

        // Limit to top 2 recommendations
        recommendations = recommendations.slice(0, 2);

        return {
            greeting: this.generateGreeting(originalQuery),
            recommendations: recommendations,
            areaInfo: area ? this.contextData.areas[area] : null,
            timeContext: time,
            tasteContext: taste
        };
    }

    generateGreeting(query) {
        const greetings = [
            "Arre bhai! Perfect timing for some local recommendations 🍛",
            "Namaste! Let me suggest some authentic Prayagraj flavors 🙏",
            "Bhai, you've come to the right place for street food advice! 😊"
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    displayResponse(response) {
        const responseArea = document.getElementById('responseArea');
        
        let html = `<div class="recommendation">
            <h3>${response.greeting}</h3>`;

        if (response.recommendations.length > 0) {
            response.recommendations.forEach(item => {
                html += `
                    <div class="food-item">
                        <h4>🍽️ ${item.name}</h4>
                        <p class="description">${item.description}</p>
                        <div class="details">
                            <div class="detail-item">
                                <strong>Local Style:</strong>
                                ${item.localStyle}
                            </div>
                            <div class="detail-item">
                                <strong>Best Time:</strong>
                                ${this.capitalizeFirst(response.timeContext)}
                            </div>
                        </div>
                        ${item.localTip ? `
                            <div class="local-tip">
                                <strong>💡 Local Tip:</strong> ${item.localTip}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }

        if (response.areaInfo) {
            html += `
                <div class="area-info">
                    <h4>📍 About ${response.areaInfo.name}</h4>
                    <p><strong>Famous for:</strong> ${response.areaInfo.famous}</p>
                    <p><strong>Best for:</strong> ${response.areaInfo.bestFor}</p>
                    <p><strong>Specialties:</strong> ${response.areaInfo.specialties}</p>
                </div>
            `;
        }

        html += '</div>';
        responseArea.innerHTML = html;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showError(message) {
        const responseArea = document.getElementById('responseArea');
        responseArea.innerHTML = `
            <div class="error-message">
                <strong>Oops!</strong> ${message}
            </div>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrayagrajFoodGuide();
});
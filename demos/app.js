/**
 * Weather Animations Demo
 * Main application script with enhanced performance and accessibility
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Weather Effects engine
    const weatherEffects = new WeatherEffects();
    
    // Cache DOM elements
    const elements = {
        body: document.body,
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('#theme-toggle i'),
        demoArea: document.getElementById('demo-area'),
        demoText: document.getElementById('demo-text'),
        demoInfo: document.getElementById('demo-info'),
        effectButtons: document.querySelectorAll('.button-group button'),
        clearEffectsBtn: document.getElementById('clear-effects'),
        tags: document.querySelectorAll('.tags .tag')
    };

    // Active effect tracking
    let activeEffect = null;
    
    /**
     * Show information message
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the message (in ms)
     */
    function showInfo(message, duration = 5000) {
        // Clear any existing timer
        if (window.infoTimer) {
            clearTimeout(window.infoTimer);
        }
        
        elements.demoInfo.textContent = message;
        elements.demoInfo.classList.add('visible');
        
        // Update screen reader text
        elements.demoText.textContent = 'Active effect: ' + message;
        
        // Hide after specified duration
        window.infoTimer = setTimeout(() => {
            elements.demoInfo.classList.remove('visible');
        }, duration);
    }
    
    /**
     * Clear all weather effects
     */
    function clearAllEffects() {
        weatherEffects.clearEffects();
        
        // Reset active button states
        elements.effectButtons.forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // Reset active tag states
        elements.tags.forEach(tag => {
            tag.classList.remove('active');
            tag.setAttribute('aria-selected', 'false');
        });
        
        showInfo('All weather effects cleared');
        activeEffect = null;
    }
    
    /**
     * Set an effect as active
     * @param {Element} element - The button or tag element to set as active
     */
    function setActiveEffect(element) {
        // Clear previous active states
        elements.effectButtons.forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
        });
        
        elements.tags.forEach(tag => {
            tag.classList.remove('active');
            tag.setAttribute('aria-selected', 'false');
        });
        
        // Set the new active element
        if (element.tagName === 'BUTTON') {
            element.setAttribute('aria-pressed', 'true');
        } else {
            element.classList.add('active');
            element.setAttribute('aria-selected', 'true');
        }
    }
    
    // Theme toggle functionality
    function setupThemeToggle() {
        // Check for saved theme preference
        const isDarkMode = () => {
            return localStorage.theme === 'dark' || 
                (!('theme' in localStorage) && 
                window.matchMedia('(prefers-color-scheme: dark)').matches);
        };

        // Apply the right theme on initial load
        if (isDarkMode()) {
            elements.body.classList.add('dark');
            elements.themeIcon.classList.remove('fa-moon');
            elements.themeIcon.classList.add('fa-sun');
        }

        // Toggle theme when button is clicked
        elements.themeToggle.addEventListener('click', () => {
            if (elements.body.classList.contains('dark')) {
                elements.body.classList.remove('dark');
                localStorage.theme = 'light';
                elements.themeIcon.classList.remove('fa-sun');
                elements.themeIcon.classList.add('fa-moon');
            } else {
                elements.body.classList.add('dark');
                localStorage.theme = 'dark';
                elements.themeIcon.classList.remove('fa-moon');
                elements.themeIcon.classList.add('fa-sun');
            }
        });
        
        // Also respond to system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.theme) { // Only if user hasn't manually set a preference
                if (e.matches) {
                    elements.body.classList.add('dark');
                    elements.themeIcon.classList.remove('fa-moon');
                    elements.themeIcon.classList.add('fa-sun');
                } else {
                    elements.body.classList.remove('dark');
                    elements.themeIcon.classList.remove('fa-sun');
                    elements.themeIcon.classList.add('fa-moon');
                }
            }
        });
    }
    
    // Initialize weather effect buttons
    function setupWeatherButtons() {
        // Rain effects
        document.getElementById('rain-light').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateRain('light');
            showInfo('Light rain effect applied - observe the gentle drizzle');
            setActiveEffect(this);
            activeEffect = 'rain-light';
        });

        document.getElementById('rain-moderate').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateRain('moderate');
            showInfo('Moderate rain effect applied - steady rainfall');
            setActiveEffect(this);
            activeEffect = 'rain-moderate';
        });

        document.getElementById('rain-heavy').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateRain('heavy');
            showInfo('Heavy rain effect applied - intense downpour');
            setActiveEffect(this);
            activeEffect = 'rain-heavy';
        });

        // Snow effect
        document.getElementById('snow').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateSnow('moderate');
            showInfo('Snow effect applied - gentle snowfall');
            setActiveEffect(this);
            activeEffect = 'snow';
        });

        // Thunderstorm effect
        document.getElementById('thunderstorm').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateRain('heavy');
            weatherEffects.generateLightning();
            showInfo('Thunderstorm effect applied - heavy rain with lightning flashes');
            setActiveEffect(this);
            activeEffect = 'thunderstorm';
        });

        // Fog effect
        document.getElementById('fog').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateFog('moderate');
            showInfo('Fog/mist effect applied - observe the drifting fog layers');
            setActiveEffect(this);
            activeEffect = 'fog';
        });

        // Cloudy effect
        document.getElementById('cloudy').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateClouds('heavy');
            showInfo('Cloudy effect applied - overcast conditions');
            setActiveEffect(this);
            activeEffect = 'cloudy';
        });

        // Partly cloudy effect
        document.getElementById('partly-cloudy').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateClouds('light');
            weatherEffects.generateSun(true);
            showInfo('Partly cloudy effect applied - sun partially visible through clouds');
            setActiveEffect(this);
            activeEffect = 'partly-cloudy';
        });

        // Clear/sunny effect
        document.getElementById('clear').addEventListener('click', function() {
            clearAllEffects();
            weatherEffects.generateSun(false);
            showInfo('Clear/sunny effect applied - bright sunshine');
            setActiveEffect(this);
            activeEffect = 'clear';
        });

        // Clear effects button
        elements.clearEffectsBtn.addEventListener('click', () => {
            clearAllEffects();
        });
    }
    
    // Initialize special weather tags
    function setupWeatherTags() {
        elements.tags.forEach(tag => {
            // Initialize aria attributes
            tag.setAttribute('aria-selected', 'false');
            
            tag.addEventListener('click', function() {
                const tagName = this.textContent.toLowerCase();
                
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    this.setAttribute('aria-selected', 'false');
                    clearAllEffects();
                    return;
                }
                
                clearAllEffects();
                setActiveEffect(this);
                
                // Handle specific tag effects
                switch(tagName) {
                    case 'drizzle':
                        weatherEffects.generateRain('light');
                        showInfo('Drizzle effect applied - very light rain');
                        activeEffect = 'drizzle';
                        break;
                        
                    case 'haze':
                        weatherEffects.generateFog('light');
                        weatherEffects.generateSun(true);
                        showInfo('Haze effect applied - foggy with dim sun');
                        activeEffect = 'haze';
                        break;
                        
                    case 'wind':
                        // Create wind effect using CSS animation
                        const windContainer = document.createElement('div');
                        windContainer.className = 'wind-container';
                        
                        // Generate wind keyframes if they don't exist
                        if (!document.querySelector('style#wind-keyframes')) {
                            const style = document.createElement('style');
                            style.id = 'wind-keyframes';
                            style.innerHTML = `
                                @keyframes wind-particle {
                                    0% {
                                        transform: translateX(0) translateY(0) rotate(0deg);
                                        opacity: 0;
                                    }
                                    10% {
                                        opacity: 1;
                                    }
                                    100% {
                                        transform: translateX(calc(100vw + 100px)) translateY(${Math.random() * 200 - 100}px) rotate(360deg);
                                        opacity: 0;
                                    }
                                }
                            `;
                            document.head.appendChild(style);
                        }
                        
                        windContainer.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 1;
                            pointer-events: none;
                        `;
                        
                        // Add leaves/particles for wind visualization
                        const particleTypes = [
                            '🍃', '🍂', '🍁', '🌿', '🌱', '💨', '✨'
                        ];
                        
                        for (let i = 0; i < 30; i++) {
                            const particle = document.createElement('div');
                            const useEmoji = Math.random() > 0.6;
                            
                            if (useEmoji) {
                                // Use emoji particles
                                const emoji = particleTypes[Math.floor(Math.random() * particleTypes.length)];
                                particle.textContent = emoji;
                                particle.style.cssText = `
                                    position: absolute;
                                    font-size: ${Math.random() * 20 + 12}px;
                                    top: ${Math.random() * 100}%;
                                    left: -20px;
                                    animation: wind-particle ${Math.random() * 5 + 5}s linear infinite;
                                    animation-delay: ${Math.random() * 5}s;
                                    opacity: 0;
                                    z-index: 2;
                                `;
                            } else {
                                // Use traditional particles
                                particle.style.cssText = `
                                    position: absolute;
                                    width: ${Math.random() * 8 + 4}px;
                                    height: ${Math.random() * 8 + 4}px;
                                    background: rgba(255, 255, 255, 0.6);
                                    border-radius: 50%;
                                    top: ${Math.random() * 100}%;
                                    left: -10px;
                                    animation: wind-particle ${Math.random() * 5 + 3}s linear infinite;
                                    animation-delay: ${Math.random() * 5}s;
                                    opacity: 0;
                                `;
                            }
                            
                            windContainer.appendChild(particle);
                        }
                        
                        weatherEffects.effectsContainer.appendChild(windContainer);
                        showInfo('Wind effect applied - observe particles moving in the breeze');
                        activeEffect = 'wind';
                        break;
                        
                    case 'night':
                        // Apply dark theme
                        elements.body.classList.add('dark');
                        elements.themeIcon.classList.remove('fa-moon');
                        elements.themeIcon.classList.add('fa-sun');
                        
                        // Create starry night effect
                        const nightContainer = document.createElement('div');
                        nightContainer.className = 'night-container';
                        
                        // Generate star keyframes
                        if (!document.querySelector('style#star-keyframes')) {
                            const style = document.createElement('style');
                            style.id = 'star-keyframes';
                            style.innerHTML = `
                                @keyframes star-twinkle {
                                    0%, 100% {
                                        opacity: 0.2;
                                        transform: scale(0.8);
                                    }
                                    50% {
                                        opacity: 1;
                                        transform: scale(1.1);
                                    }
                                }
                            `;
                            document.head.appendChild(style);
                        }
                        
                        nightContainer.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
                            z-index: 0;
                            pointer-events: none;
                        `;
                        
                        // Add stars
                        for (let i = 0; i < 100; i++) {
                            const star = document.createElement('div');
                            const size = Math.random() * 2 + 1;
                            
                            star.style.cssText = `
                                position: absolute;
                                width: ${size}px;
                                height: ${size}px;
                                background-color: white;
                                border-radius: 50%;
                                top: ${Math.random() * 100}%;
                                left: ${Math.random() * 100}%;
                                box-shadow: 0 0 ${size + 1}px rgba(255, 255, 255, 0.8);
                                opacity: ${Math.random() * 0.5 + 0.5};
                                animation: star-twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
                                animation-delay: ${Math.random() * 5}s;
                            `;
                            
                            nightContainer.appendChild(star);
                        }
                        
                        // Add a moon
                        const moon = document.createElement('div');
                        moon.style.cssText = `
                            position: absolute;
                            top: 15%;
                            right: 15%;
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            background: radial-gradient(circle at 35% 35%, #f0f0f0, #d0d0d0);
                            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
                        `;
                        
                        // Add moon craters
                        for (let i = 0; i < 5; i++) {
                            const crater = document.createElement('div');
                            const size = Math.random() * 10 + 5;
                            
                            crater.style.cssText = `
                                position: absolute;
                                width: ${size}px;
                                height: ${size}px;
                                background-color: rgba(200, 200, 200, 0.8);
                                border-radius: 50%;
                                top: ${Math.random() * 70 + 15}%;
                                left: ${Math.random() * 70 + 15}%;
                            `;
                            
                            moon.appendChild(crater);
                        }
                        
                        nightContainer.appendChild(moon);
                        weatherEffects.effectsContainer.appendChild(nightContainer);
                        showInfo('Night mode applied - observe the starry sky');
                        activeEffect = 'night';
                        break;
                        
                    case 'overcast':
                        weatherEffects.generateClouds('heavy');
                        showInfo('Overcast effect applied - heavy cloud cover');
                        activeEffect = 'overcast';
                        break;
                    
                    case 'rainbow':
                        weatherEffects.generateRain('light');
                        weatherEffects.generateRainbow();
                        showInfo('Rainbow effect applied - colorful arch after rain');
                        activeEffect = 'rainbow';
                        break;
                        
                    case 'hurricane':
                        weatherEffects.generateHurricane();
                        showInfo('Hurricane effect applied - observe the spinning storm');
                        activeEffect = 'hurricane';
                        break;
                }
            });
            
            // Add keyboard support for tags
            tag.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Create a background gradient 
    function createBackground() {
        const container = document.createElement('div');
        container.className = 'gradient-bg-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(56, 189, 248, 0.1), rgba(224, 242, 254, 0.15));
            transition: background 0.5s ease;
        `;
        
        document.body.appendChild(container);
        return container;
    }
    
    // Handle window resize for responsive animations
    function handleResize() {
        window.addEventListener('resize', debounce(() => {
            // Only regenerate the active effect if there is one
            if (activeEffect) {
                const activeButton = document.querySelector('button[aria-pressed="true"]');
                const activeTag = document.querySelector('.tag.active');
                
                if (activeButton) {
                    activeButton.click();
                } else if (activeTag) {
                    activeTag.click();
                }
            }
        }, 250));
    }
    
    // Debounce helper function for resize events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Add keyboard shortcut support
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle if not in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key) {
                case 'c':
                    clearAllEffects();
                    break;
                case 'd':
                case 't':
                    elements.themeToggle.click(); // Toggle dark/light mode
                    break;
                case '1':
                    document.getElementById('rain-light').click();
                    break;
                case '2':
                    document.getElementById('rain-moderate').click();
                    break;
                case '3':
                    document.getElementById('rain-heavy').click();
                    break;
                case '4':
                    document.getElementById('snow').click();
                    break;
                case '5':
                    document.getElementById('thunderstorm').click();
                    break;
                case '6':
                    document.getElementById('fog').click();
                    break;
                case '7':
                    document.getElementById('cloudy').click();
                    break;
                case '8':
                    document.getElementById('partly-cloudy').click();
                    break;
                case '9':
                    document.getElementById('clear').click();
                    break;
            }
        });
    }
    
    // Initialize the application
    function init() {
        setupThemeToggle();
        setupWeatherButtons();
        setupWeatherTags();
        createBackground();
        handleResize();
        setupKeyboardShortcuts();
        
        // Show welcome message
        showInfo('Welcome to the Weather Animations Demo! Click any weather effect to begin.');
    }
    
    // Start the application
    init();
    
    // Clean up on page unload to prevent memory leaks
    window.addEventListener('beforeunload', () => {
        weatherEffects.destroy();
    });
}); 
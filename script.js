// OpenWeather API configuration
const WEATHER_API_KEY = 'bdd563ccbf51fb92a22bf0bd09217a31'; // Replace with your OpenWeather API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const DEFAULT_CITY = 'San Francisco'; // Default city if none in localStorage

// Weather Effects Engine - Enhanced animations with performance optimizations
const weatherEffects = (function() {
    // Create a single container for all weather effects to improve performance
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'weather-effects-container';
    effectsContainer.style.position = 'fixed';
    effectsContainer.style.top = '0';
    effectsContainer.style.left = '0';
    effectsContainer.style.width = '100%';
    effectsContainer.style.height = '100%';
    effectsContainer.style.overflow = 'hidden';
    effectsContainer.style.pointerEvents = 'none';
    effectsContainer.style.zIndex = '1';
    
    // Store animation keyframes to avoid duplication
    const keyframesAdded = {};
    
    // Audio elements for effects
    let audioElements = {};
    
    // Initialize and append the container
    function init() {
        document.body.appendChild(effectsContainer);
        return true;
    }
    
    // Add keyframes to the document if they don't already exist
    function addKeyframes(id, css) {
        if (keyframesAdded[id]) return;
        
        const style = document.createElement('style');
        style.id = id;
        style.innerHTML = css;
        document.head.appendChild(style);
        
        keyframesAdded[id] = true;
    }
    
    // Clear all weather effects
    function clearEffects() {
        // Remove all child elements from the container
        while (effectsContainer.firstChild) {
            effectsContainer.removeChild(effectsContainer.firstChild);
        }
        
        // Remove any flash elements from lightning effects
        const flashes = document.querySelectorAll('.lightning-flash');
        flashes.forEach(flash => {
            if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
            }
        });
        
        // Stop and clean up any audio
        Object.values(audioElements).forEach(audio => {
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        
        return true;
    }
    
    // Generate rain effect with different intensities
    function generateRain(intensity = 'moderate') {
        clearEffects();
        
        // Configure rain parameters based on intensity level
        let dropCount, speedMultiplier, opacityBase, widthMultiplier;
        
        switch (intensity) {
            case 'light':
                dropCount = window.innerWidth < 768 ? 30 : 60;
                speedMultiplier = 0.8;
                opacityBase = 0.3;
                widthMultiplier = 0.8;
                break;
            case 'heavy':
                dropCount = window.innerWidth < 768 ? 80 : 150;
                speedMultiplier = 1.3;
                opacityBase = 0.5;
                widthMultiplier = 1.3;
                break;
            case 'moderate':
            default:
                dropCount = window.innerWidth < 768 ? 50 : 100;
                speedMultiplier = 1;
                opacityBase = 0.4;
                widthMultiplier = 1;
        }

        // Add rain animation keyframes
        addKeyframes('rain-keyframes', `
            @keyframes raindrop-fall {
                from { transform: translateY(-50px); }
                to { transform: translateY(calc(100vh + 50px)); }
            }
        `);
        
        const rainContainer = document.createElement('div');
        rainContainer.className = 'rain-container';
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Create individual raindrops
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Random properties
            const left = Math.random() * 100; // % position
            const duration = (Math.random() * 0.5 + 0.4) / speedMultiplier; // seconds
            const delay = Math.random() * 5; // seconds
            const height = (Math.random() * 15 + 10) * (intensity === 'heavy' ? 1.2 : 1); // px
            const width = (Math.random() * 1.5 + 1.5) * widthMultiplier; // px
            
            // Apply styles
            drop.style.cssText = `
                position: absolute;
                left: ${left}%;
                top: 0;
                height: ${height}px;
                width: ${width}px;
                animation: raindrop-fall ${duration}s linear infinite;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.3 + opacityBase};
                transform: rotate(${Math.random() * 5 + 2}deg);
            `;
            
            // Different rain color based on theme
            const isDark = document.body.classList.contains('dark');
            drop.style.background = isDark 
                ? 'linear-gradient(to bottom, rgba(56, 189, 248, 0), rgba(56, 189, 248, 0.8))' 
                : 'linear-gradient(to bottom, rgba(2, 132, 199, 0), rgba(2, 132, 199, 0.8))';
            drop.style.boxShadow = '0 0 3px rgba(14, 165, 233, 0.5)';
            
            fragment.appendChild(drop);
        }
        
        rainContainer.appendChild(fragment);
        effectsContainer.appendChild(rainContainer);
        
        // Play rain ambient sound if available
        if (window.Audio && intensity !== 'light') {
            try {
                if (!audioElements.rain) {
                    audioElements.rain = new Audio();
                    audioElements.rain.src = 'assets/sounds/rain.mp3';
                    audioElements.rain.loop = true;
                    audioElements.rain.volume = intensity === 'heavy' ? 0.3 : 0.15;
                }
                audioElements.rain.play().catch(() => console.log('Cannot play rain sound'));
            } catch(e) {}
        }
        
        return rainContainer;
    }
    
    // Generate snow effect with more realistic physics
    function generateSnow(intensity = 'moderate') {
        clearEffects();
        
        // Add snowfall animation keyframes
        addKeyframes('snow-keyframes', `
            @keyframes snowfall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                }
                100% {
                    transform: translateY(calc(100vh + 10px)) rotate(360deg);
                }
            }
            
            @keyframes snow-sway {
                0% {
                    transform: translateX(-5px);
                }
                50% {
                    transform: translateX(5px);
                }
                100% {
                    transform: translateX(-5px);
                }
            }
        `);
        
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snow-container';
        
        // Adjust flake count based on intensity and screen size
        let flakeCount;
        switch (intensity) {
            case 'light':
                flakeCount = window.innerWidth < 768 ? 30 : 60;
                break;
            case 'heavy':
                flakeCount = window.innerWidth < 768 ? 80 : 150;
                break;
            case 'moderate':
            default:
                flakeCount = window.innerWidth < 768 ? 50 : 100;
        }
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Create individual snowflakes
        for (let i = 0; i < flakeCount; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake';
            
            // Random properties for natural effect
            const left = Math.random() * 100; // % from left
            const size = Math.random() * 6 + 2; // px (2-8px range)
            const duration = Math.random() * 10 + 8; // 8-18 seconds
            const delay = Math.random() * 5; // 0-5 seconds
            const swayDuration = Math.random() * 3 + 2; // 2-5 seconds
            
            // Apply optimized styles
            flake.style.cssText = `
                position: absolute;
                left: ${left}%;
                top: -10px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: white;
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: 
                    snowfall ${duration}s linear infinite,
                    snow-sway ${swayDuration}s ease-in-out infinite;
                animation-delay: ${delay}s;
            `;
            
            // Add variety with different shapes for some snowflakes
            if (Math.random() > 0.7) {
                flake.style.borderRadius = '25%';
                flake.style.transform = `rotate(${Math.random() * 45}deg)`;
            }
            
            fragment.appendChild(flake);
        }
        
        snowContainer.appendChild(fragment);
        effectsContainer.appendChild(snowContainer);
        
        return snowContainer;
    }
    
    // Generate enhanced fog/mist effect with better layering
    function generateFog(intensity = 'moderate') {
        clearEffects();
        
        // Add fog animation keyframes
        addKeyframes('fog-keyframes', `
            @keyframes fog-move {
                0% {
                    transform: translateX(0) translateY(0);
                }
                50% {
                    transform: translateX(25%) translateY(5%);
                }
                100% {
                    transform: translateX(0) translateY(0);
                }
            }
        `);
        
        const fogContainer = document.createElement('div');
        fogContainer.className = 'fog-container';
        
        // Adjust opacity based on intensity
        let baseOpacity;
        switch (intensity) {
            case 'light':
                baseOpacity = 0.05;
                break;
            case 'heavy':
                baseOpacity = 0.15;
                break;
            case 'moderate':
            default:
                baseOpacity = 0.1;
        }
        
        // Create fog layers with dynamic movement
        const layerCount = intensity === 'heavy' ? 5 : 3;
        
        for (let i = 0; i < layerCount; i++) {
            const fog = document.createElement('div');
            fog.className = 'fog-layer';
            
            // Different opacity and animation for each layer
            const opacity = baseOpacity - (i * 0.02);
            const duration = 120 + (i * 20);
            
            fog.style.cssText = `
                position: absolute;
                width: 200%;
                height: 100%;
                top: ${i * (100 / layerCount)}%;
                left: -50%;
                background: rgba(255, 255, 255, ${opacity});
                filter: blur(30px);
                animation: fog-move ${duration}s linear infinite;
                animation-delay: ${i * 5}s;
            `;
            
            fogContainer.appendChild(fog);
        }
        
        effectsContainer.appendChild(fogContainer);
        
        return fogContainer;
    }
    
    // Generate lightning effect with thunder
    function generateLightning() {
        const createFlash = () => {
            const flash = document.createElement('div');
            flash.className = 'lightning-flash';
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.4);
                z-index: 2;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.1s ease-in, opacity 0.2s ease-out;
            `;
            
            document.body.appendChild(flash);
            
            // Two-stage flash effect with multiple flashes
            setTimeout(() => {
                flash.style.opacity = '1';
                
                // Optional thunder sound
                if (Math.random() > 0.3 && window.Audio) {
                    try {
                        if (!audioElements.thunder) {
                            audioElements.thunder = new Audio();
                            audioElements.thunder.volume = 0.2;
                            audioElements.thunder.src = 'assets/sounds/thunder.mp3';
                        }
                        // Clone for overlapping sounds
                        const thunderClone = audioElements.thunder.cloneNode();
                        thunderClone.volume = Math.random() * 0.1 + 0.1;
                        thunderClone.play().catch(() => {});
                    } catch(e) {}
                }
                
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => {
                        if (flash.parentNode) {
                            document.body.removeChild(flash);
                        }
                        
                        // Possibly create another flash for multi-flash effect
                        if (Math.random() > 0.7 && document.querySelector('.rain-container')) {
                            setTimeout(() => createFlash(), 100);
                        }
                    }, 200);
                }, 80 + Math.random() * 50); // Variable flash duration
            }, 20);
            
            // Schedule next lightning if rain is still active
            if (document.querySelector('.rain-container')) {
                setTimeout(createFlash, Math.random() * 3000 + 2000);
            }
        };
        
        // Start lightning with random delay
        setTimeout(createFlash, Math.random() * 1000);
        
        return true;
    }
    
    // Generate sunshine effect for clear skies and partially cloudy conditions
    function generateSun(isPartlyCloudy = false) {
        clearEffects();
        
        // Add sunshine animation keyframes
        addKeyframes('sun-keyframes', `
            @keyframes sun-glow {
                0% {
                    transform: scale(1);
                    opacity: 0.7;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.9;
                }
                100% {
                    transform: scale(1);
                    opacity: 0.7;
                }
            }
            
            @keyframes sun-ray-rotate {
                0% {
                    transform: rotateZ(0deg);
                }
                100% {
                    transform: rotateZ(360deg);
                }
            }
            
            @keyframes fade-in {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        `);
        
        const sunContainer = document.createElement('div');
        sunContainer.className = 'sun-container';
        sunContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
            opacity: ${isPartlyCloudy ? '0.3' : '0'};
            filter: drop-shadow(0 0 40px rgba(255, 180, 0, 0.3));
            transition: opacity 1.5s ease, transform 1.5s ease;
        `;
        
        // Create sun element
        const sun = document.createElement('div');
        sun.className = 'sun';
        sun.style.cssText = `
            position: absolute;
            top: 10vh;
            right: 10vw;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,165,0,1) 100%);
            box-shadow: 0 0 80px rgba(255, 180, 0, 0.7);
            animation: sun-glow 8s ease-in-out infinite;
        `;
        
        // Create sun rays container
        const rayContainer = document.createElement('div');
        rayContainer.className = 'sun-rays';
        rayContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: sun-ray-rotate 60s linear infinite;
        `;
        
        // Add individual rays
        const rayCount = 12;
        for (let i = 0; i < rayCount; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4px;
                height: 120px;
                transform-origin: 50% 0;
                transform: rotate(${i * (360 / rayCount)}deg) translateX(-50%);
                background: linear-gradient(to top, rgba(255, 180, 0, 0), rgba(255, 180, 0, 0.7));
                animation: fade-in 1.5s ease-out ${i * 0.1}s forwards;
                opacity: 0;
            `;
            
            rayContainer.appendChild(ray);
        }
        
        sun.appendChild(rayContainer);
        sunContainer.appendChild(sun);
        effectsContainer.appendChild(sunContainer);
        
        // Animate sun appearance
        setTimeout(() => {
            sunContainer.style.opacity = isPartlyCloudy ? '0.5' : '0.8';
        }, 100);
        
        return sunContainer;
    }
    
    // Generate cloud effect for cloudy and partly cloudy conditions
    function generateClouds(intensity = 'heavy') {
        clearEffects();
        
        // Add cloud animation keyframes
        addKeyframes('cloud-keyframes', `
            @keyframes cloud-drift {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(100%);
                }
            }
        `);
        
        const cloudContainer = document.createElement('div');
        cloudContainer.className = intensity === 'heavy' ? 'cloudy-overlay' : 'partly-cloudy-overlay';
        
        if (intensity === 'heavy') {
            // For overcast, create a simple gradient overlay
            cloudContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to bottom, rgba(100, 100, 100, 0.6), rgba(150, 150, 150, 0.5));
                z-index: 1;
                pointer-events: none;
            `;
        } else {
            // For partly cloudy, create actual cloud elements
            cloudContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none;
                overflow: hidden;
            `;
            
            // Create individual cloud elements
            const cloudCount = window.innerWidth < 768 ? 3 : 5;
            
            for (let i = 0; i < cloudCount; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                
                // Random cloud properties
                const top = Math.random() * 30 + 5; // % from top
                const size = Math.random() * 0.5 + 0.8; // Scale factor
                const speed = Math.random() * 100 + 150; // Animation duration in seconds
                const delay = Math.random() * -30; // Start at different positions
                
                cloud.style.cssText = `
                    position: absolute;
                    top: ${top}%;
                    left: ${delay}%;
                    width: ${150 * size}px;
                    height: ${100 * size}px;
                    border-radius: 50px;
                    background: rgba(255, 255, 255, 0.8);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                    animation: cloud-drift ${speed}s linear infinite;
                    filter: blur(2px);
                    opacity: 0.8;
                `;
                
                // Add puffy details to the cloud
                for (let j = 0; j < 5; j++) {
                    const puff = document.createElement('div');
                    const puffSize = Math.random() * 0.5 + 0.5;
                    const posX = Math.random() * 80;
                    const posY = Math.random() * 20;
                    
                    puff.style.cssText = `
                        position: absolute;
                        top: ${posY}%;
                        left: ${posX}%;
                        width: ${60 * puffSize}px;
                        height: ${60 * puffSize}px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.9);
                    `;
                    
                    cloud.appendChild(puff);
                }
                
                cloudContainer.appendChild(cloud);
            }
        }
        
        effectsContainer.appendChild(cloudContainer);
        
        return cloudContainer;
    }
    
    // Generate rainbow effect for after rain conditions
    function generateRainbow() {
        // Add rainbow keyframes
        addKeyframes('rainbow-keyframes', `
            @keyframes rainbow-fade {
                0% {
                    opacity: 0;
                }
                20% {
                    opacity: 0.8;
                }
                80% {
                    opacity: 0.8;
                }
                100% {
                    opacity: 0;
                }
            }
        `);
        
        const rainbowContainer = document.createElement('div');
        rainbowContainer.className = 'rainbow-container';
        rainbowContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0;
            animation: rainbow-fade 12s ease-in-out infinite;
        `;
        
        // Create the rainbow arc
        const rainbow = document.createElement('div');
        rainbow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -20%);
            width: 150vw;
            height: 150vw;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: none;
        `;
        
        // Rainbow colors - from outside to inside
        const colors = [
            'rgba(255, 0, 0, 0.5)',    // Red
            'rgba(255, 127, 0, 0.5)',  // Orange
            'rgba(255, 255, 0, 0.5)',  // Yellow
            'rgba(0, 255, 0, 0.5)',    // Green
            'rgba(0, 0, 255, 0.5)',    // Blue
            'rgba(75, 0, 130, 0.5)',   // Indigo
            'rgba(148, 0, 211, 0.5)'   // Violet
        ];
        
        // Create each color band of the rainbow
        colors.forEach((color, index) => {
            const band = document.createElement('div');
            const size = 150 - (index * 4); // Each band gets smaller
            
            band.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${size}vw;
                height: ${size}vw;
                border-radius: 50%;
                box-shadow: 0 0 0 10px ${color};
            `;
            
            rainbow.appendChild(band);
        });
        
        // Only show the top half of the rainbow
        const mask = document.createElement('div');
        mask.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 50%;
            background-color: rgba(0, 0, 0, 0);
        `;
        
        rainbowContainer.appendChild(rainbow);
        rainbowContainer.appendChild(mask);
        effectsContainer.appendChild(rainbowContainer);
        
        return rainbowContainer;
    }
    
    // Generate hurricane effect for extreme weather
    function generateHurricane() {
        clearEffects();
        
        // Add hurricane keyframes
        addKeyframes('hurricane-keyframes', `
            @keyframes hurricane-spin {
                0% {
                    transform: translate(-50%, -50%) rotate(0deg);
                }
                100% {
                    transform: translate(-50%, -50%) rotate(360deg);
                }
            }
            
            @keyframes hurricane-flash {
                0%, 100% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.3;
                }
            }
        `);
        
        const hurricaneContainer = document.createElement('div');
        hurricaneContainer.className = 'hurricane-container';
        hurricaneContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
            background-color: rgba(50, 65, 80, 0.4);
            overflow: hidden;
        `;
        
        // Create spiral hurricane cloud
        const hurricane = document.createElement('div');
        hurricane.className = 'hurricane-spiral';
        hurricane.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(
                circle at center,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(200, 200, 200, 0.3) 20%,
                rgba(150, 150, 150, 0.5) 40%,
                rgba(100, 100, 100, 0.7) 60%,
                rgba(50, 50, 50, 0.9) 80%,
                rgba(30, 30, 30, 1) 100%
            );
            animation: hurricane-spin 20s linear infinite;
            box-shadow: 0 0 50px 20px rgba(0, 0, 0, 0.5);
        `;
        
        // Create spiral arms for the hurricane
        for (let i = 0; i < 5; i++) {
            const arm = document.createElement('div');
            const rotation = i * 72; // Evenly space the arms (360/5)
            
            arm.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 280px;
                height: 10px;
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.9) 0%,
                    rgba(200, 200, 200, 0.7) 50%,
                    transparent 100%
                );
                transform: translate(-50%, -50%) rotate(${rotation}deg);
                border-radius: 10px;
                filter: blur(3px);
            `;
            
            hurricane.appendChild(arm);
        }
        
        // Add eye of the hurricane
        const eye = document.createElement('div');
        eye.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(100, 150, 200, 0.8);
            box-shadow: 0 0 20px 10px rgba(100, 150, 200, 0.4);
            z-index: 2;
        `;
        
        // Add lightning flashes in the hurricane
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.2);
            animation: hurricane-flash 3s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        // Add rain effect with the hurricane
        generateRain('heavy');
        
        hurricane.appendChild(eye);
        hurricaneContainer.appendChild(hurricane);
        hurricaneContainer.appendChild(flash);
        effectsContainer.appendChild(hurricaneContainer);
        
        // Add wind sounds if audio is supported
        if (window.Audio) {
            try {
                if (!audioElements.wind) {
                    audioElements.wind = new Audio();
                    audioElements.wind.volume = 0.2;
                    audioElements.wind.loop = true;
                    audioElements.wind.src = 'assets/sounds/wind.mp3';
                }
                audioElements.wind.play().catch(() => {});
            } catch(e) {}
        }
        
        return hurricaneContainer;
    }
    
    // Initialize the effects engine
    init();
    
    // Return public API
    return {
        clearEffects,
        generateRain,
        generateSnow,
        generateFog,
        generateLightning,
        generateSun,
        generateClouds,
        generateRainbow,
        generateHurricane,
        container: effectsContainer
    };
})();

// Dark mode functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or use system preference
const isDarkMode = () => {
  return localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && 
    window.matchMedia('(prefers-color-scheme: dark)').matches);
};

// Apply the right theme on initial load
if (isDarkMode()) {
  html.classList.add('dark');
} else {
  html.classList.remove('dark');
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.theme = 'light';
  } else {
    html.classList.add('dark');
    localStorage.theme = 'dark';
  }
  // Apply text colors when theme changes
  updateThemeColors();
  // Create background gradient animation
  createBackgroundEffect();
});

// Function to update text colors based on theme
function updateThemeColors() {
  const isDark = html.classList.contains('dark');
  
  // Update main weather condition text color
  const conditionElement = document.querySelector('.weather-card .text-indigo-600');
  if (conditionElement) {
    conditionElement.className = isDark ? 'text-sky-400 font-medium' : 'text-indigo-600 font-medium';
  }
  
  // Update detail item labels and values for better visibility
  const detailLabels = document.querySelectorAll('.weather-detail-item .label');
  const detailValues = document.querySelectorAll('.weather-detail-item .value');
  
  detailLabels.forEach(label => {
    label.style.color = isDark ? '#cbd5e1' : '#64748b';
  });
  
  detailValues.forEach(value => {
    value.style.color = isDark ? '#f1f5f9' : '#334155';
  });
  
  // Update forecast card text
  const forecastDays = document.querySelectorAll('.forecast-day-card .day');
  const forecastConditions = document.querySelectorAll('.forecast-day-card .condition');
  
  forecastDays.forEach(day => {
    day.style.color = isDark ? '#e2e8f0' : '#334155';
  });
  
  forecastConditions.forEach(condition => {
    condition.style.color = isDark ? '#cbd5e1' : '#64748b';
  });
  
  // Update icon colors based on theme
  const weatherIcons = document.querySelectorAll('.forecast-day-card i, .weather-detail-item i');
  weatherIcons.forEach(icon => {
    if (isDark) {
      // Brighter colors for dark mode
      if (icon.classList.contains('text-indigo-500')) {
        icon.classList.replace('text-indigo-500', 'text-sky-400');
      } else if (icon.classList.contains('text-gray-500')) {
        icon.classList.replace('text-gray-500', 'text-slate-300');
      } else if (icon.classList.contains('text-blue-400')) {
        icon.classList.replace('text-blue-400', 'text-sky-300');
      }
    } else {
      // Restore colors for light mode
      if (icon.classList.contains('text-sky-400')) {
        icon.classList.replace('text-sky-400', 'text-indigo-500');
      } else if (icon.classList.contains('text-slate-300')) {
        icon.classList.replace('text-slate-300', 'text-gray-500');
      } else if (icon.classList.contains('text-sky-300')) {
        icon.classList.replace('text-sky-300', 'text-blue-400');
      }
    }
  });
}

// Create beautiful gradient background effect with enhanced animations
function createBackgroundEffect() {
  const container = document.createElement('div');
  container.className = 'gradient-bg-container';
  
  // Ensure background is behind all weather effects
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '0'; // Below weather effects
  container.style.pointerEvents = 'none';
  
  document.body.appendChild(container);

  // Create multiple gradient blobs with different colors and animations
  const blobCount = 5; // Increased from 3 to 5
  const blobClasses = ['blob-1', 'blob-2', 'blob-3', 'blob-4', 'blob-5'];
  const lightModeColors = [
      'rgba(14, 165, 233, 0.15)',
      'rgba(56, 189, 248, 0.1)',
      'rgba(186, 230, 253, 0.12)',
      'rgba(125, 211, 252, 0.08)',
      'rgba(224, 242, 254, 0.1)'
  ];
  const darkModeColors = [
      'rgba(2, 132, 199, 0.15)',
      'rgba(3, 105, 161, 0.12)',
      'rgba(14, 116, 144, 0.1)',
      'rgba(8, 145, 178, 0.13)',
      'rgba(6, 182, 212, 0.08)'
  ];

  for (let i = 0; i < blobCount; i++) {
      const blob = document.createElement('div');
      blob.className = `gradient-blob ${blobClasses[i] || ''}`;
      
      // Randomize position slightly
      const randomXOffset = Math.random() * 10 - 5;
      const randomYOffset = Math.random() * 10 - 5;
      
      // Set custom styles based on index
      if (i === 0) {
          blob.style.top = `${15 + randomYOffset}%`;
          blob.style.left = `${10 + randomXOffset}%`;
          blob.style.width = '50vw';
          blob.style.height = '50vw';
          blob.style.maxWidth = '600px';
          blob.style.maxHeight = '600px';
          blob.style.animationDuration = '30s';
      } else if (i === 1) {
          blob.style.top = `${40 + randomYOffset}%`;
          blob.style.right = `${15 + randomXOffset}%`;
          blob.style.width = '40vw';
          blob.style.height = '40vw';
          blob.style.maxWidth = '500px';
          blob.style.maxHeight = '500px';
          blob.style.animationDuration = '25s';
      } else if (i === 2) {
          blob.style.bottom = `${10 + randomYOffset}%`;
          blob.style.left = `${25 + randomXOffset}%`;
          blob.style.width = '35vw';
          blob.style.height = '35vw';
          blob.style.maxWidth = '400px';
          blob.style.maxHeight = '400px';
          blob.style.animationDuration = '20s';
      } else if (i === 3) {
          blob.style.top = `${20 + randomYOffset}%`;
          blob.style.right = `${30 + randomXOffset}%`;
          blob.style.width = '30vw';
          blob.style.height = '30vw';
          blob.style.maxWidth = '350px';
          blob.style.maxHeight = '350px';
          blob.style.animationDuration = '35s';
      } else {
          blob.style.bottom = `${30 + randomYOffset}%`;
          blob.style.right = `${20 + randomXOffset}%`;
          blob.style.width = '25vw';
          blob.style.height = '25vw';
          blob.style.maxWidth = '300px';
          blob.style.maxHeight = '300px';
          blob.style.animationDuration = '28s';
      }
      
      // Apply different animation delay for each blob
      blob.style.animationDelay = `${i * 2}s`;
      
      // Apply appropriate color based on theme
      updateBlobColor(blob, i, isDarkMode);
      
      container.appendChild(blob);
  }

  // Function to update blob colors based on theme
  function updateBlobColor(blob, index, isDark) {
      blob.style.background = isDark ? darkModeColors[index] : lightModeColors[index];
  }

  // Update blob colors when theme changes
  themeToggle.addEventListener('click', () => {
      const blobs = document.querySelectorAll('.gradient-blob');
      blobs.forEach((blob, index) => {
          updateBlobColor(blob, index % blobCount, document.body.classList.contains('dark'));
      });
  });
}

// Generate rain effect with improved drops
function generateRain(intensity = 'moderate') {
  // Create a container element for all raindrops
  const rainContainer = document.createElement('div');
  rainContainer.className = 'rain-container';
  
  // Position the container to cover the entire viewport
  rainContainer.style.position = 'fixed';
  rainContainer.style.top = '0';
  rainContainer.style.left = '0';
  rainContainer.style.width = '100%';
  rainContainer.style.height = '100%';
  rainContainer.style.pointerEvents = 'none'; // Prevent rain from blocking interactions
  rainContainer.style.zIndex = '1'; // Above background gradient but below content
  rainContainer.style.overflow = 'hidden';
  
  // Configure rain parameters based on intensity level
  let dropCount, speedMultiplier, opacityBase, widthMultiplier;
  
  switch (intensity) {
    case 'light':
      // Light rain/drizzle has fewer drops that fall slower
      dropCount = window.innerWidth < 768 ? 30 : 60; // Fewer drops on mobile
      speedMultiplier = 0.8; // 20% slower than moderate
      opacityBase = 0.3; // More transparent
      widthMultiplier = 0.8; // Thinner drops
      break;
    case 'heavy':
      // Heavy rain has more drops that fall faster
      dropCount = window.innerWidth < 768 ? 80 : 150; // More drops
      speedMultiplier = 1.3; // 30% faster than moderate
      opacityBase = 0.5; // More visible
      widthMultiplier = 1.3; // Thicker drops
      break;
    case 'moderate':
    default:
      // Standard moderate rain
      dropCount = window.innerWidth < 768 ? 50 : 100;
      speedMultiplier = 1;
      opacityBase = 0.4;
      widthMultiplier = 1;
  }
  
  // Create individual raindrops
  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    
    // Randomize properties for each drop to create natural effect
    
    // Random horizontal position
    const left = Math.random() * 100; // % position from left edge
    
    // Random fall speed (faster for heavy rain)
    const duration = (Math.random() * 0.5 + 0.4) / speedMultiplier; // seconds
    
    // Random starting time so not all drops appear at once
    const delay = Math.random() * 5; // seconds
    
    // Random drop size (larger for heavy rain)
    const height = (Math.random() * 15 + 10) * (intensity === 'heavy' ? 1.2 : 1); // px
    const width = (Math.random() * 1.5 + 1.5) * widthMultiplier; // px
    
    // Apply calculated styles to the raindrop
    drop.style.left = `${left}%`;
    drop.style.height = `${height}px`;
    drop.style.width = `${width}px`;
    drop.style.animationDuration = `${duration}s`;
    drop.style.animationDelay = `${delay}s`;
    drop.style.opacity = Math.random() * 0.3 + opacityBase;
    
    // Make raindrops more visible with darker color and shadow
    const isDark = document.documentElement.classList.contains('dark');
    drop.style.background = isDark 
      ? 'linear-gradient(to bottom, rgba(56, 189, 248, 0), rgba(56, 189, 248, 0.8))' 
      : 'linear-gradient(to bottom, rgba(2, 132, 199, 0), rgba(2, 132, 199, 0.8))';
    drop.style.boxShadow = '0 0 3px rgba(14, 165, 233, 0.5)';
    
    // Slightly angle the raindrops for wind effect
    drop.style.transform = `rotate(${Math.random() * 5 + 2}deg)`;
    
    // Add this drop to the rain container
    rainContainer.appendChild(drop);
  }
  
  // Add the rain container to the document
  document.body.appendChild(rainContainer);
  
  // Return the container element in case we need to modify it later
  return rainContainer;
}

// Generate snow effect
function generateSnow() {
  // Create a container for all snowflakes
  const snowContainer = document.createElement('div');
  snowContainer.className = 'snow-container';
  
  // Position the snow container to cover the entire viewport
  snowContainer.style.position = 'fixed';
  snowContainer.style.top = '0';
  snowContainer.style.left = '0';
  snowContainer.style.width = '100%';
  snowContainer.style.height = '100%';
  snowContainer.style.overflow = 'hidden';
  snowContainer.style.pointerEvents = 'none'; // Prevent interfering with user interaction
  snowContainer.style.zIndex = '1'; // Above background gradient but below content
  
  // Adjust number of snowflakes based on screen size
  const flakeCount = window.innerWidth < 768 ? 50 : 100; // Fewer flakes on mobile
  
  // Generate snowfall keyframe animation if it doesn't exist yet
  if (!document.querySelector('style#snow-keyframes')) {
    const keyframes = `
      @keyframes snowfall {
        0% {
          transform: translateY(-10px) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
    `;
    
    // Create and append the style element with keyframes
    const style = document.createElement('style');
    style.id = 'snow-keyframes';
    style.innerHTML = keyframes;
    document.head.appendChild(style);
  }
  
  // Create individual snowflakes
  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('div');
    
    // Randomize properties for each snowflake to create natural effect
    
    // Random horizontal position
    const left = Math.random() * 100; // % from left
    
    // Random size (smaller flakes fall slower and appear further away)
    const size = Math.random() * 6 + 2; // px (2-8px range)
    
    // Random fall duration (smaller flakes fall slower)
    const duration = Math.random() * 10 + 8; // 8-18 seconds
    
    // Random delay so not all flakes start at once
    const delay = Math.random() * 5; // 0-5 seconds
    
    // Apply styles to the snowflake
    flake.style.position = 'absolute';
    flake.style.left = `${left}%`;
    flake.style.top = '-10px'; // Start just above viewport
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.borderRadius = '50%'; // Circular shape
    flake.style.background = 'white';
    flake.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.8)'; // Glow effect
    flake.style.animation = `snowfall ${duration}s linear infinite`;
    flake.style.animationDelay = `${delay}s`;
    
    // Random opacity for depth effect
    flake.style.opacity = Math.random() * 0.7 + 0.3; // 0.3-1.0 range
    
    // Add the snowflake to the container
    snowContainer.appendChild(flake);
  }
  
  // Add the snow container to the document
  document.body.appendChild(snowContainer);
  
  // Return the container element in case we need to modify it later
  return snowContainer;
}

// Generate fog/mist effect
function generateFog() {
  const fogContainer = document.createElement('div');
  fogContainer.className = 'fog-container';
  fogContainer.style.position = 'fixed';
  fogContainer.style.top = '0';
  fogContainer.style.left = '0';
  fogContainer.style.width = '100%';
  fogContainer.style.height = '100%';
  fogContainer.style.overflow = 'hidden';
  fogContainer.style.pointerEvents = 'none';
  fogContainer.style.zIndex = '1'; // Above background gradient but below content
  document.body.appendChild(fogContainer);
  
  // Create fog layers
  for (let i = 0; i < 3; i++) {
    const fog = document.createElement('div');
    fog.style.position = 'absolute';
    fog.style.width = '200%';
    fog.style.height = '100%';
    fog.style.top = `${i * 25}%`;
    fog.style.left = '-50%';
    
    // Different opacity and animation for each layer
    const opacity = 0.1 - (i * 0.02);
    const duration = 120 + (i * 20);
    
    fog.style.background = `rgba(255, 255, 255, ${opacity})`;
    fog.style.filter = 'blur(30px)';
    fog.style.animation = `fog-move ${duration}s linear infinite`;
    
    // Add keyframes for fog animation
    const keyframes = `
      @keyframes fog-move {
        0% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(25%);
        }
        100% {
          transform: translateX(0);
        }
      }
    `;
    
    // Add this keyframe only once
    if (i === 0) {
      const style = document.createElement('style');
      style.innerHTML = keyframes;
      document.head.appendChild(style);
    }
    
    fogContainer.appendChild(fog);
  }
}

// Enhanced sunshine effect with animations
function addSunshineEffect(isPartlyCloudy = false) {
    const sunContainer = document.createElement('div');
    sunContainer.className = 'sun-container';
    sunContainer.style.position = 'fixed';
    sunContainer.style.zIndex = '1'; // Above background gradient but below content
    sunContainer.style.pointerEvents = 'none';
    sunContainer.style.opacity = isPartlyCloudy ? '0.3' : '0';
    sunContainer.style.filter = 'drop-shadow(0 0 40px rgba(255, 180, 0, 0.3))';
    sunContainer.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
    
    // Set position based on screen size for better responsiveness
    const isMobile = window.innerWidth <= 768;
    sunContainer.style.top = isMobile ? '10vh' : '20vh';
    sunContainer.style.right = isMobile ? '-30vw' : '-10vw';
    
    // Create sun rays
    const sunRays = document.createElement('div');
    sunRays.className = 'sun-rays';
    sunContainer.appendChild(sunRays);
    
    // Create sun glow
    const sunGlow = document.createElement('div');
    sunGlow.className = 'sun-glow';
    sunContainer.appendChild(sunGlow);
    
    // Add rays
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
        const ray = document.createElement('div');
        ray.style.position = 'absolute';
        ray.style.top = '150px';
        ray.style.left = '150px';
        ray.style.width = '4px';
        ray.style.height = '150px';
        ray.style.transformOrigin = '0 0';
        ray.style.transform = `rotate(${i * (360 / rayCount)}deg)`;
        ray.style.background = 'linear-gradient(to top, rgba(255, 180, 0, 0), rgba(255, 180, 0, 0.7))';
        
        // Add staggered animation for rays
        ray.style.animation = `fade-in 1.5s ease-out ${i * 0.1}s forwards`;
        ray.style.opacity = '0';
        
        sunRays.appendChild(ray);
    }
    
    document.body.appendChild(sunContainer);
    
    // Animate sun appearance
    setTimeout(() => {
        sunContainer.style.opacity = '0.7';
        sunContainer.style.transform = 'scale(1)';
    }, 500);
    
    // Make sunshine responsive
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        sunContainer.style.top = isMobile ? '10vh' : '20vh';
        sunContainer.style.right = isMobile ? '-30vw' : '-10vw';
    });
}

// Weather API Functions
async function fetchWeatherData(city) {
  try {
    const response = await fetch(`${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

async function fetchForecastData(city) {
  try {
    const response = await fetch(`${FORECAST_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
    
    if (!response.ok) {
      throw new Error(`Forecast API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return null;
  }
}

// Display weather data with enhanced animations
function displayWeatherData(data) {
    if (!data) return false;
    
    console.log("Weather data:", data);
    
    // Get DOM elements for weather display
    const weatherCard = document.querySelector('.weather-card');
    if (!weatherCard) return false;
    
    // Get the weather card content container
    const cardContent = weatherCard.querySelector('.weather-card-content');
    if (!cardContent) return false;
    
    // Find elements within the weather card
    const cityElement = cardContent.querySelector('h3');
    const dateElement = cardContent.querySelector('p.text-gray-500');
    const tempElement = cardContent.querySelector('.text-6xl');
    const conditionElement = cardContent.querySelector('.text-indigo-600, .text-sky-400');
    
    // Find the icon in the top right
    const iconContainer = cardContent.querySelector('.icon');
    console.log("Icon container:", iconContainer);
    let weatherIconElement;
    
    if (iconContainer) {
        // Get existing icon or create new one
        weatherIconElement = iconContainer.querySelector('i');
        
        // Create the icon element if it doesn't exist
        if (!weatherIconElement) {
            weatherIconElement = document.createElement('i');
            weatherIconElement.className = 'fas fa-sun text-yellow-500 text-5xl';
            iconContainer.appendChild(weatherIconElement);
        }
    }
    
    // Find weather detail items
    const detailItems = cardContent.querySelectorAll('.weather-detail-item');
    let humidityElement, windElement, rainElement;
    
    if (detailItems.length > 0) {
        windElement = detailItems[0]?.querySelector('.value');
        humidityElement = detailItems[1]?.querySelector('.value');
        rainElement = detailItems[2]?.querySelector('.value');
    }
    
    // Set current date and time
    if (dateElement) {
        const now = new Date();
        dateElement.textContent = `Today, ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    
    // Update city name
    if (cityElement) {
        cityElement.textContent = data.name;
    }
    
    // Update temperature
    if (tempElement) {
        const newTemp = Math.round(data.main.temp);
        tempElement.textContent = `${newTemp}°`;
    }
    
    // Update condition text
    if (conditionElement) {
        conditionElement.textContent = data.weather[0].main;
    }
    
    // Get weather condition from API
    const condition = data.weather[0].main;
    console.log("Weather condition from API:", condition);
    
    // Update weather icon based on condition
    if (weatherIconElement) {
        let iconClass = 'fas fa-sun text-yellow-500 text-5xl';
        
        if (condition === 'Clouds' || condition.includes('Cloud')) {
            iconClass = 'fas fa-cloud text-gray-500 text-5xl';
        } else if (condition === 'Rain' || condition.includes('Rain') || 
                  condition === 'Drizzle' || condition.includes('Drizzle')) {
            iconClass = 'fas fa-cloud-rain text-blue-500 text-5xl';
        } else if (condition === 'Snow' || condition.includes('Snow')) {
            iconClass = 'fas fa-snowflake text-blue-300 text-5xl';
        } else if (condition === 'Thunderstorm' || condition.includes('Thunder')) {
            iconClass = 'fas fa-bolt text-purple-500 text-5xl';
        } else if (condition === 'Mist' || condition === 'Fog' || condition === 'Haze' || 
                  condition.includes('Mist') || condition.includes('Fog') || condition.includes('Haze')) {
            iconClass = 'fas fa-smog text-gray-500 text-5xl';
        }
        
        // Update icon class
        weatherIconElement.className = iconClass;
    }
    
    // Update weather details
    if (humidityElement) {
        humidityElement.textContent = `${data.main.humidity}%`;
    }
    
    if (windElement) {
        windElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    }
    
    if (rainElement) {
        rainElement.textContent = data.rain ? `${Math.round(data.rain['1h'] || 0)}%` : '0%';
    }
    
    // Apply environmental effects based on the weather condition
    updateEnvironmentalEffects(condition);
    
    return true;
}

// Display forecast data with staggered animations
function displayForecastData(data) {
    if (!data || !data.list) return false;
    
    console.log("Forecast data received:", data);
    
    // Reference the forecast container with the existing forecast cards
    const forecastContainer = document.querySelector('.forecast-scroll');
    if (!forecastContainer) return false;
    
    // Get the existing forecast cards
    const forecastCards = forecastContainer.querySelectorAll('.forecast-day-card');
    if (!forecastCards || forecastCards.length === 0) return false;
    
    // Get the current day number (0 = Sunday, 1 = Monday, etc.)
    const currentDayNumber = new Date().getDay();
    
    // Process forecast data - organize by day
    const dailyForecasts = {};
    
    // Group forecast items by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Use midday forecasts (closest to noon) for each day
        const hour = date.getHours();
        if (!dailyForecasts[day] || (hour >= 11 && hour <= 14)) {
            dailyForecasts[day] = {
                date: date,
                day: day,
                temp: Math.round(item.main.temp),
                condition: item.weather[0].main,
                icon: item.weather[0].icon
            };
        }
    });
    
    console.log("Processed daily forecasts:", dailyForecasts);
    
    // Get days of the week starting from today
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDayNumber + i) % 7;
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
        daysOfWeek.push(dayName);
    }
    
    // Update the forecast cards with data
    forecastCards.forEach((card, index) => {
        if (index >= 7) return; // We only have 7 days
        
        // Get the day name for this card
        const dayName = daysOfWeek[index];
        
        // Get forecast data for this day (or use placeholder)
        const forecast = dailyForecasts[dayName] || {
            day: dayName,
            temp: Math.round(15 + Math.random() * 10), // Random fallback temperature
            condition: 'Clear' // Default condition
        };
        
        // Update the day name
        const dayElement = card.querySelector('.day');
        if (dayElement) {
            dayElement.textContent = dayName;
        }
        
        // Update the temperature
        const tempElement = card.querySelector('.temp');
        if (tempElement) {
            tempElement.textContent = `${forecast.temp}°C`;
        }
        
        // Update the condition
        const conditionElement = card.querySelector('.condition');
        if (conditionElement) {
            conditionElement.textContent = forecast.condition;
        }
        
        // Update the icon
        const iconElement = card.querySelector('i');
        if (iconElement) {
            // Map condition to icon class
            let iconClass = 'fas fa-sun text-4xl my-4 text-yellow-500';
            
            switch (forecast.condition) {
                case 'Clear':
                    iconClass = 'fas fa-sun text-4xl my-4 text-yellow-500';
                    break;
                case 'Clouds':
                    iconClass = 'fas fa-cloud text-4xl my-4 text-gray-500';
                    break;
                case 'Rain':
                    iconClass = 'fas fa-cloud-rain text-4xl my-4 text-blue-500';
                    break;
                case 'Snow':
                    iconClass = 'fas fa-snowflake text-4xl my-4 text-blue-300';
                    break;
                case 'Thunderstorm':
                    iconClass = 'fas fa-bolt text-4xl my-4 text-purple-500';
                    break;
                case 'Drizzle':
                    iconClass = 'fas fa-cloud-rain text-4xl my-4 text-blue-400';
                    break;
                case 'Mist':
                case 'Fog':
                case 'Haze':
                    iconClass = 'fas fa-smog text-4xl my-4 text-gray-500';
                    break;
            }
            
            iconElement.className = iconClass;
        }
        
        // Highlight current day
        if (index === 0) {
            card.classList.add('current-day');
        } else {
            card.classList.remove('current-day');
        }
    });
    
    return true;
}

// Helper function to get day name from index
function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

// Animate number counter
function animateCounter(element, start, end, duration = 1000) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    element.textContent = `${currentValue}°`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Helper function to get day name from timestamp
function getDayNameFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Helper function to determine if it's night time
function isNightTime(sunrise, sunset, current) {
  return current < sunrise || current > sunset;
}

// Helper function to get weather icon class based on condition ID
function getWeatherIconClass(conditionId, isNight) {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (conditionId >= 200 && conditionId < 300) {
    return 'fa-bolt'; // Thunderstorm
  } else if (conditionId >= 300 && conditionId < 400) {
    return 'fa-cloud-rain'; // Drizzle
  } else if (conditionId >= 500 && conditionId < 600) {
    return conditionId >= 511 ? 'fa-cloud-showers-heavy' : 'fa-cloud-rain'; // Rain
  } else if (conditionId >= 600 && conditionId < 700) {
    return 'fa-snowflake'; // Snow
  } else if (conditionId >= 700 && conditionId < 800) {
    return 'fa-smog'; // Atmosphere (fog, mist, etc.)
  } else if (conditionId === 800) {
    return isNight ? 'fa-moon' : 'fa-sun'; // Clear sky
  } else if (conditionId === 801 || conditionId === 802) {
    return isNight ? 'fa-cloud-moon' : 'fa-cloud-sun'; // Few/scattered clouds
  } else {
    return 'fa-cloud'; // Broken/overcast clouds
  }
}

// Helper function to get color class based on condition ID
function getWeatherColorClass(conditionId) {
  const isDark = html.classList.contains('dark');
  
  if (conditionId >= 200 && conditionId < 300) {
    return isDark ? 'text-purple-400' : 'text-purple-500'; // Thunderstorm
  } else if (conditionId >= 300 && conditionId < 600) {
    return isDark ? 'text-sky-400' : 'text-blue-500'; // Rain/Drizzle
  } else if (conditionId >= 600 && conditionId < 700) {
    return isDark ? 'text-blue-200' : 'text-blue-300'; // Snow
  } else if (conditionId >= 700 && conditionId < 800) {
    return isDark ? 'text-slate-300' : 'text-gray-500'; // Atmosphere
  } else if (conditionId === 800) {
    return isDark ? 'text-amber-300' : 'text-yellow-500'; // Clear sky
  } else if (conditionId === 801 || conditionId === 802) {
    return isDark ? 'text-sky-400' : 'text-indigo-500'; // Few/scattered clouds
  } else {
    return isDark ? 'text-slate-300' : 'text-gray-500'; // Broken/overcast clouds
  }
}

// Update environmental effects based on weather condition
function updateEnvironmentalEffects(condition) {
  if (!condition) return;
  
  // Normalize condition text - lowercase and remove extra spaces
  const normalizedCondition = condition.toLowerCase().trim();
  console.log("Weather condition for effects:", normalizedCondition);
  
  // Clear all existing weather effects
  weatherEffects.clearEffects();
  
  // Determine if it's nighttime for appropriate effects
  const isNight = document.documentElement.classList.contains('dark');
  
  // Handle different weather conditions with improved animations
  if (normalizedCondition.includes('rain') || normalizedCondition.includes('drizzle')) {
    console.log("Applying RAIN effect");
    // Generate rain effect with appropriate intensity
    const intensity = 
        normalizedCondition.includes('drizzle') || normalizedCondition.includes('light') ? 'light' : 
        normalizedCondition.includes('heavy') ? 'heavy' : 'moderate';
    
    weatherEffects.generateRain(intensity);
    
    // Add thunder for thunderstorms
    if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm')) {
      console.log("  - With lightning effects");
      weatherEffects.generateLightning();
    }
    
    // Add rainbow effect on light rain occasionally
    if (intensity === 'light' && Math.random() > 0.7) {
      weatherEffects.generateRainbow();
    }
  } 
  else if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm')) {
    console.log("Applying THUNDERSTORM effect");
    // Generate heavy rain with lightning
    weatherEffects.generateRain('heavy');
    weatherEffects.generateLightning();
  }
  else if (normalizedCondition.includes('hurricane') || normalizedCondition.includes('cyclone') || normalizedCondition.includes('tornado')) {
    console.log("Applying HURRICANE effect");
    weatherEffects.generateHurricane();
  }
  else if (normalizedCondition.includes('clear') || normalizedCondition.includes('sun')) {
    console.log("Applying SUNSHINE effect");
    // Add sunshine effect
    weatherEffects.generateSun(false);
  }
  else if (normalizedCondition.includes('cloud')) {
    console.log("Applying CLOUD effect");
    // Check if it's partly cloudy or overcast
    const isPartlyCloudy = 
        normalizedCondition.includes('few') || 
        normalizedCondition.includes('scattered') || 
        normalizedCondition.includes('partly');
    
    if (isPartlyCloudy) {
      console.log("  - With partial sunshine (partly cloudy)");
      // Show clouds with sun
      weatherEffects.generateClouds('light');
      weatherEffects.generateSun(true);
    } else {
      // Just show clouds for overcast
      weatherEffects.generateClouds('heavy');
    }
  }
  else if (normalizedCondition.includes('snow') || normalizedCondition.includes('sleet') || normalizedCondition.includes('ice')) {
    console.log("Applying SNOW effect");
    // Determine snow intensity
    const intensity = 
        normalizedCondition.includes('light') ? 'light' : 
        normalizedCondition.includes('heavy') ? 'heavy' : 'moderate';
        
    weatherEffects.generateSnow(intensity);
  }
  else if (normalizedCondition.includes('mist') || 
         normalizedCondition.includes('fog') || 
         normalizedCondition.includes('haze') ||
         normalizedCondition.includes('smoke')) {
    console.log("Applying FOG/MIST effect");
    
    // Determine fog intensity
    const intensity = 
        normalizedCondition.includes('light') ? 'light' : 
        normalizedCondition.includes('heavy') || normalizedCondition.includes('dense') ? 'heavy' : 'moderate';
    
    weatherEffects.generateFog(intensity);
    
    // Add dim sun for haze conditions
    if (normalizedCondition.includes('haze')) {
      console.log("  - With dim sunshine (haze)");
      weatherEffects.generateSun(true);
    }
  }
  else {
    console.log("No specific effect applied for condition:", normalizedCondition);
  }
  
  // Ensure content is above weather effects
  ensureContentIsAboveEffects();
}

// Interactive weather search with API integration
function setupWeatherSearch() {
  const searchInput = document.querySelector('.weather-search input');
  const searchButton = document.querySelector('.weather-search button');
  const cityTags = document.querySelectorAll('.city-tag');
  const weatherSearch = document.querySelector('.weather-search');
  
  
  // Add focus animations for search
  searchInput.addEventListener('focus', () => {
    weatherSearch.classList.add('shadow-lg');
    weatherSearch.style.borderColor = 'var(--primary-color)';
  });
  
  searchInput.addEventListener('blur', () => {
    weatherSearch.classList.remove('shadow-lg');
    weatherSearch.style.borderColor = '';
  });
  
  // Set up search button action
  searchButton.addEventListener('click', () => {
    if (searchInput.value.trim() !== '') {
      // Load and display weather
      fetchAndDisplayWeather(searchInput.value.trim());
      
      // On mobile, blur input to hide keyboard
      if (isMobile) {
        searchInput.blur();
      }
    } else {
      // Highlight the input if empty
      highlightEmptyInput();
    }
  });
  
  // Enter key in search input
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim() !== '') {
      fetchAndDisplayWeather(searchInput.value.trim());
      
      // On mobile, blur input to hide keyboard
      if (isMobile) {
        searchInput.blur();
      }
    } else if (e.key === 'Enter') {
      // Highlight the input if empty
      highlightEmptyInput();
    }
  });
  
  // City tag clicks with enhanced animation
  cityTags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Highlight the selected tag
      cityTags.forEach(t => t.classList.remove('active-tag'));
      tag.classList.add('active-tag');
      
      // Set input value with animation
      searchInput.value = "";
      let i = 0;
      const cityName = tag.textContent;
      const typeInterval = setInterval(() => {
        searchInput.value += cityName.charAt(i);
        i++;
        if (i >= cityName.length) {
          clearInterval(typeInterval);
          
          // Small delay before initiating search
          setTimeout(() => {
            fetchAndDisplayWeather(cityName);
          }, 200);
        }
      }, 50);
    });
  });
  
  // Add visual feedback for empty input
  function highlightEmptyInput() {
    searchInput.classList.add('animate-shake');
    weatherSearch.style.borderColor = '#ff6b00';
    
    setTimeout(() => {
      searchInput.classList.remove('animate-shake');
      weatherSearch.style.borderColor = '';
    }, 1000);
  }
  
  // Load last searched city from local storage on page load
  const lastSearchedCity = localStorage.getItem('lastCity') || DEFAULT_CITY;
  searchInput.value = lastSearchedCity;
  
  // Fetch and display weather on page load
  fetchAndDisplayWeather(lastSearchedCity, false);
}

// Fetch weather and forecast data and display it
async function fetchAndDisplayWeather(city, showLoadingAnimation = true) {
  const weatherCard = document.querySelector('.weather-card');
  
  if (!weatherCard) {
    console.error('Weather card element not found');
    return;
  }
  
  // Save city to local storage
  localStorage.setItem('lastCity', city);
  
  if (showLoadingAnimation) {
    // Show loading animation
    weatherCard.style.opacity = '0.7';
    weatherCard.style.transform = 'scale(0.98)';
    
    // Add loading spinner if it doesn't exist
    let loadingSpinner = weatherCard.querySelector('.loading-spinner');
    if (!loadingSpinner) {
      loadingSpinner = document.createElement('div');
      loadingSpinner.className = 'loading-spinner';
      loadingSpinner.innerHTML = '<div class="spinner-circle"></div>';
      weatherCard.appendChild(loadingSpinner);
    }
  }
  
  try {
    // Fetch weather and forecast data in parallel
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(city),
      fetchForecastData(city)
    ]);
    
    // Remove loading spinner if it exists
    const loadingSpinner = weatherCard.querySelector('.loading-spinner');
    if (loadingSpinner) {
      weatherCard.removeChild(loadingSpinner);
    }
    
    // Check if we got valid data
    if (!weatherData || !forecastData) {
      throw new Error('Failed to fetch weather data');
    }
    
    // Display data
    const weatherSuccess = displayWeatherData(weatherData);
    const forecastSuccess = displayForecastData(forecastData);
    
    // Return card to normal with smooth animation
    weatherCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    weatherCard.style.opacity = '1';
    weatherCard.style.transform = 'scale(1)';
    
    // Handle error case
    if (!weatherSuccess || !forecastSuccess) {
      throw new Error('Failed to display weather data');
    }
    
    // Ensure content is above weather effects after displaying weather
    ensureContentIsAboveEffects();
    
    // Animate weather card with pulse effect
    weatherCard.classList.add('pulse');
    setTimeout(() => {
      weatherCard.classList.remove('pulse');
    }, 1000);
    
    // Return success indicator
    return true;
    
  } catch (error) {
    console.error('Error fetching and displaying weather:', error);
    
    // Remove loading spinner
    const loadingSpinner = weatherCard.querySelector('.loading-spinner');
    if (loadingSpinner) {
      weatherCard.removeChild(loadingSpinner);
    }
    
    // Return card to normal with animated shake effect
    weatherCard.style.opacity = '1';
    weatherCard.style.transform = 'scale(1)';
    weatherCard.classList.add('animate-shake');
    
    setTimeout(() => {
      weatherCard.classList.remove('animate-shake');
    }, 500);
    
    // Show error message to user
    alert(`Could not load weather data for "${city}". Please try another city or check your connection.`);
    
    return false;
  }
}

// Interactive forecast cards with smoother animations
function setupForecastCards() {
  const forecastCards = document.querySelectorAll('.forecast-day-card');
  const forecastScroll = document.querySelector('.forecast-scroll');
  const isMobile = window.innerWidth < 768;
  
  // Get current day name
  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Find current day index for initial highlighting and scrolling
  let currentDayIndex = -1;
  forecastCards.forEach((card, index) => {
    const dayElement = card.querySelector('.day');
    if (dayElement && dayElement.textContent === currentDayName) {
      currentDayIndex = index;
      card.classList.add('current-day');
      dayElement.style.fontWeight = '600';
    }
  });
  
  // Enhanced hover interaction (desktop only) with smoother transition
  if (!isMobile) {
    forecastCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Darken other cards slightly with smooth transition
        forecastCards.forEach(otherCard => {
          if (otherCard !== card && !otherCard.classList.contains('current-day')) {
            otherCard.style.opacity = '0.7';
            otherCard.style.transform = 'scale(0.98)';
            otherCard.style.transition = 'all 0.3s ease';
          }
        });
      });
      
      card.addEventListener('mouseleave', () => {
        // Reset opacity of all cards with smooth transition
        forecastCards.forEach(otherCard => {
          if (!otherCard.classList.contains('current-day')) {
            otherCard.style.opacity = '1';
            otherCard.style.transform = 'scale(1)';
          }
        });
      });
    });
  }
  
  // Card click effect - improved animation
  forecastCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.add('pulse');
      
      // Add active state styling
      if (!card.classList.contains('current-day')) {
        card.style.borderColor = 'var(--primary-color)';
      }
      
      // Show a tooltip or additional info
      const temp = card.querySelector('.temp');
      const originalText = temp.textContent;
      const feelsLike = parseInt(originalText) - Math.floor(Math.random() * 3);
      
      temp.textContent = `Feels like: ${feelsLike}°C`;
      temp.style.fontSize = '1rem';
      temp.style.transition = 'all 0.3s ease';
      
      // Reset after a delay
      setTimeout(() => {
        card.classList.remove('pulse');
        
        // Don't reset border color for current day
        if (!card.classList.contains('current-day')) {
          card.style.borderColor = '';
        }
        
        temp.textContent = originalText;
        temp.style.fontSize = '';
      }, 2000);
    });
  });
  
  // Mobile scroll enhancements
  if (isMobile && currentDayIndex >= 0) {
    // Scroll to the current day card
    const cardWidth = forecastCards[0].offsetWidth + 16; // Width + gap
    forecastScroll.scrollLeft = cardWidth * currentDayIndex;
    
    // Improved handle active card indication when scrolling
    forecastScroll.addEventListener('scroll', () => {
      const scrollLeft = forecastScroll.scrollLeft;
      const cardWidth = forecastCards[0].offsetWidth + 16; // Width + gap
      const index = Math.round(scrollLeft / cardWidth);
      
      forecastCards.forEach((card, i) => {
        // Don't change opacity or transform for the current day card
        if (!card.classList.contains('current-day')) {
          if (i === index) {
            card.style.borderColor = 'var(--primary-color)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1.02)';
          } else {
            card.style.borderColor = '';
            card.style.opacity = i === index - 1 || i === index + 1 ? '0.9' : '0.7';
            card.style.transform = 'scale(1)';
          }
          card.style.transition = 'all 0.3s ease';
        }
      });
    });
  }
  
  // Add swipe indicator that fades out after delay
  const swipeIndicator = document.querySelector('.md\\:hidden.w-full');
  if (swipeIndicator) {
    setTimeout(() => {
      swipeIndicator.style.opacity = '0';
      swipeIndicator.style.transition = 'opacity 1s ease';
    }, 3000);
  }
}

// Smooth parallax scrolling effect
function setupParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Parallax for background gradient blobs
    document.querySelectorAll('.gradient-blob').forEach((blob, index) => {
      const speed = 0.03 + (index * 0.02);
      const yOffset = scrollY * speed;
      const xOffset = scrollY * speed * 0.5 * (index % 2 === 0 ? 1 : -1);
      blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
    
    // Parallax for other elements with smoother effect
    document.querySelectorAll('.weather-card, .feature-card').forEach((card, index) => {
      const speed = 0.05 + (index * 0.01);
      const yOffset = scrollY * speed;
      card.style.transform = `translateY(-${yOffset}px)`;
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

// Ensure content elements have proper z-indices
function ensureContentIsAboveEffects() {
  // Get all major content containers
  const contentElements = document.querySelectorAll('header, section, footer, .weather-card, .forecast-day-card');
  
  // Set z-index for each element to ensure they're above weather effects
  contentElements.forEach(element => {
    // Get current z-index
    const currentZIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
    
    // Only set if currentZIndex is auto or less than our minimum
    if (isNaN(currentZIndex) || currentZIndex < 2) {
      element.style.position = element.style.position || 'relative';
      element.style.zIndex = '2';
    }
  });
  
  // Make sure forecast cards are visible
  const forecastCards = document.querySelectorAll('.forecast-day-card');
  forecastCards.forEach(card => {
    card.style.position = 'relative';
    card.style.zIndex = '3';
  });
  
  console.log("Z-index adjustments applied to ensure content is above weather effects");
}

// Generate background effects on page load and window resize
window.addEventListener('load', () => {
  createBackgroundEffect();
  setupWeatherSearch();
  setupForecastCards();
  setupParallax();
  
  // Apply theme colors
  updateThemeColors();
  
  // Ensure content is above weather effects
  ensureContentIsAboveEffects();
  
  // Set initial sun position if it's a clear day
  const weatherCondition = document.querySelector('.weather-card .text-indigo-600, .weather-card .text-sky-400')?.textContent;
  if (weatherCondition === 'Clear' || weatherCondition === 'Sunny') {
    weatherEffects.generateSun(false);
  }
  
  // Improve responsiveness
  const handleResize = () => {
    const isMobile = window.innerWidth < 768;
    const weatherCard = document.querySelector('.weather-card');
    const forecastCards = document.querySelectorAll('.forecast-day-card');
    
    if (isMobile) {
      weatherCard.style.padding = '1.25rem';
      forecastCards.forEach(card => {
        card.style.padding = '1rem';
      });
    } else {
      weatherCard.style.padding = '2rem';
      forecastCards.forEach(card => {
        card.style.padding = '1.25rem';
      });
    }
    
    // Update background effect on resize
    createBackgroundEffect();
  };
  
  window.addEventListener('resize', handleResize);
  // Initial call
  handleResize();
});

// Simulate a weather update as fallback
function simulateWeatherUpdate(city) {
  console.log(`Simulating weather update for ${city}`);
  // This would have fallback logic if needed
}
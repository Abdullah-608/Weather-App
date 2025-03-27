/**
 * Weather Effects Library
 * Enhanced weather animations with performance optimizations
 */

class WeatherEffects {
    constructor() {
        // Create a single container for all weather effects to improve performance
        this.effectsContainer = document.createElement('div');
        this.effectsContainer.className = 'weather-effects-container';
        this.effectsContainer.style.position = 'fixed';
        this.effectsContainer.style.top = '0';
        this.effectsContainer.style.left = '0';
        this.effectsContainer.style.width = '100%';
        this.effectsContainer.style.height = '100%';
        this.effectsContainer.style.overflow = 'hidden';
        this.effectsContainer.style.pointerEvents = 'none';
        this.effectsContainer.style.zIndex = '1';
        
        // Append the container to the document body
        document.body.appendChild(this.effectsContainer);
        
        // Store animation keyframes to avoid duplication
        this.keyframesAdded = {};
    }
    
    /**
     * Clear all weather effects
     */
    clearEffects() {
        // Remove all child elements from the container
        while (this.effectsContainer.firstChild) {
            this.effectsContainer.removeChild(this.effectsContainer.firstChild);
        }
        
        // Remove any flash elements from lightning effects
        const flashes = document.querySelectorAll('.lightning-flash');
        flashes.forEach(flash => {
            if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
            }
        });
        
        return true;
    }
    
    /**
     * Add keyframes to the document if they don't already exist
     * @param {string} id - The identifier for the keyframes
     * @param {string} css - The CSS keyframes definition
     */
    addKeyframes(id, css) {
        if (this.keyframesAdded[id]) return;
        
        const style = document.createElement('style');
        style.id = id;
        style.innerHTML = css;
        document.head.appendChild(style);
        
        this.keyframesAdded[id] = true;
    }
    
    /**
     * Generate rain effect with different intensities
     * @param {string} intensity - 'light', 'moderate', or 'heavy'
     */
    generateRain(intensity = 'moderate') {
        this.clearEffects();
        
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
        this.addKeyframes('rain-keyframes', `
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
        this.effectsContainer.appendChild(rainContainer);
        
        return rainContainer;
    }
    
    /**
     * Generate snow effect
     * @param {string} intensity - 'light', 'moderate', or 'heavy'
     */
    generateSnow(intensity = 'moderate') {
        this.clearEffects();
        
        // Add snowfall animation keyframes
        this.addKeyframes('snow-keyframes', `
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
        this.effectsContainer.appendChild(snowContainer);
        
        return snowContainer;
    }
    
    /**
     * Generate fog/mist effect
     * @param {string} intensity - 'light', 'moderate', or 'heavy'
     */
    generateFog(intensity = 'moderate') {
        this.clearEffects();
        
        // Add fog animation keyframes
        this.addKeyframes('fog-keyframes', `
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
        
        this.effectsContainer.appendChild(fogContainer);
        
        return fogContainer;
    }
    
    /**
     * Generate lightning effect with thunder
     */
    generateLightning() {
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
                        const thunder = new Audio();
                        thunder.volume = 0.2;
                        thunder.src = 'data:audio/mp3;base64,SUQzAwAAAAABJFRYWFgAAAAYAAADTGF2ZjU4LjEyLjEwMCBEb24gTWVhbgBUWFhYAAAAEwAAAw==';
                        thunder.play().catch(() => {});
                    } catch(e) {}
                }
                
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => {
                        if (flash.parentNode) {
                            document.body.removeChild(flash);
                        }
                        
                        // Possibly create another flash for multi-flash effect
                        if (Math.random() > 0.7 && this.effectsContainer.querySelector('.rain-container')) {
                            setTimeout(() => createFlash(), 100);
                        }
                    }, 200);
                }, 80 + Math.random() * 50); // Variable flash duration
            }, 20);
            
            // Schedule next lightning if rain is still active
            if (this.effectsContainer.querySelector('.rain-container')) {
                setTimeout(createFlash, Math.random() * 3000 + 2000);
            }
        };
        
        // Start lightning with random delay
        setTimeout(createFlash, Math.random() * 1000);
        
        return true;
    }
    
    /**
     * Generate sunshine effect
     * @param {boolean} isPartlyCloudy - Whether this is for partly cloudy (true) or clear sky (false)
     */
    generateSun(isPartlyCloudy = false) {
        this.clearEffects();
        
        // Add sunshine animation keyframes
        this.addKeyframes('sun-keyframes', `
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
        this.effectsContainer.appendChild(sunContainer);
        
        // Animate sun appearance
        setTimeout(() => {
            sunContainer.style.opacity = isPartlyCloudy ? '0.5' : '0.8';
        }, 100);
        
        return sunContainer;
    }
    
    /**
     * Generate cloud effect
     * @param {string} intensity - 'light' (partly cloudy) or 'heavy' (overcast)
     */
    generateClouds(intensity = 'heavy') {
        this.clearEffects();
        
        // Add cloud animation keyframes if needed
        this.addKeyframes('cloud-keyframes', `
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
        
        this.effectsContainer.appendChild(cloudContainer);
        
        return cloudContainer;
    }
    
    /**
     * Generate rainbow effect (new)
     */
    generateRainbow() {
        const rainbowContainer = document.createElement('div');
        rainbowContainer.className = 'rainbow-container';
        
        // Add rainbow keyframes
        this.addKeyframes('rainbow-keyframes', `
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
        this.effectsContainer.appendChild(rainbowContainer);
        
        return rainbowContainer;
    }
    
    /**
     * Generate hurricane effect (new)
     */
    generateHurricane() {
        this.clearEffects();
        
        // Add hurricane keyframes
        this.addKeyframes('hurricane-keyframes', `
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
        this.generateRain('heavy');
        
        hurricane.appendChild(eye);
        hurricaneContainer.appendChild(hurricane);
        hurricaneContainer.appendChild(flash);
        this.effectsContainer.appendChild(hurricaneContainer);
        
        // Add wind sounds if audio is supported
        if (window.Audio) {
            try {
                const wind = new Audio();
                wind.volume = 0.1;
                wind.loop = true;
                wind.src = 'data:audio/mp3;base64,SUQzAwAAAAABJFRYWFgAAAAYAAADTGF2ZjU4LjEyLjEwMCBEb24gTWVhbgBUWFhYAAAAEwAAAw==';
                wind.play().catch(() => {});
                
                // Store the audio element for cleanup
                hurricaneContainer.dataset.audioElement = 'true';
                this.audioElement = wind;
            } catch(e) {}
        }
        
        return hurricaneContainer;
    }
    
    /**
     * Clean up any resources
     */
    destroy() {
        this.clearEffects();
        
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        
        if (this.effectsContainer && this.effectsContainer.parentNode) {
            this.effectsContainer.parentNode.removeChild(this.effectsContainer);
        }
    }
}

// Export weather effects for global use
window.WeatherEffects = WeatherEffects; 
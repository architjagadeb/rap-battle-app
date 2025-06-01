document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D tilt effect on circles
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        VanillaTilt.init(circle, {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.5
        });
    });
    
    // Initialize statistics animation
    setupStatsAnimation();
    
    // Initialize ripple effect
    setupRippleEffect();
    
    // Initialize feature list interactions
    setupFeaturesList();
    
    // Initialize audio previews
    setupAudioPreviews();
});

function setupStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-card');
    
    function formatNumber(number) {
        // Handle special case for 24/7
        if (number === '24/7') return number;

        // Convert to number if it's a string
        number = typeof number === 'string' ? parseInt(number) : number;

        // Format with K+ or M+ suffix
        if (number >= 1000000) {
            return Math.floor(number / 1000000) + 'M+';
        } else if (number >= 1000) {
            return Math.floor(number / 1000) + 'K+';
        } else {
            return number.toString() + '+';
        }
    }

    const animateValue = (element, start, end, duration) => {
        // Get the raw value from data attribute
        const rawValue = element.getAttribute('data-value');
        
        // If it's 24/7, don't animate
        if (rawValue === '24/7') {
            element.textContent = '24/7';
            return;
        }

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            
            // Format the number with appropriate suffix
            element.textContent = formatNumber(current);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    const value = stat.getAttribute('data-value');
                    
                    // Skip animation for 24/7
                    if (value === '24/7') {
                        stat.textContent = value;
                        return;
                    }

                    const endValue = parseInt(value);
                    stat.textContent = '0';
                    animateValue(stat, 0, endValue, 2000);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Initialize stats immediately if they're already visible
    stats.forEach(stat => {
        const value = stat.getAttribute('data-value');
        if (value !== '24/7') {
            stat.textContent = formatNumber(parseInt(value));
        }
    });

    if (statsSection) {
        observer.observe(statsSection);
    }
}

function setupRippleEffect() {
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        
        document.getElementById('ripple-container').appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
}

function setupFeaturesList() {
    const features = document.querySelectorAll('.features-list li');
    
    features.forEach(feature => {
        feature.addEventListener('click', () => {
            // Remove active class from all features
            features.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked feature
            feature.classList.add('active');
            
            // Create and show feature demo
            showFeatureDemo(feature);
        });
    });
}

function showFeatureDemo(feature) {
    const demoContent = {
        'Live Rap Battles': '<div class="demo-battle"><div class="vs">VS</div><div class="demo-timer">01:30</div></div>',
        'Artist Collaborations': '<div class="demo-collab"><div class="artist-connect"></div></div>',
        'Community Feedback': '<div class="demo-feedback"><div class="likes">👍 1.2k</div><div class="comments">💭 324</div></div>',
        'Global Exposure': '<div class="demo-global"><div class="globe"></div><div class="connections"></div></div>'
    };

    const demo = document.createElement('div');
    demo.className = 'feature-demo';
    demo.innerHTML = demoContent[feature.textContent] || '';
    
    // Remove existing demo
    const existingDemo = document.querySelector('.feature-demo');
    if (existingDemo) {
        existingDemo.remove();
    }
    
    // Add new demo
    feature.appendChild(demo);
}

function setupAudioPreviews() {
    const previewBtns = document.querySelectorAll('.preview-btn');
    
    previewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const visualizer = btn.parentElement.querySelector('.audio-visualizer');
            const bars = visualizer.querySelectorAll('.bar');
            
            // Toggle animation state
            if (visualizer.classList.contains('playing')) {
                visualizer.classList.remove('playing');
                btn.textContent = 'Preview Track';
                bars.forEach(bar => bar.style.animation = 'none');
            } else {
                visualizer.classList.add('playing');
                btn.textContent = 'Stop Preview';
                bars.forEach(bar => {
                    const height = Math.random() * 100;
                    bar.style.height = `${height}%`;
                    bar.style.animation = `visualizer ${Math.random() * 0.7 + 0.3}s ease-in-out infinite alternate`;
                });
            }
        });
    });
} 
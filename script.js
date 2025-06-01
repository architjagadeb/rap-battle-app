// Reluxe Music Platform JavaScript

import murfService from './murfService.js';

class ReluxePlatform {
    constructor() {
        this.currentUser = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.volume = 0.7;
        this.progress = 0;
        this.spectatorCount = 0;
        this.isSpectator = false;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing ReluxePlatform...');
        this.setupEventListeners();
        this.initializeAnimations();
        this.loadUserData();
        this.setupMusicPlayer();
        this.setupNavigation();
        this.initializeMurfAI();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        this.setupNavigation();
        this.setupAuthButtons();
        this.setupMusicControls();
        this.setupCardNavigation();
    }

    // Navigation Setup
    setupNavigation() {
        console.log('Setting up navigation...');
        const navButtons = document.querySelectorAll('.nav-btn');
        const heroContainer = document.querySelector('.hero-container');
        const contentSections = document.querySelectorAll('.content-section');
        const learnMoreBtn = document.getElementById('learnMoreBtn');

        // Navigation function
        const navigateToSection = (section) => {
            console.log('Navigating to section:', section);
            
            // Remove active class from all nav buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to corresponding nav button
            const correspondingBtn = document.querySelector(`.nav-btn[data-section="${section}"]`);
            if (correspondingBtn) {
                correspondingBtn.classList.add('active');
            }

            // Handle section visibility
            if (section === 'home') {
                heroContainer.style.display = 'flex';
                contentSections.forEach(s => {
                    s.style.display = 'none';
                    s.classList.add('hidden');
                });
            } else {
                heroContainer.style.display = 'none';
                contentSections.forEach(s => {
                    if (s.id === section) {
                        console.log(`Showing section: ${section}`);
                        s.style.display = 'flex';
                        s.classList.remove('hidden');
                        // Initialize battle arena if this is the battle section
                        if (section === 'battle-arena') {
                            console.log('Initializing battle arena...');
                            // Small delay to ensure DOM is ready
                            setTimeout(() => {
                                this.initializeBattleArena();
                                this.initializeBattle();
                                this.initializeVotingSystem();
                                this.initializeReactions();
                                this.initializeSpectatorMode();
                                this.initializeVerseInput();
                            }, 100);
                        }
                    } else {
                        s.style.display = 'none';
                        s.classList.add('hidden');
                    }
                });
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Handle navigation buttons
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.dataset.section;
                console.log('Nav button clicked:', section);
                navigateToSection(section);
            });
        });

        // Handle Learn More button
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = learnMoreBtn.dataset.section;
                navigateToSection(section);
            });
        }

        // Handle Join Button in About Section
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-btn')) {
                e.preventDefault();
                navigateToSection('battle-arena');
            }
        });

        // Handle card navigation items
        const cardNavItems = document.querySelectorAll('.card-nav .nav-btn');
        cardNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const parentNav = item.closest('.card-nav');
                if (parentNav) {
                    parentNav.querySelectorAll('.nav-item').forEach(navItem => {
                        navItem.classList.remove('active');
                    });
                    item.classList.add('active');
                }
            });
        });

        // Audio controls for navigation
        const musicPlayer = document.getElementById('musicPlayer');
        if (musicPlayer) {
            learnMoreBtn.addEventListener('click', () => {
                musicPlayer.pause(); // Stop any playing music when navigating
            });
        }
    }

    // Auth Buttons Setup
    setupAuthButtons() {
        const authButtons = document.querySelectorAll('.auth-btn, .login-btn, .signup-btn');
        
        authButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Add visual feedback
                button.style.transform = 'translateY(-2px) scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
                
                // Show notification
                this.showNotification('Functionality coming soon!');
            });
        });
    }

    // Card Navigation Setup
    setupCardNavigation() {
        const cardNavItems = document.querySelectorAll('[data-category="support"] .card-nav .nav-item');
        
        cardNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                cardNavItems.forEach(navItem => navItem.classList.remove('active'));
                // Add active class to clicked item
                e.target.classList.add('active');
            });
        });
    }

    // Show hero section (Home page)
    showHeroSection() {
        const heroContainer = document.querySelector('.hero-container');
        const contentSections = document.querySelectorAll('.content-section');
        
        if (heroContainer) {
            heroContainer.style.display = 'flex';
        }
        
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
            section.style.display = 'none';
        });
    }

    // Show content section (About, Tracks, etc.)
    showContentSection(sectionName) {
        const heroContainer = document.querySelector('.hero-container');
        const contentSections = document.querySelectorAll('.content-section');
        
        // Hide hero section
        if (heroContainer) {
            heroContainer.style.display = 'none';
        }
        
        // Hide all content sections first
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
            section.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName.replace(' ', '-')) || 
                            document.querySelector(`[data-section="${sectionName}"]`) ||
                            document.querySelector(`.${sectionName}-section`);
        
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        } else {
            // Create section if it doesn't exist
            this.createContentSection(sectionName);
        }
    }

    // Create content section dynamically
    createContentSection(sectionName) {
        const mainContent = document.querySelector('.main-content') || document.body;
        
        const section = document.createElement('div');
        section.id = sectionName.replace(' ', '-');
        section.className = 'content-section active';
        section.setAttribute('data-section', sectionName);
        
        // Add content based on section type
        const content = this.getContentForSection(sectionName);
        section.innerHTML = content;
        
        // Add styles
        section.style.cssText = `
            display: block;
            min-height: 100vh;
            padding: 2rem;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        `;
        
        mainContent.appendChild(section);
        
        // Animate in
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);
    }

    // Get content for different sections
    getContentForSection(sectionName) {
        switch(sectionName.toLowerCase()) {
            case 'about':
                return `
                    <div class="section-content">
                        <h1 style="font-size: 3rem; margin-bottom: 2rem; color: #ff6b35;">About Reluxe</h1>
                        <div style="max-width: 800px; line-height: 1.8; font-size: 1.1rem;">
                            <p style="margin-bottom: 2rem;">
                                Reluxe is revolutionizing the music industry by creating a platform where artists can truly connect with their audience and earn what they deserve.
                            </p>
                            <p style="margin-bottom: 2rem;">
                                Our mission is to empower independent artists by providing them with the tools, exposure, and financial opportunities they need to thrive in today's digital landscape.
                            </p>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem;">
                                <div style="padding: 1.5rem; background: rgba(255, 107, 53, 0.1); border-radius: 15px; border: 1px solid rgba(255, 107, 53, 0.3);">
                                    <h3 style="color: #ff6b35; margin-bottom: 1rem;">Our Vision</h3>
                                    <p>To create a world where every artist has the opportunity to be heard and fairly compensated for their creativity.</p>
                                </div>
                                <div style="padding: 1.5rem; background: rgba(247, 147, 30, 0.1); border-radius: 15px; border: 1px solid rgba(247, 147, 30, 0.3);">
                                    <h3 style="color: #f7931e; margin-bottom: 1rem;">Our Mission</h3>
                                    <p>Empowering artists through technology, community, and innovative revenue streams.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'tracks':
                return `
                    <div class="section-content">
                        <h1 style="font-size: 3rem; margin-bottom: 2rem; color: #ff6b35;">Featured Tracks</h1>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                            ${this.generateTrackCards()}
                        </div>
                    </div>
                `;
            
            case 'how-it-works':
                return `
                    <div class="section-content">
                        <h1 style="font-size: 3rem; margin-bottom: 2rem; color: #ff6b35;">How It Works</h1>
                        <div style="max-width: 1000px;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-top: 3rem;">
                                <div style="text-align: center; padding: 2rem;">
                                    <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #ff6b35, #f7931e); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">1</div>
                                    <h3 style="color: #ff6b35; margin-bottom: 1rem;">Upload Your Music</h3>
                                    <p>Share your tracks with our community and get discovered by music lovers worldwide.</p>
                                </div>
                                <div style="text-align: center; padding: 2rem;">
                                    <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #ff6b35, #f7931e); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">2</div>
                                    <h3 style="color: #ff6b35; margin-bottom: 1rem;">Build Your Audience</h3>
                                    <p>Connect with fans, collaborate with other artists, and grow your following organically.</p>
                                </div>
                                <div style="text-align: center; padding: 2rem;">
                                    <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #ff6b35, #f7931e); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">3</div>
                                    <h3 style="color: #ff6b35; margin-bottom: 1rem;">Earn Revenue</h3>
                                    <p>Get paid fairly for your streams, downloads, and live performances through our platform.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            
            default:
                return `
                    <div class="section-content">
                        <h1 style="font-size: 3rem; margin-bottom: 2rem; color: #ff6b35;">${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h1>
                        <p style="font-size: 1.2rem; opacity: 0.8;">This section is coming soon! We're working hard to bring you amazing content.</p>
                    </div>
                `;
        }
    }

    // Generate track cards for tracks section
    generateTrackCards() {
        const tracks = [
            { title: "Midnight Vibes", artist: "Luna Beat", genre: "Electronic", plays: "1.2M" },
            { title: "City Lights", artist: "Urban Flow", genre: "Hip Hop", plays: "890K" },
            { title: "Ocean Dreams", artist: "Wave Rider", genre: "Ambient", plays: "2.1M" },
            { title: "Neon Rush", artist: "Cyber Pulse", genre: "Synthwave", plays: "745K" },
            { title: "Forest Whispers", artist: "Nature Sound", genre: "Acoustic", plays: "1.5M" },
            { title: "Bass Drop", artist: "Heavy Beats", genre: "Dubstep", plays: "980K" }
        ];

        return tracks.map(track => `
            <div class="track-card" style="
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 1.5rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
                cursor: pointer;
            " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(255, 107, 53, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <div style="width: 100%; height: 200px; background: linear-gradient(45deg, #ff6b35, #f7931e); border-radius: 10px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">♪</div>
                <h3 style="color: white; margin-bottom: 0.5rem;">${track.title}</h3>
                <p style="color: #ff6b35; margin-bottom: 0.5rem;">${track.artist}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">${track.genre}</span>
                    <span style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">${track.plays} plays</span>
                </div>
            </div>
        `).join('');
    }

    // Music Player Controls
    setupMusicControls() {
        // Play/Pause buttons
        const playButtons = document.querySelectorAll('.play-btn, .pause-btn');
        playButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.togglePlayback();
            });
        });

        // Volume control
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        // Progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const clickPosition = e.offsetX / progressBar.offsetWidth;
                this.seekTo(clickPosition);
            });
        }
    }

    // Music Player Functions
    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        
        const playButtons = document.querySelectorAll('.play-btn');
        const pauseButtons = document.querySelectorAll('.pause-btn');
        
        if (this.isPlaying) {
            playButtons.forEach(btn => btn.style.display = 'none');
            pauseButtons.forEach(btn => btn.style.display = 'block');
            this.startProgressAnimation();
        } else {
            playButtons.forEach(btn => btn.style.display = 'block');
            pauseButtons.forEach(btn => btn.style.display = 'none');
            this.stopProgressAnimation();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        console.log(`Volume set to: ${this.volume * 100}%`);
    }

    seekTo(position) {
        this.progress = Math.max(0, Math.min(1, position));
        this.updateProgressBar();
        console.log(`Seeking to: ${this.progress * 100}%`);
    }

    startProgressAnimation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.progressInterval = setInterval(() => {
            this.progress += 0.01;
            if (this.progress >= 1) {
                this.progress = 0;
                this.togglePlayback(); // Auto-stop at end
            }
            this.updateProgressBar();
        }, 1000);
    }

    stopProgressAnimation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    updateProgressBar() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.style.width = `${this.progress * 100}%`;
        });
    }

    // Animation Initialization
    initializeAnimations() {
        // Stagger animation for cards
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Hero section animation
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, index * 300 + 500);
        });
    }

    // Data Management
    loadUserData() {
        // Simulate loading user data
        const userData = {
            name: 'Artist Name',
            email: 'artist@example.com',
            tracks: 12,
            followers: 1250,
            earnings: 450.75
        };
        
        this.currentUser = userData;
        this.updateUserInterface();
    }

    updateUserInterface() {
        if (!this.currentUser) return;
        
        // Update user-specific elements
        const userElements = document.querySelectorAll('[data-user-info]');
        userElements.forEach(element => {
            const infoType = element.getAttribute('data-user-info');
            if (this.currentUser[infoType]) {
                element.textContent = this.currentUser[infoType];
            }
        });
    }

    // Utility Functions
    handleResize() {
        // Handle responsive behavior
        const width = window.innerWidth;
        
        if (width < 768) {
            this.enableMobileMode();
        } else {
            this.disableMobileMode();
        }
    }

    enableMobileMode() {
        document.body.classList.add('mobile-mode');
        // Additional mobile-specific functionality
    }

    disableMobileMode() {
        document.body.classList.remove('mobile-mode');
        // Remove mobile-specific functionality
    }

    // Music Library Functions
    loadMusicLibrary() {
        const tracks = [
            { id: 1, title: "Beat Drop", artist: "Producer X", duration: "3:24" },
            { id: 2, title: "Synth Wave", artist: "Electronic Artist", duration: "4:12" },
            { id: 3, title: "Bass Line", artist: "DJ Mix", duration: "2:58" }
        ];
        
        return tracks;
    }

    createTrackElement(track) {
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.innerHTML = `
            <div class="track-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            <div class="track-duration">${track.duration}</div>
            <button class="track-play-btn" data-track-id="${track.id}">▶</button>
        `;
        
        return trackElement;
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    performSearch(query) {
        console.log(`Searching for: ${query}`);
        // Implement search logic here
    }

    // Notification System (simplified version from your working code)
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 30px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 10000;
            font-size: 14px;
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Voting system properties
    voteData = {
        leftCount: 0,
        rightCount: 0,
        totalVotes: 0,
        hasVoted: false
    };

    // Initialize voting system
    initializeVotingSystem() {
        const slider = document.querySelector('.vote-slider');
        const percentage = document.querySelector('.vote-percentage');
        const indicatorFill = document.querySelector('.vote-indicator-fill');
        const leftCount = document.querySelector('.vote-count-left');
        const rightCount = document.querySelector('.vote-count-right');
        const leftBtn = document.querySelector('.vote-btn-left');
        const rightBtn = document.querySelector('.vote-btn-right');

        if (slider) {
            // Update percentage display and indicator on slider change
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                percentage.textContent = `${value}%`;
                percentage.style.left = `${value}%`;
                indicatorFill.style.width = `${value}%`;
            });
        }

        // Handle vote buttons
        if (leftBtn && rightBtn) {
            leftBtn.addEventListener('click', () => this.handleVote('left'));
            rightBtn.addEventListener('click', () => this.handleVote('right'));
        }
    }

    // Handle voting
    handleVote(side) {
        if (this.isSpectator) {
            this.showNotification('Voting is disabled in spectator mode');
            return;
        }

        if (this.voteData.hasVoted) {
            this.showNotification('You have already voted!');
            return;
        }

        // Update vote counts
        if (side === 'left') {
            this.voteData.leftCount++;
        } else {
            this.voteData.rightCount++;
        }
        this.voteData.totalVotes++;
        this.voteData.hasVoted = true;

        // Calculate new percentages
        const leftPercentage = Math.round((this.voteData.leftCount / this.voteData.totalVotes) * 100);
        const rightPercentage = 100 - leftPercentage;

        // Update UI
        const slider = document.querySelector('.vote-slider');
        const percentage = document.querySelector('.vote-percentage');
        const indicatorFill = document.querySelector('.vote-indicator-fill');
        const leftCount = document.querySelector('.vote-count-left');
        const rightCount = document.querySelector('.vote-count-right');

        if (slider) slider.value = leftPercentage;
        if (percentage) {
            percentage.textContent = `${leftPercentage}%`;
            percentage.style.left = `${leftPercentage}%`;
        }
        if (indicatorFill) indicatorFill.style.width = `${leftPercentage}%`;
        if (leftCount) leftCount.textContent = this.voteData.leftCount;
        if (rightCount) rightCount.textContent = this.voteData.rightCount;

        // Disable vote buttons
        const buttons = document.querySelectorAll('.vote-btn-left, .vote-btn-right');
        buttons.forEach(btn => {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });

        // Show vote confirmation
        this.showNotification(`Vote recorded for ${side === 'left' ? 'DHANJI' : 'KR$NA'}!`);

        // Add voting animation
        const votedBtn = side === 'left' ? 
            document.querySelector('.vote-btn-left') : 
            document.querySelector('.vote-btn-right');
        
        if (votedBtn) {
            votedBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                votedBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Reaction system properties
    reactionCounts = {
        '👍': 0,
        '🔥': 0,
        '😂': 0,
        '🤯': 0
    };

    // Initialize reaction system
    initializeReactions() {
        const reactionButtons = document.querySelectorAll('.reaction-btn');
        const floatingContainer = document.querySelector('.floating-reactions');

        reactionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const emoji = button.dataset.emoji;
                this.addReaction(emoji, button);
            });
        });
    }

    // Add a reaction
    addReaction(emoji, button) {
        // Update count
        this.reactionCounts[emoji]++;
        const countElement = button.querySelector('.reaction-count');
        if (countElement) {
            countElement.textContent = this.reactionCounts[emoji];
            button.classList.add('has-reactions');
        }

        // Create floating emoji
        const floatingEmoji = document.createElement('div');
        floatingEmoji.className = 'floating-emoji';
        floatingEmoji.textContent = emoji;

        // Random horizontal position
        const randomX = Math.random() * (window.innerWidth - 50);
        floatingEmoji.style.left = `${randomX}px`;

        // Add some random rotation and movement
        const randomRotation = -15 + Math.random() * 30;
        const randomOffset = -20 + Math.random() * 40;
        floatingEmoji.style.transform = `rotate(${randomRotation}deg) translateX(${randomOffset}px)`;

        // Add to container
        const container = document.querySelector('.floating-reactions');
        if (container) {
            container.appendChild(floatingEmoji);

            // Remove element after animation
            setTimeout(() => {
                floatingEmoji.remove();
            }, 3000);
        }

        // Add button feedback
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }

    // Update initializeBattleArena to include spectator mode
    initializeBattleArena() {
        console.log('Initializing battle arena...');
        this.setupRapLibrary();
        const rapperSides = document.querySelectorAll('.rapper-side');
        const versusSection = document.querySelector('.versus-section');
        const startBattleBtn = document.querySelector('.start-battle-btn');
        
        console.log('Found elements:', {
            rapperSides: rapperSides.length,
            versusSection: !!versusSection,
            startBattleBtn: !!startBattleBtn
        });
        
        // Reset animations
        rapperSides.forEach(side => side.classList.remove('animate-in'));
        if (versusSection) versusSection.classList.remove('animate-in');
        
        // Trigger animations with slight delays
        setTimeout(() => {
            rapperSides[0]?.classList.add('animate-in');
        }, 300);
        
        setTimeout(() => {
            if (versusSection) versusSection.classList.add('animate-in');
        }, 600);
        
        setTimeout(() => {
            rapperSides[1]?.classList.add('animate-in');
        }, 900);

        // Initialize battle functionality
        this.initializeBattle();
        
        // Initialize voting system
        this.initializeVotingSystem();

        // Initialize reaction system
        this.initializeReactions();

        // Initialize spectator mode
        this.initializeSpectatorMode();

        // Initialize verse input system
        this.initializeVerseInput();

        // Add debug click handler to battle button
        if (startBattleBtn) {
            startBattleBtn.addEventListener('mousedown', (e) => {
                console.log('Battle button mousedown:', e);
            });
        }
    }

    setupRapLibrary() {
        const rapCategories = document.querySelector('.rap-categories');
        if (!rapCategories) return;

        // Event delegation for category buttons
        rapCategories.addEventListener('click', (e) => {
            const categoryBtn = e.target.closest('.category-btn');
            if (!categoryBtn) return;

            // Remove active class from all buttons
            const allCategoryBtns = rapCategories.querySelectorAll('.category-btn');
            allCategoryBtns.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            categoryBtn.classList.add('active');

            // Get the category from data attribute
            const category = categoryBtn.dataset.category;
            console.log(`Selected category: ${category}`);

            // Here you can add logic to load rap verses based on the selected category
            this.loadRapVersesByCategory(category);
        });

        // Set initial active state to first button
        const firstCategoryBtn = rapCategories.querySelector('.category-btn');
        if (firstCategoryBtn) {
            firstCategoryBtn.classList.add('active');
            const initialCategory = firstCategoryBtn.dataset.category;
            this.loadRapVersesByCategory(initialCategory);
        }
    }

    loadRapVersesByCategory(category) {
        // This method will be used to load rap verses based on the selected category
        // You can implement the verse loading logic here
        console.log(`Loading verses for category: ${category}`);
    }

    // Sample rap verses
    rapVerses = {
        rapper1: [
            "I step in the ring, with flows that sting",
            "Your rhymes are weak, like a broken wing",
            "I'm the king of this game, watch me soar",
            "While you're stuck on the ground, begging for more"
        ],
        rapper2: [
            "You talk about flying, but you're afraid of heights",
            "Your metaphors are weak, like dim street lights",
            "I'm the real MVP, the one they admire",
            "Your career's so cold, it needs a campfire"
        ]
    };

    // Typing animation method
    async typeText(element, text) {
        element.classList.add('typing');
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, 50)); // Adjust typing speed here
        }
        element.classList.remove('typing');
    }

    // Display rap verse method
    async displayRapVerse(container, verses, isActiveTurn = false) {
        container.innerHTML = ''; // Clear previous verses
        if (isActiveTurn) {
            container.classList.add('active-turn');
        }

        for (let verse of verses) {
            const lineElement = document.createElement('div');
            lineElement.className = 'rap-line';
            container.appendChild(lineElement);
            
            // Trigger particle effect for each line
            document.dispatchEvent(new Event('rapLine'));
            
            await this.typeText(lineElement, verse);
            lineElement.classList.add('visible');
            await new Promise(resolve => setTimeout(resolve, 500)); // Pause between lines
        }

        if (isActiveTurn) {
            container.classList.remove('active-turn');
        }
    }

    // Battle turn handler
    async handleBattleTurn(rapperIndex) {
        if (this.isSpectator) {
            this.showSpectatorMessage('Watching battle in spectator mode...');
        }
        
        const containers = document.querySelectorAll('.rap-verse-container');
        const verses = rapperIndex === 0 ? this.rapVerses.rapper1 : this.rapVerses.rapper2;
        
        // Clear both containers and remove active states
        containers.forEach(container => {
            container.innerHTML = '';
            container.classList.remove('active-turn');
        });

        // Add entrance animation to current rapper's container
        containers[rapperIndex].style.transform = 'translateX(20px)';
        containers[rapperIndex].style.opacity = '0';
        
        // Trigger reflow
        void containers[rapperIndex].offsetWidth;
        
        // Animate in
        containers[rapperIndex].style.transition = 'all 0.5s ease';
        containers[rapperIndex].style.transform = 'translateX(0)';
        containers[rapperIndex].style.opacity = '1';

        // Display verses with typing animation
        await this.displayRapVerse(containers[rapperIndex], verses, true);

        // Add exit animation
        containers[rapperIndex].style.transition = 'all 0.5s ease';
        containers[rapperIndex].style.transform = 'translateX(-20px)';
        containers[rapperIndex].style.opacity = '0.7';
    }

    // Initialize battle
    initializeBattle() {
        console.log('Initializing Battle...');
        const startBattleBtn = document.querySelector('.start-battle-btn');
        const battleTimer = document.querySelector('.battle-timer');
        const progressFill = document.querySelector('.battle-progress .battle-progress-fill');
        const turnIndicator = document.querySelector('.rapper-turn-indicator .turn-text');
        const BATTLE_DURATION = 120; // 2 minutes in seconds
        let timeLeft = BATTLE_DURATION;
        let battleInterval;

        // Debug element locations
        console.log('Element locations:', {
            startBattleBtn: startBattleBtn?.parentElement?.className,
            battleTimer: battleTimer?.parentElement?.className,
            progressFill: progressFill?.parentElement?.className,
            turnIndicator: turnIndicator?.parentElement?.className
        });

        // Debug element contents
        console.log('Element contents:', {
            startBattleBtn: startBattleBtn?.innerHTML,
            battleTimer: battleTimer?.innerHTML,
            progressFill: progressFill?.innerHTML,
            turnIndicator: turnIndicator?.innerHTML
        });

        if (!startBattleBtn || !battleTimer || !progressFill || !turnIndicator) {
            console.error('Missing required elements for battle initialization');
            this.showNotification('Battle arena not properly initialized. Please refresh the page.');
            return;
        }

        // Remove any existing click listeners
        const newStartBattleBtn = startBattleBtn.cloneNode(true);
        startBattleBtn.parentNode.replaceChild(newStartBattleBtn, startBattleBtn);

        // Add click listener to the new button
        const handleBattleStart = async (e) => {
            console.log('Battle button clicked!', e);

            newStartBattleBtn.disabled = true;
            newStartBattleBtn.classList.add('disabled');
            newStartBattleBtn.textContent = 'Battle In Progress...';

            // Reset timer and progress
            timeLeft = BATTLE_DURATION;
            progressFill.style.width = '0%';

            // Start the timer
            if (battleInterval) {
                clearInterval(battleInterval);
            }

            battleInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                battleTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                // Update progress bar
                const progress = ((BATTLE_DURATION - timeLeft) / BATTLE_DURATION) * 100;
                progressFill.style.width = `${progress}%`;

                // Add urgent class when time is running low
                if (timeLeft <= 30) {
                    battleTimer.classList.add('urgent');
                }

                // End battle when time runs out
                if (timeLeft <= 0) {
                    clearInterval(battleInterval);
                    this.endBattle();
                }
            }, 1000);

            try {
                // First rapper's turn
                turnIndicator.textContent = "DHANJI's Turn";
                turnIndicator.parentElement.classList.add('active');
                await this.handleBattleTurn(0);
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Second rapper's turn
                turnIndicator.textContent = "KR$NA's Turn";
                await this.handleBattleTurn(1);

                // End battle
                this.endBattle();
            } catch (error) {
                console.error('Error during battle:', error);
                this.showNotification('An error occurred during the battle. Please try again.');
                this.endBattle();
            }
        };

        // Add both click and mousedown event listeners
        newStartBattleBtn.addEventListener('click', handleBattleStart);
        newStartBattleBtn.addEventListener('mousedown', (e) => {
            console.log('Button mousedown event:', e);
        });

        // Debug click handler
        newStartBattleBtn.onclick = (e) => {
            console.log('Direct onclick handler triggered', e);
        };
    }

    // End battle method
    endBattle() {
        const startBattleBtn = document.querySelector('.start-battle-btn');
        const battleTimer = document.querySelector('.battle-timer');
        const turnIndicator = document.querySelector('.rapper-turn-indicator');

        // Reset button
        startBattleBtn.disabled = false;
        startBattleBtn.classList.remove('disabled');
        startBattleBtn.textContent = 'Begin Battle';

        // Reset timer
        battleTimer.classList.remove('urgent');
        battleTimer.textContent = '02:00';

        // Hide turn indicator
        turnIndicator.classList.remove('active');

        // Enable voting
        const voteButtons = document.querySelectorAll('.vote-btn-left, .vote-btn-right');
        voteButtons.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });

        // Show voting prompt
        this.showNotification('Time to vote for your favorite!');
    }

    // Add after initializeBattle method
    initializeSpectatorMode() {
        const spectatorToggle = document.getElementById('spectatorMode');
        const battleStage = document.querySelector('.battle-stage');
        const spectatorCount = document.querySelector('.spectator-count .count');
        
        if (spectatorToggle) {
            spectatorToggle.addEventListener('change', (e) => {
                this.isSpectator = e.target.checked;
                
                if (this.isSpectator) {
                    battleStage.classList.add('spectator-mode');
                    this.spectatorCount++;
                    this.showSpectatorMessage('Entered Spectator Mode - Watch and enjoy the battle!');
                } else {
                    battleStage.classList.remove('spectator-mode');
                    this.spectatorCount = Math.max(0, this.spectatorCount - 1);
                    this.showSpectatorMessage('Exited Spectator Mode - You can now participate!');
                }
                
                // Update spectator count
                spectatorCount.textContent = this.spectatorCount;
            });
        }
    }

    showSpectatorMessage(message) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.spectator-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = 'spectator-message';
        messageElement.textContent = message;
        document.querySelector('.battle-stage').appendChild(messageElement);

        // Show message
        setTimeout(() => messageElement.classList.add('visible'), 100);

        // Remove message after delay
        setTimeout(() => {
            messageElement.classList.remove('visible');
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }

    // Handle convert to audio button clicks
    async handleVoiceConversion(button, input, voiceSelect) {
        if (!input.value.trim()) {
            this.showNotification('Please write some verses first!');
            return;
        }

        try {
            // Show loading state
            button.disabled = true;
            button.textContent = 'Converting...';
            button.classList.add('loading');

            const success = await murfService.convertToSpeech(
                input.value.trim(),
                voiceSelect.value
            );

            if (success) {
                this.showNotification('Rap converted successfully! 🎵');
                button.classList.add('success');
                setTimeout(() => button.classList.remove('success'), 2000);
            }
        } catch (error) {
            console.error('Voice conversion error:', error);
            this.showNotification(error.message || 'Failed to convert rap to speech. Please try again.');
            button.classList.add('error');
            setTimeout(() => button.classList.remove('error'), 2000);
        } finally {
            // Reset button state
            button.disabled = false;
            button.textContent = 'Convert to Audio 🎤';
            button.classList.remove('loading');
        }
    }

    // Initialize verse input system
    initializeVerseInput() {
        const verseInputs = document.querySelectorAll('.verse-input');
        const clearButtons = document.querySelectorAll('.clear-btn');
        const previewButtons = document.querySelectorAll('.preview-btn');
        const suggestionLines = document.querySelectorAll('.suggestion-line');
        
        // Initialize drag and drop
        suggestionLines.forEach(line => {
            line.setAttribute('draggable', 'true');
            
            line.addEventListener('dragstart', (e) => {
                line.classList.add('dragging');
                
                // Create custom ghost image
                const ghost = document.createElement('div');
                ghost.className = 'drag-ghost';
                ghost.textContent = line.textContent;
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 10, 10);
                
                // Clean up ghost after drag
                setTimeout(() => {
                    document.body.removeChild(ghost);
                }, 0);
                
                e.dataTransfer.setData('text/plain', line.getAttribute('data-line'));
            });
            
            line.addEventListener('dragend', () => {
                line.classList.remove('dragging');
                document.querySelectorAll('.drag-over').forEach(el => 
                    el.classList.remove('drag-over')
                );
            });
        });
        
        // Handle drop zones (verse inputs)
        verseInputs.forEach(input => {
            const container = input.closest('.verse-input-container');
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                input.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
                
                container.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            // Visual feedback for drag over
            ['dragenter', 'dragover'].forEach(eventName => {
                input.addEventListener(eventName, () => {
                    container.classList.add('drag-over');
                    input.classList.add('drag-over');
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                input.addEventListener(eventName, () => {
                    container.classList.remove('drag-over');
                    input.classList.remove('drag-over');
                });
            });
            
            // Handle the drop
            input.addEventListener('drop', (e) => {
                const verse = e.dataTransfer.getData('text/plain');
                
                // If there's existing text, add a new line
                if (input.value) {
                    input.value += '\n' + verse;
                } else {
                    input.value = verse;
                }
                
                // Trigger input event for auto-resize
                input.dispatchEvent(new Event('input'));
                
                // Show success notification
                this.showNotification('Verse added! 🎤');
            });
        });
        
        // Keep existing functionality
        verseInputs.forEach((input, index) => {
            // Store initial placeholder
            const initialPlaceholder = input.placeholder;
            
            // Focus effects
            input.addEventListener('focus', () => {
                input.placeholder = '';
                // Highlight corresponding rapper side
                const rapperSide = input.closest('.rapper-side');
                if (rapperSide) {
                    rapperSide.style.opacity = '1';
                    const otherSide = rapperSide.classList.contains('left') ? 
                        document.querySelector('.rapper-side.right') : 
                        document.querySelector('.rapper-side.left');
                    if (otherSide) {
                        otherSide.style.opacity = '0.7';
                    }
                }
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.placeholder = initialPlaceholder;
                }
                // Reset opacity of rapper sides
                document.querySelectorAll('.rapper-side').forEach(side => {
                    side.style.opacity = '1';
                });
            });
            
            // Auto-resize
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = (input.scrollHeight) + 'px';
            });
        });
        
        // Clear button functionality
        clearButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const input = btn.closest('.verse-input-container').querySelector('.verse-input');
                input.value = '';
                input.style.height = 'auto';
            });
        });
        
        // Preview button functionality
        previewButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const input = btn.closest('.verse-input-container').querySelector('.verse-input');
                const verseContainer = btn.closest('.rapper-controls').querySelector('.rap-verse-container');
                
                if (input.value.trim()) {
                    // Split input into lines
                    const lines = input.value.trim().split('\n');
                    
                    // Clear existing content
                    verseContainer.innerHTML = '';
                    
                    // Display each line with animation
                    this.displayRapVerse(verseContainer, lines, true);
                } else {
                    this.showNotification('Please write some verses first!');
                }
            });
        });

        // Initialize suggestion categories
        const categories = document.querySelectorAll('.category-label');
        categories.forEach(category => {
            category.addEventListener('click', () => {
                const currentCategory = category.parentElement;
                const wasActive = currentCategory.classList.contains('active');
                
                // Reset all categories
                document.querySelectorAll('.suggestion-category').forEach(cat => {
                    cat.classList.remove('active');
                    const lines = cat.querySelectorAll('.suggestion-line');
                    lines.forEach(line => line.style.display = 'none');
                });
                
                if (!wasActive) {
                    // Activate clicked category
                    currentCategory.classList.add('active');
                    const lines = currentCategory.querySelectorAll('.suggestion-line');
                    lines.forEach(line => {
                        line.style.display = 'block';
                        line.style.animation = 'slideIn 0.3s ease forwards';
                    });
                } else {
                    // Show all suggestions
                    document.querySelectorAll('.suggestion-line').forEach(line => {
                        line.style.display = 'block';
                        line.style.animation = 'slideIn 0.3s ease forwards';
                    });
                }
            });
        });
    }

    // Initialize Murf AI integration
    async initializeMurfAI() {
        console.log('Murf AI will be accessed through the backend.');
    }

    setupMusicPlayer() {
        console.log('Music player setup skipped - feature coming soon');
        // Placeholder for future music player implementation
    }
}

// Initialize the platform when DOM is loaded
let platform;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing platform...');
    platform = new ReluxePlatform();
    platform.init();
});

// Additional utility functions
const utils = {
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    formatNumber: (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for module systems
export default ReluxePlatform;
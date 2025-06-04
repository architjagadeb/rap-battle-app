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
        
        // Initialize core functionality first
        this.initializeAnimations();
        this.loadUserData();
        this.setupMusicPlayer();
        
        // Initialize navigation last to ensure all sections are ready
        this.setupNavigation();
        
        // Initialize Murf AI
        this.initializeMurfAI();
        
        // Initialize comment system
        this.initializeCommentSystem();
        
        // Initialize How It Works page
        this.initializeHowItWorks();
        
        // Set up window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Initialize theme toggle
        this.initializeThemeToggle();
        
        // Initialize search functionality
        this.initializeSearch();

        // Initialize sidebar
        this.initializeSidebar();
        
        // Show initial section based on URL hash or default to home
        const initialSection = window.location.hash.slice(1) || 'home';
        const showSection = this.setupNavigation();
        showSection(initialSection);
    }

    initializeThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            const root = document.documentElement;
            let isDarkTheme = true;

            themeToggle.addEventListener('click', () => {
                isDarkTheme = !isDarkTheme;
                root.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
                themeToggle.textContent = isDarkTheme ? '🌓' : '☀️';
            });
        }
    }

    initializeSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const searchOverlay = document.querySelector('.search-overlay');
        const closeSearch = document.querySelector('.close-search');
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');

        if (searchBtn && searchOverlay && closeSearch && searchInput && searchResults) {
            searchBtn.addEventListener('click', () => {
                searchOverlay.classList.remove('hidden');
                searchInput.focus();
            });

            closeSearch.addEventListener('click', () => {
                searchOverlay.classList.add('hidden');
            });

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                if (query.length < 2) {
                    searchResults.innerHTML = '';
                    return;
                }
                // Add loading state
                searchResults.innerHTML = '<div class="loading"></div>';
                // Simulate search (replace with actual search logic)
                setTimeout(() => {
                    searchResults.innerHTML = `
                        <div class="search-result">
                            <h4>Search results for: ${query}</h4>
                            <p>Feature coming soon...</p>
                        </div>
                    `;
                }, 500);
            });
        }
    }

    setupNavigation() {
        console.log('Setting up navigation...');
        
        // Get navigation elements
        const navButtons = document.querySelectorAll('.nav-btn');
        const heroContainer = document.querySelector('.hero-container');
        const contentSections = document.querySelectorAll('.content-section');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        
        // Function to show a section
        const showSection = (sectionId) => {
            console.log('Showing section:', sectionId);
            
            // Update nav buttons
            navButtons.forEach(btn => {
                if (btn.dataset.section === sectionId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Show/hide sections
            if (sectionId === 'home') {
                if (heroContainer) {
                heroContainer.style.display = 'flex';
                }
                contentSections.forEach(section => {
                    section.style.display = 'none';
                    section.classList.add('hidden');
                });
            } else {
                if (heroContainer) {
                heroContainer.style.display = 'none';
                }
                contentSections.forEach(section => {
                    if (section.id === sectionId) {
                        section.style.display = 'flex';
                        section.classList.remove('hidden');
                        
                        // Initialize battle arena if needed
                        if (sectionId === 'battle-arena') {
                            this.initializeBattleArena();
                            this.initializeBattle();
                            this.initializeVotingSystem();
                            this.initializeReactions();
                            this.initializeSpectatorMode();
                            this.initializeVerseInput();
                        }
                    } else {
                        section.style.display = 'none';
                        section.classList.add('hidden');
                    }
                });
            }
        };
        
        // Add click handlers
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.dataset.section;
                showSection(section);
            });
        });
        
        // Handle Learn More button
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showSection('about');
            });
        }
        
        // Handle Join button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-btn')) {
                e.preventDefault();
                showSection('battle-arena');
            }
        });
        
        // Return the showSection function so it can be used elsewhere
        return showSection;
    }

    // Initialize Spectator Mode
    initializeSpectatorMode() {
        const spectatorToggle = document.querySelector('.spectator-toggle');
        
        if (spectatorToggle) {
            spectatorToggle.addEventListener('click', () => {
                this.isSpectator = !this.isSpectator;
                spectatorToggle.classList.toggle('active', this.isSpectator);
                
                // Get all interactive elements
                const verseInputs = document.querySelectorAll('.verse-input');
                const suggestionLines = document.querySelectorAll('.suggestion-line');
                const clearButtons = document.querySelectorAll('.clear-btn');
                const previewButtons = document.querySelectorAll('.preview-btn');
                const convertButtons = document.querySelectorAll('.convert-btn');
                const voiceSelects = document.querySelectorAll('.voice-select');
                const avatarOverlays = document.querySelectorAll('.avatar-overlay');
                const categoryButtons = document.querySelectorAll('.category-btn');
                
                if (this.isSpectator) {
                    // Disable battle interaction elements
                    verseInputs.forEach(input => {
                        input.disabled = true;
                        input.style.opacity = '0.5';
                        input.style.cursor = 'not-allowed';
                    });
                    
                    suggestionLines.forEach(line => {
                        line.setAttribute('draggable', 'false');
                        line.style.cursor = 'not-allowed';
                        line.style.opacity = '0.5';
                    });
                    
                    clearButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.style.opacity = '0.5';
                        btn.style.cursor = 'not-allowed';
                    });
                    
                    previewButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.style.opacity = '0.5';
                        btn.style.cursor = 'not-allowed';
                    });
                    
                    convertButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.style.opacity = '0.5';
                        btn.style.cursor = 'not-allowed';
                    });
                    
                    voiceSelects.forEach(select => {
                        select.disabled = true;
                        select.style.opacity = '0.5';
                        select.style.cursor = 'not-allowed';
                    });
                    
                    avatarOverlays.forEach(overlay => {
                        overlay.style.display = 'none';
                    });
                    
                    categoryButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.style.opacity = '0.5';
                        btn.style.cursor = 'not-allowed';
                    });
                    
                    this.showNotification('Spectator mode enabled - Vote and comment only 👀');
                } else {
                    // Re-enable all interactive elements
                    verseInputs.forEach(input => {
                        input.disabled = false;
                        input.style.opacity = '1';
                        input.style.cursor = 'text';
                    });
                    
                    suggestionLines.forEach(line => {
                        line.setAttribute('draggable', 'true');
                        line.style.cursor = 'grab';
                        line.style.opacity = '1';
                    });
                    
                    clearButtons.forEach(btn => {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                    });
                    
                    previewButtons.forEach(btn => {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                    });
                    
                    convertButtons.forEach(btn => {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                    });
                    
                    voiceSelects.forEach(select => {
                        select.disabled = false;
                        select.style.opacity = '1';
                        select.style.cursor = 'pointer';
                    });
                    
                    avatarOverlays.forEach(overlay => {
                        overlay.style.display = 'flex';
                    });
                    
                    categoryButtons.forEach(btn => {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                    });
                    
                    this.showNotification('Spectator mode disabled - Full access mode 🎤');
                }
            });
        }
    }

    // Initialize Comment System
    initializeCommentSystem() {
        const commentsContainer = document.querySelector('.comments-container');
        const commentInput = document.querySelector('.comment-input');
        const postButton = document.querySelector('.post-comment-btn');

        if (!commentsContainer || !commentInput || !postButton) {
            console.error('Comment system elements not found');
            return;
        }

        // Create a container for the comment list if it doesn't exist
        let commentList = commentsContainer.querySelector('.comment-list');
        if (!commentList) {
            commentList = document.createElement('div');
            commentList.className = 'comment-list';
            commentsContainer.appendChild(commentList);
        }

        // Handle comment posting
        postButton.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            
            if (!commentText) {
                this.showNotification('Please write something first! 📝');
                return;
            }

            // Create comment element
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-box';
            
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">User</span>
                    <span class="comment-time">${timestamp}</span>
                </div>
                <div class="comment-text">${commentText}</div>
                <div class="comment-actions">
                    <button class="like-btn">👍 <span class="like-count">0</span></button>
                    <button class="reply-btn">↩️ Reply</button>
                </div>
            `;

            // Add like functionality
            const likeBtn = commentElement.querySelector('.like-btn');
            const likeCount = likeBtn.querySelector('.like-count');
            let likes = 0;
            
            likeBtn.addEventListener('click', () => {
                likes++;
                likeCount.textContent = likes;
                this.showNotification('Comment liked! 👍');
            });

            // Add to comment list
            commentList.insertBefore(commentElement, commentList.firstChild);
            
            // Clear input
            commentInput.value = '';
            
            // Show notification
            this.showNotification('Comment posted! 💬');

            // Add animation
            commentElement.style.opacity = '0';
            commentElement.style.transform = 'translateY(-10px)';
            requestAnimationFrame(() => {
                commentElement.style.transition = 'all 0.3s ease';
                commentElement.style.opacity = '1';
                commentElement.style.transform = 'translateY(0)';
            });
        });

        // Add some sample comments if empty
        if (commentList.children.length === 0) {
            const sampleComments = [
                { author: 'RapFan123', text: 'This battle is 🔥', time: '5m ago' },
                { author: 'BeatMaster', text: 'Both rappers are killing it!', time: '10m ago' }
            ];

            sampleComments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment-box';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-time">${comment.time}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-actions">
                        <button class="like-btn">👍 <span class="like-count">0</span></button>
                        <button class="reply-btn">↩️ Reply</button>
                    </div>
                `;
                commentList.appendChild(commentElement);
            });
        }

        // Add styles for comments
        const style = document.createElement('style');
        style.textContent = `
            .comment-box {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
                color: #fff;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .comment-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 0.9em;
            }
            .comment-author {
                font-weight: bold;
                color: #ff8c00;
            }
            .comment-time {
                color: rgba(255, 255, 255, 0.6);
            }
            .comment-text {
                margin-bottom: 8px;
                line-height: 1.4;
            }
            .comment-actions {
                display: flex;
                gap: 12px;
            }
            .comment-actions button {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .comment-actions button:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize Verse Input
    initializeVerseInput() {
        console.log('Initializing verse input system...');
        
        // Get all verse inputs
        const leftInput = document.getElementById('leftRapText');
        const rightInput = document.getElementById('rightRapText');
        
        // Get preview containers
        const leftPreviewContainer = document.querySelector('.rapper-side.left .rap-verse-container');
        const rightPreviewContainer = document.querySelector('.rapper-side.right .rap-verse-container');
        
        // Get all suggestion lines
        const suggestionLines = document.querySelectorAll('.suggestion-line');
        
        console.log('Found rap text inputs:', {
            left: !!leftInput,
            right: !!rightInput,
            leftPreview: !!leftPreviewContainer,
            rightPreview: !!rightPreviewContainer,
            suggestions: suggestionLines.length
        });
        
        // Initialize suggestion lines for drag and drop
        suggestionLines.forEach(line => {
            // Make the line draggable and add necessary attributes
            line.setAttribute('draggable', 'true');
            line.setAttribute('role', 'button');
            line.setAttribute('tabindex', '0');
            
            // Add visual feedback for dragging
            line.addEventListener('dragstart', (e) => {
                console.log('Drag started:', line.textContent.trim());
                line.classList.add('dragging');
                
                // Set the drag data
                const text = line.textContent.trim();
                e.dataTransfer.setData('text/plain', text);
                e.dataTransfer.effectAllowed = 'copy';
                
                // Create a custom drag image
                const dragImage = line.cloneNode(true);
                dragImage.style.cssText = `
                    position: absolute;
                    top: -1000px;
                    background: rgba(255, 140, 0, 0.2);
                    padding: 10px;
                    border-radius: 5px;
                    pointer-events: none;
                    width: ${line.offsetWidth}px;
                `;
                document.body.appendChild(dragImage);
                e.dataTransfer.setDragImage(dragImage, 0, 0);
                setTimeout(() => dragImage.remove(), 0);
                
                // Style all verse inputs to show they're valid drop targets
                [leftInput, rightInput].forEach(input => {
                    if (input && !this.isSpectator) {
                        input.classList.add('valid-drop-target');
                    }
                });
            });
            
            line.addEventListener('dragend', () => {
                line.classList.remove('dragging');
                
                // Remove drop target styling
                [leftInput, rightInput].forEach(input => {
                    if (input) {
                        input.classList.remove('valid-drop-target');
                        input.classList.remove('drag-over');
                    }
                });
            });
            
            // Add hover effects
            line.addEventListener('mouseenter', () => {
                if (!this.isSpectator) {
                    line.style.transform = 'scale(1.02)';
                    line.style.cursor = 'grab';
                    line.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }
            });
            
            line.addEventListener('mouseleave', () => {
                line.style.transform = 'scale(1)';
                line.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            // Add click-to-copy functionality
            line.addEventListener('click', () => {
                if (this.isSpectator) {
                    this.showNotification('Cannot add lines in spectator mode 👀');
                    return;
                }
                
                const text = line.textContent.trim();
                // Find the nearest verse input
                const nearestInput = line.closest('.rapper-side')?.querySelector('.verse-input') || leftInput;
                
                if (nearestInput) {
                    if (nearestInput.value && !nearestInput.value.endsWith('\n')) {
                        nearestInput.value += '\n';
                    }
                    nearestInput.value += text;
                    
                    // Update preview if visible
                    const side = nearestInput.id.includes('left') ? 'left' : 'right';
                    const previewContainer = side === 'left' ? leftPreviewContainer : rightPreviewContainer;
                    const versePreview = previewContainer?.querySelector('.verse-preview');
                    if (versePreview) {
                        versePreview.querySelector('pre').textContent = nearestInput.value;
                    }
                    
                    // Add visual feedback
                    line.style.backgroundColor = 'rgba(255, 140, 0, 0.3)';
                    setTimeout(() => {
                        line.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }, 300);
                    
                    this.showNotification('Line added! Click to edit ✍️');
                }
            });
        });
        
        // Set up clear buttons
        const clearButtons = document.querySelectorAll('.clear-btn');
        console.log('Found clear buttons:', clearButtons.length);
        
        clearButtons.forEach(button => {
            console.log('Setting up clear button:', button.id);
            button.addEventListener('click', () => {
                const side = button.id.includes('left') ? 'left' : 'right';
                const input = side === 'left' ? leftInput : rightInput;
                const previewContainer = side === 'left' ? leftPreviewContainer : rightPreviewContainer;
                
                console.log(`Clearing ${side} rap text:`, !!input);
                if (input) {
                    input.value = '';
                    if (previewContainer) {
                        previewContainer.innerHTML = '';
                    }
                    this.showNotification('Verse cleared! 🗑️');
                } else {
                    console.error(`Could not find ${side}RapText input`);
                }
            });
        });

        // Set up preview buttons
        const previewButtons = document.querySelectorAll('.preview-btn');
        console.log('Found preview buttons:', previewButtons.length);
        
        previewButtons.forEach(button => {
            console.log('Setting up preview button:', button.id);
            button.addEventListener('click', () => {
                const side = button.id.includes('left') ? 'left' : 'right';
                const input = side === 'left' ? leftInput : rightInput;
                const previewContainer = side === 'left' ? leftPreviewContainer : rightPreviewContainer;
                
                console.log(`Previewing ${side} rap text:`, !!input, input?.value);
                if (input && input.value.trim()) {
                    if (previewContainer) {
                        // Create verse preview element
                        previewContainer.innerHTML = `
                            <div class="verse-preview">
                                <pre>${input.value}</pre>
                            </div>
                        `;
                        
                        // Style the preview
                        const versePreview = previewContainer.querySelector('.verse-preview');
                        versePreview.style.cssText = `
                            background: rgba(0, 0, 0, 0.3);
                            border-radius: 10px;
                            padding: 15px;
                            margin: 10px 0;
                            width: 100%;
                        `;
        
                        // Style the pre tag
                        const pre = versePreview.querySelector('pre');
                        pre.style.cssText = `
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            margin: 0;
                            font-family: 'Courier New', monospace;
                            color: white;
                            font-size: 14px;
                            line-height: 1.5;
                        `;
                        
                        this.showNotification('Verse previewed! 👀');
                    } else {
                        console.error(`Could not find preview container for ${side} side`);
                    }
                } else {
                    if (previewContainer) {
                        previewContainer.innerHTML = '';
                    }
                    this.showNotification('No verse to preview! Write something first 📝');
                }
            });
        });
        
        // Set up drag and drop for verse inputs
        [leftInput, rightInput].forEach(input => {
            if (!input) return;
            
            // Add visual cues for drag targets
            input.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (!this.isSpectator) {
                    input.classList.add('drag-over');
                    input.style.backgroundColor = 'rgba(255, 140, 0, 0.1)';
                }
            });
            
            input.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!this.isSpectator) {
                    e.dataTransfer.dropEffect = 'copy';
                input.classList.add('drag-over');
                }
            });
            
            input.addEventListener('dragleave', (e) => {
                e.preventDefault();
                input.classList.remove('drag-over');
                input.style.backgroundColor = '';
            });
            
            input.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                input.classList.remove('drag-over');
                input.classList.remove('valid-drop-target');
                input.style.backgroundColor = '';
                
                if (this.isSpectator) {
                    this.showNotification('Adding verses is disabled in spectator mode');
                    return;
                }
                
                const verse = e.dataTransfer.getData('text/plain');
                console.log('Dropped verse:', verse);
                
                if (!verse) {
                    console.error('No verse data found in drop event');
                    return;
                }
                
                // Add newline if needed
                if (input.value && !input.value.endsWith('\n')) {
                    input.value += '\n';
                }
                input.value += verse;
                
                // Also update preview if it exists
                const side = input.id.includes('left') ? 'left' : 'right';
                const previewContainer = side === 'left' ? leftPreviewContainer : rightPreviewContainer;
                if (previewContainer) {
                    const versePreview = previewContainer.querySelector('.verse-preview');
                    if (versePreview) {
                        versePreview.querySelector('pre').textContent = input.value;
                    }
                }
                
                // Add drop animation
                const dropAnimation = document.createElement('div');
                dropAnimation.className = 'drop-animation';
                dropAnimation.style.cssText = `
                    position: absolute;
                    top: ${e.offsetY}px;
                    left: ${e.offsetX}px;
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 140, 0, 0.5);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: dropRipple 0.6s ease-out;
                `;
                input.appendChild(dropAnimation);
                setTimeout(() => dropAnimation.remove(), 600);
                
                // Focus the input after dropping
                input.focus();
                
                this.showNotification('Verse added! 🎤');
            });
        });
        
        // Add styles for drag and drop
        const style = document.createElement('style');
        style.textContent = `
            .suggestion-line {
                background: rgba(255, 255, 255, 0.1);
                padding: 12px;
                margin: 8px 0;
                border-radius: 8px;
                transition: all 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: grab;
                user-select: none;
                position: relative;
            }
            
            .suggestion-line:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            .suggestion-line.dragging {
                opacity: 0.5;
                cursor: grabbing;
                transform: scale(0.95);
            }
            
            .verse-input.valid-drop-target {
                border-color: rgba(255, 140, 0, 0.5);
                box-shadow: 0 0 10px rgba(255, 140, 0, 0.2);
            }
            
            .verse-input.drag-over {
                border-color: rgba(255, 140, 0, 1);
                background: rgba(255, 140, 0, 0.1);
                transform: scale(1.01);
            }
            
            .suggestion-category {
                margin-bottom: 20px;
            }
            
            .category-label {
                display: block;
                margin-bottom: 10px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                font-weight: 500;
            }
            
            @keyframes dropRipple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(20);
                    opacity: 0;
                }
            }
            
            .suggestion-line::before {
                content: '⋮';
                position: absolute;
                left: -20px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(255, 255, 255, 0.5);
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .suggestion-line:hover::before {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Utility function to show notifications
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
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
        
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
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

        // Feature Cards Animation
        const featureCards = document.querySelectorAll('.feature-card');
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.visibility = 'visible';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        featureCards.forEach(card => {
            card.style.visibility = 'hidden';
            cardObserver.observe(card);
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

    // Voting system properties
    voteData = {
        leftCount: 0,
        rightCount: 0,
        totalVotes: 0,
        hasVoted: false
    };

    // Initialize voting system
    initializeVotingSystem() {
        console.log('Initializing voting system...');
        
        const leftBtn = document.querySelector('.vote-btn-left');
        const rightBtn = document.querySelector('.vote-btn-right');
        const leftCount = document.querySelector('.vote-count-left');
        const rightCount = document.querySelector('.vote-count-right');
        const voteIndicator = document.querySelector('.vote-indicator-fill');

        if (!leftBtn || !rightBtn || !leftCount || !rightCount || !voteIndicator) {
            console.error('Voting elements not found');
            return;
        }

        // Initialize vote counts
        let votes = {
            left: 0,
            right: 0,
            hasVoted: false
        };

        // Update vote display
        const updateVoteDisplay = () => {
            leftCount.textContent = votes.left;
            rightCount.textContent = votes.right;
            
            const total = votes.left + votes.right;
            const leftPercentage = total > 0 ? (votes.left / total) * 100 : 50;
            voteIndicator.style.width = `${leftPercentage}%`;
        };

        // Handle voting
        const handleVote = (side) => {
            if (votes.hasVoted) {
                this.showNotification('You have already voted! 🎭');
                return;
            }

            if (side === 'left') {
                votes.left++;
                this.showNotification(`Voted for ${leftBtn.textContent.split(' ')[2]}! 🎤`);
            } else {
                votes.right++;
                this.showNotification(`Voted for ${rightBtn.textContent.split(' ')[2]}! 🎤`);
            }

            votes.hasVoted = true;
            updateVoteDisplay();

            // Disable buttons
            leftBtn.style.opacity = '0.5';
            rightBtn.style.opacity = '0.5';
            leftBtn.style.cursor = 'not-allowed';
            rightBtn.style.cursor = 'not-allowed';
        };

        // Add click handlers
        leftBtn.addEventListener('click', () => handleVote('left'));
        rightBtn.addEventListener('click', () => handleVote('right'));

        // Initialize display
        updateVoteDisplay();
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

    // Initialize voice selections
    initializeVoiceSelections() {
        const leftVoiceSelect = document.querySelector('#leftVoiceSelect');
        const rightVoiceSelect = document.querySelector('#rightVoiceSelect');

        // Set default voices
        if (leftVoiceSelect) {
            leftVoiceSelect.value = 'en-IN-rohan';
            
            // Add change listener
            leftVoiceSelect.addEventListener('change', () => {
                // If voice is changed back to default, maintain it
                if (!leftVoiceSelect.value) {
                    leftVoiceSelect.value = 'en-IN-rohan';
                }
                console.log('Rapper 1 voice changed to:', leftVoiceSelect.value);
            });
        }

        if (rightVoiceSelect) {
            rightVoiceSelect.value = 'en-IN-aarav';
            
            // Add change listener
            rightVoiceSelect.addEventListener('change', () => {
                // If voice is changed back to default, maintain it
                if (!rightVoiceSelect.value) {
                    rightVoiceSelect.value = 'en-IN-aarav';
                }
                console.log('Rapper 2 voice changed to:', rightVoiceSelect.value);
            });
        }
    }

    // Initialize Battle Arena
    initializeBattleArena() {
        console.log('Initializing battle arena...');
        
        // Initialize voice selections first
        this.initializeVoiceSelections();
        
        // Initialize rap library
        this.initializeRapLibrary();
        
        // Initialize voting system
        this.initializeVotingSystem();
        
        // Initialize other components
        this.initializeSpectatorMode();
        this.initializeVerseInput();
        this.initializeCommentSystem();
    }

    // Initialize Rap Library
    initializeRapLibrary() {
        console.log('Initializing rap library...');
        
        // Get all necessary elements
        const categoryButtons = document.querySelectorAll('.category-btn');
        const leftRapperName = document.querySelector('#rapper1');
        const rightRapperName = document.querySelector('#rapper2');
        const leftAvatar = document.querySelector('.rapper-side.left .avatar-image');
        const rightAvatar = document.querySelector('.rapper-side.right .avatar-image');
        const suggestionBox = document.querySelector('.suggestions-container');
        const leftVoiceSelect = document.querySelector('#leftVoiceSelect');
        const rightVoiceSelect = document.querySelector('#rightVoiceSelect');

        // Set default voices
        if (leftVoiceSelect) {
            leftVoiceSelect.value = 'en-IN-rohan';
            console.log('Set Rapper 1 default voice to Rohan');
        }
        if (rightVoiceSelect) {
            rightVoiceSelect.value = 'en-IN-aarav';
            console.log('Set Rapper 2 default voice to Aarav');
        }

        console.log('Found elements:', {
            categoryButtons: categoryButtons.length,
            leftRapperName: !!leftRapperName,
            rightRapperName: !!rightRapperName,
            leftAvatar: !!leftAvatar,
            rightAvatar: !!rightAvatar,
            suggestionBox: !!suggestionBox,
            leftVoiceSelect: !!leftVoiceSelect,
            rightVoiceSelect: !!rightVoiceSelect
        });

        // Define rapper pairs for each category
        const rapperPairs = {
            roast: {
                left: { name: 'Raftaar', avatar: 'raftaar.jpg' },
                right: { name: '2Pac', avatar: 'tupac-pfp.jpg' }
            },
            aggressive: {
                left: { name: 'Eminem', avatar: 'eminem.jpg' },
                right: { name: 'KR$NA', avatar: 'krsna-portrait.jpg' }
            },
            funny: {
                left: { name: 'Tyler', avatar: 'Tyler 🎀.jpg' },
                right: { name: 'MC Stan', avatar: 'mc stan.jpg' }
            },
            freestyle: {
                left: { name: 'Encore ABJ', avatar: 'Encore ABJ.jpg' },
                right: { name: 'Harry Mack', avatar: 'Harry.jpg' }
            }
        };

        // Define suggested lines for each category
        const suggestedLines = {
            roast: {
                hinglish: [
                    'Teri vibe hai thandi jaise purani chai,\nMain hoon spotlight, tu background guy',
                    'Bars mere fire, tere jaise jal jaayein,\nRap kare tu, log neend mein chale jaayein'
                ],
                english: [
                    'You\'re all bark, no bite, just noise in the crowd,\nI\'m the storm in the booth, thunder spittin\' loud',
                    'You flex online, but freeze on the mic,\nI drop one bar, and it ends your hype'
                ]
            },
            aggressive: {
                hinglish: [
                    'Main hoon jung ka sher, tu gali ka chuha,\nTere jaise sau aaye, maine sabko dhooya',
                    'Tere bars hai fake, jaise insta ka fame,\nMain likhu toh lage jaise jal gaya game'
                ],
                english: [
                    'I don\'t play safe, I aim for the head,\nOne bar from me, and your whole crew\'s dead',
                    'Step in my zone, get torn like a page,\nI spit like a beast that just broke out the cage'
                ]
            },
            funny: {
                hinglish: [
                    'Tere jokes pe hansi sirf mummy ko aayi,\nBaaki sab ne bola, "beta chhup ho ja bhai!"',
                    'Swag dikhaye tu, par chappal hai hawai,\nTinder pe likha "model," par photo mein bhai'
                ],
                english: [
                    'You call yourself a king, but can\'t find your crown,\nEven autocorrect turns your bars down',
                    'You post gym pics like you lift a ton,\nBut dropped your phone and called it a \'leg day run\''
                ]
            },
            freestyle: {
                hinglish: [
                    'Mic haath mein, beat chalu, mood hai high,\nSoch meri sky pe, main udta jaaun bhai',
                    'Flow mera smooth, jaise butter on toast,\nTere bars ka taste, jaise kadvi chai ka dose'
                ],
                english: [
                    'Words in my mind, let the rhythm decide,\nI ride every beat like a wave I can\'t hide',
                    'No script, no pen, just vibes and flow,\nI speak from the soul, let the real ones know'
                ]
            }
        };

        // Handle category selection
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                console.log('Selected category:', category);

                // Update active state
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update rappers
                const pair = rapperPairs[category];
                if (pair) {
                    // Update names with animation
                    if (leftRapperName) {
                        leftRapperName.style.opacity = '0';
                        setTimeout(() => {
                            leftRapperName.textContent = pair.left.name;
                            leftRapperName.style.opacity = '1';
                        }, 300);
                    }
                    if (rightRapperName) {
                        rightRapperName.style.opacity = '0';
                        setTimeout(() => {
                            rightRapperName.textContent = pair.right.name;
                            rightRapperName.style.opacity = '1';
                        }, 300);
                    }

                    // Update avatars with animation
                    if (leftAvatar) {
                        leftAvatar.style.opacity = '0';
                        setTimeout(() => {
                            leftAvatar.src = pair.left.avatar;
                            leftAvatar.style.opacity = '1';
                        }, 300);
                    }
                    if (rightAvatar) {
                        rightAvatar.style.opacity = '0';
                        setTimeout(() => {
                            rightAvatar.src = pair.right.avatar;
                            rightAvatar.style.opacity = '1';
                        }, 300);
                    }

                    // Ensure voice selections are maintained
                    if (leftVoiceSelect && !leftVoiceSelect.value) {
                        leftVoiceSelect.value = 'en-IN-rohan';
                    }
                    if (rightVoiceSelect && !rightVoiceSelect.value) {
                        rightVoiceSelect.value = 'en-IN-aarav';
                    }

                    // Update vote button text
                    const leftVoteBtn = document.querySelector('.vote-btn-left');
                    const rightVoteBtn = document.querySelector('.vote-btn-right');
                    if (leftVoteBtn) leftVoteBtn.textContent = `Vote for ${pair.left.name}`;
                    if (rightVoteBtn) rightVoteBtn.textContent = `Vote for ${pair.right.name}`;
                }

                // Update suggested lines
                const lines = suggestedLines[category];
                if (lines && suggestionBox) {
                    // Get random lines
                    const hinglishIndex = Math.floor(Math.random() * lines.hinglish.length);
                    const englishIndex = Math.floor(Math.random() * lines.english.length);

                    // Update suggestion box with animation
                    suggestionBox.style.opacity = '0';
                    setTimeout(() => {
                        suggestionBox.innerHTML = `
                            <div class="suggestion-category">
                                <span class="category-label">🎭 ${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                <div class="suggestion-line" draggable="true" data-verse="${lines.hinglish[hinglishIndex]}">
                                    ${lines.hinglish[hinglishIndex].split('\n').join('<br>')}
                                </div>
                                <div class="suggestion-line" draggable="true" data-verse="${lines.english[englishIndex]}">
                                    ${lines.english[englishIndex].split('\n').join('<br>')}
                                </div>
                            </div>
                        `;
                        suggestionBox.style.opacity = '1';

                        // Initialize drag and drop for new lines
                        this.initializeDragAndDrop();
                    }, 300);
                }

                // Show notification
                this.showNotification(`Switched to ${category} mode! 🎤`);
            });
        });

        // Initialize drag and drop functionality
        this.initializeDragAndDrop();

        // Select first category by default
        if (categoryButtons.length > 0) {
            categoryButtons[0].click();
        }
    }

    // Initialize drag and drop functionality
    initializeDragAndDrop() {
        console.log('Initializing drag and drop...');
        
        const draggableLines = document.querySelectorAll('.suggestion-line');
        const verseInputs = document.querySelectorAll('.verse-input');
        let currentFocusedInput = null; // Track which input is currently focused
        
        console.log('Found elements:', {
            draggableLines: draggableLines.length,
            verseInputs: verseInputs.length
        });

        // Track focused input
        verseInputs.forEach(input => {
            input.addEventListener('focus', () => {
                currentFocusedInput = input;
                console.log('Input focused:', input.id);
            });
        });

        draggableLines.forEach(line => {
            // Make sure draggable attribute is set
            line.setAttribute('draggable', 'true');
            
            line.addEventListener('dragstart', (e) => {
                console.log('Drag started');
                e.dataTransfer.setData('text/plain', line.textContent.trim());
                line.classList.add('dragging');
                
                // Create custom drag image
                const dragImage = line.cloneNode(true);
                dragImage.style.cssText = `
                    position: absolute;
                    top: -1000px;
                    background: rgba(255, 140, 0, 0.2);
                    padding: 10px;
                    border-radius: 5px;
                    pointer-events: none;
                    width: ${line.offsetWidth}px;
                `;
                document.body.appendChild(dragImage);
                e.dataTransfer.setDragImage(dragImage, 0, 0);
                setTimeout(() => dragImage.remove(), 0);

                // Highlight all verse inputs as valid drop targets
                verseInputs.forEach(input => {
                    if (!this.isSpectator) {
                        input.classList.add('valid-drop-target');
                    }
                });
            });

            line.addEventListener('dragend', () => {
                console.log('Drag ended');
                line.classList.remove('dragging');
                verseInputs.forEach(input => {
                    input.classList.remove('drag-over');
                    input.classList.remove('valid-drop-target');
                });
            });

            // Add hover effects
            line.addEventListener('mouseenter', () => {
                if (!this.isSpectator) {
                line.style.transform = 'scale(1.02)';
                    line.style.cursor = 'grab';
                    line.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }
            });

            line.addEventListener('mouseleave', () => {
                line.style.transform = 'scale(1)';
                line.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });

            // Add click-to-copy functionality
            line.addEventListener('click', () => {
                if (this.isSpectator) {
                    this.showNotification('Cannot add lines in spectator mode 👀');
                    return;
                }

                const text = line.textContent.trim();
                
                // Use currently focused input or default to left input if none focused
                const targetInput = currentFocusedInput || document.querySelector('#leftRapText');
                
                if (targetInput) {
                    if (targetInput.value && !targetInput.value.endsWith('\n')) {
                        targetInput.value += '\n';
                    }
                    targetInput.value += text;
                    
                    // Add visual feedback
                    line.style.backgroundColor = 'rgba(255, 140, 0, 0.3)';
                    setTimeout(() => {
                        line.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }, 300);
                    
                    // Update preview if it exists
                    const side = targetInput.id.includes('left') ? 'left' : 'right';
                    const previewContainer = document.querySelector(`.rapper-side.${side} .rap-verse-container`);
                    if (previewContainer) {
                        const versePreview = previewContainer.querySelector('.verse-preview');
                        if (versePreview) {
                            versePreview.querySelector('pre').textContent = targetInput.value;
                        }
                    }
                    
                    this.showNotification(`Line added to ${side === 'left' ? 'Rapper 1' : 'Rapper 2'}! ✍️`);
                    
                    // Keep focus on the input
                    targetInput.focus();
                }
            });
        });

        verseInputs.forEach(input => {
            input.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (!this.isSpectator) {
                    input.classList.add('drag-over');
                }
            });

            input.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!this.isSpectator) {
                    e.dataTransfer.dropEffect = 'copy';
                input.classList.add('drag-over');
                }
            });

            input.addEventListener('dragleave', () => {
                input.classList.remove('drag-over');
            });

            input.addEventListener('drop', (e) => {
                e.preventDefault();
                input.classList.remove('drag-over');
                input.classList.remove('valid-drop-target');
                
                if (this.isSpectator) {
                    this.showNotification('Cannot add verses in spectator mode');
                    return;
                }

                const verse = e.dataTransfer.getData('text/plain');
                console.log('Dropped verse:', verse);

                if (!verse) {
                    console.error('No verse data found in drop event');
                    return;
                }

                // Add newline if needed
                if (input.value && !input.value.endsWith('\n')) {
                    input.value += '\n';
                }
                input.value += verse;

                // Update preview if it exists
                const side = input.id.includes('left') ? 'left' : 'right';
                const previewContainer = document.querySelector(`.rapper-side.${side} .rap-verse-container`);
                if (previewContainer) {
                    const versePreview = previewContainer.querySelector('.verse-preview');
                    if (versePreview) {
                        versePreview.querySelector('pre').textContent = input.value;
                    }
                }

                // Add drop animation
                const dropAnimation = document.createElement('div');
                dropAnimation.className = 'drop-animation';
                dropAnimation.style.cssText = `
                    position: absolute;
                    top: ${e.offsetY}px;
                    left: ${e.offsetX}px;
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 140, 0, 0.5);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: dropRipple 0.6s ease-out;
                `;
                input.appendChild(dropAnimation);
                setTimeout(() => dropAnimation.remove(), 600);

                // Focus the input after dropping
                input.focus();
                currentFocusedInput = input;
                
                this.showNotification(`Verse added to ${side === 'left' ? 'Rapper 1' : 'Rapper 2'}! 🎤`);
            });
        });

        // Add styles for drag and drop
        const style = document.createElement('style');
        style.textContent = `
            .suggestion-line {
                background: rgba(255, 255, 255, 0.1);
                padding: 12px;
                margin: 8px 0;
                border-radius: 8px;
                transition: all 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: grab;
                user-select: none;
                position: relative;
            }
            
            .suggestion-line:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            .suggestion-line.dragging {
                opacity: 0.5;
                cursor: grabbing;
                transform: scale(0.95);
            }
            
            .verse-input.drag-over {
                border-color: rgba(255, 140, 0, 1);
                background: rgba(255, 140, 0, 0.1);
                transform: scale(1.01);
            }
            
            @keyframes dropRipple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(20);
                    opacity: 0;
                }
            }
            
            .suggestion-line::before {
                content: '⋮';
                position: absolute;
                left: -20px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(255, 255, 255, 0.5);
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .suggestion-line:hover::before {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize Murf AI integration
    async initializeMurfAI() {
        console.log('Murf AI will be accessed through the backend.');
    }

    setupMusicPlayer() {
        console.log('Music player setup skipped - feature coming soon');
        // Placeholder for future music player implementation
    }

    // Initialize How It Works page functionality
    initializeHowItWorks() {
        console.log('Initializing How It Works page...');

        // FAQ Interaction
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Battle Arena Navigation
        const battleBtn = document.querySelector('.start-battle-btn[data-section="battle-arena"]');
        if (battleBtn) {
            battleBtn.addEventListener('click', () => {
                // Hide current section
                const currentSection = document.querySelector('.content-section:not(.hidden)');
                if (currentSection) {
                    currentSection.classList.add('hidden');
                }

                // Show battle arena section
                const battleArena = document.getElementById('battle-arena');
                if (battleArena) {
                    battleArena.classList.remove('hidden');
                    battleArena.scrollIntoView({ behavior: 'smooth' });
                }

                // Update navigation buttons
                const navButtons = document.querySelectorAll('.nav-btn');
                navButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.section === 'battle-arena') {
                        btn.classList.add('active');
                    }
                });
            });
        }

        // Add hover effect for feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(10px)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Demo Section
        const demoSteps = document.querySelectorAll('.demo-step');
        const demoInput = document.querySelector('.demo-input');
        const demoOutput = document.querySelector('.demo-output');
        
        demoSteps.forEach(step => {
            step.addEventListener('click', () => {
                const stepNumber = step.dataset.step;
                
                // Remove active state from all steps
                demoSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                
                switch(stepNumber) {
                    case '1':
                        demoInput.style.display = 'block';
                        demoOutput.style.display = 'none';
                        demoInput.placeholder = 'Write your verse here...';
                        break;
                    case '2':
                        demoInput.style.display = 'none';
                        demoOutput.style.display = 'block';
                        demoOutput.innerHTML = `
                            <div class="conversion-preview">
                                <div class="waveform-animation"></div>
                                <button class="play-preview">▶️ Play Preview</button>
                            </div>
                        `;
                        break;
                    case '3':
                        demoInput.style.display = 'none';
                        demoOutput.style.display = 'block';
                        demoOutput.innerHTML = `
                            <div class="battle-preview">
                                <div class="mini-battle-arena">
                                    <div class="mini-rapper">Rapper 1</div>
                                    <div class="vs-text">VS</div>
                                    <div class="mini-rapper">Rapper 2</div>
                                </div>
                                <button class="start-preview">Start Battle</button>
                            </div>
                        `;
                        break;
                }
            });
        });

        // Feature Card Demos
        const voiceDemo = document.querySelector('[data-feature="voice"] .demo-btn');
        if (voiceDemo) {
            voiceDemo.addEventListener('click', () => {
                const audioPreview = voiceDemo.nextElementSibling;
                if (audioPreview) {
                    audioPreview.style.display = 'block';
                    // Add waveform animation
                    const waveform = audioPreview.querySelector('.waveform');
                    if (waveform) {
                        waveform.innerHTML = `
                            <div class="wave"></div>
                            <div class="wave"></div>
                            <div class="wave"></div>
                        `;
                    }
                }
            });
        }

        // Mini Suggestion Drag and Drop Demo
        const miniSuggestion = document.querySelector('.mini-suggestion');
        if (miniSuggestion) {
            miniSuggestion.addEventListener('dragstart', (e) => {
                miniSuggestion.classList.add('dragging');
                e.dataTransfer.setData('text/plain', miniSuggestion.textContent);
            });

            miniSuggestion.addEventListener('dragend', () => {
                miniSuggestion.classList.remove('dragging');
            });
        }

        // Achievement Cards Animation
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            const progress = card.querySelector('.progress');
            if (progress) {
                // Animate progress bar when card is in view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            progress.style.width = progress.style.width || '0%';
                            requestAnimationFrame(() => {
                                progress.style.transition = 'width 1s ease';
                                progress.style.width = progress.parentElement.dataset.progress || '50%';
                            });
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(card);
            }
        });

        // Timeline Steps Animation
        const timelineSteps = document.querySelectorAll('.timeline-step');
        timelineSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                step.style.transition = 'all 0.5s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Resource Cards Hover Effect
        const resourceCards = document.querySelectorAll('.resource-card');
        resourceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 5px 15px rgba(255, 140, 0, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });

        // CTA Button Effect
        const ctaButton = document.querySelector('.cta-section .start-battle-btn');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                // Navigate to battle arena
                const battleArenaBtn = document.querySelector('[data-section="battle-arena"]');
                if (battleArenaBtn) {
                    battleArenaBtn.click();
                }
            });
        }
    }

    initializeSidebar() {
        const menuButton = document.querySelector('.logo-icon');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const closeSidebarButton = document.querySelector('.close-sidebar');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const categoryCards = document.querySelectorAll('.category-card');
        const actionButtons = document.querySelectorAll('.action-btn');

        if (!sidebar || !sidebarOverlay || !menuButton || !closeSidebarButton) {
            console.error('Sidebar elements not found');
            return;
        }

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        const openSidebar = () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        // Event Listeners
        menuButton.addEventListener('click', openSidebar);
        closeSidebarButton.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        });

        // Handle navigation links
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                    closeSidebar();
                }
            });
        });

        // Handle category cards
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const category = card.getAttribute('data-category');
                if (category) {
                    // Handle category selection
                    categoryCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    // Add your category handling logic here
                }
            });
        });

        // Handle action buttons
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('logout')) {
                    // Handle logout
                    console.log('Logging out...');
                } else if (button.textContent.includes('Settings')) {
                    // Handle settings
                    console.log('Opening settings...');
                } else if (button.textContent.includes('Practice')) {
                    // Handle practice mode
                    console.log('Starting practice mode...');
                }
            });
        });

        // Add touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0 && !sidebar.classList.contains('active')) {
                    // Swipe right, open sidebar
                    openSidebar();
                } else if (swipeDistance < 0 && sidebar.classList.contains('active')) {
                    // Swipe left, close sidebar
                    closeSidebar();
                }
            }
        };
    }
}

// Initialize the platform when DOM is loaded
let platform;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing platform...');
    platform = new ReluxePlatform();
    platform.init();
});

// Export for module systems
export default ReluxePlatform;

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
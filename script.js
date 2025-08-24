// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const generateBtn = document.getElementById('generateBtn');
const enhanceBtn = document.getElementById('enhanceBtn');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const resultsContainer = document.getElementById('resultsContainer');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const captionText = document.getElementById('captionText');
const confidenceBadge = document.getElementById('confidenceBadge');
const imageName = document.getElementById('imageName');
const imageDimensions = document.getElementById('imageDimensions');
const imageSize = document.getElementById('imageSize');
const objectsCount = document.getElementById('objectsCount');
const processingTime = document.getElementById('processingTime');
const wordsCount = document.getElementById('wordsCount');
const accuracyScore = document.getElementById('accuracyScore');
const themeToggle = document.getElementById('themeToggle');
const notification = document.getElementById('notification');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelpModal = document.getElementById('closeHelpModal');
const loadingOverlay = document.getElementById('loadingOverlay');

// Enhanced Mobile Detection and Optimizations
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isLandscape = window.innerWidth > window.innerHeight;

// Mobile-specific optimizations
function optimizeForMobile() {
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Reduce motion on mobile for better performance
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Add mobile-specific classes
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
        }
        
        if (isLandscape) {
            document.body.classList.add('landscape-orientation');
        }
        
        // Optimize touch interactions
        optimizeTouchInteractions();
        
        // Add mobile-specific event listeners
        addMobileEventListeners();
    }
}

// Optimize touch interactions
function optimizeTouchInteractions() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevent zoom on double tap for specific elements
    const preventZoomElements = document.querySelectorAll('.upload-area, .btn, .feature-card');
    preventZoomElements.forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
}

// Add mobile-specific event listeners
function addMobileEventListeners() {
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, 0);
            updateOrientationClasses();
        }, 100);
    });
    
    // Handle resize for mobile
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateOrientationClasses();
            optimizeLayoutForScreenSize();
        }, 250);
    });
    
    // Handle visibility change (app switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // App went to background
            document.body.classList.add('app-background');
        } else {
            // App came to foreground
            document.body.classList.remove('app-background');
            // Refresh any necessary data
            refreshAppState();
        }
    });
}

// Update orientation classes
function updateOrientationClasses() {
    const isLandscape = window.innerWidth > window.innerHeight;
    document.body.classList.toggle('landscape-orientation', isLandscape);
    
    if (isLandscape && isMobile) {
        // Optimize for landscape on mobile
        optimizeForLandscape();
    } else {
        // Reset to portrait optimizations
        optimizeForPortrait();
    }
}

// Optimize layout for landscape orientation
function optimizeForLandscape() {
    const uploadArea = document.getElementById('uploadArea');
    const featuresGrid = document.querySelector('.features-grid');
    
    if (uploadArea && featuresGrid) {
        // Adjust spacing for landscape
        uploadArea.style.marginBottom = '1.5rem';
        featuresGrid.style.marginTop = '1.5rem';
        
        // Optimize feature cards for landscape
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.style.padding = '1.25rem';
        });
    }
}

// Optimize layout for portrait orientation
function optimizeForPortrait() {
    const uploadArea = document.getElementById('uploadArea');
    const featuresGrid = document.querySelector('.features-grid');
    
    if (uploadArea && featuresGrid) {
        // Reset to default spacing
        uploadArea.style.marginBottom = '';
        featuresGrid.style.marginTop = '';
        
        // Reset feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.style.padding = '';
        });
    }
}

// Optimize layout for current screen size
function optimizeLayoutForScreenSize() {
    const width = window.innerWidth;
    
    if (width <= 360) {
        // Extra small screens
        document.body.classList.add('screen-xs');
        document.body.classList.remove('screen-sm', 'screen-md');
    } else if (width <= 480) {
        // Small screens
        document.body.classList.add('screen-sm');
        document.body.classList.remove('screen-xs', 'screen-md');
    } else if (width <= 768) {
        // Medium screens
        document.body.classList.add('screen-md');
        document.body.classList.remove('screen-xs', 'screen-sm');
    } else {
        // Large screens
        document.body.classList.remove('screen-xs', 'screen-sm', 'screen-md');
    }
}

// Refresh app state when coming back to foreground
function refreshAppState() {
    // Check if we need to refresh any data
    if (window.location.hash === '#refresh') {
        window.location.reload();
    }
    
    // Update any time-sensitive information
    updateTimestamp();
}

// Update timestamp for mobile users
function updateTimestamp() {
    const timestampElements = document.querySelectorAll('.timestamp');
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    timestampElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Enhanced mobile scrolling
function smoothScrollTo(element, options = {}) {
    if (isMobile) {
        // Mobile-optimized scrolling
        const defaultOptions = {
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        };
        
        const scrollOptions = { ...defaultOptions, ...options };
        
        // Add a small delay for mobile
        setTimeout(() => {
            element.scrollIntoView(scrollOptions);
        }, 100);
    } else {
        // Desktop scrolling
        element.scrollIntoView(options);
    }
}

// Enhanced mobile notifications
function showMobileNotification(message, type = 'info', duration = 4000) {
    if (isMobile) {
        // Mobile-optimized notification
        const notification = document.createElement('div');
        notification.className = `notification ${type} mobile-notification`;
        notification.textContent = message;
        
        // Mobile-specific styling
        notification.style.position = 'fixed';
        notification.style.bottom = '2rem';
        notification.style.left = '1rem';
        notification.style.right = '1rem';
        notification.style.transform = 'translateY(100%)';
        notification.style.transition = 'transform 0.3s ease';
        notification.style.zIndex = '1001';
        notification.style.maxWidth = 'none';
        notification.style.textAlign = 'center';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '12px';
        notification.style.fontSize = '0.875rem';
        notification.style.fontWeight = '600';
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.style.transform = 'translateY(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    } else {
        // Desktop notification (existing code)
        showNotification(message, type, duration);
    }
}

// Enhanced mobile modal handling
function showMobileModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (isMobile) {
        // Mobile-optimized modal
        modal.style.display = 'flex';
        modal.style.alignItems = 'flex-start';
        modal.style.paddingTop = '2rem';
        
        // Prevent body scroll on mobile
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Add mobile-specific classes
        modal.classList.add('mobile-modal');
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } else {
        // Desktop modal (existing code)
        showHelpModal();
    }
}

function hideMobileModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (isMobile) {
        // Mobile-optimized modal hiding
        modal.classList.remove('show');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('mobile-modal');
        }, 300);
    } else {
        // Desktop modal (existing code)
        hideHelpModal();
    }
}

// Enhanced mobile keyboard shortcuts
function handleMobileKeyboardShortcuts(e) {
    if (isMobile) {
        // Mobile-specific shortcuts
        switch(e.key) {
            case 'Escape':
                // Close any open modals
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    hideMobileModal(openModal.id);
                }
                break;
                
            case ' ':
                // Spacebar for primary action
                e.preventDefault();
                const generateBtn = document.getElementById('generateBtn');
                if (generateBtn && !generateBtn.disabled) {
                    generateBtn.click();
                }
                break;
        }
    } else {
        // Desktop shortcuts (existing code)
        handleKeyboardShortcuts(e);
    }
}

// Enhanced mobile file handling
function enhanceMobileFileHandling() {
    if (isMobile) {
        const imageInput = document.getElementById('imageInput');
        const uploadArea = document.getElementById('uploadArea');
        
        if (imageInput && uploadArea) {
            // Add mobile-specific file input handling
            imageInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    // Add mobile-specific feedback
                    uploadArea.classList.add('file-selected', 'mobile-file-selected');
                    
                    // Show mobile-optimized notification
                    showMobileNotification('Image selected! 📸', 'success', 2000);
                }
            });
            
            // Enhanced mobile drag and drop
            uploadArea.addEventListener('touchstart', function(e) {
                this.classList.add('touch-active');
            });
            
            uploadArea.addEventListener('touchend', function(e) {
                this.classList.remove('touch-active');
            });
            
            // Prevent default touch behaviors
            uploadArea.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
        }
    }
}

// Enhanced mobile performance monitoring
function monitorMobilePerformance() {
    if (isMobile) {
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        function countFrames() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Log performance issues
                if (fps < 30) {
                    console.warn('Low frame rate detected:', fps);
                    // Optimize animations
                    document.body.classList.add('low-performance');
                } else {
                    document.body.classList.remove('low-performance');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        }
        
        requestAnimationFrame(countFrames);
        
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('High memory usage detected');
                }
            }, 5000);
        }
    }
}

// Demo captions
const demoCaptions = [
    "A serene mountain landscape at sunset with vibrant orange and pink hues reflecting off a calm lake, surrounded by evergreen trees and rocky peaks.",
    "A bustling city street scene with pedestrians walking past modern glass skyscrapers under a clear blue sky, featuring taxis and urban architecture.",
    "A close-up portrait of a young woman with freckles smiling naturally, with soft bokeh lights in the background creating a warm atmosphere.",
    "A delicious gourmet burger with melted cheese, crispy bacon, and fresh vegetables on a wooden table, accompanied by golden french fries.",
    "An adorable golden retriever puppy playing in a sunlit garden with green grass and colorful flowers, looking curiously at the camera."
];

// Demo stats
const demoStats = {
    objects: [8, 15, 5, 7, 4],
    time: [1.8, 2.3, 1.5, 1.2, 1.0],
    words: [28, 35, 22, 30, 25],
    accuracy: [95, 92, 97, 94, 98]
};

// Event Listeners
uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
uploadArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        imageInput.click();
    }
});

// Mobile-specific event listeners
if (isTouchDevice) {
    uploadArea.addEventListener('touchstart', handleTouchStart);
    uploadArea.addEventListener('touchend', handleTouchEnd);
}

imageInput.addEventListener('change', handleFileSelect);
generateBtn.addEventListener('click', generateCaption);
enhanceBtn.addEventListener('click', enhanceCaption);
resetBtn.addEventListener('click', resetAll);
copyBtn.addEventListener('click', copyCaption);
downloadBtn.addEventListener('click', downloadCaption);
shareBtn.addEventListener('click', shareCaption);
themeToggle.addEventListener('click', toggleTheme);
helpBtn.addEventListener('click', showHelpModal);
closeHelpModal.addEventListener('click', hideHelpModal);

// Keyboard shortcuts
document.addEventListener('keydown', handleKeyboardShortcuts);

// Mobile gesture handling
let touchStartY = 0;
let touchStartX = 0;

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    const deltaX = Math.abs(touchEndX - touchStartX);
    
    // If it's a tap (small movement), trigger file selection
    if (deltaY < 10 && deltaX < 10) {
        imageInput.click();
    }
}

// Functions
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
        imageInput.files = e.dataTransfer.files;
        handleFileSelect({ target: imageInput });
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        showNotification('Please select an image file (JPG, PNG, WEBP)', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size too large. Please select an image under 10MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        previewImage.src = event.target.result;
        previewContainer.style.display = 'block';
        uploadArea.style.display = 'none';
        
        // Add file-selected state to upload area
        uploadArea.classList.add('file-selected');
        
        // Update image info
        imageName.textContent = file.name;
        imageSize.textContent = formatFileSize(file.size);
        
        // Enable buttons
        generateBtn.disabled = false;
        enhanceBtn.disabled = false;
        resetBtn.disabled = false;
        
        // Get image dimensions
        const img = new Image();
        img.onload = function() {
            imageDimensions.textContent = `${this.width}×${this.height}`;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function setLoadingState(isLoading) {
    if (isLoading) {
        loadingOverlay.style.display = 'flex';
        setTimeout(() => loadingOverlay.classList.add('show'), 10);
        generateBtn.disabled = true;
        enhanceBtn.disabled = true;
        resetBtn.disabled = true;
    } else {
        loadingOverlay.classList.remove('show');
        setTimeout(() => loadingOverlay.style.display = 'none', 300);
        generateBtn.disabled = false;
        enhanceBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

function generateCaption() {
    // Show progress
    progressContainer.style.display = 'block';
    generateBtn.disabled = true;
    enhanceBtn.disabled = true;

    // Get the uploaded image as base64
    const file = imageInput.files[0];
    if (!file) {
        showNotification('Please select an image file first.', 'error');
        progressContainer.style.display = 'none';
        generateBtn.disabled = false;
        enhanceBtn.disabled = false;
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        // Remove the data URL prefix to get only base64
        const base64 = event.target.result.split(',')[1];
        
        try {
            setLoadingState(true);
            progressText.textContent = "Uploading image and generating caption...";
            
            const response = await fetch('http://localhost:3000/api/caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
            });
            
            const data = await response.json();
            
            if (response.ok && data.caption) {
                showResults(data.caption);
            } else {
                throw new Error(data.error || 'No caption returned');
            }
        } catch (err) {
            console.error('Caption generation error:', err);
            showNotification('Failed to generate caption from backend. Showing demo.', 'error');
            showResults(); // fallback to demo
        } finally {
            setLoadingState(false);
        }
    };
    reader.readAsDataURL(file);
}

function enhanceCaption() {
    showNotification("Premium feature coming soon! 🚀", "info");
}

function showResults(realCaption) {
    progressContainer.style.display = 'none';
    resultsContainer.style.display = 'block';

    if (realCaption) {
        captionText.textContent = realCaption;
        // Set stats for real caption
        objectsCount.textContent = '-';
        processingTime.textContent = '-';
        wordsCount.textContent = realCaption.split(' ').length;
        accuracyScore.textContent = '-';
        confidenceBadge.textContent = 'AI Caption';
        confidenceBadge.style.background = "var(--accent-gradient)";
    } else {
        // Random demo caption and stats
        const randomIndex = Math.floor(Math.random() * demoCaptions.length);
        captionText.textContent = demoCaptions[randomIndex];
        objectsCount.textContent = demoStats.objects[randomIndex];
        processingTime.textContent = demoStats.time[randomIndex];
        wordsCount.textContent = demoStats.words[randomIndex];
        accuracyScore.textContent = demoStats.accuracy[randomIndex];
        
        // Update confidence badge
        const confidence = demoStats.accuracy[randomIndex];
        confidenceBadge.textContent = `${confidence}% Confidence`;
        if (confidence >= 95) {
            confidenceBadge.style.background = "var(--success-gradient)";
        } else if (confidence >= 85) {
            confidenceBadge.style.background = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
        } else {
            confidenceBadge.style.background = "var(--warning-gradient)";
        }
    }
    
    // Scroll to results with mobile-optimized behavior
    if (isMobile) {
        // On mobile, scroll more smoothly and ensure results are visible
        setTimeout(() => {
            resultsContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 100);
    } else {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function resetAll() {
    imageInput.value = '';
    previewImage.src = '';
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'flex';
    uploadArea.classList.remove('file-selected');
    resultsContainer.style.display = 'none';
    progressContainer.style.display = 'none';
    generateBtn.disabled = true;
    enhanceBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Reset image info
    imageName.textContent = 'image.jpg';
    imageDimensions.textContent = '1920x1080';
    imageSize.textContent = '2.4 MB';
}

function copyCaption() {
    navigator.clipboard.writeText(captionText.textContent)
        .then(() => showNotification('Caption copied to clipboard! 📋', 'success'))
        .catch(() => showNotification('Failed to copy caption', 'error'));
}

function downloadCaption() {
    const blob = new Blob([captionText.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-caption.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Caption downloaded! 💾', 'success');
}

function shareCaption() {
    if (navigator.share) {
        navigator.share({
            title: 'AI Generated Caption',
            text: captionText.textContent,
            url: window.location.href
        }).catch(() => showNotification('Sharing cancelled', 'info'));
    } else {
        showNotification('Web Share API not supported', 'error');
    }
}

function toggleTheme() {
    console.log('toggleTheme function called');
    
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.error('Theme toggle not found in toggleTheme');
        return;
    }
    
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    console.log('Theme toggle elements:', { icon, text });
    
    if (icon && text) {
        if (body.classList.contains('dark-theme')) {
            // Switch to light theme
            body.classList.remove('dark-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
            text.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
            console.log('Switched to light theme');
        } else {
            // Switch to dark theme
            body.classList.add('dark-theme');
            icon.classList.replace('fa-moon', 'fa-sun');
            text.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
            console.log('Switched to dark theme');
        }
    } else {
        console.error('Icon or text not found in theme toggle');
    }
}

function showHelpModal() {
    console.log('showHelpModal function called');
    
    const helpModal = document.getElementById('helpModal');
    
    if (helpModal) {
        helpModal.style.display = 'flex';
        setTimeout(() => helpModal.classList.add('show'), 10);
        
        // On mobile, prevent body scroll when modal is open
        if (isMobile) {
            document.body.style.overflow = 'hidden';
        }
        console.log('Help modal displayed successfully');
    } else {
        console.error('Help modal not found!');
    }
}

function hideHelpModal() {
    console.log('hideHelpModal function called');
    
    const helpModal = document.getElementById('helpModal');
    
    if (helpModal) {
        helpModal.classList.remove('show');
        setTimeout(() => helpModal.style.display = 'none', 300);
        
        // Restore body scroll on mobile
        if (isMobile) {
            document.body.style.overflow = '';
        }
        console.log('Help modal hidden successfully');
    } else {
        console.error('Help modal not found in hideHelpModal!');
    }
}

function handleKeyboardShortcuts(e) {
    // Don't trigger shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    switch (true) {
        case modifier && e.key === 'o':
            e.preventDefault();
            imageInput.click();
            break;
        case e.key === 'Enter' && !generateBtn.disabled:
            e.preventDefault();
            generateCaption();
            break;
        case modifier && e.key === 'c' && resultsContainer.style.display !== 'none':
            e.preventDefault();
            copyCaption();
            break;
        case modifier && e.key === 'd' && resultsContainer.style.display !== 'none':
            e.preventDefault();
            downloadCaption();
            break;
        case modifier && e.key === 'r':
            e.preventDefault();
            resetAll();
            break;
        case modifier && e.key === 'k':
            e.preventDefault();
            showHelpModal();
            break;
        case modifier && e.key === 't':
            e.preventDefault();
            toggleTheme();
            break;
        case e.key === 'F1':
            e.preventDefault();
            showHelpModal();
            break;
        case e.key === 'Escape':
            if (helpModal.style.display === 'flex') {
                hideHelpModal();
            }
            break;
    }
}

function showNotification(message, type) {
    notification.className = `notification ${type}`;
    notification.querySelector('.notification-content').textContent = message;
    notification.classList.add('show');
    
    // Auto-hide notification
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    console.log('Initializing theme, saved theme:', savedTheme);
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        if (icon && text) {
            icon.classList.replace('fa-moon', 'fa-sun');
            text.textContent = 'Light Mode';
        }
    }
    
    // Set initial theme state
    const isDark = document.body.classList.contains('dark-theme');
    console.log('Theme initialized, isDark:', isDark);
}

// Close modal when clicking outside
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        hideHelpModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    
    // Initialize theme
    initializeTheme();
    
    // Initialize mobile optimizations
    optimizeForMobile();
    
    // Reset app state
    resetAll();
    
    // Ensure loading overlay is hidden by default
    loadingOverlay.style.display = 'none';
    loadingOverlay.classList.remove('show');
    
    // Add visual feedback for controls
    addControlFeedback();
    
    // Add some visual feedback for the upload area
    uploadArea.addEventListener('mouseenter', () => {
        if (!isTouchDevice) {
            uploadArea.style.transform = 'translateY(-2px)';
        }
    });
    
    uploadArea.addEventListener('mouseleave', () => {
        if (!isTouchDevice) {
            uploadArea.style.transform = 'translateY(0)';
        }
    });
    
    // Mobile-specific optimizations
    if (isMobile) {
        // Reduce motion on mobile for better performance
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.style.setProperty('--transition-smooth', 'all 0.2s ease');
            document.body.style.setProperty('--transition-spring', 'all 0.3s ease');
        }
        
        // Add mobile-specific keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // On mobile, allow spacebar to trigger buttons
            if (e.key === ' ' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                const activeElement = document.activeElement;
                if (activeElement && activeElement.tagName === 'BUTTON') {
                    activeElement.click();
                }
            }
        });
    }
    
    // Add enhanced upload area interactions
    enhanceUploadArea();
    
    console.log('App initialization complete!');
});

// Add visual feedback for controls
function addControlFeedback() {
    const themeToggle = document.getElementById('themeToggle');
    const helpBtn = document.getElementById('helpBtn');
    
    console.log('Looking for controls:', { themeToggle, helpBtn });
    
    if (themeToggle) {
        // Remove any existing listeners
        themeToggle.replaceWith(themeToggle.cloneNode(true));
        const newThemeToggle = document.getElementById('themeToggle');
        
        newThemeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Theme toggle clicked!');
            
            // Add visual feedback
            this.classList.add('changing');
            setTimeout(() => this.classList.remove('changing'), 500);
            
            // Toggle theme
            toggleTheme();
        });
        
        console.log('Theme toggle initialized successfully');
    } else {
        console.error('Theme toggle button not found!');
    }
    
    if (helpBtn) {
        // Remove any existing listeners
        helpBtn.replaceWith(helpBtn.cloneNode(true));
        const newHelpBtn = document.getElementById('helpBtn');
        
        newHelpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Help button clicked!');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 150);
            
            // Show help modal
            showHelpModal();
        });
        
        console.log('Help button initialized successfully');
    } else {
        console.error('Help button not found!');
    }
}

// Enhanced upload area functionality
function enhanceUploadArea() {
    // Add visual feedback for drag and drop
    uploadArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
        uploadArea.style.transform = 'scale(1.02)';
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!uploadArea.contains(e.relatedTarget)) {
            uploadArea.classList.remove('dragover');
            uploadArea.style.transform = 'scale(1)';
        }
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        uploadArea.style.transform = 'scale(1)';
        
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files;
            handleFileSelect({ target: imageInput });
        }
    });
    
    // Add click feedback
    uploadArea.addEventListener('mousedown', () => {
        if (!isTouchDevice) {
            uploadArea.style.transform = 'scale(0.98)';
        }
    });
    
    uploadArea.addEventListener('mouseup', () => {
        if (!isTouchDevice) {
            uploadArea.style.transform = 'scale(1)';
        }
    });
    
    // Add touch feedback for mobile
    if (isTouchDevice) {
        uploadArea.addEventListener('touchstart', () => {
            uploadArea.style.transform = 'scale(0.98)';
        });
        
        uploadArea.addEventListener('touchend', () => {
            uploadArea.style.transform = 'scale(1)';
        });
    }
    
    // Add keyboard navigation
    uploadArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            imageInput.click();
        }
    });
    
    // Add file input change feedback
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadArea.style.borderColor = 'var(--accent-gradient)';
            uploadArea.style.background = 'rgba(79, 172, 254, 0.1)';
            
            // Reset after a short delay
            setTimeout(() => {
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
            }, 1000);
        }
    });
}

// Enhanced mobile error handling
window.addEventListener('error', function(e) {
    if (isMobile) {
        // Mobile-specific error handling
        console.error('Mobile error:', e.error);
        
        // Show user-friendly error message
        showMobileNotification('Something went wrong. Please try again.', 'error', 5000);
        
        // Log to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.error?.message || 'Unknown error',
                fatal: false
            });
        }
    }
});

// Handle mobile network status
window.addEventListener('online', function() {
    if (isMobile) {
        showMobileNotification('Connection restored! 🌐', 'success', 3000);
        document.body.classList.remove('offline');
    }
});

window.addEventListener('offline', function() {
    if (isMobile) {
        showMobileNotification('No internet connection 📡', 'warning', 0);
        document.body.classList.add('offline');
    }
});

// Enhanced mobile touch feedback
function addTouchFeedback() {
    if (isTouchDevice) {
        const touchElements = document.querySelectorAll('.btn, .upload-area, .feature-card, .upload-feature');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-feedback');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-feedback');
                }, 150);
            });
        });
    }
}

// Initialize touch feedback
document.addEventListener('DOMContentLoaded', addTouchFeedback);

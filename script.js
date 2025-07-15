// Enhanced Pro JS for AI Vision Caption Studio
let currentImage = null;
let processingStartTime = null;
let isDarkMode = false;
let isProcessing = false;

// Modal functionality
const helpModal = document.getElementById('helpModal');
const closeHelpModal = document.getElementById('closeHelpModal');
const loadingOverlay = document.getElementById('loadingOverlay');

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (isProcessing) return; // Disable shortcuts during processing
    
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    
    switch (e.key) {
        case 'o':
            if (isCtrlOrCmd) {
                e.preventDefault();
                document.getElementById('imageInput').click();
            }
            break;
        case 'Enter':
            if (isCtrlOrCmd && currentImage) {
                e.preventDefault();
                generateCaption();
            }
            break;
        case 'c':
            if (isCtrlOrCmd && captionText.textContent) {
                e.preventDefault();
                copyCaption();
            }
            break;
        case 'd':
            if (isCtrlOrCmd && captionText.textContent) {
                e.preventDefault();
                downloadCaption();
            }
            break;
        case 'r':
            if (isCtrlOrCmd && currentImage) {
                e.preventDefault();
                regenerateCaption();
            }
            break;
        case 'k':
            if (isCtrlOrCmd) {
                e.preventDefault();
                clearAll();
            }
            break;
        case 't':
            if (isCtrlOrCmd) {
                e.preventDefault();
                themeToggle.click();
            }
            break;
        case 'F1':
            e.preventDefault();
            showHelpModal();
            break;
        case 'Escape':
            if (helpModal.classList.contains('show')) {
                hideHelpModal();
            }
            break;
    }
});

// Modal functions
function showHelpModal() {
    helpModal.classList.add('show');
    helpModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function hideHelpModal() {
    helpModal.classList.remove('show');
    helpModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

closeHelpModal.addEventListener('click', hideHelpModal);
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        hideHelpModal();
    }
});

// Loading overlay functions
function showLoadingOverlay() {
    loadingOverlay.classList.add('show');
    loadingOverlay.setAttribute('aria-hidden', 'false');
}

function hideLoadingOverlay() {
    loadingOverlay.classList.remove('show');
    loadingOverlay.setAttribute('aria-hidden', 'true');
}

// Utility: Format bytes to human-readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility: Compress image for better performance
function compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Utility: Validate file type and size
function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please use JPG, PNG, GIF, or WEBP.');
    }
    
    if (file.size > maxSize) {
        throw new Error('File too large. Please use images under 10MB.');
    }
    
    return true;
}

// Utility: Show loading state
function setLoadingState(loading) {
    isProcessing = loading;
    const generateBtn = document.getElementById('generateBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const enhanceBtn = document.getElementById('enhanceBtn');
    
    if (loading) {
        generateBtn.innerHTML = '<div class="loading-spinner"></div><span>Processing...</span>';
        generateBtn.disabled = true;
        analyzeBtn.disabled = true;
        enhanceBtn.disabled = true;
        showProgress(10, 'Initializing...');
    } else {
        generateBtn.innerHTML = '<i class="fas fa-magic"></i><span>Generate Caption</span>';
        generateBtn.disabled = false;
        analyzeBtn.disabled = false;
        enhanceBtn.disabled = false;
        hideProgress();
    }
}

// Theme toggle with localStorage persistence
const themeToggle = document.getElementById('themeToggle');
function initTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    }
}

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
    }
});

// File input & preview with enhanced validation
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const previewContainer = document.getElementById('previewContainer');
const imageSize = document.getElementById('imageSize').querySelector('span');
const imageType = document.getElementById('imageType').querySelector('span');
const imageFileSize = document.getElementById('imageFileSize').querySelector('span');

imageInput.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (file) {
        try {
            // Validate file
            validateFile(file);
            
            // Show loading state
            showNotification('Processing image...', 'info');
            
            // Compress image if needed
            let processedFile = file;
            if (file.size > 5 * 1024 * 1024) { // Compress if > 5MB
                processedFile = await compressImage(file);
                showNotification('Image compressed for better performance', 'success');
            }
            
            currentImage = processedFile;
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                
                // Get image dimensions
                const img = new Image();
                img.onload = () => {
                    imageSize.textContent = `${img.width} × ${img.height}`;
                    imageType.textContent = file.type.split('/')[1]?.toUpperCase() || file.type;
                    imageFileSize.textContent = formatBytes(file.size);
                };
                img.src = e.target.result;
                
                enableActionButtons();
                showNotification('Image loaded successfully!', 'success');
            };
            reader.readAsDataURL(processedFile);
        } catch (error) {
            showNotification(error.message, 'error');
            imageInput.value = '';
        }
    }
});

function enableActionButtons() {
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('analyzeBtn').disabled = false;
    document.getElementById('enhanceBtn').disabled = false;
}

// Enhanced drag & drop with better feedback
const uploadArea = document.getElementById('uploadArea');
uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
    showNotification('Drop your image here', 'info');
});

uploadArea.addEventListener('dragleave', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', async e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        imageInput.files = e.dataTransfer.files;
        await imageInput.dispatchEvent(new Event('change'));
    }
});

uploadArea.addEventListener('click', () => imageInput.click());

// Progress bar with enhanced feedback
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

function showProgress(percent, text) {
    progressContainer.style.display = 'block';
    progressFill.style.width = percent + '%';
    progressText.textContent = text || 'Processing...';
}

function hideProgress() {
    progressContainer.style.display = 'none';
    progressFill.style.width = '0%';
    progressText.textContent = '';
}

// Enhanced results display
const resultsContainer = document.getElementById('resultsContainer');
const captionText = document.getElementById('captionText');
const statsGrid = document.getElementById('statsGrid');
const processingTimeValue = document.getElementById('processingTimeValue');
const confidenceValue = document.getElementById('confidenceValue');
const wordsValue = document.getElementById('wordsValue');
const resolutionValue = document.getElementById('resolutionValue');
const confidenceBadge = document.getElementById('confidenceBadge');

function showResults(caption, stats) {
    resultsContainer.style.display = 'block';
    captionText.textContent = caption;
    
    if (stats) {
        processingTimeValue.textContent = stats.processingTime || '-';
        confidenceValue.textContent = stats.confidence || '-';
        wordsValue.textContent = stats.words || '-';
        resolutionValue.textContent = stats.resolution || '-';
        
        if (stats.confidence) {
            confidenceBadge.textContent = `Confidence: ${stats.confidence}`;
            confidenceBadge.style.display = 'inline-block';
        } else {
            confidenceBadge.style.display = 'none';
        }
    }
    
    statsGrid.style.display = 'grid';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResults() {
    resultsContainer.style.display = 'none';
    statsGrid.style.display = 'none';
    confidenceBadge.style.display = 'none';
}

// Enhanced action buttons with better UX
const generateBtn = document.getElementById('generateBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const enhanceBtn = document.getElementById('enhanceBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const speakBtn = document.getElementById('speakBtn');
const shareBtn = document.getElementById('shareBtn');
const regenerateBtn = document.getElementById('regenerateBtn');

function setButtonsEnabled(enabled) {
    generateBtn.disabled = !enabled || isProcessing;
    analyzeBtn.disabled = !enabled || isProcessing;
    enhanceBtn.disabled = !enabled || isProcessing;
}

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear everything?')) {
        imageInput.value = '';
        previewImage.src = '';
        previewContainer.style.display = 'none';
        hideResults();
        setButtonsEnabled(false);
        currentImage = null;
        showNotification('All cleared!', 'success');
    }
});

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(captionText.textContent || '');
        showNotification('Copied to clipboard!', 'success');
    } catch (error) {
        showNotification('Failed to copy. Please try again.', 'error');
    }
});

downloadBtn.addEventListener('click', () => {
    const caption = captionText.textContent || '';
    if (!caption) {
        showNotification('No caption to download', 'error');
        return;
    }
    
    const blob = new Blob([caption], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caption_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Caption downloaded!', 'success');
});

speakBtn.addEventListener('click', () => {
    const caption = captionText.textContent;
    if (caption) {
        const utterance = new SpeechSynthesisUtterance(caption);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
        showNotification('Speaking caption...', 'info');
    } else {
        showNotification('No caption to speak', 'error');
    }
});

shareBtn.addEventListener('click', async () => {
    const caption = captionText.textContent;
    if (!caption) {
        showNotification('No caption to share', 'error');
        return;
    }
    
    if (navigator.share) {
        try {
            await navigator.share({ 
                text: caption,
                title: 'AI Generated Caption',
                url: window.location.href
            });
            showNotification('Shared successfully!', 'success');
        } catch (error) {
            showNotification('Share cancelled', 'info');
        }
    } else {
        // Fallback for browsers without Web Share API
        try {
            await navigator.clipboard.writeText(caption);
            showNotification('Caption copied to clipboard for sharing!', 'success');
        } catch (error) {
            showNotification('Share not supported on this device', 'error');
        }
    }
});

regenerateBtn.addEventListener('click', () => {
    if (currentImage && !isProcessing) {
        generateCaption();
    } else if (isProcessing) {
        showNotification('Please wait for current processing to complete', 'info');
    } else {
        showNotification('No image to regenerate caption for', 'error');
    }
});

// Enhanced notification system
const notification = document.getElementById('notification');
let notificationTimeout;

function showNotification(msg, type = 'info') {
    // Clear existing notification
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    notification.textContent = msg;
    notification.className = `notification show ${type}`;
    
    // Auto-hide after 3 seconds
    notificationTimeout = setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// Enhanced caption generation with better error handling
async function generateCaption() {
    if (!currentImage) {
        showNotification('Please upload an image first.', 'error');
        return;
    }
    
    if (isProcessing) {
        showNotification('Already processing an image. Please wait.', 'info');
        return;
    }
    
    setLoadingState(true);
    showProgress(30, 'Uploading image...');
    captionText.textContent = 'Generating caption...';
    hideResults();
    
    try {
        const reader = new FileReader();
        reader.readAsDataURL(currentImage);
        
        reader.onload = async function() {
            const base64Image = reader.result.split(',')[1];
            
            try {
                showProgress(60, 'Processing with AI...');
                const start = Date.now();
                
                const response = await fetch('http://localhost:3000/api/caption', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                const elapsed = ((Date.now() - start) / 1000).toFixed(2) + 's';
                
                if (data.caption) {
                    showResults(data.caption, {
                        processingTime: elapsed,
                        confidence: data.confidence || '-',
                        words: data.caption.split(' ').length,
                        resolution: previewImage.naturalWidth + 'x' + previewImage.naturalHeight
                    });
                    showNotification('Caption generated successfully!', 'success');
                } else {
                    throw new Error(data.error || 'Failed to generate caption');
                }
            } catch (error) {
                console.error('API Error:', error);
                captionText.textContent = `Error: ${error.message}`;
                showNotification(`Failed to generate caption: ${error.message}`, 'error');
            } finally {
                setLoadingState(false);
                hideProgress();
            }
        };
    } catch (error) {
        console.error('File Error:', error);
        captionText.textContent = 'Error processing image file';
        showNotification('Error processing image file', 'error');
        setLoadingState(false);
        hideProgress();
    }
}

generateBtn.addEventListener('click', generateCaption);

// Enhanced feature stubs with better feedback
analyzeBtn.addEventListener('click', () => {
    showNotification('Deep Analysis feature coming soon! Stay tuned for advanced image breakdown capabilities.', 'info');
});

enhanceBtn.addEventListener('click', () => {
    showNotification('Enhanced Mode feature coming soon! Get even more detailed AI analysis.', 'info');
});

// Clear all functionality
function clearAll() {
    currentImage = null;
    imageInput.value = '';
    previewContainer.style.display = 'none';
    hideResults();
    setButtonsEnabled(false);
    showNotification('All cleared!', 'info');
}

// Copy caption functionality
function copyCaption() {
    const caption = captionText.textContent;
    if (caption) {
        navigator.clipboard.writeText(caption).then(() => {
            showNotification('Caption copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy caption', 'error');
        });
    } else {
        showNotification('No caption to copy', 'error');
    }
}

// Download caption functionality
function downloadCaption() {
    const caption = captionText.textContent;
    if (caption) {
        const blob = new Blob([caption], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-caption.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Caption downloaded!', 'success');
    } else {
        showNotification('No caption to download', 'error');
    }
}

// Regenerate caption functionality
function regenerateCaption() {
    if (currentImage && !isProcessing) {
        generateCaption();
    } else if (isProcessing) {
        showNotification('Please wait for current processing to complete', 'info');
    } else {
        showNotification('No image to regenerate caption for', 'error');
    }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    showNotification('Welcome to AI Vision Caption Studio Pro! Press F1 for keyboard shortcuts.', 'info');
});

// Service Worker for offline support (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

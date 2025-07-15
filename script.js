// Enhanced Pro JS for AI Vision Caption Studio
let currentImage = null;
let processingStartTime = null;
let isDarkMode = false;

// Utility: Format bytes to human-readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
});

// File input & preview
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const previewContainer = document.getElementById('previewContainer');
const imageSize = document.getElementById('imageSize').querySelector('span');
const imageType = document.getElementById('imageType').querySelector('span');
const imageFileSize = document.getElementById('imageFileSize').querySelector('span');

imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        currentImage = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
            imageSize.textContent = '-';
            imageType.textContent = file.type.split('/')[1]?.toUpperCase() || file.type;
            imageFileSize.textContent = formatBytes(file.size);
        };
        reader.readAsDataURL(file);
        enableActionButtons();
    }
});

function enableActionButtons() {
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('analyzeBtn').disabled = false;
    document.getElementById('enhanceBtn').disabled = false;
}

// Drag & drop
const uploadArea = document.getElementById('uploadArea');
uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        imageInput.files = e.dataTransfer.files;
        imageInput.dispatchEvent(new Event('change'));
    }
});
uploadArea.addEventListener('click', () => imageInput.click());

// Progress bar
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

// Results
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
        confidenceBadge.textContent = stats.confidence ? `Confidence: ${stats.confidence}` : '';
    }
    statsGrid.style.display = 'grid';
}
function hideResults() {
    resultsContainer.style.display = 'none';
    statsGrid.style.display = 'none';
}

// Action buttons
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
    generateBtn.disabled = !enabled;
    analyzeBtn.disabled = !enabled;
    enhanceBtn.disabled = !enabled;
}

clearBtn.addEventListener('click', () => {
    imageInput.value = '';
    previewImage.src = '';
    previewContainer.style.display = 'none';
    hideResults();
    setButtonsEnabled(false);
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(captionText.textContent || '').then(() => showNotification('Copied!'));
});
downloadBtn.addEventListener('click', () => {
    const blob = new Blob([captionText.textContent || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caption.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
speakBtn.addEventListener('click', () => {
    if (captionText.textContent) {
        const utterance = new SpeechSynthesisUtterance(captionText.textContent);
        window.speechSynthesis.speak(utterance);
    }
});
shareBtn.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({ text: captionText.textContent });
    } else {
        showNotification('Share not supported on this device.');
    }
});
regenerateBtn.addEventListener('click', () => {
    if (currentImage) {
        generateCaption();
    }
});

// Notification
const notification = document.getElementById('notification');
function showNotification(msg, type = 'info') {
    notification.textContent = msg;
    notification.className = `notification show ${type}`;
    setTimeout(() => notification.className = 'notification', 2000);
}

// Generate Caption
async function generateCaption() {
    if (!currentImage) {
        showNotification('Please upload an image first.', 'error');
        return;
    }
    showProgress(30, 'Uploading...');
    captionText.textContent = 'Generating caption...';
    hideResults();
    const reader = new FileReader();
    reader.readAsDataURL(currentImage);
    reader.onload = async function() {
        const base64Image = reader.result.split(',')[1];
        try {
            showProgress(60, 'Processing...');
            const start = Date.now();
            const response = await fetch('http://localhost:3000/api/caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image })
            });
            const data = await response.json();
            const elapsed = ((Date.now() - start) / 1000).toFixed(2) + 's';
            if (data.caption) {
                showResults(data.caption, {
                    processingTime: elapsed,
                    confidence: data.confidence || '-',
                    words: data.caption.split(' ').length,
                    resolution: previewImage.naturalWidth + 'x' + previewImage.naturalHeight
                });
                showNotification('Caption generated!', 'success');
            } else {
                captionText.textContent = data.error || 'Failed to generate caption.';
                showNotification('Failed to generate caption.', 'error');
            }
        } catch (error) {
            captionText.textContent = 'Server error. Please try again.';
            showNotification('Server error.', 'error');
        } finally {
            hideProgress();
        }
    };
}

generateBtn.addEventListener('click', generateCaption);

// Deep Analysis (stub)
analyzeBtn.addEventListener('click', () => {
    showNotification('Deep Analysis coming soon!', 'info');
});

enhanceBtn.addEventListener('click', () => {
    showNotification('Enhanced Mode coming soon!', 'info');
});

// Show/hide progress animation
const processingAnimation = document.getElementById('processingAnimation');
function showProcessingAnimation(show) {
    processingAnimation.style.display = show ? 'block' : 'none';
}

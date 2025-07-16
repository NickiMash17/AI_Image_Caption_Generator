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
imageInput.addEventListener('change', handleFileSelect);
generateBtn.addEventListener('click', generateCaption);
enhanceBtn.addEventListener('click', enhanceCaption);
resetBtn.addEventListener('click', resetAll);
copyBtn.addEventListener('click', copyCaption);
downloadBtn.addEventListener('click', downloadCaption);
shareBtn.addEventListener('click', shareCaption);
themeToggle.addEventListener('click', toggleTheme);

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

        const reader = new FileReader();
    reader.onload = function(event) {
        previewImage.src = event.target.result;
        previewContainer.style.display = 'block';
        uploadArea.style.display = 'none';
        
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
            showNotification('Failed to generate caption from backend. Showing demo.', 'error');
            showResults(); // fallback to demo
        }
    };
    reader.readAsDataURL(file);
}

function enhanceCaption() {
    showNotification("Premium feature coming soon!", "info");
}

function showResults(realCaption) {
    progressContainer.style.display = 'none';
    resultsContainer.style.display = 'block';

    if (realCaption) {
        captionText.textContent = realCaption;
        // Optionally, you can clear or set stats to N/A or fetch from backend if available
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
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetAll() {
    imageInput.value = '';
    previewImage.src = '';
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'flex';
    resultsContainer.style.display = 'none';
    progressContainer.style.display = 'none';
    generateBtn.disabled = true;
    enhanceBtn.disabled = true;
    resetBtn.disabled = true;
}

function copyCaption() {
    navigator.clipboard.writeText(captionText.textContent)
        .then(() => showNotification('Caption copied to clipboard!', 'success'))
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
    showNotification('Caption downloaded!', 'success');
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
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        text.textContent = 'Light Mode';
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        text.textContent = 'Dark Mode';
    }
}

function showNotification(message, type) {
    notification.className = `notification ${type}`;
    notification.querySelector('.notification-content').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Initialize
resetAll();

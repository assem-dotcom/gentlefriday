// Storybook content
const storyContent = [
    {
        text: "Hi! I'm Lenny the Lamb. Today is a very special day called Good Friday. Let me tell you why it's so important...",
        image: "assets/lenny-intro.svg"
    },
    {
        text: "A long time ago, there was someone very special who loved everyone so much that He was willing to do something very hard...",
        image: "assets/jesus-teaching.svg"
    },
    {
        text: "He showed us that true love means being willing to help others, even when it's difficult. Just like sharing your last carrot with a friend!",
        image: "assets/carrot.svg"
    },
    {
        text: "On Good Friday, we remember how this special person showed us the greatest love of all by giving everything He had for others.",
        image: "assets/cross.svg"
    },
    {
        text: "But the story doesn't end there! After the darkness comes light, and after sadness comes joy. That's why we call it GOOD Friday!",
        image: "assets/sunrise.svg"
    },
    {
        text: "Just like flowers bloom after winter, and lambs are born in spring, Good Friday reminds us that love and hope always win in the end!",
        image: "assets/meadow.svg"
    }
];

// Candle quotes
const candleQuotes = [
    "Darkness doesn't last forever.",
    "Even little lambs can be brave.",
    "Love is stronger than anything.",
    "Hope grows in the smallest places.",
    "Kindness makes the world brighter."
];

// API configuration
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Make these functions available globally
    window.initializeStorybook = initializeStorybook;
    window.initializeCandles = initializeCandles;
    window.initializeKindnessQuest = initializeKindnessQuest;
    window.initializeGratitudeGarden = initializeGratitudeGarden;
    window.setupLennyEasterEgg = setupLennyEasterEgg;

    // Initialize all features
    initializeStorybook();
    initializeCandles();
    initializeKindnessQuest();
    initializeGratitudeGarden();
    setupLennyEasterEgg();
});

// Storybook functionality
function initializeStorybook() {
    const storyContainer = document.querySelector('.story-container');
    if (!storyContainer) return;

    let currentPage = 0;

    function displayPage(pageIndex) {
        const page = storyContent[pageIndex];
        storyContainer.innerHTML = `
            <div class="story-page">
                <img src="${page.image}" alt="Story illustration" style="max-width: 100%; height: auto;">
                <p style="margin: 1rem 0;">${page.text}</p>
                <div class="story-controls" style="display: flex; justify-content: center; gap: 1rem;">
                    <button onclick="turnPage(-1)" ${pageIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button onclick="turnPage(1)" ${pageIndex === storyContent.length - 1 ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        `;
    }

    window.turnPage = (direction) => {
        currentPage = Math.max(0, Math.min(storyContent.length - 1, currentPage + direction));
        displayPage(currentPage);
    };

    displayPage(0);
}

// Candle lighting functionality
function initializeCandles() {
    const candlesContainer = document.querySelector('.candles-container');
    let litCandles = 0;

    for (let i = 0; i < 5; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.innerHTML = `
            <div class="candle-flame"></div>
            <div class="candle-quote">${candleQuotes[i]}</div>
        `;

        candle.addEventListener('click', () => {
            if (!candle.classList.contains('lit')) {
                candle.classList.add('lit');
                litCandles++;
                const quoteElement = candle.querySelector('.candle-quote');
                
                // Handle quote animation end
                quoteElement.addEventListener('animationend', () => {
                    quoteElement.style.display = 'none';
                    candle.classList.remove('lit');
                    litCandles--;
                }, { once: true });
                
                if (litCandles === 3) {
                    // Trigger Lenny's happy dance
                    const lenny = document.querySelector('.lenny-image');
                    lenny.style.animation = 'none';
                    setTimeout(() => {
                        lenny.style.animation = 'float 0.5s ease-in-out infinite';
                    }, 10);
                }
            }
        });

        candlesContainer.appendChild(candle);
    }
}

// Kindness Quest functionality
async function initializeKindnessQuest() {
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clear-canvas');
    const saveButton = document.getElementById('save-heart');
    const heartsGallery = document.createElement('div');
    heartsGallery.className = 'hearts-gallery';
    
    // Add gallery to the container
    document.querySelector('.kindness-container').appendChild(heartsGallery);
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;
    
    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Set up drawing styles
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Load saved hearts from API
    async function loadHearts() {
        try {
            const response = await fetch(`${API_URL}/hearts`);
            const hearts = await response.json();
            hearts.forEach(heart => {
                addHeartToGallery(heart.image);
            });
        } catch (error) {
            console.error('Error loading hearts:', error);
        }
    }
    
    // Drawing functions
    function getCoordinates(e) {
        let x, y;
        if (e.type.includes('touch')) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }
        return [x, y];
    }
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const [x, y] = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function addHeartToGallery(imageData) {
        const heartContainer = document.createElement('div');
        heartContainer.className = 'heart-container';
        
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = 'Heart drawing';
        
        heartContainer.appendChild(img);
        heartsGallery.appendChild(heartContainer);
    }
    
    // Event listeners for both mouse and touch
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
    
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    saveButton.addEventListener('click', async () => {
        const dataURL = canvas.toDataURL('image/png');
        
        try {
            // Save to API
            const response = await fetch(`${API_URL}/hearts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: dataURL }),
            });
            
            if (response.ok) {
                // Add to gallery
                addHeartToGallery(dataURL);
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                console.error('Error saving heart');
            }
        } catch (error) {
            console.error('Error saving heart:', error);
        }
    });
    
    // Load initial hearts
    loadHearts();
}

// Gratitude Garden functionality
async function initializeGratitudeGarden() {
    const container = document.querySelector('.garden-container');
    const input = document.getElementById('gratitude-input');
    const button = document.getElementById('plant-flower');
    const flowersContainer = document.querySelector('.flowers-container');
    
    if (!container || !input || !button || !flowersContainer) return;
    
    async function loadGratitudeEntries() {
        try {
            const response = await fetch(`${API_URL}/gratitude`);
            const entries = await response.json();
            entries.forEach(entry => createFlower(entry.text));
        } catch (error) {
            console.error('Error loading gratitude entries:', error);
        }
    }
    
    function createFlower(text) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.innerHTML = `
            <div class="flower-petals">🌸</div>
            <div class="flower-text">${text}</div>
        `;
        flowersContainer.appendChild(flower);
    }
    
    button.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) return;
        
        try {
            const response = await fetch(`${API_URL}/gratitude`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            
            if (response.ok) {
                createFlower(text);
                input.value = '';
            }
        } catch (error) {
            console.error('Error saving gratitude:', error);
        }
    });
    
    loadGratitudeEntries();
}

// Easter Egg: Click Lenny 10 times
function setupLennyEasterEgg() {
    const lenny = document.querySelector('.lenny-image');
    let clickCount = 0;

    lenny.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 10) {
            const lennySpeech = document.querySelector('.lenny-speech');
            lennySpeech.textContent = "Okay, I ate the church flowers once. Don't tell Pastor Dave.";
            clickCount = 0;
        }
    });
} 
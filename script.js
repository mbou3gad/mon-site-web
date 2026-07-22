/* ==========================================================================
   INTERACTION LOGIC & NAVIGATION - SOUTENANCE DNSSEC (18 SLIDES)
   ========================================================================== */

let currentSlide = 1;
const totalSlides = 18;

// DOM Elements
const slides = document.querySelectorAll('.slide');
const currentSlideNumEl = document.getElementById('current-slide-num');
const totalSlidesNumEl = document.getElementById('total-slides-num');
const progressBarEl = document.getElementById('progress-bar');

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnGrid = document.getElementById('btn-grid');
const gridModal = document.getElementById('grid-modal');
const modalClose = document.getElementById('modal-close');
const slidesGridOverview = document.getElementById('slides-grid-overview');

// Timer Variables
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;
const timerDisplay = document.getElementById('timer-display');
const btnTimerToggle = document.getElementById('btn-timer-toggle');

// Slide Titles for Overview Modal
const slideTitles = [
    "01. Page de Garde",
    "02. Plan de Présentation",
    "03. Introduction",
    "04. Problématique",
    "05. Objectifs",
    "06. Architecture du DNS",
    "07. Empoisonnement de Cache",
    "08. Présentation de DNSSEC",
    "09. Architecture Proposée",
    "10. Environnement de Simulation",
    "11. Déploiement",
    "12. Test sans DNSSEC",
    "13. Activation de DNSSEC",
    "14. Test avec DNSSEC",
    "15. Matrice Comparée",
    "16. Conclusion",
    "17. Perspectives",
    "18. Merci & Questions"
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateSlideDisplay();
    generateOverviewGrid();
    startTimer(); // Auto-start timer on load for presentation comfort
});

// Update Active Slide View
function updateSlideDisplay() {
    slides.forEach((slide) => {
        const slideIndex = parseInt(slide.getAttribute('data-slide'));
        if (slideIndex === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Update Header Counter & Progress Bar
    if (currentSlideNumEl) currentSlideNumEl.textContent = currentSlide;
    if (totalSlidesNumEl) totalSlidesNumEl.textContent = totalSlides;

    const progressPercent = (currentSlide / totalSlides) * 100;
    if (progressBarEl) progressBarEl.style.width = `${progressPercent}%`;

    // Disable / Enable Nav Buttons
    if (btnPrev) btnPrev.disabled = (currentSlide === 1);
    if (btnNext) btnNext.disabled = (currentSlide === totalSlides);

    // Update Active Thumb in Modal
    const thumbs = document.querySelectorAll('.thumb-card');
    thumbs.forEach((thumb, idx) => {
        if (idx + 1 === currentSlide) {
            thumb.classList.add('active-thumb');
        } else {
            thumb.classList.remove('active-thumb');
        }
    });
}

// Navigation Functions
function goToSlide(n) {
    if (n >= 1 && n <= totalSlides) {
        currentSlide = n;
        updateSlideDisplay();
        closeGridModal();
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlideDisplay();
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlideDisplay();
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // If modal is open, Escape closes it
    if (gridModal.classList.contains('active')) {
        if (e.key === 'Escape') closeGridModal();
        return;
    }

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    } else if (e.key === 'm' || e.key === 'M') {
        toggleGridModal();
    } else if (e.key === 'Home') {
        goToSlide(1);
    } else if (e.key === 'End') {
        goToSlide(totalSlides);
    }
});

// Fullscreen Control
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Erreur de passage en plein écran: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
}

// Overview Grid Modal
function generateOverviewGrid() {
    if (!slidesGridOverview) return;
    slidesGridOverview.innerHTML = '';

    slideTitles.forEach((title, index) => {
        const slideNum = index + 1;
        const card = document.createElement('div');
        card.className = `thumb-card ${slideNum === currentSlide ? 'active-thumb' : ''}`;
        card.onclick = () => goToSlide(slideNum);

        card.innerHTML = `
            <span class="thumb-num">Diapositives ${slideNum}</span>
            <span class="thumb-title">${title}</span>
        `;
        slidesGridOverview.appendChild(card);
    });
}

function toggleGridModal() {
    if (gridModal) gridModal.classList.toggle('active');
}

function closeGridModal() {
    if (gridModal) gridModal.classList.remove('active');
}

if (btnGrid) btnGrid.addEventListener('click', toggleGridModal);
if (modalClose) modalClose.addEventListener('click', closeGridModal);

// Presentation Timer Logic
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        btnTimerToggle.textContent = '⏸';
        timerInterval = setInterval(() => {
            timerSeconds++;
            const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
            const secs = (timerSeconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }
}

function pauseTimer() {
    if (timerRunning) {
        timerRunning = false;
        btnTimerToggle.textContent = '▶';
        clearInterval(timerInterval);
    }
}

if (btnTimerToggle) {
    btnTimerToggle.addEventListener('click', () => {
        if (timerRunning) pauseTimer();
        else startTimer();
    });
}

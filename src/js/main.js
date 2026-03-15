import { presentationMarkdown } from './presentation-content.js';

const SLIDE_SEPARATOR = /\n---\n/;

let currentSlide = 0;
let slides = [];

function loadPresentation() {
  return presentationMarkdown.split(SLIDE_SEPARATOR).map(s => s.trim()).filter(Boolean);
}

function renderSlide(index) {
  const container = document.getElementById('slides-container');
  const counter = document.getElementById('slide-counter');
  const progressFill = document.getElementById('progress-fill');

  container.querySelectorAll('.slide').forEach(el => {
    el.classList.remove('active', 'prev', 'next');
  });

  const activeSlide = container.children[index];
  if (activeSlide) activeSlide.classList.add('active');

  if (index > 0 && container.children[index - 1]) {
    container.children[index - 1].classList.add('prev');
  }
  if (index < slides.length - 1 && container.children[index + 1]) {
    container.children[index + 1].classList.add('next');
  }

  counter.textContent = `${index + 1} / ${slides.length}`;
  progressFill.style.width = `${((index + 1) / slides.length) * 100}%`;

  document.getElementById('btn-prev').disabled = index === 0;
  document.getElementById('btn-next').disabled = index === slides.length - 1;
}

function goTo(index) {
  if (index < 0 || index >= slides.length) return;
  currentSlide = index;
  renderSlide(currentSlide);
}

function buildSlides(rawSlides) {
  const container = document.getElementById('slides-container');
  container.innerHTML = '';

  rawSlides.forEach((content, i) => {
    const div = document.createElement('div');
    div.className = 'slide';
    div.dataset.index = i;
    div.innerHTML = marked.parse(content);
    container.appendChild(div);
  });

  container.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });
}

function setupControls() {
  document.getElementById('btn-prev').addEventListener('click', () => goTo(currentSlide - 1));
  document.getElementById('btn-next').addEventListener('click', () => goTo(currentSlide + 1));

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        goTo(currentSlide + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        goTo(currentSlide - 1);
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(slides.length - 1);
        break;
    }
  });
}

function init() {
  try {
    slides = loadPresentation();
    buildSlides(slides);
    setupControls();
    renderSlide(0);
  } catch (err) {
    document.getElementById('slides-container').innerHTML =
      `<div class="slide error"><h2>Erreur de chargement</h2><p>${err.message}</p></div>`;
  }
}

init();

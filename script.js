/* =============================================
   APEX DRIVE — Script.js
   ============================================= */

/* ── CURSOR ─────────────────────────────────
   Usa requestAnimationFrame para suavidade.
   pointer-events:none no CSS garante que o
   cursor não desaparece em cima de nenhum elem. */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mx = 0, my = 0; // posição do mouse
let fx = 0, fy = 0; // posição do follower (suavizada)

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // cursor pontual: atualiza instantâneo
    cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
});

// follower com inércia via rAF
function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animFollower);
}
animFollower();

// crescer ao passar em interativos
document.querySelectorAll('a, button, .arrow, .dot, .card, .feature, .soc').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('grow');
        follower.classList.add('grow');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('grow');
        follower.classList.remove('grow');
    });
});

/* ── NAV SCROLL ─────────────────────────────── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── CAROUSEL ───────────────────────────────── */
let slideIndex = 0;
const TOTAL_SLIDES = 2; // 4 cards, 2 visíveis por vez = 2 posições

function getCardWidth() {
    const track = document.getElementById('track');
    const card  = track.querySelector('.card');
    if (!card) return 0;
    const style = window.getComputedStyle(card);
    return card.offsetWidth + parseInt(style.marginRight || 0) + 28; // 28 = gap
}

function applySlide() {
    const track = document.getElementById('track');
    // calcula deslocamento: cada slide avança 2 cards
    const offset = slideIndex * getCardWidth() * 2;
    track.style.transform = `translateX(-${offset}px)`;

    // atualiza dots
    document.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === slideIndex)
    );
}

function changeSlide(dir) {
    slideIndex = (slideIndex + dir + TOTAL_SLIDES) % TOTAL_SLIDES;
    applySlide();
}

function goToSlide(i) {
    slideIndex = i;
    applySlide();
}

// swipe touch
let touchX = 0;
document.querySelector('.carousel')?.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; });
document.querySelector('.carousel')?.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
});

// auto-avanço
setInterval(() => changeSlide(1), 6000);
window.addEventListener('resize', applySlide);

/* ── SCROLL REVEAL ───────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // opcional: parar de observar após revelar
            // revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ── CONTADOR ANIMADO (stats do hero) ────────── */
function animCount(el, target, suffix='') {
    let start = 0;
    const dur = 1800;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// Dispara contador quando a seção hero fica visível
const heroObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('[data-count]').forEach(el => {
                animCount(el, parseInt(el.dataset.count), el.dataset.suffix || '');
            });
            heroObs.disconnect();
        }
    });
}, { threshold: 0.3 });
const heroSec = document.getElementById('hero');
if (heroSec) heroObs.observe(heroSec);

/* ── PARALLAX SUTIL NO HERO ─────────────────── */
window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const scrolled = window.scrollY;
        heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.18}px)`;
    }
});

/* ── FORM SUBMIT ─────────────────────────────── */
function submitForm() {
    const nome  = document.getElementById('f-name')?.value.trim();
    const email = document.getElementById('f-email')?.value.trim();
    const carro = document.getElementById('f-car')?.value;

    if (!nome || !email || !carro) {
        // shake leve no botão
        const btn = document.querySelector('.btn-submit');
        btn.style.animation = 'shake .4s ease';
        setTimeout(() => btn.style.animation = '', 400);
        return;
    }

    const success = document.getElementById('formSuccess');
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ── SHAKE KEYFRAME INLINE ───────────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
}`;
document.head.appendChild(shakeStyle);

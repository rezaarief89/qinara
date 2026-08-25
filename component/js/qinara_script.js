const track = document.getElementById('track');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const dots = document.getElementById('dots');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

let index = 0;

// Mobile hamburger menu
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 850) {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function visible() {
    return window.innerWidth <= 850 ? 2 : 3;
}

function maxIndex() {
    return Math.max(0, track.children.length - visible());
}

function buildDots() {
    dots.innerHTML = '';

    const total = maxIndex() + 1;

    for (let i = 0; i < total; i++) {
        const button = document.createElement('button');

        button.className = 'dot' + (i === index ? ' active' : '');

        button.addEventListener('click', () => {
            index = i;
            render();
        });

        dots.appendChild(button);
    }
}

function render() {
    const v = visible();
    const slideWidth = 100 / v;

    track.style.transform = `translateX(-${index * slideWidth}%)`;

    [...dots.children].forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

prev.addEventListener('click', () => {
    index = index > 0 ? index - 1 : maxIndex();
    render();
});

next.addEventListener('click', () => {
    index = index < maxIndex() ? index + 1 : 0;
    render();
});

window.addEventListener('resize', () => {
    index = Math.min(index, maxIndex());

    buildDots();
    render();
});

// Touch / swipe
let startX = 0;

track.addEventListener(
    'touchstart',
    (event) => {
        startX = event.touches[0].clientX;
    },
    { passive: true }
);

track.addEventListener(
    'touchend',
    (event) => {
        const diff = startX - event.changedTouches[0].clientX;

        if (Math.abs(diff) < 40) {
            return;
        }

        if (diff > 0) {
            index = index < maxIndex() ? index + 1 : 0;
        } else {
            index = index > 0 ? index - 1 : maxIndex();
        }

        render();
    },
    { passive: true }
);

// Initial render
buildDots();
render();
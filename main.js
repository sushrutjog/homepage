// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
}

applyTheme(localStorage.getItem('theme') || 'dark');

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// --- Smooth Scroll for Nav Links ---
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Active Nav Link on Scroll (IntersectionObserver) ---
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active',
                    link.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { rootMargin: '-20% 0px -60% 0px' });

sections.forEach(section => observer.observe(section));

// --- Text Scramble Effect on h2 headings ---
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function scramble(element) {
    const original = element.dataset.value;
    if (!original) return;

    let iteration = 0;
    if (element._scrambleInterval) clearInterval(element._scrambleInterval);

    element._scrambleInterval = setInterval(() => {
        element.innerText = original
            .split('')
            .map((char, i) => {
                if (char === ' ') return ' ';
                if (i < iteration) return original[i];
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join('');

        if (iteration >= original.length) clearInterval(element._scrambleInterval);
        iteration += 1 / 3;
    }, 30);
}

document.querySelectorAll('h2[data-value]').forEach(h2 => {
    h2.addEventListener('mouseenter', () => scramble(h2));
});

// --- Letter Scatter Effect ---
function enhanceScatterText(element) {
    const text = element.innerText.split('');
    element.innerText = '';

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    text.forEach((char, index) => {
        const outer = document.createElement('span');
        outer.className = 'outer';

        const inner = document.createElement('span');
        inner.className = 'inner';
        inner.style.animationDelay = `${rand(-5000, 0)}ms`;

        const letter = document.createElement('span');
        letter.className = 'letter';
        if (char === ' ') {
            letter.innerHTML = '&nbsp;';
            letter.style.width = '0.4em';
        } else {
            letter.innerText = char;
        }
        letter.style.animationDelay = `${index * 1000}ms`;

        inner.appendChild(letter);
        outer.appendChild(inner);
        element.appendChild(outer);
    });

    // Assign random scatter transforms on hover
    const outers = element.querySelectorAll('.outer');
    element.addEventListener('mouseenter', () => {
        outers.forEach(outer => {
            const x = rand(-30, 30);
            const y = rand(-20, 20);
            const r = rand(-15, 15);
            outer.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
        });
    });

    element.addEventListener('mouseleave', () => {
        outers.forEach(outer => {
            outer.style.transform = 'translate(0, 0) rotate(0deg)';
        });
    });
}

document.querySelectorAll('.scatter-text').forEach(enhanceScatterText);


const fs = require('fs');

// 1. Modifikasi index.html
let html = fs.readFileSync('index.html', 'utf8');

const overlayPattern = /class="absolute inset-0 bg-gradient-to-t from-gray-900\/90 via-gray-900\/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"/g;
const overlayRepl = 'class="member-overlay absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"';
html = html.replace(overlayPattern, overlayRepl);

const h3Pattern = /class="text-white font-poppins font-bold text-lg md:text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300"/g;
const h3Repl = 'class="text-white font-poppins font-bold text-lg md:text-xl md:translate-y-4 md:group-hover:translate-y-0 md:transition-transform md:duration-300"';
html = html.replace(h3Pattern, h3Repl);

const aPattern = /class="text-gray-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:text-red-400"/g;
const aRepl = 'class="text-gray-300 text-sm md:translate-y-4 md:group-hover:translate-y-0 md:transition-transform md:duration-300 md:delay-75 hover:text-red-400"';
html = html.replace(aPattern, aRepl);

const carouselEndPattern = /            <\/div>\s*<\/div>\s*<div class="mt-8 text-center">/;
const carouselEndRepl = `            </div>
        </div>
    <div id="carousel-dots" class="md:hidden flex justify-center items-center gap-2 mt-4 px-4 flex-wrap"></div>
        <div class="mt-8 text-center">`;
html = html.replace(carouselEndPattern, carouselEndRepl);

const footerPattern = /<p class="text-gray-500 text-sm">&copy; 2026 Job Interview Class. Period April 10, 2026. All Rightss\s*Reserved.<\/p>/;
const footerRepl = `<p class="text-gray-500 text-sm mb-2">&copy; 2026 Job Interview Class. Period April 10, 2026. All Rights Reserved.</p>
    <div class="flex justify-center items-center gap-2 mt-4">
        <span class="text-gray-500 text-sm"><i class="fa-solid fa-eye mr-1"></i> Visitors:</span>
        <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fmrpepsiclass.vercel.app&count_bg=%233B82F6&title_bg=%231F2937&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" alt="Visitor Counter">
    </div>`;
html = html.replace(footerPattern, footerRepl);

fs.writeFileSync('index.html', html);

// 2. Modifikasi script.js
let js = fs.readFileSync('js/script.js', 'utf8');

const oldJsPattern = /    \/\* =========================================\s*5b\. Mobile Click for Member Cards\s*=========================================\ \*\/\s*const memberCards = document\.querySelectorAll\('\.member-card'\);\s*memberCards\.forEach\(card => {\s*card\.addEventListener\('click', \(\) => {\s*memberCards\.forEach\(c => {\s*if \(c !== card\) c\.classList\.remove\('mobile-active'\);\s*}\);\s*card\.classList\.toggle\('mobile-active'\);\s*}\);\s*}\);/;

const newJs = `    /* =========================================
       5b. Mobile Center Reveal & Dots
    ========================================= */
    const memberCards = document.querySelectorAll('.member-card');
const dotContainer = document.getElementById('carousel-dots');

const originalCardsCount = memberCards.length / 2; // Karena di-duplicate untuk infinite scroll

if (dotContainer && window.innerWidth <= 768) {
    for (let i = 0; i < originalCardsCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dotContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.carousel-dot');
    const track = document.getElementById('class-carousel-wrapper');

    const observerOptions = {
        root: track,
        rootMargin: '0px -40% 0px -40%', // Deteksi saat kartu di tengah
        threshold: 0
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                memberCards.forEach(c => c.classList.remove('is-center'));
                entry.target.classList.add('is-center');

                let index = Array.from(memberCards).indexOf(entry.target);
                let dotIndex = index % originalCardsCount;

                dots.forEach((dot, i) => {
                    if (i === dotIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    memberCards.forEach(card => cardObserver.observe(card));
}`;

js = js.replace(oldJsPattern, newJs);
fs.writeFileSync('js/script.js', js);


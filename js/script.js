
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Sticky Header & Active Link Logic
    ========================================= */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('shadow-md', 'py-2');
            header.classList.remove('py-4', 'shadow-sm');
        } else {
            header.classList.add('py-4', 'shadow-sm');
            header.classList.remove('shadow-md', 'py-2');
        }

        // Active Link Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-500');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('text-blue-500');
            }
        });
    });

    /* =========================================
       2. Mobile Menu Toggle
    ========================================= */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const icon = mobileBtn.querySelector('i');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        }
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    /* =========================================
       3. Intersection Observer (Scroll Reveal)
    ========================================= */
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    /* =========================================
       4. Infinite Scroll Cloning
    ========================================= */
    // Helper function to clone children for seamless CSS marquee
    const setupInfiniteScroll = (trackId) => {
        const track = document.getElementById(trackId);
        if (!track) return;

        const children = Array.from(track.children);
        // Clone once for seamless infinite loop (used with -50% scroll)
        children.forEach(child => {
            const clone = child.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); // Accessibility
            track.appendChild(clone);
        });
    };

    setupInfiniteScroll('class-carousel');
    setupInfiniteScroll('outclass-carousel');
    setupInfiniteScroll('messages-track');

    /* =========================================
       5. Lightbox Modal for Documentation
    ========================================= */
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.parentElement.addEventListener('click', () => {
            const imgSrc = item.getAttribute('src');
            // Get higher quality image by modifying URL if from Unsplash
            const highResSrc = imgSrc.replace('w=600', 'w=1200').replace('w=1000', 'w=1200');

            lightboxImg.src = highResSrc;

            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            // Slight delay for transition
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
                lightboxImg.classList.remove('scale-95');
                lightboxImg.classList.add('scale-100');
            }, 10);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');

        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            lightboxImg.src = '';

            const galleryModal = document.getElementById('gallery-modal');
            if (!galleryModal || galleryModal.classList.contains('hidden')) {
                document.body.style.overflow = '';
            }
        }, 300); // Matches transition duration
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    /* =========================================
       5b. Mobile Center Reveal & Dots
    ========================================= */
    const memberCards = document.querySelectorAll('.member-card');
    const dotContainer = document.getElementById('carousel-dots');

    // We duplicate for infinite scroll, so original count is half
    const originalCardsCount = memberCards.length / 2;

    if (dotContainer && window.innerWidth <= 768) {
        // Create dots for original cards
        for (let i = 0; i < originalCardsCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dotContainer.appendChild(dot);
        }

        const dots = document.querySelectorAll('.carousel-dot');
        const track = document.getElementById('class-carousel-wrapper');

        // Use IntersectionObserver to find which card is at the center
        const observerOptions = {
            root: track,
            rootMargin: '0px -40% 0px -40%', // Triggers when element is near center
            threshold: 0
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove is-center from all
                    memberCards.forEach(c => c.classList.remove('is-center'));
                    // Add is-center to current
                    entry.target.classList.add('is-center');

                    // Update dots based on index
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
    }

    /* =========================================
       6. See All Gallery Modal
    ========================================= */
    const seeAllBtns = document.querySelectorAll('.see-all-btn');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryModalClose = document.getElementById('gallery-modal-close');
    const galleryModalGrid = document.getElementById('gallery-modal-grid');
    const galleryModalTitle = document.getElementById('gallery-modal-title');
    const galleryTabs = document.getElementById('gallery-tabs');
    const tabBtns = document.querySelectorAll('.gallery-tab');

    let currentGalleryData = [];
    let currentFilter = 'image';

    // Sample data for galleries with image/video types
    const galleryData = {
        'class': [
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.43 PM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.43 PMa.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.43 PMb.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.44 PMc.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.44 PMd.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.1AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.2 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.3 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.4 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.6.17 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.8.43 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.813 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.13.59 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.16.48 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.18.24 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.20.00 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.22.19 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.24.15 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.25.05 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 6.27.10 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.51.24 AM.webp' },
            { type: 'image', src: 'assets/optimized/dokumentasi-class/WhatsApp Image 2026-04-30 at 5.52.21 AM.webp' },
            { type: 'material', src: 'assets/optimized/ourclass/materials/WhatsApp Image 2026-04-28 at 9.39.26 PM.webp' },
            { type: 'material', src: 'assets/optimized/ourclass/materials/WhatsApp Image 2026-04-28 at 9.39.27 PM.webp' },
            { type: 'material', src: 'assets/optimized/ourclass/materials/WhatsApp Image 2026-04-28 at 9.39.27 PM (1).webp' }
        ],
        'outclass': [
            { type: 'image', src: 'assets/optimized/outclass/20260420_103904.webp' },
            { type: 'image', src: 'assets/optimized/outclass/20260420_104712.webp' },
            { type: 'image', src: 'assets/optimized/outclass/20260423_101051.webp' },
            { type: 'image', src: 'assets/optimized/outclass/20260423_101056.webp' },
            { type: 'image', src: 'assets/optimized/outclass/20260423_101106.webp' },
            { type: 'image', src: 'assets/optimized/outclass/20260423_101123.webp' },
            { type: 'image', src: 'assets/optimized/outclass/20260423_101218.webp' },
            // { type: 'image', src: 'assets/optimized/outclass/E5A708BE-2F1D-438B-B012-6D08BE2FEF91.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_6490.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_6534.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_6537.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_8953.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_9016.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_9017.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_9021.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_9022.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_9023.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_9025.webp' },
            { type: 'image', src: 'assets/optimized/outclass/IMG_9026.webp' },
            { type: 'image', src: 'assets/optimized/outclass/WhatsApp Image 2026-04-24 at 10.57.48 AM.webp' }
        ],
        'ourclass': [
            { type: 'image', src: 'assets/optimized/ourclass/Anam musholli.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Ahmad Sultonul Haramayn.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Arransyah Mahogra Istiawan.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Sarifatul Azizah.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Glory Naomi Parhusip.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Sultan Nauval Hakim.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Herlando Prayitno.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Eva Purbaningrum.webp' },
            { type: 'image', src: 'assets/optimized/ourclass/Ihsan.webp' },
            { type: 'material', src: 'assets/optimized/ourclass/materials/WhatsApp Image 2026-04-28 at 9.39.26 PM.webp' },
            { type: 'material', src: 'assets/optimized/ourclass/materials/WhatsApp Image 2026-04-28 at 9.39.27 PM.webp' },
            { type: 'material', src: 'assets/optimized/ourclass/materials/WhatsApp Image 2026-04-28 at 9.39.27 PM (1).webp' }
        ],
        'beach': [
            { type: 'image', src: 'assets/optimized/pantai/69837ab3-889d-4e30-a341-e27ba95b9433.webp' },
            { type: 'image', src: 'assets/optimized/pantai/FullSizeRender(1).webp' },
            { type: 'image', src: 'assets/optimized/pantai/FullSizeRender(2).webp' },
            { type: 'image', src: 'assets/optimized/pantai/FullSizeRender(3).webp' },
            { type: 'image', src: 'assets/optimized/pantai/FullSizeRender.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG20260424233229.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG20260424233622.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG20260424233712.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG20260424233818.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG20260424235806.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG20260424235922.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_5582.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5583.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5585.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5586.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5587.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5588.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_5694.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5695.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5723.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5724.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5725.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_5746.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5747.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5748.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5749.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5750.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_5777.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5778.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5779.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5780.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5781.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5782.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_5794.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5795.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5796.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_5797.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_6147.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6153.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6154.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6155.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6159.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6160.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6161.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6162.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6164.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6165.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6166.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_6199.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6201.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6202.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6204.webp' },

            // { type: 'image', src: 'assets/optimized/pantai/IMG_6582.webp' },
            // { type: 'image', src: 'assets/optimized/pantai/IMG_6585.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6587.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6589.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6591.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6592.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6593.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6596.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6597.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6598.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6599.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_6602.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6603.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6605.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6606.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6607.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6608.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6609.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6610.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6612.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6613.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6614.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6615.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6617.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6618.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_6628.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_8854.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8855.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8857.webp' },
            // { type: 'image', src: 'assets/optimized/pantai/IMG_8859.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8867.webp' },
            // { type: 'image', src: 'assets/optimized/pantai/IMG_8878.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8881.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8882.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8883.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8884.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8885.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8886.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_8895.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8896.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8898.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8899.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8900.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8901.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8902.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8903.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8905.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8906.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8907.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_8917.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8918.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8919.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8920.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8922.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8926.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8927.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_8939.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8940.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8941.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_8949.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8950.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8951.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8952.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_8994.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8995.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8996.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_8998.webp' },

            { type: 'image', src: 'assets/optimized/pantai/IMG_9001.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_9002.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_9003.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_9009.webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_9010(1).webp' },
            { type: 'image', src: 'assets/optimized/pantai/IMG_9010.webp' },

            { type: 'image', src: 'assets/optimized/pantai/WhatsApp Image 2026-04-24 at 10.55.42 AM.webp' }
        ]
    };



    const renderGalleryGrid = () => {
        galleryModalGrid.innerHTML = '';
        const filteredData = currentGalleryData.filter(item => item.type === currentFilter);

        if (filteredData.length === 0) {
            galleryModalGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-10">No items found for this category.</p>';
            return;
        }

        filteredData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group h-48';

            if (item.type === 'image' || item.type === 'material') {
                div.classList.add('cursor-pointer');
                div.innerHTML = `
                    <img src="${item.src}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <i class="fa-solid fa-expand text-white text-3xl"></i>
                    </div>
                `;
                div.addEventListener('click', () => {
                    lightboxImg.src = item.src.replace('w=800', 'w=1200');
                    lightbox.classList.remove('hidden');
                    lightbox.classList.add('flex');
                    setTimeout(() => {
                        lightbox.classList.remove('opacity-0');
                        lightboxImg.classList.remove('scale-95');
                        lightboxImg.classList.add('scale-100');
                    }, 10);
                });
            }

            galleryModalGrid.appendChild(div);
        });
    };

    const openGalleryModal = (galleryId) => {
        if (galleryId === 'class') galleryModalTitle.textContent = 'Class Activities';
        else if (galleryId === 'outclass') galleryModalTitle.textContent = 'Outclass Activities';
        else if (galleryId === 'beach') galleryModalTitle.textContent = 'Beach Trip Documentation';
        else if (galleryId === 'ourclass') galleryModalTitle.textContent = 'Our Class';

        currentGalleryData = galleryData[galleryId] || [];

        // Show tabs if there are materials
        const hasMaterials = currentGalleryData.some(item => item.type === 'material');
        if (hasMaterials) {
            galleryTabs.classList.remove('hidden');
        } else {
            galleryTabs.classList.add('hidden');
        }

        // Reset to image tab
        currentFilter = 'image';
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-type') === 'image') {
                btn.classList.add('bg-blue-500', 'text-white');
                btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            } else {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            }
        });

        renderGalleryGrid();

        galleryModal.classList.remove('hidden');
        galleryModal.classList.add('flex');
        setTimeout(() => {
            galleryModal.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            if (currentFilter === type) return;

            // Require password for Materials tab
            if (type === 'material' && !materialsUnlocked) {
                openPasswordModal(btn);
                return;
            }

            currentFilter = type;

            // Update active styles
            tabBtns.forEach(b => {
                b.classList.remove('bg-blue-500', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            });
            btn.classList.add('bg-blue-500', 'text-white');
            btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');

            renderGalleryGrid();
        });
    });

    /* =========================================
       6b. Password Modal for Materials
    ========================================= */
    let materialsUnlocked = false;
    let pendingMaterialBtn = null;

    const MATERIALS_PASSWORD = 'JOBINTERVIEW10APRIL2026';

    const passwordModal = document.getElementById('password-modal');
    const passwordBox = document.getElementById('password-box');
    const passwordInput = document.getElementById('password-input');
    const passwordError = document.getElementById('password-error');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordCancel = document.getElementById('password-cancel');
    const togglePassword = document.getElementById('toggle-password');

    const openPasswordModal = (triggerBtn) => {
        pendingMaterialBtn = triggerBtn;
        passwordInput.value = '';
        passwordError.classList.add('hidden');
        passwordModal.classList.remove('hidden');
        passwordModal.classList.add('flex');
        setTimeout(() => {
            passwordModal.classList.remove('opacity-0');
            passwordBox.classList.remove('scale-95');
            passwordBox.classList.add('scale-100');
            passwordInput.focus();
        }, 10);
    };

    const closePasswordModal = () => {
        passwordModal.classList.add('opacity-0');
        passwordBox.classList.remove('scale-100');
        passwordBox.classList.add('scale-95');
        setTimeout(() => {
            passwordModal.classList.add('hidden');
            passwordModal.classList.remove('flex');
        }, 300);
    };

    const submitPassword = () => {
        const val = passwordInput.value.trim();
        if (val === MATERIALS_PASSWORD) {
            materialsUnlocked = true;
            closePasswordModal();

            // Auto-click the materials tab after unlock
            if (pendingMaterialBtn) {
                currentFilter = 'material';
                tabBtns.forEach(b => {
                    b.classList.remove('bg-blue-500', 'text-white');
                    b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
                });
                pendingMaterialBtn.classList.add('bg-blue-500', 'text-white');
                pendingMaterialBtn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
                renderGalleryGrid();
                pendingMaterialBtn = null;
            }
        } else {
            passwordError.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            passwordInput.classList.add('border-red-400', 'ring-2', 'ring-red-200');
            setTimeout(() => {
                passwordInput.classList.remove('border-red-400', 'ring-2', 'ring-red-200');
            }, 1500);
        }
    };

    passwordSubmit.addEventListener('click', submitPassword);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitPassword();
    });
    passwordCancel.addEventListener('click', closePasswordModal);
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) closePasswordModal();
    });

    // Toggle show/hide password
    togglePassword.addEventListener('click', () => {
        const icon = togglePassword.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });


    const closeGalleryModal = () => {
        galleryModal.classList.add('opacity-0');
        setTimeout(() => {
            galleryModal.classList.add('hidden');
            galleryModal.classList.remove('flex');
            if (lightbox.classList.contains('hidden')) {
                document.body.style.overflow = '';
            }
        }, 300);
    };

    seeAllBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gallery = btn.getAttribute('data-gallery');
            openGalleryModal(gallery);
        });
    });

    if (galleryModalClose) {
        galleryModalClose.addEventListener('click', closeGalleryModal);
    }

    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                closeGalleryModal();
            }
        });
    }

    // Close on Escape key (handled for both modals)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!lightbox.classList.contains('hidden')) {
                closeLightbox();
            } else if (galleryModal && !galleryModal.classList.contains('hidden')) {
                closeGalleryModal();
            }
        }
    });

    /* =========================================
       7. JS Auto-Scroll for Carousels
    ========================================= */
    const setupAutoScroll = (wrapperId, trackId, speed = 1, reverse = false) => {
        const wrapper = document.getElementById(wrapperId);
        const track = document.getElementById(trackId);
        if (!wrapper || !track) return;

        let isHovered = false;
        let animationId;

        // Duplicate content for smooth infinite scrolling
        track.innerHTML += track.innerHTML;

        const scrollStep = () => {
            if (!isHovered) {
                if (reverse) {
                    wrapper.scrollLeft -= speed;
                    if (wrapper.scrollLeft <= 0) {
                        wrapper.scrollLeft = track.scrollWidth / 2;
                    }
                } else {
                    wrapper.scrollLeft += speed;
                    if (wrapper.scrollLeft >= track.scrollWidth / 2) {
                        wrapper.scrollLeft = 0;
                    }
                }
            }
            animationId = requestAnimationFrame(scrollStep);
        };

        // Pause on hover or touch
        wrapper.addEventListener('mouseenter', () => isHovered = true);
        wrapper.addEventListener('mouseleave', () => isHovered = false);
        wrapper.addEventListener('touchstart', () => isHovered = true, { passive: true });
        wrapper.addEventListener('touchend', () => isHovered = false);

        // Start
        if (reverse) {
            // Need small timeout to ensure layout is calculated for scrollWidth
            setTimeout(() => wrapper.scrollLeft = track.scrollWidth / 2, 100);
        }
        animationId = requestAnimationFrame(scrollStep);
    };

    setupAutoScroll('class-carousel-wrapper', 'class-carousel', 1, false);
    setupAutoScroll('outclass-carousel-wrapper', 'outclass-carousel', 1, true);
});

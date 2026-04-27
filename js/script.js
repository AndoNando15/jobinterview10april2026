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
       5b. Mobile Click for Member Cards
    ========================================= */
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach(card => {
        card.addEventListener('click', () => {
            memberCards.forEach(c => {
                if (c !== card) c.classList.remove('mobile-active');
            });
            card.classList.toggle('mobile-active');
        });
    });

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
            { type: 'image', src: 'assets/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.43 PM.jpeg' },
            { type: 'image', src: 'assets/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.43 PMa.jpeg' },
            { type: 'image', src: 'assets/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.43 PMb.jpeg' },
            { type: 'video', src: 'assets/dokumentasi-class/videos/video1.mp4' },
            { type: 'image', src: 'assets/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.44 PMc.jpeg' },
            { type: 'image', src: 'assets/dokumentasi-class/WhatsApp Image 2026-04-23 at 12.01.44 PMd.jpeg' },
            { type: 'video', src: 'assets/dokumentasi-class/videos/video2.mp4' }
        ],
        'outclass': [
            { type: 'image', src: 'assets/outclass/20260420_103904.jpg' },
            { type: 'image', src: 'assets/outclass/20260420_104712.jpg' },
            { type: 'image', src: 'assets/outclass/20260423_101051.jpg' },
            { type: 'image', src: 'assets/outclass/20260423_101056.jpg' },
            { type: 'image', src: 'assets/outclass/20260423_101106.jpg' },
            { type: 'image', src: 'assets/outclass/20260423_101123.jpg' },
            { type: 'image', src: 'assets/outclass/20260423_101218.jpg' },
            { type: 'image', src: 'assets/outclass/E5A708BE-2F1D-438B-B012-6D08BE2FEF91.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_6490.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_6534.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_6537.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_8953.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_9016.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_9017.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_9021.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_9022.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_9023.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_9025.jpg' },
            { type: 'image', src: 'assets/outclass/IMG_9026.jpg' },
            { type: 'image', src: 'assets/outclass/WhatsApp Image 2026-04-24 at 10.57.48 AM.jpeg' },
            { type: 'video', src: 'assets/outclass/videos/WhatsApp Video 2026-04-24 at 11.16.16 AM.mp4' }
        ],
        'beach': [
            { type: 'image', src: 'assets/pantai/69837ab3-889d-4e30-a341-e27ba95b9433.jpg' },
            { type: 'image', src: 'assets/pantai/FullSizeRender(1).jpg' },
            { type: 'image', src: 'assets/pantai/FullSizeRender(2).jpg' },
            { type: 'image', src: 'assets/pantai/FullSizeRender(3).jpg' },
            { type: 'image', src: 'assets/pantai/FullSizeRender.jpg' },
            { type: 'image', src: 'assets/pantai/IMG20260424233229.jpg' },
            { type: 'image', src: 'assets/pantai/IMG20260424233622.jpg' },
            { type: 'image', src: 'assets/pantai/IMG20260424233712.jpg' },
            { type: 'image', src: 'assets/pantai/IMG20260424233818.jpg' },
            { type: 'image', src: 'assets/pantai/IMG20260424235806.jpg' },
            { type: 'image', src: 'assets/pantai/IMG20260424235922.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5582.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5583.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5585.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5586.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5587.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5588.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5694.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5695.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5723.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5724.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5725.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5746.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5747.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5748.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5749.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5750.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5777.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5778.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5779.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5780.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5781.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5782.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5794.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5795.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5796.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_5797.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6147.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6153.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6154.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6155.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6159.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6160.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6161.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6162.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6164.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6165.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6166.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6199.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6201.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6202.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6204.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6582.JPG' },
            { type: 'image', src: 'assets/pantai/IMG_6585.JPG' },
            { type: 'image', src: 'assets/pantai/IMG_6587.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6589.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6591.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6592.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6593.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6596.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6597.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6598.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6599.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6602.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6603.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6605.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6606.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6607.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6608.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6609.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6610.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6612.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6613.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6614.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6615.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6617.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6618.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_6628.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8854.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8855.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8857.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8859.JPG' },
            { type: 'image', src: 'assets/pantai/IMG_8867.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8878.JPG' },
            { type: 'image', src: 'assets/pantai/IMG_8881.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8882.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8883.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8884.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8885.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8886.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8895.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8896.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8898.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8899.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8900.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8901.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8902.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8903.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8905.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8906.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8907.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8917.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8918.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8919.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8920.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8922.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8926.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8927.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8939.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8940.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8941.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8949.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8950.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8951.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8952.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8994.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8995.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8996.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_8998.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_9001.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_9002.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_9003.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_9009.jpg' },
            { type: 'image', src: 'assets/pantai/IMG_9010(1).jpg' },
            { type: 'image', src: 'assets/pantai/IMG_9010.jpg' },
            { type: 'image', src: 'assets/pantai/WhatsApp Image 2026-04-24 at 10.55.42 AM.jpeg' }
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

            if (item.type === 'image') {
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
            } else if (item.type === 'video') {
                div.innerHTML = `
                    <video src="${item.src}" controls class="w-full h-full object-cover bg-black"></video>
                `;
            }

            galleryModalGrid.appendChild(div);
        });
    };

    const openGalleryModal = (galleryId) => {
        if (galleryId === 'class') galleryModalTitle.textContent = 'Class Activities';
        else if (galleryId === 'outclass') galleryModalTitle.textContent = 'Outclass Activities';
        else if (galleryId === 'beach') galleryModalTitle.textContent = 'Beach Trip Documentation';

        currentGalleryData = galleryData[galleryId] || [];

        // Show tabs if there are videos
        const hasVideos = currentGalleryData.some(item => item.type === 'video');
        if (hasVideos) {
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

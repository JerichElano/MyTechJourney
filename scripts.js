    // Dynamically set the current year for the copyright notice
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navContainer = document.getElementById('nav-container');
    const mobileMenu = document.getElementById('mobile-menu'); // Get mobile menu element
    const menuIcon = mobileMenuButton.querySelector('i');

    mobileMenuButton.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        // Toggle visibility for mobile menu
        mobileMenu.classList.toggle('opacity-0');
        mobileMenu.classList.toggle('h-0');
        mobileMenu.classList.toggle('h-auto'); // Adjust height dynamically

        // Toggle the icon between fa-bars and fa-times
        if (navContainer.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            mobileMenu.classList.add('opacity-0');
            mobileMenu.classList.add('h-0');
            mobileMenu.classList.remove('h-auto');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        });
    });

    // Gemini API integration for generating summary in the footer
    document.getElementById('generate-summary-btn').addEventListener('click', async () => {
        const summaryElement = document.getElementById('about-us-summary');
        const originalSummary = summaryElement.textContent;
        summaryElement.textContent = 'Generating summary...';

        try {
            let chatHistory = [];
            const prompt = "Generate a concise, professional, and impactful summary (around 30-50 words) for a digital agency named 'Bazil' specializing in modern web development and creating engaging digital experiences.";
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will automatically provide the API key at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const generatedText = result.candidates[0].content.parts[0].text;
                summaryElement.textContent = generatedText;
            } else {
                summaryElement.textContent = originalSummary;
                console.error('Gemini API response structure unexpected:', result);
            }
        } catch (error) {
            summaryElement.textContent = originalSummary;
            console.error('Error calling Gemini API:', error);
        }
    });

    // WebGL Background for Hero Section using god_rays.json
    let scene, camera, renderer, uniforms;
    async function initBackground() {
        const container = document.getElementById('hero-background');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '0';

        // Load the god_rays.json file
        const response = await fetch('assets/json/god_rays.json');
        const shaderData = await response.json();

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        camera.position.z = 1;

        renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
        uniforms = {
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Vector2() },
            u_time: { value: 0 },
            u_colors: { value: [
                new THREE.Vector4(...shaderData.uniforms.u_colors[0]),
                new THREE.Vector4(...shaderData.uniforms.u_colors[1])
            ] },
            u_intensity: { value: shaderData.uniforms.u_intensity },
            u_rays: { value: shaderData.uniforms.u_rays },
            u_reach: { value: shaderData.uniforms.u_reach }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader: shaderData.vertexShader,
            fragmentShader: shaderData.fragmentShader,
            uniforms: uniforms,
            transparent: true
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        if (uniforms) uniforms.u_time.value += 0.05;
        if (renderer) renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.left = window.innerWidth / -2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / -2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (uniforms) uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);
    initBackground().catch(error => console.error('Error initializing background:', error));


    // --- Parallax Effect for Main.png Image ---
    document.addEventListener('DOMContentLoaded', () => {
        // Ensure custom cursor works by scaling source image to 32x32 via canvas
        (function applyCustomCursor() {
            const src = 'assets/jerichIcon-white.png';
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const size = 32;
                    const canvas = document.createElement('canvas');
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    // Draw centered cover-fit
                    const ratio = Math.min(size / img.width, size / img.height);
                    const w = Math.round(img.width * ratio);
                    const h = Math.round(img.height * ratio);
                    const x = Math.round((size - w) / 2);
                    const y = Math.round((size - h) / 2);
                    ctx.clearRect(0, 0, size, size);
                    ctx.drawImage(img, x, y, w, h);
                    const dataUrl = canvas.toDataURL('image/png');
                    const styleEl = document.createElement('style');
                    styleEl.id = 'we-custom-cursor-style';
                    styleEl.textContent = `
                        .we-card, .we-card * { cursor: url(${dataUrl}) 16 16, pointer !important; }
                    `;
                    document.head.appendChild(styleEl);
                } catch (e) {
                    // Fallback: pointer
                }
            };
            img.onerror = () => {
                // ignore; keep default pointer
            };
            img.src = src;
        })();
        // Flip interaction for Work Experience cards
        const weCards = document.querySelectorAll('.we-card');
        weCards.forEach(card => {
            const toggleFlip = (e) => {
                // Prevent navigating if link-icons are clicked
                const target = e.target;
                if (target.closest && target.closest('.link-icon')) return;
                card.classList.toggle('is-flipped');
            };
            card.addEventListener('click', toggleFlip);
            card.setAttribute('tabindex', '0');
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFlip(e);
                }
            });
        });

        // No fullscreen buttons; removed previous behavior per request

        const heroSection = document.getElementById('home');
        const mainPersonImage = document.getElementById('main-person-image');

        if (heroSection && mainPersonImage) {
            let sectionRect = heroSection.getBoundingClientRect(); // Get section dimensions
            let sectionCenterX = sectionRect.left + sectionRect.width / 2;
            let sectionCenterY = sectionRect.top + sectionRect.height / 2;

            let animationFrameRequested = false;

            heroSection.addEventListener('mousemove', (e) => {
                if (!animationFrameRequested) {
                    requestAnimationFrame(() => {
                        // Calculate mouse position relative to the center of the hero section
                        let mouseX = e.clientX - sectionCenterX;
                        let mouseY = e.clientY - sectionCenterY;

                        // Define the maximum movement range for the image (in pixels)
                        const moveRangeX = 15; // Max horizontal movement
                        const moveRangeY = 10; // Max vertical movement

                        // Normalize mouse position relative to section size (-1 to 1)
                        let normalizedX = mouseX / (sectionRect.width / 2);
                        let normalizedY = mouseY / (sectionRect.height / 2);

                        // Calculate the translation amounts
                        let translateX = normalizedX * moveRangeX;
                        let translateY = normalizedY * moveRangeY;

                        // Apply the new transform, preserving the existing -translate-x-1/2 for centering
                        // The order of transform functions matters: translateX(-50%) should be first for self-centering
                        mainPersonImage.style.transform = `translateX(-50%) translate(${translateX}px, ${translateY}px)`;

                        animationFrameRequested = false;
                    });
                    animationFrameRequested = true;
                }
            });

            // Reset image position when the mouse leaves the hero section
            heroSection.addEventListener('mouseleave', () => {
                if (!animationFrameRequested) {
                    requestAnimationFrame(() => {
                        mainPersonImage.style.transform = `translateX(-50%)`; // Reset to original centered position
                        animationFrameRequested = false;
                    });
                    animationFrameRequested = true;
                }
            });

            // Recalculate section center on window resize to keep the effect accurate
            window.addEventListener('resize', () => {
                sectionRect = heroSection.getBoundingClientRect();
                sectionCenterX = sectionRect.left + sectionRect.width / 2;
                sectionCenterY = sectionRect.top + sectionRect.height / 2;
            });
        }
    });

    // --- Enhanced Infinite Carousel with Smooth Animation and Correct Left/Right Click Behavior ---
    document.addEventListener('DOMContentLoaded', () => {
        const carouselSlidesContainer = document.getElementById('carouselSlides');
        const carouselWrapper = document.getElementById('carouselWrapper');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const originalSlides = Array.from(carouselSlidesContainer.children);
        const totalOriginalSlides = originalSlides.length;
        let slidesPerPage = 3;
        let currentIndex = 0;
        let isTransitioning = false;
        let isDragging = false;
        let dragStartX = 0;
        let dragCurrentX = 0;
        let prevTranslate = 0;
        const transitionDuration = 500; // ms

        // --- Helper: Set grayscale with smooth transition ---
        function setGrayscale(slide, isGray) {
            slide.style.transition = 'filter 0.4s cubic-bezier(0.4,0.2,0.2,1)';
            slide.style.filter = isGray ? 'grayscale(1)' : 'grayscale(0)';
        }

        // --- Responsive slides per page ---
        function updateSlidesPerPage() {
            if (window.innerWidth < 768) {
                slidesPerPage = 1;
            } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                slidesPerPage = 2;
            } else {
                slidesPerPage = 3;
            }
            cloneSlides();
            currentIndex = slidesPerPage;
            updateCarousel(true);
        }

        // --- Clone slides for infinite effect ---
        function cloneSlides() {
            // Remove all children (including old clones)
            while (carouselSlidesContainer.firstChild) {
                carouselSlidesContainer.removeChild(carouselSlidesContainer.firstChild);
            }
            // Add clones at start (last N)
            for (let i = totalOriginalSlides - slidesPerPage; i < totalOriginalSlides; i++) {
                const clone = originalSlides[i].cloneNode(true);
                clone.classList.add('cloned');
                carouselSlidesContainer.appendChild(clone);
            }
            // Add originals
            originalSlides.forEach(slide => {
                carouselSlidesContainer.appendChild(slide);
            });
            // Add clones at end (first N)
            for (let i = 0; i < slidesPerPage; i++) {
                const clone = originalSlides[i].cloneNode(true);
                clone.classList.add('cloned');
                carouselSlidesContainer.appendChild(clone);
            }
            attachSlideClickListeners();
        }

        // --- Animate carousel movement with requestAnimationFrame for smoothness ---
        function setCarouselTransform(translate, withTransition = true) {
            if (withTransition) {
                carouselSlidesContainer.style.transition = `transform ${transitionDuration / 1000}s cubic-bezier(0.4,0.2,0.2,1)`;
            } else {
                carouselSlidesContainer.style.transition = 'none';
            }
            carouselSlidesContainer.style.transform = `translateX(-${translate}%)`;
        }

        function getTranslateForIndex(index) {
            return index * (100 / slidesPerPage);
        }

        function updateCarousel(instant = false) {
            setCarouselTransform(getTranslateForIndex(currentIndex), !instant);
            updateButtonStates();
            updateSlideStates();
        }

        // --- Button state logic ---
        function updateButtonStates() {
            const disableButtons = totalOriginalSlides <= slidesPerPage;
            prevBtn.disabled = disableButtons;
            nextBtn.disabled = disableButtons;
        }

        // --- Slide state logic (active/grayscale) with smooth fade ---
        function updateSlideStates() {
            const allSlides = carouselSlidesContainer.querySelectorAll('.carousel-slide, .cloned.carousel-slide');
            const centerSlideIndexOffset = Math.floor(slidesPerPage / 2);
            allSlides.forEach((slide, index) => {
                const isActiveSlide = (index === currentIndex + centerSlideIndexOffset);
                if (isActiveSlide) {
                    slide.classList.add('is-active');
                    setGrayscale(slide, false);
                } else {
                    slide.classList.remove('is-active');
                    setGrayscale(slide, true);
                }
            });
        }

        // --- Carousel navigation logic ---
        function goToNextSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateCarousel();
            setTimeout(() => {
                if (currentIndex >= totalOriginalSlides + slidesPerPage) {
                    // Instantly jump to the real first slide (no transition)
                    carouselSlidesContainer.style.transition = 'none';
                    currentIndex = slidesPerPage;
                    setCarouselTransform(getTranslateForIndex(currentIndex), false);
                }
                isTransitioning = false;
                updateSlideStates();
            }, transitionDuration);
        }

        function goToPrevSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updateCarousel();
            setTimeout(() => {
                if (currentIndex < slidesPerPage) {
                    // Instantly jump to the real last slide (no transition)
                    carouselSlidesContainer.style.transition = 'none';
                    currentIndex = totalOriginalSlides + slidesPerPage - 1;
                    setCarouselTransform(getTranslateForIndex(currentIndex), false);
                }
                isTransitioning = false;
                updateSlideStates();
            }, transitionDuration);
        }

        // --- Click on slide to navigate, with left-side awareness ---
        function attachSlideClickListeners() {
            const allSlides = carouselSlidesContainer.querySelectorAll('.carousel-slide, .cloned.carousel-slide');
            allSlides.forEach((slide, index) => {
                slide.onclick = () => {
                    const centerSlideIndexOffset = Math.floor(slidesPerPage / 2);
                    const isActiveSlide = (index === currentIndex + centerSlideIndexOffset);
                    if (isActiveSlide) {
                        // Already active, do nothing
                    } else if (index < currentIndex + centerSlideIndexOffset) {
                        // Clicked on left image: scroll to the right (show image from the left)
                        goToPrevSlide();
                    } else if (index > currentIndex + centerSlideIndexOffset) {
                        // Clicked on right image: scroll to the left (show image from the right)
                        goToNextSlide();
                    }
                };
            });
        }

        // --- Touch/Swipe support for smooth navigation ---
        function onDragStart(e) {
            if (isTransitioning) return;
            isDragging = true;
            dragStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            dragCurrentX = dragStartX;
            prevTranslate = getTranslateForIndex(currentIndex);
            carouselSlidesContainer.style.transition = 'none';
        }

        function onDragMove(e) {
            if (!isDragging) return;
            dragCurrentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const moveX = dragCurrentX - dragStartX;
            const percentMove = (moveX / carouselWrapper.offsetWidth) * 100;
            const currentTranslate = prevTranslate - percentMove;
            carouselSlidesContainer.style.transform = `translateX(-${currentTranslate}%)`;
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            const movedBy = dragCurrentX - dragStartX;
            const threshold = carouselWrapper.offsetWidth * 0.15; // 15% swipe to trigger
            if (movedBy < -threshold) {
                goToNextSlide();
            } else if (movedBy > threshold) {
                goToPrevSlide();
            } else {
                updateCarousel();
            }
        }

        // Mouse events
        carouselWrapper.addEventListener('mousedown', onDragStart);
        carouselWrapper.addEventListener('mousemove', onDragMove);
        carouselWrapper.addEventListener('mouseup', onDragEnd);
        carouselWrapper.addEventListener('mouseleave', () => { if (isDragging) onDragEnd(); });

        // Touch events
        carouselWrapper.addEventListener('touchstart', onDragStart, { passive: true });
        carouselWrapper.addEventListener('touchmove', onDragMove, { passive: true });
        carouselWrapper.addEventListener('touchend', onDragEnd);

        // --- Button events ---
        nextBtn.addEventListener('click', goToNextSlide);
        prevBtn.addEventListener('click', goToPrevSlide);

        // --- Responsive ---
        window.addEventListener('resize', updateSlidesPerPage);

        // --- Initialize ---
        updateSlidesPerPage();
    });

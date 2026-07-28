document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // 1. Sofi Health Organic Loader & SVG Draw
    const initLoader = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('is-loading');
                document.getElementById('sofi-loader').style.display = 'none';
                initScrollAnimations();
                initPersistentBackground();
            }
        });

        // Draw the SVG LFK logo
        tl.to(".svg-draw-path", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.2 })
          // fade in the subtext
          .to(".svg-draw-text", { opacity: 1, duration: 0.5 }, "-=0.5")
          // Progress bar appears
          .to(".loader-progress-bar", { opacity: 1, duration: 0.4 }, "-=0.2")
          // Fill progress
          .to(".loader-progress-fill", { width: "100%", duration: 1.2, ease: "power2.inOut" })
          // Fade out logo/bar
          .to([".loader-svg-logo", ".loader-progress-bar"], { opacity: 0, duration: 0.4, ease: "power2.in" })
          // Organic Wipe (panels open like eyelids)
          .to(".top-panel", { height: 0, duration: 1.2, ease: "expo.inOut" }, "wipe")
          .to(".bottom-panel", { height: 0, duration: 1.2, ease: "expo.inOut" }, "wipe");
          
        return tl;
    };

    // 2. Bilingual Toggle System
    const langToggle = document.getElementById('lang-toggle');
    const i18nElements = document.querySelectorAll('.i18n');

    if(langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = langToggle.getAttribute('data-current');
            const newLang = currentLang === 'en' ? 'es' : 'en';
            
            langToggle.setAttribute('data-current', newLang);
            langToggle.textContent = newLang === 'en' ? 'Español' : 'English';

            i18nElements.forEach(el => {
                const translation = el.getAttribute(`data-${newLang}`);
                if (translation) el.textContent = translation;
            });
        });
    }

    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            document.body.style.overflow = mobileMenu.classList.contains('is-active') ? 'hidden' : '';
        });
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('is-active');
            
            // Close all others
            document.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('is-active');
                other.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('is-active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 3. Scroll Animations (Sofi Style)
    const initScrollAnimations = () => {
        // Curtain Reveal Parallax
        const sections = gsap.utils.toArray('.pin-section');
        sections.forEach((section, i) => {
            gsap.to(section, {
                yPercent: -20, ease: "none",
                scrollTrigger: { trigger: section, start: "bottom bottom", end: "bottom top", scrub: true }
            });
        });

        // Hero initial reveals
        gsap.to(".hero-image-wrapper", { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" });
        gsap.to("#hero .gs-text-reveal", { y: "0%", duration: 1.2, stagger: 0.1, ease: "power4.out" });

        // Scroll Triggers for text masks
        document.querySelectorAll(':not(#hero) .gs-text-reveal').forEach(text => {
            gsap.to(text, {
                scrollTrigger: { trigger: text.closest('.mask-wrap'), start: "top 90%", toggleActions: "play none none none" },
                y: "0%", duration: 1.2, ease: "power4.out"
            });
        });

        // Generic Fade Ups
        gsap.utils.toArray('.gs-fade-up').forEach(el => {
            gsap.from(el, { scrollTrigger: { trigger: el, start: "top 90%" }, y: 40, opacity: 0, duration: 1, ease: "power3.out" });
        });

        // Image Parallax (exclude canvas)
        document.querySelectorAll('img[data-speed]').forEach(img => {
            gsap.to(img, {
                yPercent: 15, ease: "none",
                scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
            });
        });
    };

    // 4. Persistent Scroll Background (Tonik Style)
    const initPersistentBackground = () => {
        const sections = document.querySelectorAll('[data-bg]');
        const bgLayers = document.querySelectorAll('.bg-layer');
        if (!bgLayers.length) return;

        // Animate all layers slowly for a "breathing" effect
        bgLayers.forEach(layer => {
            gsap.to(layer, {
                scale: 1.15,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });

        // Set up ScrollTrigger for each section that dictates a background state
        sections.forEach(section => {
            const bgId = section.getAttribute('data-bg');
            const targetBg = document.getElementById(bgId);

            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => activateBg(targetBg),
                onEnterBack: () => activateBg(targetBg)
            });
        });

        function activateBg(targetBg) {
            if (!targetBg || targetBg.classList.contains('active')) return;
            
            // Remove active class from all
            bgLayers.forEach(layer => layer.classList.remove('active'));
            
            // Add active class to target (CSS transition handles opacity crossfade)
            targetBg.classList.add('active');
        }
    };

    // 5. Footer Video Speed adjustment
    const footerVideo = document.querySelector('.footer-video-bg');
    if (footerVideo) {
        footerVideo.playbackRate = 0.75;
    }

    // Start Loader
    initLoader();

});

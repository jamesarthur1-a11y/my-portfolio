
/* =========================================================
   HTET WAI YAN - PERSONAL PORTFOLIO
   MAIN JAVASCRIPT
========================================================= */

"use strict";

/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const preloader = document.querySelector(".preloader");

const header = document.querySelector(".header");

const themeToggle = document.querySelector(
    ".theme-toggle, #theme-toggle, #themeToggle"
);

const menuToggle = document.querySelector(
    ".menu-toggle, #menu-toggle, #menuToggle"
);

const navMenu = document.querySelector(".nav-menu");

const navLinks = document.querySelectorAll(".nav-link");

const projectCards = document.querySelectorAll(".project-card");

const filterButtons = document.querySelectorAll(
    ".filter-btn, .project-filter-btn"
);

const backToTop = document.querySelector(
    ".back-to-top, #back-to-top, #backToTop"
);

/* =========================================================
   2. PRELOADER
   Hide preloader after page loading is completed
========================================================= */

function initPreloader() {

    if (!preloader) return;

    const hidePreloader = () => {

        preloader.classList.add("loaded");

        setTimeout(() => {

            preloader.style.display = "none";

        }, 600);

    };

    if (document.readyState === "complete") {

        hidePreloader();

    } else {

        window.addEventListener("load", hidePreloader, {
            once: true
        });

    }

}

/* =========================================================
   3. DARK MODE / LIGHT MODE
   Save user preference using localStorage
========================================================= */

function initThemeToggle() {

    const toggleButtons = document.querySelectorAll(
        ".theme-toggle, #theme-toggle, #themeToggle"
    );

    if (toggleButtons.length === 0) return;

    const savedTheme = localStorage.getItem("portfolio-theme");

    const prefersLight = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;

    const initialTheme = savedTheme ||
        (prefersLight ? "light" : "dark");

    applyTheme(initialTheme);

    toggleButtons.forEach(button => {

        button.addEventListener("click", () => {

            const currentTheme = document.body.classList.contains(
                "light-theme"
            ) ? "light" : "dark";

            const newTheme = currentTheme === "dark"
                ? "light"
                : "dark";

            applyTheme(newTheme);

            localStorage.setItem("portfolio-theme", newTheme);

        });

    });

}

function applyTheme(theme) {

    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);

    const toggleButtons = document.querySelectorAll(
        ".theme-toggle, #theme-toggle, #themeToggle"
    );

    toggleButtons.forEach(button => {

        button.setAttribute(
            "aria-label",
            isLight ? "Switch to dark mode" : "Switch to light mode"
        );

        button.setAttribute("aria-pressed", String(isLight));

        const icon = button.querySelector("i, svg");

        if (icon) {

            if (icon.tagName.toLowerCase() === "i") {

                icon.classList.remove(
                    "fa-sun",
                    "fa-moon"
                );

                icon.classList.add(
                    isLight ? "fa-moon" : "fa-sun"
                );

            }

        }

    });

}

/* =========================================================
   4. MOBILE NAVIGATION MENU
   Open / Close hamburger menu
========================================================= */

function initMobileMenu() {

    if (!menuToggle || !navMenu) return;

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.setAttribute("role", "button");

    menuToggle.setAttribute("tabindex", "0");

    function toggleMenu() {

        const isOpen = navMenu.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        document.body.classList.toggle("menu-open", isOpen);

    }

    function closeMenu() {

        navMenu.classList.remove("active");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Open navigation menu");

        document.body.classList.remove("menu-open");

    }

    menuToggle.addEventListener("click", toggleMenu);

    menuToggle.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();

            toggleMenu();

        }

    });

    // Close menu after clicking navigation link

    navLinks.forEach(link => {

        link.addEventListener("click", closeMenu);

    });

    // Close menu when clicking outside

    document.addEventListener("click", event => {

        const clickedInsideMenu = navMenu.contains(event.target);

        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {

            closeMenu();

        }

    });

    // Close menu using Escape key

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeMenu();

        }

    });

    // Close mobile menu when resizing to desktop

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            closeMenu();

        }

    });

}

/* =========================================================
   5. PROJECT FILTER
   Filter projects by category
========================================================= */

function initProjectFilter() {

    const buttons = document.querySelectorAll(
        ".filter-btn, .project-filter-btn"
    );

    const cards = document.querySelectorAll(".project-card");

    if (buttons.length === 0 || cards.length === 0) return;

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedCategory = (
                button.dataset.filter ||
                button.dataset.category ||
                "all"
            ).toLowerCase();

            // Update active filter button

            buttons.forEach(item => {

                item.classList.remove("active");

                item.setAttribute("aria-pressed", "false");

            });

            button.classList.add("active");

            button.setAttribute("aria-pressed", "true");

            // Filter project cards

            cards.forEach(card => {

                const cardCategory = (
                    card.dataset.category || ""
                ).toLowerCase();

                const shouldShow =
                    selectedCategory === "all" ||
                    selectedCategory === cardCategory ||
                    cardCategory.split(/\s+/).includes(selectedCategory);

                if (shouldShow) {

                    card.classList.remove("hidden");

                    card.style.display = "";

                } else {

                    card.classList.add("hidden");

                    card.style.display = "none";

                }

            });

        });

    });

}

/* =========================================================
   6. SCROLL REVEAL
   Reveal elements when entering viewport
========================================================= */

function initScrollReveal() {

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, " +
        ".reveal-up, .section-header, " +
        ".skill-card, .project-card, " +
        ".experience-card, .research-card, .interest-card"
    );

    if (revealElements.length === 0) return;

    // Fallback for browsers without IntersectionObserver

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

        return;

    }

    const observer = new IntersectionObserver(

        (entries, currentObserver) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    currentObserver.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }

    );

    revealElements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });

}

/* =========================================================
   7. BACK TO TOP BUTTON
   Show button when scrolling down
========================================================= */

function initBackToTop() {

    if (!backToTop) return;

    function updateBackToTop() {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }

    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );

    backToTop.addEventListener("click", event => {

        event.preventDefault();

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    updateBackToTop();

}

/* =========================================================
   8. STICKY HEADER
   Add scrolled class when scrolling
========================================================= */

function initStickyHeader() {

    if (!header) return;

    function updateHeader() {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();

}

/* =========================================================
   9. ACTIVE NAVIGATION LINK
   Highlight current section
========================================================= */

function initActiveNavigation() {

    const sections = document.querySelectorAll("section[id]");

    if (sections.length === 0 || navLinks.length === 0) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const currentId = entry.target.id;

                    navLinks.forEach(link => {

                        const href = link.getAttribute("href");

                        const isActive = href === `#${currentId}`;

                        link.classList.toggle("active", isActive);

                    });

                }

            });

        },

        {
            rootMargin: "-35% 0px -55% 0px"
        }

    );

    sections.forEach(section => {

        observer.observe(section);

    });

}

/* =========================================================
   10. TYPING EFFECT
   Animated text in hero section
========================================================= */

function initTypingEffect() {

    const typingElement = document.querySelector(".typing-text");

    if (!typingElement) return;

    let words = [];

    try {

        words = JSON.parse(
            typingElement.dataset.words || "[]"
        );

    } catch (error) {

        words = [];

    }

    if (!Array.isArray(words) || words.length === 0) {

        return;

    }

    let wordIndex = 0;

    let characterIndex = 0;

    let isDeleting = false;

    function type() {

        const currentWord = words[wordIndex];

        if (!currentWord) return;

        if (isDeleting) {

            characterIndex--;

        } else {

            characterIndex++;

        }

        typingElement.textContent = currentWord.substring(
            0,
            characterIndex
        );

        let speed = isDeleting ? 45 : 90;

        if (!isDeleting && characterIndex === currentWord.length) {

            speed = 1500;

            isDeleting = true;

        } else if (isDeleting && characterIndex === 0) {

            isDeleting = false;

            wordIndex = (wordIndex + 1) % words.length;

            speed = 400;

        }

        setTimeout(type, speed);

    }

    type();

}

/* =========================================================
   11. CURRENT YEAR
   Automatically update copyright year
========================================================= */

function initCurrentYear() {

    const yearElements = document.querySelectorAll(
        "#current-year, .current-year"
    );

    const currentYear = new Date().getFullYear();

    yearElements.forEach(element => {

        element.textContent = currentYear;

    });

}

/* =========================================================
   12. INITIALIZE ALL FUNCTIONS
   Run after HTML document is ready
========================================================= */

function initPortfolio() {

    initPreloader();

    initThemeToggle();

    initMobileMenu();

    initProjectFilter();

    initScrollReveal();

    initBackToTop();

    initStickyHeader();

    initActiveNavigation();

    initTypingEffect();

    initCurrentYear();

}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initPortfolio,
        { once: true }
    );

} else {

    initPortfolio();

}

/* =========================================================
   END OF MAIN JAVASCRIPT
========================================================= */
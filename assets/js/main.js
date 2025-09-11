document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin)

    /// ScrollSmoother
    const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
        smoothTouch: 0.1,
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        onUpdate: (self) => {
            ScrollTrigger.update();
        }
    });

    // Scrollsmoother - hacer scroll en los anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const id = e.target.getAttribute("href"),
                trigger = ScrollTrigger.getById(id);
            gsap.to(window, {
                duration: .4,
                scrollTo: trigger ? trigger.start : id
            });
        });
    });

    // On resize window, update ScrollTrigger
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    initMenu();
    initAnimations();
});

function initMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function () {
            mobileMenu.style.left = '0';
        });
    }

    if (closeBtn && mobileMenu) {
        closeBtn.addEventListener('click', function () {
            mobileMenu.style.left = '-50vw';
        });
    }

    // Close menu if user clicks outside of it
    window.addEventListener('click', function (event) {
        if (event.target == mobileMenu) {
            mobileMenu.style.left = '-50vw';
        }
    });
}

function initAnimations() {
    // initStickyCards();
}

function initStickyCards() {
    const elements = getStickyCardElements();
    if (!elements) return;

    const { programaHeader, cards, cardsWrappers } = elements;

    // Configurar altura uniforme de las cards después de cargar
    gsap.delayedCall(0.1, () => {
        normalizeCardHeights(cardsWrappers);
        createScrollTriggers(programaHeader, cards);
        refreshScrollTriggers();
    });
}

function getStickyCardElements() {
    const programaSection = document.querySelector('#programa');
    const programaHeader = document.querySelector('.programa-header');
    const cards = document.querySelectorAll('.card-programa');
    const cardsWrappers = document.querySelectorAll('.card-programa-wrapper');

    // Validar que todos los elementos necesarios existen
    if (!programaSection || !programaHeader || cards.length === 0) {
        return null;
    }

    return { programaSection, programaHeader, cards, cardsWrappers };
}

function normalizeCardHeights(cardsWrappers) {
    // Obtener la altura máxima de todas las cards
    const heights = Array.from(cardsWrappers, card => card.offsetHeight);
    const maxHeight = Math.max(...heights);

    // Establecer la misma altura para todas las cards
    gsap.set(cardsWrappers, { height: maxHeight });
}

function createScrollTriggers(programaHeader, cards) {
    const getHeaderHeight = () => programaHeader.offsetHeight;
    const getEndPosition = () => {
        const lastCard = cards[cards.length - 1];
        return lastCard.offsetTop + lastCard.offsetHeight;
    };

    // Crear ScrollTrigger para el header
    createHeaderScrollTrigger(programaHeader, getEndPosition);

    // Crear ScrollTriggers para cada card
    createCardScrollTriggers(cards, getHeaderHeight, getEndPosition);
}

function createHeaderScrollTrigger(programaHeader, getEndPosition) {
    ScrollTrigger.create({
        trigger: programaHeader,
        start: "top top",
        end: () => `+=${getEndPosition()}`,
        pin: true,
        pinSpacing: false,
        id: "header-pin"
    });
}

function createCardScrollTriggers(cards, getHeaderHeight, getEndPosition) {
    cards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: () => `top ${getHeaderHeight()}px`,
            end: () => {
                const endPos = getEndPosition();
                const lastCard = cards[cards.length - 1];
                return `+=${endPos - lastCard.offsetHeight * index}`;
            },
            pin: true,
            pinSpacing: false,
            id: "#" + card.getAttribute("id"),
        });
    });
}

function refreshScrollTriggers() {
    gsap.delayedCall(0.1, () => {
        ScrollTrigger.refresh();
    });
}
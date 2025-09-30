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
    initLogoAnimation();
    // initStickyCards();
    initSpeakerAnimation();
    initInfoAnimation();
}

function initInfoAnimation() {
    const infoSection = document.querySelector('#info');
    if (!infoSection) return;

    const pinWrappers = infoSection.querySelectorAll('.pin-wrapper');
    pinWrappers.forEach(wrapper => {
        const pinElement = wrapper.querySelector('.pin-element');
        if (!pinElement) return;

        ScrollTrigger.create({
            trigger: pinElement,
            start: "top-=50 top",
            end: () => {
                const wrapperRect = wrapper.getBoundingClientRect();
                const pinRect = pinElement.getBoundingClientRect();
                return `+=${wrapperRect.height - pinRect.height}px`;
            },
            pin: pinElement,
            pinSpacing: false,
        });
    });
}

function initLogoAnimation() {
    const logo = document.querySelector('.logo-header svg');
    if (!logo) return;

    const capa1 = logo.querySelector('.capa1');
    const capa2 = logo.querySelector('.capa2');
    const capa3 = logo.querySelector('.capa3');
    const capa4 = logo.querySelector('.capa4');

    if (!capa1 || !capa2 || !capa3 || !capa4) return;

    const container = document.querySelector('.logo-header');
    if (!container) return;

    // Obtener el viewBox del SVG para calcular la escala
    const viewBox = logo.viewBox.baseVal;
    const svgViewBoxHeight = viewBox.height;
    const svgRealHeight = logo.getBoundingClientRect().height;

    // Calcular la escala: unidades SVG por píxel
    const scale = svgViewBoxHeight / svgRealHeight;

    // Calcular la distancia de movimiento en píxeles
    const moveDistancePx = (container.offsetHeight - logo.getBoundingClientRect().height) * scale;

    const tl = gsap.timeline({
        delay: 0.5,
    });

    tl.to(capa4, {
        y: moveDistancePx,
        ease: "power4.out",
        duration: 1.5
    }, 0)
        .to(capa3, {
            y: moveDistancePx,
            ease: "power4.out",
            duration: 1.5
        }, 0.2)
        .to(capa2, {
            y: moveDistancePx,
            ease: "power4.out",
            duration: 1.5
        }, 0.4)
        .to(capa1, {
            y: moveDistancePx,
            ease: "power4.out",
            duration: 1.5
        }, 0.6);
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

function initSpeakerAnimation() {
    // Solo ejecutar en páginas de speaker-detail
    const speakerSection = document.querySelector('#speaker');
    if (!speakerSection) return;

    const speakerWrapper = document.querySelector('.speaker-wrapper');
    const speakerName = document.querySelector('#speaker .speaker-title');
    const imageWrapper = document.querySelector('#speaker .image-wrapper');
    const speakerLeft = document.querySelector('#speaker .speaker-left');
    const speakerRight = document.querySelector('#speaker .speaker-right');

    if (!speakerWrapper || !speakerName || !imageWrapper || !speakerLeft || !speakerRight) return;

    // Función para calcular el punto final del pin
    const getEndPosition = () => {
        const speakerLeftRect = imageWrapper.getBoundingClientRect();
        const speakerRightRect = speakerRight.getBoundingClientRect();
        const speakerLeftHeight = speakerLeftRect.height;
        const speakerRightHeight = speakerRightRect.height;
        const heightDifference = Math.abs(speakerRightHeight - speakerLeftHeight);

        if (speakerRightHeight > speakerLeftHeight) {
            return `+=${heightDifference}px`;
        }

        return "bottom center";
    };

    // Crear ScrollTrigger para anclar el nombre del speaker
    ScrollTrigger.create({
        trigger: speakerWrapper,
        start: "top top",
        end: getEndPosition,
        pin: speakerName,
        pinSpacing: false,
        id: "speaker-name-pin",
    });

    // Crear ScrollTrigger para anclar la imagen del speaker
    ScrollTrigger.create({
        trigger: speakerWrapper,
        start: "top top",
        end: getEndPosition,
        pin: imageWrapper,
        pinSpacing: false,
        id: "speaker-image-pin"
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
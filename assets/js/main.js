let smoother;

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin)

    /// ScrollSmoother
    smoother = ScrollSmoother.create({
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

    initHeader();
    initMenu();
    initAnimations();
});

function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    // update CSS variable for header height
    const updateHeaderHeight = () => {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    };

    updateHeaderHeight();

    window.addEventListener('resize', () => {
        updateHeaderHeight();
    });

    // Change header class on scroll
    ScrollTrigger.create({
        start: "top -300",
        end: 99999,
        toggleClass: { className: "scrolled", targets: header }
    });

    // Change header class on scroll up
    let lastScrollY = window.pageYOffset;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        if (currentScrollY < lastScrollY) {
            header.classList.add('scrolling-up');
        } else {
            header.classList.remove('scrolling-up');
        }
        lastScrollY = currentScrollY;
    });

    // Refresh ScrollTrigger después de un pequeño retraso para asegurar que todo está cargado
    gsap.delayedCall(0.5, () => {
        ScrollTrigger.refresh();
    });
}

function initMenu() {
    const hamburgerBtns = document.querySelectorAll('button.hamburger');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    function openMenu() {
        const scrollY = smoother ? smoother.scrollTop() : window.pageYOffset;
        body.classList.add('menu-open');
        body.style.top = `-${scrollY}px`;

        if (smoother) {
            smoother.paused(true);
        }
    }

    function closeMenu() {
        const scrollY = body.style.top;

        body.classList.remove('menu-open');
        body.style.top = '';

        if (smoother) {
            smoother.paused(false);

            if (scrollY) {
                const scrollPosition = parseInt(scrollY || '0') * -1;
                smoother.scrollTo(scrollPosition);
            }
        } else {
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }

    if (hamburgerBtns && mobileMenu) {
        hamburgerBtns.forEach(hamburgerBtn => {
            hamburgerBtn.addEventListener('click', function (event) {
                event.preventDefault();
                openMenu();
            });
        });
    }

    if (closeBtn && mobileMenu) {
        closeBtn.addEventListener('click', function (event) {
            event.preventDefault();
            closeMenu();
        });
    }

    document.addEventListener('click', function (event) {
        if (body.classList.contains('menu-open')) {
            let closeMenuVar = true;
            hamburgerBtns.forEach(hamburgerBtn => {
                if (hamburgerBtn.contains(event.target) || mobileMenu.contains(event.target)) {
                    closeMenuVar = false;
                }
            });
            if (closeMenuVar) {
                closeMenu();
            }
        }
    });

    // Cerrar menú con Esc
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && body.classList.contains('menu-open')) {
            closeMenu();
        }
    });
}

function initAnimations() {
    initLogoAnimation();
    // initStickyCards();
    initSpeakerAnimation();
    initInfoAnimation();
    initAgendaTabs();
    initAgendaAnimation();
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

function initAgendaTabs() {
    // Solo ejecutar en páginas de agenda
    const agendaSection = document.querySelector('#agenda');
    if (!agendaSection) return;

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Si no hay tabs, no hacer nada
    if (tabButtons.length === 0 || tabContents.length === 0) return;

    // Función para cambiar de tab
    function switchTab(targetDay) {
        // Remover active de todos los botones y contenidos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Añadir active al botón y contenido correspondiente
        const targetButton = document.querySelector(`[data-day="${targetDay}"]`);
        const targetContent = document.querySelector(`#tab-${targetDay}`);

        if (targetButton && targetContent) {
            targetButton.classList.add('active');
            targetContent.classList.add('active');
        }

        // Refresh ScrollTrigger después del cambio de tab
        gsap.delayedCall(0.1, () => {
            ScrollTrigger.refresh();
        });
    }

    // Añadir event listeners a los botones
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetDay = button.getAttribute('data-day');
            switchTab(targetDay);
        });
    });

    // Soporte para navegación por teclado
    tabButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const targetDay = button.getAttribute('data-day');
                switchTab(targetDay);
            }
        });
    });
}

function initAgendaAnimation() {
    const agenda = document.querySelector('#agenda');
    if (!agenda) return;

    const pinWrappers = agenda.querySelectorAll('.pin-wrapper');
    pinWrappers.forEach(wrapper => {
        const pinElement = wrapper.querySelector('.pin-element.agenda-tabs');
        if (!pinElement) return;

        ScrollTrigger.create({
            trigger: pinElement,
            start: "top top",
            end: () => {
                const wrapperRect = wrapper.getBoundingClientRect();
                const pinRect = pinElement.getBoundingClientRect();
                return `+=${wrapperRect.height - pinRect.height}px`;
            },
            pin: pinElement,
            pinSpacing: false,
        });

        const pinElementHeaders = wrapper.querySelectorAll('.pin-element.agenda-row');
        if (!pinElementHeaders) return;

        pinElementHeaders.forEach(pinElementHeader => {
            ScrollTrigger.create({
                trigger: pinElementHeader,
                start: () => {
                    const tabsHeight = pinElement.getBoundingClientRect().height;
                    return `top-=${tabsHeight} top`;
                },
                end: () => {
                    const wrapperRect = wrapper.getBoundingClientRect();
                    const pinRect = pinElementHeader.getBoundingClientRect();
                    return `+=${wrapperRect.height - pinRect.height}px`;
                },
                pin: pinElementHeader,
                pinSpacing: false,
            });
        });
    });
}
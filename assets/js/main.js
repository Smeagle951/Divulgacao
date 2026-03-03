document.addEventListener('DOMContentLoaded', () => {

    // Navbar — adiciona classe 'scrolled' ao rolar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Smooth Scrolling para links internos (com offset da navbar fixa)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 72;
                const top = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer para animações de Fade + Slide na rolagem
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Dispara quando 15% do elemento está visível
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Opcional: Desobservar após animar uma vez para performance
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos que devem ser animados (Seções, Grids e Timeline)
    const animatableElements = document.querySelectorAll('.animate-on-scroll, .cards-grid, .timeline-section');

    animatableElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // ── Contador animado para a seção de Impacto ──
    const counterEls = document.querySelectorAll('.impacto-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const target = parseInt(entry.target.dataset.target, 10);
                const duration = 1800;
                const frameDuration = 1000 / 60;
                const totalFrames = Math.round(duration / frameDuration);
                let frame = 0;
                const counter = setInterval(() => {
                    frame++;
                    const progress = frame / totalFrames;
                    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    entry.target.textContent = Math.min(Math.round(ease * target), target).toLocaleString('pt-BR');
                    if (frame === totalFrames) clearInterval(counter);
                }, frameDuration);
            }
        });
    }, { threshold: 0.3 });

    counterEls.forEach(el => counterObserver.observe(el));

    // Staggered effect manual delay calculation para os cards se eles tiverem display block individual
    // Embora no CSS a classe pai `.cards-grid.show .card` já dispare, a gente pode dar delay
    const cards = document.querySelectorAll('.cards-grid .card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    // Delay sequencial para itens na linha do tempo
    const timelineItems = document.querySelectorAll('.timeline-anim');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });

}); // fim DOMContentLoaded

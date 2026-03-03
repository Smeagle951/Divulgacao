document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth Scrolling para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

});

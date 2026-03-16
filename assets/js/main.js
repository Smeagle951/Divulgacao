document.addEventListener('DOMContentLoaded', () => {
    // Remove no-js para ativar animações
    document.documentElement.classList.remove('no-js');

    // Mostrar imediatamente os elementos já na viewport
    const animatableElements = document.querySelectorAll('.animate-on-scroll, .cards-grid, .timeline-section');
    const viewportH = window.innerHeight;
    animatableElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportH * 2) el.classList.add('show');
    });

    // Fallback para imagens que não carregam (evita quebra de layout e placeholders visíveis)
    document.querySelectorAll('img[src*="assets/images"]').forEach(img => {
        img.addEventListener('error', function onImgError() {
            this.onerror = null;
            this.style.background = 'linear-gradient(135deg, #f0f4f0 0%, #e0e8e0 100%)';
            this.style.minHeight = '100px';
            this.style.objectFit = 'none';
            if (!this.alt.includes('não disponível')) this.alt = (this.alt || 'Imagem') + ' (não disponível)';
        });
    });

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

    // Observa os mesmos elementos para animar ao rolar
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

    // ══════════════════════════════════════════
    // LIGHTBOX — Preview com zoom de qualidade
    // ══════════════════════════════════════════

    // 1. Cria o overlay HTML dinamicamente
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
        <div class="lb-backdrop"></div>
        <button class="lb-close" aria-label="Fechar">✕</button>
        <button class="lb-nav lb-prev" aria-label="Anterior">‹</button>
        <button class="lb-nav lb-next" aria-label="Próximo">›</button>
        <div class="lb-img-wrap">
            <img class="lb-img" src="" alt="">
        </div>
        <div class="lb-caption"></div>
        <div class="lb-hint">Clique para ampliar · Scroll para zoom · ESC para fechar</div>
    `;
    document.body.appendChild(lb);

    // 2. Coleta todas as imagens clicáveis
    const lbSelector = '.mockup-img, .diferencial-img, .app-image, .info-banner-img';
    let lbImages = [];
    let lbIndex = 0;
    let lbZoomed = false;
    let lbScale = 1;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let imgOffset = { x: 0, y: 0 };

    const lbEl = document.getElementById('lightbox');
    const lbImgWrap = lbEl.querySelector('.lb-img-wrap');
    const lbImg = lbEl.querySelector('.lb-img');
    const lbCaption = lbEl.querySelector('.lb-caption');
    const lbBackdrop = lbEl.querySelector('.lb-backdrop');

    function buildGallery() {
        lbImages = Array.from(document.querySelectorAll(lbSelector)).map(img => ({
            src: img.src,
            alt: img.alt || '',
        }));
        document.querySelectorAll(lbSelector).forEach((img, i) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openLb(i));
        });
    }

    function openLb(index) {
        lbIndex = index;
        lbEl.classList.add('lb-open');
        document.body.style.overflow = 'hidden';
        showImage();
    }

    function closeLb() {
        lbEl.classList.remove('lb-open');
        document.body.style.overflow = '';
        resetZoom();
    }

    function showImage() {
        const item = lbImages[lbIndex];
        lbImg.style.opacity = '0';
        // Reset zoom whenever image changes
        resetZoom();
        // Pre-load
        const tmpImg = new Image();
        tmpImg.onload = () => {
            lbImg.src = tmpImg.src;
            lbImg.alt = item.alt;
            lbCaption.textContent = item.alt;
            requestAnimationFrame(() => { lbImg.style.opacity = '1'; });
        };
        tmpImg.src = item.src;
        // Update nav
        lbEl.querySelector('.lb-prev').style.display = lbIndex === 0 ? 'none' : '';
        lbEl.querySelector('.lb-next').style.display = lbIndex === lbImages.length - 1 ? 'none' : '';
    }

    function resetZoom() {
        lbScale = 1;
        lbZoomed = false;
        imgOffset = { x: 0, y: 0 };
        applyTransform();
        lbImg.style.cursor = 'zoom-in';
    }

    function applyTransform() {
        lbImg.style.transform = `translate(${imgOffset.x}px, ${imgOffset.y}px) scale(${lbScale})`;
    }

    function toggleZoom(clientX, clientY) {
        if (!lbZoomed) {
            lbScale = 2.5;
            lbZoomed = true;
            lbImg.style.cursor = 'zoom-out';
        } else {
            resetZoom();
        }
        applyTransform();
    }

    // Scroll para zoom
    lbImgWrap.addEventListener('wheel', (e) => {
        e.preventDefault();
        lbScale = Math.min(5, Math.max(1, lbScale - e.deltaY * 0.003));
        lbZoomed = lbScale > 1;
        lbImg.style.cursor = lbZoomed ? 'zoom-out' : 'zoom-in';
        if (!lbZoomed) imgOffset = { x: 0, y: 0 };
        applyTransform();
    }, { passive: false });

    // Click na imagem — zoom toggle
    lbImg.addEventListener('click', (e) => { toggleZoom(e.clientX, e.clientY); });

    // Drag quando zoomed
    lbImg.addEventListener('mousedown', (e) => {
        if (!lbZoomed) return;
        isDragging = true;
        dragStart = { x: e.clientX - imgOffset.x, y: e.clientY - imgOffset.y };
        lbImg.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        imgOffset = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        lbImg.style.cursor = lbZoomed ? 'zoom-out' : 'zoom-in';
    });

    // Fechar
    lbBackdrop.addEventListener('click', closeLb);
    lbEl.querySelector('.lb-close').addEventListener('click', closeLb);

    // Navegação
    lbEl.querySelector('.lb-prev').addEventListener('click', () => { lbIndex--; showImage(); });
    lbEl.querySelector('.lb-next').addEventListener('click', () => { lbIndex++; showImage(); });

    // Teclado
    window.addEventListener('keydown', (e) => {
        if (!lbEl.classList.contains('lb-open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft' && lbIndex > 0) { lbIndex--; showImage(); }
        if (e.key === 'ArrowRight' && lbIndex < lbImages.length - 1) { lbIndex++; showImage(); }
    });

    buildGallery();

}); // fim DOMContentLoaded


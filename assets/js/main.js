document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.remove('no-js');

    const year = document.getElementById('year');
    if (year && !year.textContent) year.textContent = new Date().getFullYear();

    function getAssetsBase() {
        const path = window.location.pathname;
        const dir = path.endsWith('/') ? path : path.replace(/\/[^/]*$/, '/');
        return window.location.origin + dir;
    }

    document.querySelectorAll('img[src*="assets/images"]').forEach((img) => {
        img.addEventListener('error', function onImgError() {
            this.onerror = null;
            this.src = getAssetsBase() + 'assets/images/placeholder.svg';
        });
    });

    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    const menuBtn = document.getElementById('mobileMenuBtn');
    const links = document.getElementById('navbarLinks');
    if (menuBtn && links) {
        menuBtn.addEventListener('click', () => {
            const open = links.classList.toggle('is-open');
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        links.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                links.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    const animatables = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        animatables.forEach((el) => io.observe(el));
    } else {
        animatables.forEach((el) => el.classList.add('show'));
    }
});

(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;

    root.classList.add('motion-ready');

    const revealSelector = [
        '.header-title',
        '.flash',
        '.card',
        '.dashboard-hero',
        '.pipeline-item',
        '.visual-feature',
        '.sentiment-panel',
        '.metric-card-dark',
        '.chart-card-dark',
        '.quick-link',
        '.predict-board',
        '.predict-stat',
        '.pipeline-board',
        '.step',
        '.result-hero',
        '.analysis-panel',
        '.model-panel',
        '.summary-card',
        '.metric-eval',
        '.latest-item',
    ].join(',');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
    });

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateNumber(entry.target);
            numberObserver.unobserve(entry.target);
        });
    }, { threshold: 0.45 });

    function prepareReveal() {
        document.querySelectorAll(revealSelector).forEach((element, index) => {
            if (!element.dataset.animate) {
                element.dataset.animate = 'rise';
            }

            element.style.setProperty('--motion-delay', `${Math.min(index % 8, 7) * 45}ms`);
            revealObserver.observe(element);
        });
    }

    function prepareRows(scope = document) {
        scope.querySelectorAll('tbody tr').forEach((row, index) => {
            if (row.classList.contains('motion-row')) {
                return;
            }

            row.classList.add('motion-row');
            row.style.setProperty('--motion-delay', `${Math.min(index % 12, 11) * 28}ms`);
            revealObserver.observe(row);
        });
    }

    function prepareCounters() {
        const candidates = document.querySelectorAll([
            '.metric-value',
            '.metric-card-dark strong',
            '.summary-card strong',
            '.metric-eval strong',
            '.predict-stat strong',
            '.donut-center > div',
        ].join(','));

        candidates.forEach((element) => {
            const text = element.textContent.trim();

            if (!/^\d[\d.,]*(%| hasil)?$/.test(text)) {
                return;
            }

            element.dataset.countText = text;
            numberObserver.observe(element);
        });
    }

    function animateNumber(element) {
        if (reduceMotion || element.dataset.countDone === 'true') {
            return;
        }

        const text = element.dataset.countText || element.textContent.trim();
        const suffix = text.replace(/^[\d.,]+/, '');
        const rawNumber = text.match(/^[\d.,]+/)?.[0] || '0';
        const normalized = rawNumber.replace(/\./g, '').replace(',', '.');
        const target = Number(normalized);

        if (!Number.isFinite(target)) {
            return;
        }

        const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0;
        const duration = 850;
        const startTime = performance.now();

        element.dataset.countDone = 'true';

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            const formatted = decimals > 0
                ? value.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
                : Math.round(value).toLocaleString('id-ID');

            element.textContent = `${formatted}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent = text;
            }
        }

        requestAnimationFrame(tick);
    }

    function prepareBars() {
        document.querySelectorAll('.track, .rating-column, .daily-column').forEach((element) => {
            if (!element.dataset.animate) {
                element.dataset.animate = 'bar';
            }
            revealObserver.observe(element);
        });
    }

    function prepareButtons() {
        document.addEventListener('pointerdown', (event) => {
            const button = event.target.closest('.btn-action, .page-link, .quick-link');

            if (!button || reduceMotion) {
                return;
            }

            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'button-ripple';
            ripple.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
            ripple.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
            button.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        });
    }

    function prepareParallax() {
        if (reduceMotion) {
            return;
        }

        document.querySelectorAll('.hero-media, .visual-frame, .chart-wrapper').forEach((element) => {
            element.classList.add('parallax-lite');

            element.addEventListener('pointermove', (event) => {
                const rect = element.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
                element.style.transform = `perspective(900px) rotateX(${y * -2.4}deg) rotateY(${x * 2.4}deg) translateY(-2px)`;
            });

            element.addEventListener('pointerleave', () => {
                element.style.transform = '';
            });
        });
    }

    function prepareDynamicTables() {
        const tableBodies = document.querySelectorAll('tbody');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) {
                        return;
                    }

                    if (node.matches('tr')) {
                        prepareRows(node.parentElement || document);
                    } else {
                        prepareRows(node);
                    }
                });
            });
        });

        tableBodies.forEach((body) => observer.observe(body, { childList: true }));
    }

    function prepareSidebarToggle() {
        const toggle = document.querySelector('.sidebar-toggle');
        if (!toggle) {
            return;
        }

        const collapsedKey = 'skripsi_chess_sidebar_collapsed';
        const rootBody = document.body;

        function syncToggleState() {
            const collapsed = rootBody.classList.contains('sidebar-collapsed');
            toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            toggle.setAttribute('title', collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = collapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
            }
        }

        if (window.localStorage.getItem(collapsedKey) === 'true') {
            rootBody.classList.add('sidebar-collapsed');
        }
        syncToggleState();

        toggle.addEventListener('click', () => {
            rootBody.classList.toggle('sidebar-collapsed');
            window.localStorage.setItem(collapsedKey, rootBody.classList.contains('sidebar-collapsed') ? 'true' : 'false');
            syncToggleState();
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        prepareSidebarToggle();
        prepareReveal();
        prepareRows();
        prepareCounters();
        prepareBars();
        prepareButtons();
        prepareParallax();
        prepareDynamicTables();
    });
})();

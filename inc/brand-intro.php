<?php
if (!defined('ABSPATH')) exit;

// Reserve the welcome screen before styles or body content can paint.
add_action('wp_head', function () {
    ?>
    <style id="aes-intro-critical">
        html.aes-intro-pending { background: #fffdfb; }
        html.aes-intro-pending body { visibility: hidden; }
        html.aes-intro-pending #aes-brand-intro { visibility: visible !important; display: grid !important; }
        .aes-brand-intro { position: fixed; inset: 0; z-index: 1000; place-items: center; background: #fffdfb; }
    </style>
    <script>
    (() => {
        let seen = true;
        try { seen = localStorage.getItem('aes-brand-intro-seen-v5') === '1'; } catch (error) {}
        if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        document.documentElement.classList.add('aes-intro-pending', 'aes-intro-active');
        window.aesIntroFallback = setTimeout(() => {
            document.documentElement.classList.remove('aes-intro-pending', 'aes-intro-active');
            document.getElementById('aes-brand-intro')?.remove();
        }, 10000);
    })();
    </script>
    <link rel="preload" as="image" href="<?php echo esc_url(get_template_directory_uri() . '/assets/logo.png'); ?>" />
    <?php
}, 0);

add_action('wp_body_open', function () {
    ?>
    <div id="aes-brand-intro" class="aes-brand-intro" role="dialog" aria-modal="true" aria-labelledby="aes-brand-intro-name" tabindex="-1" hidden>
        <div class="aes-brand-intro__identity">
            <img class="aes-brand-intro__logo" src="<?php echo esc_url(get_template_directory_uri() . '/assets/logo.png'); ?>" alt="Akshar Engineering Services Pvt. Ltd." width="520" height="196" fetchpriority="high" />
            <p id="aes-brand-intro-name" class="aes-brand-intro__name">Akshar Engineering</p>
            <p class="aes-brand-intro__caption">Services Pvt. Ltd.</p>
            <div class="aes-brand-intro__signature" aria-label="AES. Trusted Inspection - Safer Tomorrow">
                <span class="aes-brand-intro__letters" aria-hidden="true"><span>A</span><span>E</span><span>S</span></span>
                <p class="aes-brand-intro__promise">TRUSTED INSPECTION - SAFER TOMORROW</p>
            </div>
        </div>
    </div>
    <script>
    (() => {
        const intro = document.getElementById('aes-brand-intro');
        const motion = matchMedia('(prefers-reduced-motion: reduce)');
        const key = 'aes-brand-intro-seen-v5';
        let seen = false;
        try { seen = localStorage.getItem(key) === '1'; } catch (error) { seen = true; }
        if (seen || motion.matches) {
            clearTimeout(window.aesIntroFallback);
            document.documentElement.classList.remove('aes-intro-pending', 'aes-intro-active');
            intro.remove(); return;
        }
        intro.hidden = false;
        document.documentElement.classList.remove('aes-intro-pending');
        document.documentElement.classList.add('aes-intro-active');
        const shownAt = performance.now();
        try { localStorage.setItem(key, '1'); } catch (error) {}
        let finished = false, transfer, headerLogo, timer;
        let originalOpacity, originalVisibility;
        function finish() {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            clearTimeout(window.aesIntroFallback);
            document.removeEventListener('keydown', handleKey, true);
            motion.removeEventListener('change', finish);
            document.documentElement.classList.remove('aes-intro-active', 'aes-intro-pending');
            if (headerLogo) {
                headerLogo.getAnimations().forEach(animation => animation.cancel());
                headerLogo.style.opacity = originalOpacity;
                headerLogo.style.visibility = originalVisibility;
            }
            transfer?.remove();
            if (intro.contains(document.activeElement)) document.activeElement.blur();
            intro.remove();
        }
        function handleKey(event) {
            if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); finish(); }
            if (event.key === 'Tab') { event.preventDefault(); intro.focus({ preventScroll: true }); }
        }
        async function dockLogo() {
            if (finished) return;
            const source = intro.querySelector('img');
            headerLogo = document.querySelector('body > header > div:first-child > a img');
            intro.classList.add('is-leaving');
            const clearBackground = () => {
                const fade = intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
                fade.finished.then(() => {
                    if (intro.contains(document.activeElement)) document.activeElement.blur();
                    intro.remove();
                }).catch(() => {});
            };
            if (!headerLogo) { clearBackground(); setTimeout(finish, 240); return; }
            originalOpacity = headerLogo.style.opacity;
            originalVisibility = headerLogo.style.visibility;
            if (!source.complete || !source.naturalWidth) { clearBackground(); setTimeout(finish, 240); return; }
            const from = source.getBoundingClientRect(), to = headerLogo.getBoundingClientRect();
            transfer = source.cloneNode();
            transfer.className = 'aes-brand-transfer';
            transfer.alt = '';
            transfer.setAttribute('aria-hidden', 'true');
            transfer.style.width = from.width + 'px';
            transfer.style.height = from.height + 'px';
            document.body.appendChild(transfer);
            source.style.visibility = 'hidden';
            headerLogo.style.opacity = '0';
            clearBackground();
            const arrival = `translate(${to.left}px, ${to.top}px) scale(${to.width / from.width}, ${to.height / from.height})`;
            const flight = transfer.animate([
                { transform: `translate(${from.left}px, ${from.top}px) scale(1)`, opacity: 1, offset: 0 },
                { transform: arrival, opacity: 1, offset: .82 },
                { transform: arrival, opacity: 0, offset: 1 }
            ], { duration: 760, easing: 'cubic-bezier(.45, 0, .2, 1)', fill: 'forwards' });
            headerLogo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 560, fill: 'forwards' });
            try { await flight.finished; } catch (error) {}
            finish();
        }
        document.addEventListener('keydown', handleKey, true);
        motion.addEventListener('change', finish);
        intro.focus({ preventScroll: true });
        const start = () => { if (!finished) setTimeout(dockLogo, Math.max(0, 5000 - (performance.now() - shownAt))); };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
        else start();
        timer = setTimeout(finish, 9000);
    })();
    </script>
    <?php
});

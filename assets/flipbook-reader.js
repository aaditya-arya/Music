/**
 * AES Native Interactive 3D Flipbook Brochure Reader
 * Pure Vanilla JS + Hardware-Accelerated CSS 3D Transforms
 * Zero External Dependencies, Zero Watermarks, Realistic 3D Page Turn Animation
 */
(function() {
  'use strict';

  const totalPages = 8;
  const pageTitles = [
    'Cover Page',
    'Company Journey & Scope',
    'Civil, Infra & Renewables',
    'Global Network & Reach',
    'Welding & NDE Engineering',
    'Shop Floor & Field QA',
    'Document Traceability & IRN',
    'Back Cover & Contact'
  ];

  // Desktop spreads:
  // Spread 0: [null, 1] (Single right page - Cover)
  // Spread 1: [2, 3]    (Dual spread)
  // Spread 2: [4, 5]    (Dual spread)
  // Spread 3: [6, 7]    (Dual spread)
  // Spread 4: [8, null] (Single left page - Back cover)
  const spreads = [
    { left: null, right: 1, label: 'Page 1 of 8 — Brochure Cover' },
    { left: 2, right: 3, label: 'Pages 2–3 of 8 — Company Profile & Scope' },
    { left: 4, right: 5, label: 'Pages 4–5 of 8 — Global Reach & Capabilities' },
    { left: 6, right: 7, label: 'Pages 6–7 of 8 — Welding, NDT & QA Standards' },
    { left: 8, right: null, label: 'Page 8 of 8 — Back Cover & Contacts' }
  ];

  let currentSpread = 0;
  let isMobile = window.innerWidth < 768;
  let currentPageMobile = 1;
  let isZoomed = false;
  let isFlipping = false;

  window.addEventListener('resize', function() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 768;
    if (wasMobile !== isMobile) {
      renderFlipbook();
    }
  });

  function initFlipbook() {
    const container = document.getElementById('aesFlipbookContainer');
    if (!container) return;

    injectFlipStyles();
    renderFlipbook();
    setupThumbnails();
    setupControls();
  }

  function injectFlipStyles() {
    if (document.getElementById('aes-flipbook-styles')) return;
    const style = document.createElement('style');
    style.id = 'aes-flipbook-styles';
    style.textContent = `
      .aes-book-viewport {
        perspective: 2500px;
        perspective-origin: 50% 50%;
        user-select: none;
        -webkit-user-select: none;
      }
      .aes-book-spread {
        position: relative;
        display: flex;
        align-items: center;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 0, 0, 0.6);
        border-radius: 12px;
        background: #080f24;
      }
      .aes-page-static {
        position: relative;
        background: #ffffff;
        overflow: hidden;
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .aes-page-static img {
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
        display: block;
      }
      .aes-turning-sheet {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%;
        height: 100%;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        z-index: 50;
        will-change: transform;
        transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .aes-turn-forward {
        right: 0;
        transform-origin: left center;
        transform: rotateY(0deg);
      }
      .aes-turn-forward.is-flipping {
        transform: rotateY(-180deg);
      }
      .aes-turn-backward {
        left: 0;
        transform-origin: right center;
        transform: rotateY(0deg);
      }
      .aes-turn-backward.is-flipping {
        transform: rotateY(180deg);
      }
      .aes-sheet-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        overflow: hidden;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      }
      .aes-sheet-face img {
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
        display: block;
      }
      .aes-sheet-back {
        transform: rotateY(180deg);
      }
      .aes-spine-shadow-left {
        position: absolute;
        inset-y: 0;
        right: 0;
        width: 36px;
        background: linear-gradient(to left, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
        pointer-events: none;
      }
      .aes-spine-shadow-right {
        position: absolute;
        inset-y: 0;
        left: 0;
        width: 36px;
        background: linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
        pointer-events: none;
      }
      .aes-mobile-card {
        perspective: 1200px;
        transform-style: preserve-3d;
        transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease;
      }
      .aes-mobile-card.flipping-out-next {
        transform: rotateY(-90deg) scale(0.95);
        opacity: 0.3;
      }
      .aes-mobile-card.flipping-out-prev {
        transform: rotateY(90deg) scale(0.95);
        opacity: 0.3;
      }
      .aes-mobile-card.flipping-in {
        transform: rotateY(0deg) scale(1);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function renderFlipbook() {
    const stage = document.getElementById('aesFlipbookStage');
    const pageLabel = document.getElementById('aesFlipbookPageLabel');
    if (!stage) return;

    if (isMobile) {
      // Mobile Single-Page Mode
      if (pageLabel) {
        pageLabel.textContent = `Page ${currentPageMobile} of ${totalPages} — ${pageTitles[currentPageMobile - 1]}`;
      }

      stage.innerHTML = `
        <div class="aes-book-viewport relative w-full max-w-md mx-auto flex items-center justify-center p-2">
          <div id="aesMobileCard" class="aes-mobile-card relative rounded-xl shadow-2xl overflow-hidden bg-white border border-slate-700/60 transition-transform duration-300 ${isZoomed ? 'scale-125' : 'scale-100'}">
            <img src="${AES.theme}/assets/brochure/page-${currentPageMobile}.jpg" alt="Page ${currentPageMobile}" class="w-full h-auto max-h-[68vh] object-contain block select-none">
          </div>
        </div>
      `;
    } else {
      // Desktop Dual-Spread Mode
      const spread = spreads[currentSpread];
      if (pageLabel) {
        pageLabel.textContent = spread.label;
      }

      let bookHtml = '';

      if (currentSpread === 0) {
        // Front Cover: Single Right Page Centered
        bookHtml = `
          <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2">
            <div id="aesBookSpread" class="relative rounded-r-2xl rounded-l-sm shadow-2xl overflow-hidden bg-white border border-slate-700/60 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer max-w-[460px]" onclick="window.aesFlipNext()" title="Click to open brochure">
              <img id="aesCoverImg" src="${AES.theme}/assets/brochure/page-1.jpg" alt="Brochure Cover" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none"></div>
              <div class="absolute bottom-5 right-5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-pulse">
                <span>Open Brochure</span> &rarr;
              </div>
            </div>
          </div>
        `;
      } else if (currentSpread === spreads.length - 1) {
        // Back Cover: Single Left Page Centered
        bookHtml = `
          <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2">
            <div id="aesBookSpread" class="relative rounded-l-2xl rounded-r-sm shadow-2xl overflow-hidden bg-white border border-slate-700/60 transition-all duration-300 max-w-[460px] cursor-pointer" onclick="window.aesFlipPrev()" title="Click to turn back">
              <img id="aesBackCoverImg" src="${AES.theme}/assets/brochure/page-8.jpg" alt="Brochure Back Cover" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 via-black/15 to-transparent pointer-events-none"></div>
              <div class="absolute bottom-5 left-5 bg-brand-blue hover:bg-brand-dark text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2">
                &larr; <span>Turn Back</span>
              </div>
            </div>
          </div>
        `;
      } else {
        // Open Book Dual Spread
        bookHtml = `
          <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2 w-full">
            <div id="aesBookSpread" class="aes-book-spread relative max-w-5xl w-full flex items-center rounded-2xl overflow-hidden border border-slate-700/70 transition-transform duration-300 ${isZoomed ? 'scale-110' : 'scale-100'}">
              
              <!-- Left Static Page -->
              <div id="aesPageLeft" class="aes-page-static relative flex-1 bg-white cursor-pointer overflow-hidden border-r border-slate-300/40 rounded-l-xl" onclick="window.aesFlipPrev()" title="Click left page to turn back">
                <img src="${AES.theme}/assets/brochure/page-${spread.left}.jpg" alt="Page ${spread.left}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-left"></div>
              </div>

              <!-- Right Static Page -->
              <div id="aesPageRight" class="aes-page-static relative flex-1 bg-white cursor-pointer overflow-hidden rounded-r-xl" onclick="window.aesFlipNext()" title="Click right page to turn forward">
                <img src="${AES.theme}/assets/brochure/page-${spread.right}.jpg" alt="Page ${spread.right}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-right"></div>
              </div>

            </div>
          </div>
        `;
      }

      stage.innerHTML = bookHtml;
    }

    updateThumbnailHighlights();
  }

  function updateThumbnailHighlights() {
    const activePages = isMobile ? [currentPageMobile] : (
      currentSpread === 0 ? [1] :
      currentSpread === spreads.length - 1 ? [8] :
      [spreads[currentSpread].left, spreads[currentSpread].right]
    );

    for (let i = 1; i <= totalPages; i++) {
      const thumb = document.getElementById(`aesThumb-${i}`);
      if (thumb) {
        if (activePages.includes(i)) {
          thumb.classList.add('border-brand-orange', 'opacity-100', 'scale-105', 'shadow-lg', 'shadow-orange-500/40');
          thumb.classList.remove('border-transparent', 'opacity-70');
        } else {
          thumb.classList.remove('border-brand-orange', 'opacity-100', 'scale-105', 'shadow-lg', 'shadow-orange-500/40');
          thumb.classList.add('border-transparent', 'opacity-70');
        }
      }
    }
  }

  function setupThumbnails() {
    const strip = document.getElementById('aesFlipbookThumbStrip');
    if (!strip) return;

    let thumbsHtml = '';
    for (let i = 1; i <= totalPages; i++) {
      thumbsHtml += `
        <button onclick="window.aesJumpToPage(${i})" id="aesThumb-${i}" class="shrink-0 w-12 sm:w-14 h-16 sm:h-20 rounded-md overflow-hidden border-2 border-transparent hover:border-brand-orange transition-all duration-200 bg-slate-800 opacity-70 hover:opacity-100 cursor-pointer relative group" title="Page ${i}: ${pageTitles[i-1]}">
          <img src="${AES.theme}/assets/brochure/page-${i}.jpg" alt="Thumb ${i}" class="w-full h-full object-cover">
          <span class="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-white font-bold text-center py-0.5">${i}</span>
        </button>
      `;
    }
    strip.innerHTML = thumbsHtml;
    updateThumbnailHighlights();
  }

  // Perform 3D Animated Forward Page Flip
  window.aesFlipNext = function() {
    if (isFlipping) return;

    if (isMobile) {
      if (currentPageMobile < totalPages) {
        const card = document.getElementById('aesMobileCard');
        if (card) {
          isFlipping = true;
          card.classList.add('flipping-out-next');
          setTimeout(function() {
            currentPageMobile++;
            renderFlipbook();
            isFlipping = false;
          }, 250);
        } else {
          currentPageMobile++;
          renderFlipbook();
        }
      }
      return;
    }

    if (currentSpread >= spreads.length - 1) return;

    isFlipping = true;
    const stage = document.getElementById('aesFlipbookStage');

    // Case 1: Opening Cover (Spread 0 -> Spread 1: pages 2 & 3)
    if (currentSpread === 0) {
      stage.innerHTML = `
        <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2 w-full">
          <div id="aesBookSpread" class="aes-book-spread relative max-w-5xl w-full flex items-center rounded-2xl overflow-hidden border border-slate-700/70">
            <!-- Left Static (Page 2 waiting underneath) -->
            <div class="aes-page-static relative flex-1 bg-slate-900 border-r border-slate-800 rounded-l-xl">
              <div class="aes-spine-shadow-left"></div>
            </div>
            <!-- Right Static (Page 3 waiting underneath) -->
            <div class="aes-page-static relative flex-1 bg-white rounded-r-xl">
              <img src="${AES.theme}/assets/brochure/page-3.jpg" alt="Page 3" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-right"></div>
            </div>
            <!-- 3D Turning Cover Sheet -->
            <div id="aesTurningSheet" class="aes-turning-sheet aes-turn-forward shadow-2xl">
              <div class="aes-sheet-face rounded-r-xl">
                <img src="${AES.theme}/assets/brochure/page-1.jpg" alt="Page 1" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-right"></div>
              </div>
              <div class="aes-sheet-face aes-sheet-back rounded-l-xl">
                <img src="${AES.theme}/assets/brochure/page-2.jpg" alt="Page 2" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-left"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      requestAnimationFrame(function() {
        const sheet = document.getElementById('aesTurningSheet');
        if (sheet) sheet.classList.add('is-flipping');
      });

      setTimeout(function() {
        currentSpread = 1;
        isFlipping = false;
        renderFlipbook();
      }, 640);
      return;
    }

    // Case 2: Turning to Back Cover (Spread 3 [6,7] -> Spread 4 [8, null])
    if (currentSpread === spreads.length - 2) {
      const fromSpread = spreads[currentSpread];
      stage.innerHTML = `
        <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2 w-full">
          <div id="aesBookSpread" class="aes-book-spread relative max-w-5xl w-full flex items-center rounded-2xl overflow-hidden border border-slate-700/70">
            <!-- Left Static (Page 6) -->
            <div class="aes-page-static relative flex-1 bg-white border-r border-slate-300/40 rounded-l-xl">
              <img src="${AES.theme}/assets/brochure/page-6.jpg" alt="Page 6" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-left"></div>
            </div>
            <!-- Right Static (Empty dark back) -->
            <div class="aes-page-static relative flex-1 bg-slate-900 rounded-r-xl">
              <div class="aes-spine-shadow-right"></div>
            </div>
            <!-- 3D Turning Sheet -->
            <div id="aesTurningSheet" class="aes-turning-sheet aes-turn-forward shadow-2xl">
              <div class="aes-sheet-face rounded-r-xl">
                <img src="${AES.theme}/assets/brochure/page-${fromSpread.right}.jpg" alt="Page ${fromSpread.right}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-right"></div>
              </div>
              <div class="aes-sheet-face aes-sheet-back rounded-l-xl">
                <img src="${AES.theme}/assets/brochure/page-8.jpg" alt="Page 8" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-left"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      requestAnimationFrame(function() {
        const sheet = document.getElementById('aesTurningSheet');
        if (sheet) sheet.classList.add('is-flipping');
      });

      setTimeout(function() {
        currentSpread++;
        isFlipping = false;
        renderFlipbook();
      }, 640);
      return;
    }

    // Case 3: Dual Spread to Dual Spread (e.g. [2,3] -> [4,5])
    const fromSpread = spreads[currentSpread];
    const toSpread = spreads[currentSpread + 1];

    stage.innerHTML = `
      <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2 w-full">
        <div id="aesBookSpread" class="aes-book-spread relative max-w-5xl w-full flex items-center rounded-2xl overflow-hidden border border-slate-700/70">
          <!-- Left Static (Page ${fromSpread.left}) -->
          <div class="aes-page-static relative flex-1 bg-white border-r border-slate-300/40 rounded-l-xl">
            <img src="${AES.theme}/assets/brochure/page-${fromSpread.left}.jpg" alt="Page ${fromSpread.left}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
            <div class="aes-spine-shadow-left"></div>
          </div>
          <!-- Right Static (Page ${toSpread.right} revealed underneath!) -->
          <div class="aes-page-static relative flex-1 bg-white rounded-r-xl">
            <img src="${AES.theme}/assets/brochure/page-${toSpread.right}.jpg" alt="Page ${toSpread.right}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
            <div class="aes-spine-shadow-right"></div>
          </div>
          <!-- 3D Turning Sheet -->
          <div id="aesTurningSheet" class="aes-turning-sheet aes-turn-forward shadow-2xl">
            <div class="aes-sheet-face rounded-r-xl">
              <img src="${AES.theme}/assets/brochure/page-${fromSpread.right}.jpg" alt="Page ${fromSpread.right}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-right"></div>
            </div>
            <div class="aes-sheet-face aes-sheet-back rounded-l-xl">
              <img src="${AES.theme}/assets/brochure/page-${toSpread.left}.jpg" alt="Page ${toSpread.left}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-left"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    requestAnimationFrame(function() {
      const sheet = document.getElementById('aesTurningSheet');
      if (sheet) sheet.classList.add('is-flipping');
    });

    setTimeout(function() {
      currentSpread++;
      isFlipping = false;
      renderFlipbook();
    }, 640);
  };

  // Perform 3D Animated Backward Page Flip
  window.aesFlipPrev = function() {
    if (isFlipping) return;

    if (isMobile) {
      if (currentPageMobile > 1) {
        const card = document.getElementById('aesMobileCard');
        if (card) {
          isFlipping = true;
          card.classList.add('flipping-out-prev');
          setTimeout(function() {
            currentPageMobile--;
            renderFlipbook();
            isFlipping = false;
          }, 250);
        } else {
          currentPageMobile--;
          renderFlipbook();
        }
      }
      return;
    }

    if (currentSpread <= 0) return;

    isFlipping = true;
    const stage = document.getElementById('aesFlipbookStage');

    // Case 1: Closing from Spread 1 ([2,3]) back to Cover (Spread 0 [null, 1])
    if (currentSpread === 1) {
      stage.innerHTML = `
        <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2 w-full">
          <div id="aesBookSpread" class="aes-book-spread relative max-w-5xl w-full flex items-center rounded-2xl overflow-hidden border border-slate-700/70">
            <!-- Left Static (Dark book base) -->
            <div class="aes-page-static relative flex-1 bg-slate-900 border-r border-slate-800 rounded-l-xl">
              <div class="aes-spine-shadow-left"></div>
            </div>
            <!-- Right Static (Page 3) -->
            <div class="aes-page-static relative flex-1 bg-white rounded-r-xl">
              <img src="${AES.theme}/assets/brochure/page-3.jpg" alt="Page 3" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-right"></div>
            </div>
            <!-- 3D Turning Sheet Closing to Cover -->
            <div id="aesTurningSheet" class="aes-turning-sheet aes-turn-backward shadow-2xl">
              <div class="aes-sheet-face rounded-l-xl">
                <img src="${AES.theme}/assets/brochure/page-2.jpg" alt="Page 2" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-left"></div>
              </div>
              <div class="aes-sheet-face aes-sheet-back rounded-r-xl">
                <img src="${AES.theme}/assets/brochure/page-1.jpg" alt="Cover" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-right"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      requestAnimationFrame(function() {
        const sheet = document.getElementById('aesTurningSheet');
        if (sheet) sheet.classList.add('is-flipping');
      });

      setTimeout(function() {
        currentSpread = 0;
        isFlipping = false;
        renderFlipbook();
      }, 640);
      return;
    }

    // Case 2: Closing from Back Cover (Spread 4) to Spread 3 ([6,7])
    if (currentSpread === spreads.length - 1) {
      stage.innerHTML = `
        <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2 w-full">
          <div id="aesBookSpread" class="aes-book-spread relative max-w-5xl w-full flex items-center rounded-2xl overflow-hidden border border-slate-700/70">
            <!-- Left Static (Page 6 revealed underneath!) -->
            <div class="aes-page-static relative flex-1 bg-white border-r border-slate-300/40 rounded-l-xl">
              <img src="${AES.theme}/assets/brochure/page-6.jpg" alt="Page 6" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-left"></div>
            </div>
            <!-- Right Static (Page 7) -->
            <div class="aes-page-static relative flex-1 bg-white rounded-r-xl">
              <img src="${AES.theme}/assets/brochure/page-7.jpg" alt="Page 7" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-right"></div>
            </div>
            <!-- 3D Turning Sheet -->
            <div id="aesTurningSheet" class="aes-turning-sheet aes-turn-backward shadow-2xl">
              <div class="aes-sheet-face rounded-l-xl">
                <img src="${AES.theme}/assets/brochure/page-8.jpg" alt="Page 8" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-left"></div>
              </div>
              <div class="aes-sheet-face aes-sheet-back rounded-r-xl">
                <img src="${AES.theme}/assets/brochure/page-7.jpg" alt="Page 7" class="w-full h-auto max-h-[70vh] object-contain block select-none">
                <div class="aes-spine-shadow-right"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      requestAnimationFrame(function() {
        const sheet = document.getElementById('aesTurningSheet');
        if (sheet) sheet.classList.add('is-flipping');
      });

      setTimeout(function() {
        currentSpread--;
        isFlipping = false;
        renderFlipbook();
      }, 640);
      return;
    }

    // Case 3: Dual Spread to Dual Spread Backward (e.g. [4,5] -> [2,3])
    const fromSpread = spreads[currentSpread];
    const toSpread = spreads[currentSpread - 1];

    stage.innerHTML = `
      <div class="aes-book-viewport flex items-center justify-center h-full max-h-[72vh] py-2 w-full">
        <div id="aesBookSpread" class="aes-book-spread relative max-w-5xl w-full flex items-center rounded-2xl overflow-hidden border border-slate-700/70">
          <!-- Left Static (Page ${toSpread.left} revealed underneath!) -->
          <div class="aes-page-static relative flex-1 bg-white border-r border-slate-300/40 rounded-l-xl">
            <img src="${AES.theme}/assets/brochure/page-${toSpread.left}.jpg" alt="Page ${toSpread.left}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
            <div class="aes-spine-shadow-left"></div>
          </div>
          <!-- Right Static (Page ${fromSpread.right}) -->
          <div class="aes-page-static relative flex-1 bg-white rounded-r-xl">
            <img src="${AES.theme}/assets/brochure/page-${fromSpread.right}.jpg" alt="Page ${fromSpread.right}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
            <div class="aes-spine-shadow-right"></div>
          </div>
          <!-- 3D Turning Sheet -->
          <div id="aesTurningSheet" class="aes-turning-sheet aes-turn-backward shadow-2xl">
            <div class="aes-sheet-face rounded-l-xl">
              <img src="${AES.theme}/assets/brochure/page-${fromSpread.left}.jpg" alt="Page ${fromSpread.left}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-left"></div>
            </div>
            <div class="aes-sheet-face aes-sheet-back rounded-r-xl">
              <img src="${AES.theme}/assets/brochure/page-${toSpread.right}.jpg" alt="Page ${toSpread.right}" class="w-full h-auto max-h-[70vh] object-contain block select-none">
              <div class="aes-spine-shadow-right"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    requestAnimationFrame(function() {
      const sheet = document.getElementById('aesTurningSheet');
      if (sheet) sheet.classList.add('is-flipping');
    });

    setTimeout(function() {
      currentSpread--;
      isFlipping = false;
      renderFlipbook();
    }, 640);
  };

  window.aesJumpToPage = function(pageNumber) {
    if (isFlipping) return;
    if (isMobile) {
      currentPageMobile = Math.max(1, Math.min(totalPages, pageNumber));
      renderFlipbook();
    } else {
      if (pageNumber === 1) currentSpread = 0;
      else if (pageNumber === 2 || pageNumber === 3) currentSpread = 1;
      else if (pageNumber === 4 || pageNumber === 5) currentSpread = 2;
      else if (pageNumber === 6 || pageNumber === 7) currentSpread = 3;
      else if (pageNumber === 8) currentSpread = 4;
      renderFlipbook();
    }
  };

  window.aesToggleZoom = function() {
    isZoomed = !isZoomed;
    const btn = document.getElementById('aesZoomBtnText');
    if (btn) btn.textContent = isZoomed ? 'Zoom 100%' : 'Zoom 125%';
    renderFlipbook();
  };

  window.aesToggleFullscreen = function() {
    const modalContent = document.querySelector('#companyProfileModal > div');
    if (!modalContent) return;

    if (!document.fullscreenElement) {
      modalContent.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  function setupControls() {
    // Keyboard navigation when modal is open
    document.addEventListener('keydown', function(e) {
      const modal = document.getElementById('companyProfileModal');
      if (!modal || modal.classList.contains('hidden')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        window.aesFlipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        window.aesFlipPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        window.aesJumpToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        window.aesJumpToPage(8);
      }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    const stage = document.getElementById('aesFlipbookStage');
    if (stage) {
      stage.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stage.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          window.aesFlipNext();
        } else if (touchEndX - touchStartX > 50) {
          window.aesFlipPrev();
        }
      }, { passive: true });
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlipbook);
  } else {
    initFlipbook();
  }

  // Also hook into modal open
  const origOpenModal = window.openModal;
  window.openModal = function(id) {
    if (typeof origOpenModal === 'function') origOpenModal(id);
    if (id === 'companyProfileModal') {
      setTimeout(initFlipbook, 50);
    }
  };

})();

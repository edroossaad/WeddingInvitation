/* ═══════════════════════════════════════════════════
   WEDDING INVITATION — SCRIPT
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── CURTAIN REVEAL ─────────────────────────
    const curtainOverlay = document.getElementById('curtain-overlay');
    const openBtn = document.getElementById('open-curtain-btn');
    const mainContent = document.getElementById('main-content');

    openBtn.addEventListener('click', () => {
        curtainOverlay.classList.add('open');
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            mainContent.style.opacity = '1';
            mainContent.style.pointerEvents = 'auto';
            // Trigger hero animations
            document.querySelectorAll('#hero .fade-up').forEach(el => el.classList.add('visible'));
        }, 600);
        setTimeout(() => {
            curtainOverlay.style.display = 'none';
            launchCelebration();
        }, 2000);
    });

    // ─── COUNTDOWN TIMER ────────────────────────
    const weddingDate = new Date('2026-08-02T16:00:00').getTime();

    function updateCountdown() {
        const now = Date.now();
        const diff = weddingDate - now;
        if (diff <= 0) {
            document.getElementById('cd-days').textContent = '0';
            document.getElementById('cd-hours').textContent = '0';
            document.getElementById('cd-minutes').textContent = '0';
            document.getElementById('cd-seconds').textContent = '0';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('cd-days').textContent = String(d).padStart(3, '0');
        document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
        document.getElementById('cd-minutes').textContent = String(m).padStart(2, '0');
        document.getElementById('cd-seconds').textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ─── SCRATCH TO REVEAL ──────────────────────
    const scratchCanvas = document.getElementById('scratch-canvas');
    const scratchCard = document.getElementById('scratch-card');
    const scratchText = document.getElementById('scratch-progress-text');
    const ctx = scratchCanvas.getContext('2d');
    let isScratching = false;
    let scratchRevealed = false;

    let lastX, lastY;

    function initScratchCard() {
        const rect = scratchCard.getBoundingClientRect();
        scratchCanvas.width = rect.width;
        scratchCanvas.height = rect.height;

        // High-quality Gold foil gradient
        const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        grad.addColorStop(0, '#d4a843');
        grad.addColorStop(0.2, '#f0d78c');
        grad.addColorStop(0.4, '#c49b38');
        grad.addColorStop(0.6, '#e8cc6e');
        grad.addColorStop(0.8, '#b8892e');
        grad.addColorStop(1, '#d4a843');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Add subtle texture/noise
        ctx.globalAlpha = 0.05;
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1, 1);
        }
        ctx.globalAlpha = 1;

        // "Scratch Here" text
        ctx.font = '600 14px Montserrat, sans-serif';
        ctx.fillStyle = 'rgba(60, 40, 10, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('✧ SCRATCH TO REVEAL ✧', rect.width / 2, rect.height / 2);
    }

    function scratch(x, y, isFirst) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 45;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        if (isFirst) {
            ctx.moveTo(x, y);
        } else {
            ctx.moveTo(lastX, lastY);
        }
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
        
        checkScratchProgress();
    }

    function checkScratchProgress() {
        if (scratchRevealed) return;
        const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        let transparent = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) transparent++;
        }
        const pct = transparent / (imageData.data.length / 4);
        
        // REVEAL AT 10%
        if (pct > 0.10) {
            scratchRevealed = true;
            scratchCanvas.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), filter 1s ease';
            scratchCanvas.style.opacity = '0';
            scratchCanvas.style.filter = 'blur(10px)';
            
            document.getElementById('scratch-reveal').classList.add('animate-reveal');
            
            setTimeout(() => { 
                scratchCanvas.style.display = 'none'; 
            }, 1000);

            scratchText.textContent = '🎊 Celebrating Our Big Day! 🎊';
            scratchText.classList.add('revealed');
            
            // Trigger multiple bursts
            launchCelebration();
            setTimeout(launchCelebration, 400);
            setTimeout(launchCelebration, 800);
        }
    }

    function getPos(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        return { 
            x: (touch.clientX - rect.left) * (canvas.width / rect.width), 
            y: (touch.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    scratchCanvas.addEventListener('mousedown', (e) => { 
        isScratching = true; 
        const p = getPos(e, scratchCanvas); 
        scratch(p.x, p.y, true); 
    });
    scratchCanvas.addEventListener('mousemove', (e) => { 
        if (!isScratching) return; 
        const p = getPos(e, scratchCanvas); 
        scratch(p.x, p.y, false); 
    });
    scratchCanvas.addEventListener('mouseup', () => { isScratching = false; });
    scratchCanvas.addEventListener('mouseleave', () => { isScratching = false; });
    
    scratchCanvas.addEventListener('touchstart', (e) => { 
        e.preventDefault(); 
        isScratching = true; 
        const p = getPos(e, scratchCanvas); 
        scratch(p.x, p.y, true); 
    }, { passive: false });
    scratchCanvas.addEventListener('touchmove', (e) => { 
        e.preventDefault(); 
        if (!isScratching) return; 
        const p = getPos(e, scratchCanvas); 
        scratch(p.x, p.y, false); 
    }, { passive: false });
    scratchCanvas.addEventListener('touchend', () => { isScratching = false; });

    // Init scratch card when visible (use observer)
    let scratchInited = false;
    const scratchObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !scratchInited) {
                scratchInited = true;
                initScratchCard();
            }
        });
    }, { threshold: 0.3 });
    scratchObserver.observe(scratchCard);

    // ─── SCROLL ANIMATIONS ──────────────────────
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    // ─── PARTICLE BACKGROUND ────────────────────
    const particleCanvas = document.getElementById('particles-canvas');
    const pCtx = particleCanvas.getContext('2d');
    let particles = [];

    function resizeParticles() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.3 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.golden = Math.random() > 0.6;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity += Math.sin(Date.now() * 0.001 + this.x) * 0.005;
            if (this.y < -10) this.reset(), this.y = particleCanvas.height + 10;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const c = this.golden ? `rgba(201, 168, 76, ${this.opacity})` : `rgba(200, 200, 200, ${this.opacity * 0.4})`;
            pCtx.fillStyle = c;
            pCtx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ─── CELEBRATION CONFETTI ───────────────────
    const celebCanvas = document.getElementById('celebration-canvas');
    const cCtx = celebCanvas.getContext('2d');
    celebCanvas.width = window.innerWidth;
    celebCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        celebCanvas.width = window.innerWidth;
        celebCanvas.height = window.innerHeight;
    });

    let confettiPieces = [];
    let celebAnimating = false;

    class Confetti {
        constructor() {
            this.x = Math.random() * celebCanvas.width;
            this.y = -20 - Math.random() * 200;
            this.w = Math.random() * 8 + 4;
            this.h = Math.random() * 4 + 2;
            this.color = ['#c9a84c', '#e8d48b', '#f0ece2', '#ff6b8a', '#a07c2a', '#ffd700'][Math.floor(Math.random() * 6)];
            this.vy = Math.random() * 3 + 2;
            this.vx = (Math.random() - 0.5) * 2;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
            this.opacity = 1;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.rotation += this.rotSpeed;
            this.vy += 0.04;
            if (this.y > celebCanvas.height) this.opacity -= 0.02;
        }
        draw() {
            if (this.opacity <= 0) return;
            cCtx.save();
            cCtx.translate(this.x, this.y);
            cCtx.rotate((this.rotation * Math.PI) / 180);
            cCtx.globalAlpha = this.opacity;
            cCtx.fillStyle = this.color;
            cCtx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
            cCtx.restore();
        }
    }

    function launchCelebration() {
        confettiPieces = [];
        for (let i = 0; i < 150; i++) confettiPieces.push(new Confetti());
        if (!celebAnimating) {
            celebAnimating = true;
            animateConfetti();
        }
    }

    function animateConfetti() {
        cCtx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
        confettiPieces.forEach(c => { c.update(); c.draw(); });
        confettiPieces = confettiPieces.filter(c => c.opacity > 0);
        if (confettiPieces.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            celebAnimating = false;
        }
    }

    // ─── SMOOTH MAIN CONTENT TRANSITION ─────────
    mainContent.style.transition = 'opacity 1s ease';
});

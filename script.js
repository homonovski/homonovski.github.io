// Mobile Menu Toggle

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    document.body.classList.toggle('nav-open');
    navbar.style.zIndex = isOpen ? '1500' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.classList.remove('nav-open');
        navbar.style.zIndex = '';
    });
});

// Close on swipe left
let touchStartX = 0;
let touchStartY = 0;
navLinksContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

navLinksContainer.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (deltaX < -50 && Math.abs(deltaX) > deltaY) {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.classList.remove('nav-open');
        navbar.style.zIndex = '';
    }
}, { passive: true });

// Navigation Scroll Effect
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero');

const updateNavbar = () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY > heroHeight * 0.3) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', updateNavbar);

// Canvas Background Animation
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let lines = [];

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ConnectionLine {
    constructor() {
        this.particle1 = particles[Math.floor(Math.random() * particles.length)];
        this.particle2 = particles[Math.floor(Math.random() * particles.length)];
        this.opacity = 0.05 + Math.random() * 0.05;
        this.distance = 150 + Math.random() * 100;
    }

    update() {
        this.particle1 = particles[Math.floor(Math.random() * particles.length)];
        this.particle2 = particles[Math.floor(Math.random() * particles.length)];
    }

    draw() {
        const dx = this.particle1.x - this.particle2.x;
        const dy = this.particle1.y - this.particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.distance) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(this.particle1.x, this.particle1.y);
            ctx.lineTo(this.particle2.x, this.particle2.y);
            ctx.stroke();
        }
    }
}

function initCanvas() {
    resizeCanvas();
    particles = [];
    lines = [];

    // Reduce particles on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? Math.min(width / 20, 40) : Math.min(width / 10, 100);

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const lineCount = isMobile ? Math.min(width / 40, 30) : Math.min(width / 20, 80);
    for (let i = 0; i < lineCount; i++) {
        lines.push(new ConnectionLine());
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    lines.forEach(line => {
        line.update();
        line.draw();
    });

    requestAnimationFrame(animateCanvas);
}

// Throttle canvas on mobile to save battery
let lastCanvasFrame = 0;
const canvasThrottle = window.innerWidth <= 768 ? 3 : 0; // skip frames on mobile

function animateCanvasThrottled(timestamp) {
    if (timestamp - lastCanvasFrame >= canvasThrottle * 16) {
        lastCanvasFrame = timestamp;
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        lines.forEach(line => {
            line.update();
            line.draw();
        });
    }
    requestAnimationFrame(animateCanvasThrottled);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initCanvas();
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// Observe cards
document.querySelectorAll('.project-card, .skill-category').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
});


// Animated Counter for Stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * easeOutQuart;

        // Format number
        if (target % 1 !== 0) {
            element.textContent = current.toFixed(1) + '+';
        } else {
            element.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Initialize counters when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.about-stat-num');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                let value = parseFloat(text);
                if (text.includes('%')) value = 100;
                animateCounter(stat, value);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats-row');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    if (window.innerWidth <= 768) {
        animateCanvasThrottled(performance.now());
    } else {
        animateCanvas();
    }

    // Staggered animations for hero
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDesc = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');

    setTimeout(() => { if (heroSubtitle) heroSubtitle.classList.add('visible'); }, 200);
    setTimeout(() => { if (heroTitle) heroTitle.classList.add('visible'); }, 400);
    setTimeout(() => { if (heroDesc) heroDesc.classList.add('visible'); }, 600);
    setTimeout(() => { if (heroActions) heroActions.classList.add('visible'); }, 800);

    // Initialize Three.js
    initThreeScene();
});

// Scroll to top button
let showScrollBtn = false;
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-top-btn';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
scrollBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
scrollBtn.style.cssText = `
    position: fixed;
    bottom: calc(40px + env(safe-area-inset-bottom, 0px));
    right: calc(40px + env(safe-area-inset-right, 0px));
    width: 50px;
    height: 50px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 15px;
    color: white;
    cursor: pointer;
    display: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    opacity: 0;
    transform: translateY(10px);
`;

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    const isMobile = window.innerWidth <= 768;
    showScrollBtn = window.scrollY > 300 && !isMobile;
    scrollBtn.style.display = showScrollBtn ? 'block' : 'none';
    scrollBtn.style.opacity = showScrollBtn ? '1' : '0';
    scrollBtn.style.transform = showScrollBtn ? 'translateY(0)' : 'translateY(10px)';
});

// Music toggle button
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.querySelector('.music-btn');
const musicPlayer = document.querySelector('.music-player');
const volumeRange = document.querySelector('.volume-range');
let isPlaying = false;

bgMusic.volume = 0.5;

volumeRange.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
});

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicPlayer.classList.remove('active');
    } else {
        bgMusic.play().catch(() => {});
        musicBtn.classList.add('playing');
        musicPlayer.classList.add('active');
    }
    isPlaying = !isPlaying;
    musicBtn.blur();
});


// Three.js Scene
function initThreeScene() {
    const container = document.getElementById('threeScene');
    if (!container) return;

    const isMobile = window.innerWidth <= 768;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    // Renderer - reduce quality on mobile
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Torus Knot Geometry (Blender style)
    const geometry = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 8);

    // Material - glass-like with wireframe overlay
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Inner solid core
    const coreGeometry = new THREE.IcosahedronGeometry(0.4, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x00ffff, 1, 20);
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    // Star dust particles effect - reduce on mobile
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = isMobile ? 100 : 300;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    // Animation
    let autoRotate = true;
    let rotationSpeedX = 0.01;
    let rotationSpeedY = 0.015;
    let mouseX = 0;
    let mouseY = 0;
    let animationId = null;
    let isVisible = true;

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !animationId) {
            animate();
        }
    });

    function animate() {
        if (!isVisible) {
            animationId = null;
            return;
        }

        animationId = requestAnimationFrame(animate);

        if (autoRotate) {
            torus.rotation.x += rotationSpeedX;
            torus.rotation.y += rotationSpeedY;
            core.rotation.x += 0.02;
            core.rotation.y += 0.02;
            particleMesh.rotation.y += 0.001;
        }

        // Mouse interaction - only on desktop
        if (!isMobile) {
            torus.rotation.x += mouseY * 0.01;
            torus.rotation.y += mouseX * 0.01;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Pause Three.js when scrolled out of view
    const threeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isVisible) {
                    isVisible = true;
                    animate();
                }
            } else {
                isVisible = false;
            }
        });
    }, { threshold: 0.1 });
    threeObserver.observe(container);

    // Mouse move for interaction
    document.addEventListener('mousemove', (e) => {
        if (!autoRotate) {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        }
    });

    // Mouse down to stop auto-rotate and enable manual control
    container.addEventListener('mousedown', () => {
        autoRotate = false;
    });

    // Mouse up to resume auto-rotate
    document.addEventListener('mouseup', () => {
        autoRotate = true;
        mouseX = 0;
        mouseY = 0;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (container.clientWidth) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// Typewriter effect
const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
    const skills = ['python developer', 'fastapi', 'flask', 'telegram bots', 'automation', 'blender', 'docker', 'postgresql', 'sqlite', 'beautifulsoup', 'asyncio', 'git & github', 'linux', 'vps', 'api integration', 'rest api'];
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const current = skills[skillIndex];

        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            skillIndex = (skillIndex + 1) % skills.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

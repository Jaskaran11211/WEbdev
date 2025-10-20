// Beautiful 3D Interactive Website for Florida Climate Change

// DOM Elements
const floatingNav = document.getElementById('floatingNav');
const navCompass = document.getElementById('navCompass');
const navPanel = document.getElementById('navPanel');
const progressIndicator = document.getElementById('progressIndicator');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const mainNav = document.getElementById('mainNav');

// Global state
let isNavOpen = false;
let currentSection = 'hero';
let mouseX = 0;
let mouseY = 0;

// Initialize the website
function init() {
    setupNavigation();
    setupScrollEffects();
    setup3DEffects();
    setupAnimations();
    setupSmoothScrolling();
    setupHoverEffects();
    setupMobileOptimizations();
    
    // Start the experience
    startPageLoad();
}

// Navigation System
function setupNavigation() {
    // Compass click handler
    navCompass.addEventListener('click', toggleNavPanel);
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href.startsWith('#')) {
                scrollToSection(href.substring(1));
                closeNavPanel();
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', () => {
            const section = item.getAttribute('data-section');
            updateCompassDirection(section);
        });
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (isNavOpen && !floatingNav.contains(e.target)) {
            closeNavPanel();
        }
    });
}

function toggleNavPanel() {
    isNavOpen = !isNavOpen;
    navPanel.classList.toggle('active', isNavOpen);
    
    if (isNavOpen) {
        updateNavIndicators();
    }
}

function closeNavPanel() {
    isNavOpen = false;
    navPanel.classList.remove('active');
}

function updateCompassDirection(section) {
    const directions = {
        'hero': 0,
        'climate-impact': 90,
        'florida-impacts': 180,
        'solutions': 270,
        'resources': 45
    };
    
    const needle = document.querySelector('.compass-needle');
    const targetRotation = directions[section] || 0;
    
    needle.style.transition = 'transform 0.5s ease';
    needle.style.transform = `translate(-50%, -100%) rotate(${targetRotation}deg)`;
    
    setTimeout(() => {
        needle.style.transition = '';
    }, 500);
}

function updateNavIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    const sections = ['hero', 'climate-impact', 'florida-impacts', 'solutions', 'resources'];
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', sections[index] === currentSection);
    });
}

// Scroll Effects
function setupScrollEffects() {
    window.addEventListener('scroll', throttle(() => {
        updateProgressBar();
        handleNavbarScroll();
        updateCurrentSection();
        handleParallax();
    }, 16));
}

function updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
    
    progressFill.style.height = scrollPercent + '%';
    progressText.textContent = Math.round(scrollPercent) + '%';
}

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
}

function updateCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = sectionId;
            updateNavIndicators();
        }
    });
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    
    // Hero parallax
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const rate = scrolled * -0.3;
        heroImage.style.transform = `translateY(${rate}px) scale(1.05)`;
    }
    
    // Floating cards parallax
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        const rate = scrolled * (0.1 + index * 0.05);
        card.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.01}deg)`;
    });
}

// 3D Effects
function setup3DEffects() {
    // Mouse tracking for 3D effects
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        update3DEffects();
    });
    
    // Card 3D effects
    const cards = document.querySelectorAll('.impact-card, .solution-category, .resource-category');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = '';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
    });
}

function update3DEffects() {
    // Compass 3D rotation
    const compass = document.querySelector('.compass-ring');
    if (compass) {
        const rotateX = mouseY * 10;
        const rotateY = mouseX * 10;
        compass.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Floating cards 3D effect
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        const intensity = 0.5 + index * 0.2;
        const rotateX = mouseY * intensity;
        const rotateY = mouseX * intensity;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${index * 10}px)`;
    });
}

// Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animations for different elements
                if (entry.target.classList.contains('impact-card')) {
                    animateImpactCards();
                } else if (entry.target.classList.contains('stat-number')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.impact-card, .solution-category, .resource-category, .impact-story, .action-callout, .stat-number'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Typing animation for hero title
    initTypingAnimation();
}

function animateImpactCards() {
    const cards = document.querySelectorAll('.impact-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `slideInUp 0.6s ease forwards`;
        }, index * 200);
    });
}

function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const lines = heroTitle.querySelectorAll('.title-line');
        lines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            
            setTimeout(() => {
                typeWriter(line, text, 100);
            }, index * 500);
        });
    }
}

function typeWriter(element, text, speed) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const isMillion = target.includes('M');
        const isBillion = target.includes('B');
        
        let numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
        
        if (isMillion) {
            numericValue = numericValue * 1000000;
        } else if (isBillion) {
            numericValue = numericValue * 1000000000;
        }
        
        let current = 0;
        const increment = numericValue / 100;
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            
            if (isMillion) {
                displayValue = (displayValue / 1000000).toFixed(1) + 'M';
            } else if (isBillion) {
                displayValue = '$' + (displayValue / 1000000000).toFixed(1) + 'B';
            } else if (isPercentage) {
                displayValue = displayValue + '%';
            } else if (isPlus) {
                displayValue = '+' + displayValue + '"';
            }
            
            counter.textContent = displayValue;
        }, 20);
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                const sectionId = href.substring(1);
                scrollToSection(sectionId);
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Enhanced Hover Effects
function setupHoverEffects() {
    // Button hover effects
    const buttons = document.querySelectorAll('.cta-button, .action-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Image hover effects
    const images = document.querySelectorAll('.card-image img, .story-img');
    images.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.filter = '';
        });
    });
}

// Mobile Optimizations
function setupMobileOptimizations() {
    // Touch interactions
    if ('ontouchstart' in window) {
        setupTouchInteractions();
    }
    
    // Responsive navigation
    setupResponsiveNavigation();
    
    // Mobile menu
    setupMobileMenu();
}

function setupTouchInteractions() {
    const touchElements = document.querySelectorAll('.impact-card, .solution-category, .resource-category, .nav-item');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', () => {
            element.style.transform = '';
        });
    });
}

function setupResponsiveNavigation() {
    function handleResize() {
        const compass = document.querySelector('.nav-compass');
        const panel = document.querySelector('.nav-panel');
        
        if (window.innerWidth <= 768) {
            compass.style.width = '60px';
            compass.style.height = '60px';
            panel.style.width = '280px';
        } else {
            compass.style.width = '80px';
            compass.style.height = '80px';
            panel.style.width = '350px';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
}

function setupMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        color: var(--primary-teal);
        cursor: pointer;
        padding: 10px;
        transition: all 0.3s ease;
    `;
    
    navContainer.appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        mobileMenuBtn.style.transform = navLinks.classList.contains('mobile-open') ? 'rotate(90deg)' : 'rotate(0deg)';
    });
    
    function handleMobileMenu() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            navLinks.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(255, 248, 240, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 20px;
                box-shadow: var(--shadow-soft);
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
                border-radius: 0 0 20px 20px;
                border: 1px solid rgba(32, 178, 170, 0.1);
            `;
        } else {
            mobileMenuBtn.style.display = 'none';
            navLinks.style.cssText = '';
            navLinks.classList.remove('mobile-open');
        }
    }
    
    window.addEventListener('resize', handleMobileMenu);
    handleMobileMenu();
}

// Page Load Animation
function startPageLoad() {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
        
        // Start floating animations
        startFloatingAnimations();
    }, 100);
}

function startFloatingAnimations() {
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `float 6s ease-in-out infinite`;
            card.style.animationDelay = `${index * 2}s`;
        }, index * 200);
    });
}

// Performance optimizations
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Throttle scroll events
window.addEventListener('scroll', throttle(() => {
    updateProgressBar();
    handleNavbarScroll();
    updateCurrentSection();
    handleParallax();
}, 16));

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.warn('Error occurred:', e.error);
});

// Export functions for global access
window.scrollToSection = scrollToSection;
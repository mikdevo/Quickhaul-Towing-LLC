// ============================================
//             Configuration
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof CONFIG === 'undefined') {
        console.error('CONFIG is not defined. Make sure config.js is loaded before script.js');
        return;
    }

    initializeConfig();
    initializeServiceAreas();
    loadGoogleMapsEmbed();
    initializeAnimations();
    initializeImageCarousel();
});

function initializeConfig() {
    const companyNameEl = document.getElementById('companyName');
    if (companyNameEl) {
        companyNameEl.textContent = CONFIG.company.name;
    }

    const phoneLinks = [
        document.getElementById('navCallBtn'),
        document.getElementById('heroCallBtn'),
        document.getElementById('contactPhoneLink'),
        document.getElementById('footerPhoneLink'),
        document.getElementById('floatingCallBtn')
    ];

    phoneLinks.forEach(link => {
        if (link) {
            link.href = `tel:${CONFIG.company.phoneLink}`;
            link.setAttribute('data-tel', CONFIG.company.phoneLink);
            if (link.textContent && (link.textContent.includes('(') || link.textContent.includes('Call Now') || link.textContent.includes('GET A TOW'))) {
                if (!link.textContent.includes('GET A TOW') && !link.textContent.includes('Call Now')) {
                    link.textContent = CONFIG.company.phone;
                }
            }
        }
    });

    const emailLinks = [
        document.getElementById('contactEmailLink'),
        document.getElementById('footerEmailLink')
    ];

    emailLinks.forEach(link => {
        if (link) {
            link.href = `mailto:${CONFIG.company.email}`;
            link.textContent = CONFIG.company.email;
        }
    });

    const addressEls = [
        document.getElementById('contactAddress'),
        document.getElementById('footerAddress')
    ];

    addressEls.forEach(el => {
        if (el) {
            el.innerHTML = `${CONFIG.company.address.street}<br>${CONFIG.company.address.city}, ${CONFIG.company.address.state} ${CONFIG.company.address.zip}`;
        }
    });

    const socialLinks = {
        'socialInstagram': CONFIG.socialMedia.instagram,
        'socialFacebook': CONFIG.socialMedia.facebook,
        'socialTikTok': CONFIG.socialMedia.tiktok,
        'footerSocialInstagram': CONFIG.socialMedia.instagram,
        'footerSocialFacebook': CONFIG.socialMedia.facebook,
        'footerSocialTikTok': CONFIG.socialMedia.tiktok
    };

    Object.keys(socialLinks).forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            if (socialLinks[id]) {
                link.href = socialLinks[id];
            } else {
                link.href = '#';
                link.style.cursor = 'not-allowed';
                link.style.opacity = '0.6';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                });
            }
        }
    });

    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.textContent = CONFIG.company.bio;
    }
}

function initializeServiceAreas() {
    const areasGrid = document.getElementById('serviceAreasGrid');
    if (!areasGrid || !CONFIG.serviceAreas) return;

    areasGrid.innerHTML = '';

    CONFIG.serviceAreas.forEach(area => {
        const areaCard = document.createElement('a');
        areaCard.href = area.mapsLink;
        areaCard.target = '_blank';
        areaCard.rel = 'noopener noreferrer';
        areaCard.className = 'area-card';
        areaCard.textContent = area.name;
        areaCard.setAttribute('aria-label', `View ${area.name}, ${area.state} on Google Maps`);
        
        areaCard.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        areasGrid.appendChild(areaCard);
    });
}

function loadGoogleMapsEmbed() {
    const mapIframe = document.getElementById('map');
    if (!mapIframe || !CONFIG.company.address) {
        return;
    }

    const address = encodeURIComponent(CONFIG.company.address.full);
    const embedUrl = `https://www.google.com/maps?q=${address}&output=embed&zoom=14`;
    
    mapIframe.src = embedUrl;
    
    mapIframe.onerror = function() {
        showFallbackMap();
    };
}

function showFallbackMap() {
    const mapIframe = document.getElementById('map');
    if (mapIframe) {
        const address = CONFIG.company.address.full;
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        
        const mapContainer = mapIframe.parentElement;
        mapContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #0D1117; color: #CFB360; padding: 20px; text-align: center; flex-direction: column; gap: 15px; border-radius: 16px;">
                <div>
                    <h3 style="margin-bottom: 10px; color: #E2CC88; font-size: 1.5rem;">${CONFIG.company.name}</h3>
                    <p style="margin-bottom: 5px; color: rgba(255,255,255,0.8); font-size: 1.1rem;">${CONFIG.company.address.street}</p>
                    <p style="margin-bottom: 15px; color: rgba(255,255,255,0.8); font-size: 1.1rem;">${CONFIG.company.address.city}, ${CONFIG.company.address.state} ${CONFIG.company.address.zip}</p>
                    <a href="${mapsLink}" target="_blank" rel="noopener noreferrer" style="color: #CFB360; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 10px; padding: 12px 24px; border: 2px solid #CFB360; border-radius: 8px; transition: all 0.3s; background: rgba(207, 179, 96, 0.1);">View on Google Maps</a>
                </div>
            </div>
        `;
    }
}

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.href.startsWith('tel:') || this.href.startsWith('mailto:')) {
            return;
        }
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .review-card, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        const rate = scrolled * 0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const optimizedScrollHandler = debounce(() => {
    updateActiveNav();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

const reviewCards = document.querySelectorAll('.review-card');
reviewCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

function initializeImageCarousel() {
    const images = document.querySelectorAll('.image-frame');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let autoPlayInterval;
    let isInitialized = false;
    let carouselMouseLeaveHandler = null;
    let carouselHoverHandler = null;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function setActiveImage(index) {
        if (!isMobile()) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }
    }

    function nextImage() {
        if (!isMobile()) {
            const next = (currentIndex + 1) % images.length;
            setActiveImage(next);
        }
    }

    function startAutoPlay() {
        if (!isMobile()) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                nextImage();
            }, 4000);
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function initializeForScreen() {
        const carousel = document.querySelector('.image-carousel');
        
        if (isInitialized && carousel) {
            if (carouselMouseLeaveHandler) {
                carousel.removeEventListener('mouseleave', carouselMouseLeaveHandler);
            }
            if (carouselHoverHandler) {
                carousel.removeEventListener('mouseenter', carouselHoverHandler, true);
            }
        }

        stopAutoPlay();

        if (isMobile()) {
            images.forEach((img) => {
                img.classList.add('active');
            });
            indicators.forEach((ind) => {
                ind.style.pointerEvents = 'none';
                ind.style.opacity = '0.3';
            });
        } else {
            indicators.forEach((ind) => {
                ind.style.pointerEvents = 'auto';
                ind.style.opacity = '1';
            });
            
            if (carousel) {
                carouselHoverHandler = (e) => {
                    const frame = e.target.closest('.image-frame');
                    if (frame) {
                        const index = parseInt(frame.getAttribute('data-index'));
                        if (!isNaN(index)) {
                            setActiveImage(index);
                            stopAutoPlay();
                        }
                    }
                };
                carousel.addEventListener('mouseenter', carouselHoverHandler, true);

                carouselMouseLeaveHandler = () => {
                    startAutoPlay();
                };
                carousel.addEventListener('mouseleave', carouselMouseLeaveHandler);
            }

            indicators.forEach((indicator, index) => {
                indicator.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImage(index);
                    stopAutoPlay();
                    setTimeout(() => {
                        startAutoPlay();
                    }, 5000);
                };
            });

            setActiveImage(0);

            setTimeout(() => {
                startAutoPlay();
            }, 2000);
        }

        isInitialized = true;
    }

    initializeForScreen();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initializeForScreen();
        }, 250);
    });
}

console.log('%c🚛 Quickhaul Towing LLC', 'color: #CFB360; font-size: 20px; font-weight: bold;');
console.log('%cNeed a tow? Call us at ' + (CONFIG ? CONFIG.company.phone : '(815) 555-1234'), 'color: #E2CC88; font-size: 14px;');

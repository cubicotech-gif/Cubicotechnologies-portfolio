/**
 * CUBICO TECHNOLOGIES - MAIN JAVASCRIPT
 * Interactive functionality for portfolio website
 */

// ====================================
// MOBILE MENU TOGGLE
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// ====================================
// NAVBAR SCROLL EFFECT
// ====================================
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ====================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ====================================
function setActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);
window.addEventListener('load', setActiveNav);

// ====================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or empty
        if (href === '#' || href === '') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// SCROLL ANIMATIONS
// ====================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Optional: Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
});

// ====================================
// FAQ ACCORDION
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-question');

    faqItems.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// ====================================
// CONTACT FORM VALIDATION & SUBMISSION
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Clear previous messages
            clearMessages();

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                budget: document.getElementById('budget').value,
                message: document.getElementById('message').value.trim()
            };

            // Validate form
            const errors = validateForm(formData);

            if (errors.length > 0) {
                showErrorMessage(errors.join('<br>'));
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('.btn-primary');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            try {
                // Submit to Supabase
                if (typeof submitToSupabase === 'function') {
                    await submitToSupabase(formData);
                    showSuccessMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
                    contactForm.reset();
                } else {
                    // Fallback if Supabase is not configured
                    console.log('Form data:', formData);
                    showSuccessMessage('Thank you! Your message has been received. (Note: Database not configured yet)');
                    contactForm.reset();
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly via email.');
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        });
    }
});

// Form validation function
function validateForm(data) {
    const errors = [];

    // Name validation
    if (!data.name || data.name.length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }

    // Phone validation (optional but if provided, should be valid)
    if (data.phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
            errors.push('Please enter a valid phone number');
        }
    }

    // Service validation
    if (!data.service) {
        errors.push('Please select a service');
    }

    // Budget validation
    if (!data.budget) {
        errors.push('Please select a budget range');
    }

    // Message validation
    if (!data.message || data.message.length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }

    return errors;
}

// Message display functions
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = message;

    const form = document.getElementById('contact-form');
    form.insertAdjacentElement('afterend', messageDiv);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-remove after 8 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 8000);
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = message;

    const form = document.getElementById('contact-form');
    form.insertAdjacentElement('afterend', messageDiv);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-remove after 8 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 8000);
}

function clearMessages() {
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
}

// ====================================
// STATS COUNTER ANIMATION
// ====================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Observe stats section and animate when visible
document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.stats');

    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');

                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.textContent.replace('+', ''));
                        animateCounter(stat, target);
                    });

                    // Unobserve after animation
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }
});

// ====================================
// DYNAMIC YEAR IN FOOTER
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// ====================================
// ENHANCED BUTTON INTERACTIONS
// ====================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const x = e.offsetX;
        const y = e.offsetY;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'translate(-50%, -50%)';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// ====================================
// PERFORMANCE OPTIMIZATION
// ====================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(function() {
    setActiveNav();
}, 10));

// ====================================
// LAZY LOADING IMAGES (if any are added)
// ====================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====================================
// ACCESSIBILITY ENHANCEMENTS
// ====================================

// Trap focus in mobile menu when open
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-toggle');

    if (navLinks && mobileToggle) {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                mobileToggle.focus();
            }
        });
    }
});

// Skip to main content link
document.addEventListener('DOMContentLoaded', function() {
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        });
    }
});

// ====================================
// CONSOLE SIGNATURE
// ====================================
console.log('%c🚀 Cubico Technologies', 'font-size: 20px; font-weight: bold; color: #0d4f4f;');
console.log('%cElevating Islamic Content Through Innovation', 'font-size: 14px; color: #d4a853;');
console.log('%cWebsite crafted with care | Visit: https://cubicotechnologies.com', 'font-size: 12px; color: #6b6b6b;');

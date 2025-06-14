/* ========================================
   ESTUDIA TU FP EN JAPÓN - JAVASCRIPT
   Funcionalidades completas mobile-first
======================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

// Inicializar todas las funcionalidades
function initializeAll() {
    initializeAccordion();
    initializeFAQ();
    initializeScrollEffects();
    initializeContactForm();
    initializeScrollToTop();
    initializeScrollIndicator();
    initializeIntersectionObserver();
}

/* ========================================
   ACORDEÓN DE FAMILIAS PROFESIONALES
======================================== */
function initializeAccordion() {
    const familyCards = document.querySelectorAll('.family-card');
    
    familyCards.forEach(card => {
        const header = card.querySelector('.family-header');
        const content = card.querySelector('.family-content');
        const icon = card.querySelector('.expand-icon');
        
        header.addEventListener('click', () => {
            const isExpanded = card.classList.contains('expanded');
            
            // Cerrar otros acordeones (opcional - comentar si quieres múltiples abiertos)
            // familyCards.forEach(otherCard => {
            //     if (otherCard !== card) {
            //         otherCard.classList.remove('expanded');
            //     }
            // });
            
            // Toggle actual
            card.classList.toggle('expanded');
            
            // Animación del icono
            if (card.classList.contains('expanded')) {
                icon.style.transform = 'rotate(45deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
            
            // Scroll suave al elemento expandido
            if (!isExpanded) {
                setTimeout(() => {
                    header.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 300);
            }
        });
    });
}

/* ========================================
   FAQ ACCORDION
======================================== */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Cerrar otros FAQs (opcional)
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //     }
            // });
            
            // Toggle actual
            item.classList.toggle('active');
            
            // Animación del toggle
            if (item.classList.contains('active')) {
                toggle.style.transform = 'rotate(45deg)';
            } else {
                toggle.style.transform = 'rotate(0deg)';
            }
            
            // Scroll suave al FAQ expandido
            if (!isActive) {
                setTimeout(() => {
                    question.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 300);
            }
        });
    });
}

/* ========================================
   SCROLL EFFECTS Y NAVEGACIÓN
======================================== */
function initializeScrollEffects() {
    // Scroll suave para enlaces internos
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(25px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        }
    });
}

/* ========================================
   FORMULARIO DE CONTACTO
======================================== */
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Quitar clases de error previas
    field.classList.remove('error');
    removeErrorMessage(field);
    
    // Validación según el tipo de campo
    switch(field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            if (!isValid) showFieldError(field, 'Email no válido');
            break;
            
        case 'tel':
            const phoneRegex = /^[+]?[0-9\s-()]{9,}$/;
            isValid = !value || phoneRegex.test(value); // Teléfono es opcional
            if (!isValid) showFieldError(field, 'Teléfono no válido');
            break;
            
        default:
            if (field.required && !value) {
                isValid = false;
                showFieldError(field, 'Este campo es obligatorio');
            }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorDiv = field.parentNode.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--rojo-japon)';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '5px';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function removeErrorMessage(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validar todos los campos
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Por favor, corrige los errores del formulario', 'error');
        return;
    }
    
    // Tracking Analytics - Lead generado
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            'event_category': 'Lead Generation',
            'event_label': data.programa || 'Sin programa',
            'value': 1
        });
    }
    
    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '📤 Enviando...';
    submitBtn.disabled = true;
    
    // URL de tu Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzbWiXqYcos0RCb0Jt4HgnJd87c6dadGTnyKNAceagUCu-6PBZLBbAMB_KcFGm_7iFb/exec';
    
    // Enviar a Google Apps Script
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Respuesta:', response);
        showNotification('¡Solicitud enviada! Te contactaremos pronto 🎉', 'success');
        form.reset();
        
        // Redirigir a página de gracias
        setTimeout(() => {
            window.location.href = 'gracias.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error al enviar. Inténtalo de nuevo o escríbenos a estudiatufpenjapon@gmail.com', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function createWhatsAppMessage(data) {
    return `🌸 *SOLICITUD DE INFORMACIÓN - FP EN JAPÓN* 🗾

👤 *Datos Personales:*
• Nombre: ${data.nombre}
• Email: ${data.email}
• Teléfono: ${data.telefono || 'No proporcionado'}

🎓 *Programa de Interés:*
• ${data.programa || 'No especificado'}

💬 *Mensaje adicional:*
${data.mensaje || 'Sin mensaje adicional'}

---
Solicitud enviada desde: estudiatufpenjapon.github.io
Fecha: ${new Date().toLocaleDateString('es-ES')}`;
}

/* ========================================
   NOTIFICACIONES
======================================== */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Colores según el tipo
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #17a2b8, #138496)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

/* ========================================
   SCROLL TO TOP
======================================== */
function initializeScrollToTop() {
    // Crear botón scroll to top
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--gradiente-principal);
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        z-index: 998;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Mostrar/ocultar botón
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   SCROLL INDICATOR
======================================== */
function initializeScrollIndicator() {
    // Crear indicador de scroll
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradiente-principal);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(scrollIndicator);
    
    // Actualizar indicador en scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        scrollIndicator.style.width = scrollPercent + '%';
    });
}

/* ========================================
   INTERSECTION OBSERVER - ANIMACIONES
======================================== */
function initializeIntersectionObserver() {
    // Elementos a animar
    const animatedElements = document.querySelectorAll(`
        .benefit-card,
        .testimonial-card,
        .step,
        .cycle-card,
        .family-card
    `);
    
    // Añadir clase fade-in
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   UTILITIES
======================================== */

// Función para scroll to contact (usada en header)
function scrollToContact() {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Lazy loading para imágenes (si las hubiera)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Debounce function para optimizar eventos
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

// Optimizar scroll events
const optimizedScrollHandler = debounce(() => {
    // Aquí van las funciones que dependen del scroll
}, 16); // ~60fps

// Analytics (Google Analytics, si se necesita)
function trackEvent(action, category = 'User Interaction', label = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track clicks importantes
document.addEventListener('click', (e) => {
    // WhatsApp clicks
    if (e.target.closest('.whatsapp-btn') || e.target.closest('a[href*="wa.me"]')) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'floating_button',
                'event_action': 'contact_intent'
            });
        }
        console.log('WhatsApp click tracked');
    }
    
    // CTA clicks
    if (e.target.closest('.btn-primary')) {
        const buttonText = e.target.textContent || e.target.closest('.btn-primary').textContent;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'CTA',
                'event_label': buttonText.trim(),
                'event_action': 'engagement'
            });
        }
        console.log('CTA click tracked:', buttonText);
    }
    
    // Family accordion clicks
    if (e.target.closest('.family-header')) {
        const familyName = e.target.closest('.family-card').dataset.family;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'expand', {
                'event_category': 'Programs',
                'event_label': familyName,
                'event_action': 'family_expand'
            });
        }
        console.log('Family expansion tracked:', familyName);
    }
    
    // FAQ clicks
    if (e.target.closest('.faq-question')) {
        const faqTitle = e.target.closest('.faq-question').querySelector('h3').textContent;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'expand', {
                'event_category': 'FAQ',
                'event_label': faqTitle.substring(0, 50),
                'event_action': 'faq_expand'
            });
        }
        console.log('FAQ expansion tracked:', faqTitle);
    }
    
    // Email clicks
    if (e.target.closest('a[href^="mailto:"]')) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'email',
                'event_action': 'contact_intent'
            });
        }
        console.log('Email click tracked');
    }
    
    // External links
    if (e.target.closest('a[target="_blank"]')) {
        const url = e.target.closest('a').href;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'External Link',
                'event_label': url,
                'event_action': 'outbound'
            });
        }
        console.log('External link tracked:', url);
    }
});

/* ========================================
   MOBILE SPECIFIC OPTIMIZATIONS
======================================== */

// Prevenir zoom en inputs en iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.fontSize = '16px';
        });
        input.addEventListener('blur', () => {
            input.style.fontSize = '';
        });
    });
}

// Optimización de touch events
let startY;
document.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', e => {
    const currentY = e.touches[0].clientY;
    // Aquí se pueden añadir gestos personalizados
}, { passive: true });

/* ========================================
   ERROR HANDLING
======================================== */
window.addEventListener('error', (e) => {
    console.error('Error capturado:', e.error);
    // Enviar error a analytics si es necesario
});

// Service Worker registration (PWA ready)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registrado'))
        //     .catch(error => console.log('SW falló'));
    });
}

console.log('🌸 Estudia tu FP en Japón - JavaScript cargado correctamente! 🗾');
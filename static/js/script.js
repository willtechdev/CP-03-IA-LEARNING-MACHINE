'use strict';

const utils = {
    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    debounce(func, wait) {
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
};

(function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            utils.scrollToElement(target);
        });
    });

    const handleScroll = utils.debounce(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', handleScroll, { passive: true });
})();

(function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.menu-category, .feature, .contact-item, .about-content, .about-image').forEach(el => {
        observer.observe(el);
    });
})();

const Chatbot = (function() {
    let isOpen = false;
    let waitingForPlateSelection = false;
    let apiKey = null;

    const toggle = document.getElementById('chatbotToggle');
    const container = document.getElementById('chatbotContainer');
    const messagesContainer = document.getElementById('cbMessages');
    const input = document.getElementById('cbInput');
    const sendButton = document.getElementById('cbSend');

    function init() {
        if (!toggle || !container || !messagesContainer || !input || !sendButton) {
            console.error('Chatbot elements not found');
            return;
        }

        toggle.addEventListener('click', handleToggle);
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
            }
        });

        sendButton.addEventListener('click', handleSendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !sendButton.disabled) {
                handleSendMessage();
            }
        });

        document.addEventListener('click', handleOutsideClick);

        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            input.addEventListener('focus', () => {
                input.style.fontSize = '16px';
            });
        }

        input.addEventListener('focus', () => {
            scrollToBottom();
        });
    }

    function handleToggle() {
        isOpen = !isOpen;
        container.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            input.focus();
        }
    }

    function handleOutsideClick(e) {
        if (isOpen && 
            !container.contains(e.target) && 
            e.target !== toggle &&
            !toggle.contains(e.target)) {
            handleToggle();
        }
    }

    function addMessage(content, isUser = false, intent = null, probability = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
        
        let infoHtml = '';
        if (!isUser && intent && probability !== null) {
            let probClass = 'probability-low';
            if (probability >= 70) probClass = 'probability-high';
            else if (probability >= 40) probClass = 'probability-medium';
            
            infoHtml = `
                <div class='chatbot-info'>
                    <strong>Intenção:</strong> ${escapeHtml(intent)}<br>
                    <strong>Confiança:</strong> <span class='${probClass}'>${probability}%</span>
                </div>
            `;
        }

        messageDiv.innerHTML = `
            <div class="chatbot-message-content">${formatMessage(content)}</div>
            ${infoHtml}
        `;

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function formatMessage(content) {
        return escapeHtml(content)
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/(\d+)\./g, '<strong>$1.</strong>');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function handleSendMessage() {
        const message = input.value.trim();
        if (!message || sendButton.disabled) return;

        addMessage(message, true);
        input.value = '';
        
        sendButton.disabled = true;
        sendButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';

        try {
            const payload = { message };
            
            if (waitingForPlateSelection) {
                payload.selecao_prato = message;
                if (apiKey) {
                    payload.api_key = apiKey;
                }
            }

            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            setTimeout(() => {
                if (response.ok) {
                    addMessage(data.response, false, data.intent, data.probability);
                    
                    if (data.needs_prato_selection) {
                        waitingForPlateSelection = true;
                    } else {
                        waitingForPlateSelection = false;
                    }
                } else {
                    addMessage('Gomen nasai! Houve um erro no sistema. Por favor, tente novamente.', false);
                    waitingForPlateSelection = false;
                }

                sendButton.disabled = false;
                sendButton.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i>';
                input.focus();
            }, 1000);

        } catch (error) {
            console.error('Error sending message:', error);
            setTimeout(() => {
                addMessage('Erro de conexão. Verifique sua internet e tente novamente.', false);
                waitingForPlateSelection = false;
                sendButton.disabled = false;
                sendButton.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i>';
                input.focus();
            }, 800);
        }
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    Chatbot.init();
});


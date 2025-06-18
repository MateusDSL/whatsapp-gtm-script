(function() {
    // --- INÍCIO DAS CONFIGURAÇÕES ---
    const WHATSAPP_NUMBER = "554930194949";
    const GOOGLE_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxCfahnAV6rMhAyIhMXEchwkMAlcmtQGYQV_0F2Uyn2i9CCt8x0XytNm9Yu8m8YUv5YTw/exec";
    
    // IMPORTANTE: Esta URL deve ser o caminho para o seu arquivo CSS no GitHub Pages
    const CSS_URL = "https://mateusdsl.github.io/whatsapp-gtm-script/whatsapp-button.css"; 
    // --- FIM DAS CONFIGURAÇÕES ---

    // --- ÍCONES SVG ---
    const ICONS = {
        whatsapp: `<svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/></svg>`,
        whatsappHeader: `<svg class="w-5 h-5 text-white hover-bounce" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/></svg>`,
        whatsappSubmit: `<svg class="w-4 h-4 mr-2 hover-icon-wiggle" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/></svg>`,
        x: `<svg class="w-4 h-4 hover-spin" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        phone: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
        user: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        loader: `<svg class="w-4 h-4 mr-2 animate-spin" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
    };

    let isSubmitting = false;
    let formData = {
        name: "", phone: "", gclid: "", utm_source: "",
        utm_medium: "", utm_campaign: "", utm_term: "", utm_content: ""
    };

    function loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = CSS_URL;
        document.head.appendChild(link);
    }

    function createDOM() {
        const container = document.createElement('div');
        container.className = 'font-sans';
        container.innerHTML = `
            <button id="wlc-floating-button" class="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse hover-float flex items-center justify-center" title="Fale conosco pelo WhatsApp">
                ${ICONS.whatsapp}
            </button>
            <div id="wlc-modal" class="fixed inset-0 z-[100]" style="display: none;">
                <div id="wlc-overlay" class="absolute inset-0 bg-black transition-opacity duration-300 opacity-0"></div>
                <div id="wlc-panel" class="absolute right-0 bottom-0 h-auto w-full max-w-sm bg-white shadow-2xl rounded-tl-3xl rounded-bl-3xl md:rounded-bl-none spring-animation slide-in-start">
                    <div class="flex items-center justify-between p-3 border-b border-gray-200 bg-[#25D366] rounded-tl-3xl">
                        <div class="flex items-center space-x-3 hover-group">
                            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover-pulse">
                                ${ICONS.whatsappHeader}
                            </div>
                            <h2 class="text-lg font-semibold text-white hover-glow">WhatsApp</h2>
                        </div>
                        <button id="wlc-close-button" class="text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 p-0 hover-rotate-close flex items-center justify-center">
                            ${ICONS.x}
                        </button>
                    </div>
                    <div class="p-3">
                        <div class="mb-4 transition-all duration-500 hover-lift-subtle opacity-0 translate-y-4" data-animate-order="1">
                            <h3 class="text-base font-medium text-gray-900 mb-1 hover-color-shift">Fale Conosco</h3>
                            <p class="text-xs text-gray-600 hover-fade-in">Deixe seus dados e inicie uma conversa no WhatsApp.</p>
                        </div>
                        <div id="wlc-status-message" class="mb-3 p-2 text-sm rounded-lg text-center" style="display: none;"></div>
                        <form id="wlc-lead-form" class="space-y-3">
                            <div class="space-y-1 transition-all duration-500 hover-field-group opacity-0 translate-y-4" data-animate-order="2">
                                <label for="wlc-name" class="text-sm font-medium text-gray-700 hover-label">Nome</label>
                                <div class="relative hover-input-container">
                                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 hover-icon-color transition-colors duration-200">${ICONS.user}</span>
                                    <input id="wlc-name" name="name" type="text" placeholder="Seu nome completo" class="pl-10 h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm hover-input-focus" required>
                                </div>
                            </div>
                            <div class="space-y-1 transition-all duration-500 hover-field-group opacity-0 translate-y-4" data-animate-order="3">
                                <label for="wlc-phone" class="text-sm font-medium text-gray-700 hover-label">Telefone (WhatsApp)</label>
                                <div class="relative hover-input-container">
                                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 hover-icon-color transition-colors duration-200">${ICONS.phone}</span>
                                    <input id="wlc-phone" name="phone" type="tel" placeholder="(XX) XXXXX-XXXX" class="pl-10 h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm hover-input-focus" required maxlength="15">
                                </div>
                            </div>
                            <div class="pt-1 transition-all duration-500 opacity-0 translate-y-4" data-animate-order="4">
                                <button id="wlc-submit-button" type="submit" class="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-2.5 transition-all duration-200 hover-button-premium inline-flex items-center justify-center rounded-md text-sm">
                                    ${ICONS.whatsappSubmit}<span class="hover-text-glow">Iniciar Conversa</span>
                                </button>
                            </div>
                        </form>
                        <div class="mt-3 pt-3 border-t border-gray-100 transition-all duration-500 hover-info-section opacity-0 translate-y-4" data-animate-order="5">
                            <p class="text-xs text-gray-500 text-center hover-info-text">Ao enviar, seus dados serão registrados e você será redirecionado(a) para o WhatsApp.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }
    
    function init() {
        if (document.getElementById('wlc-modal')) return; // Evita múltiplas injeções
        loadCSS();
        createDOM();

        const floatingButton = document.getElementById('wlc-floating-button');
        const modal = document.getElementById('wlc-modal');
        const overlay = document.getElementById('wlc-overlay');
        const panel = document.getElementById('wlc-panel');
        const closeModalButton = document.getElementById('wlc-close-button');
        const form = document.getElementById('wlc-lead-form');
        const nameInput = document.getElementById('wlc-name');
        const phoneInput = document.getElementById('wlc-phone');
        const submitButton = document.getElementById('wlc-submit-button');
        const statusMessage = document.getElementById('wlc-status-message');

        const captureUrlParams = () => {
            const params = new URLSearchParams(window.location.search);
            formData.gclid = params.get("gclid") || "";
            formData.utm_source = params.get("utm_source") || "";
            formData.utm_medium = params.get("utm_medium") || "";
            formData.utm_campaign = params.get("utm_campaign") || "";
            formData.utm_term = params.get("utm_term") || "";
            formData.utm_content = params.get("utm_content") || "";
        };

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            if (name === "phone") {
                const phoneValue = value.replace(/\D/g, "");
                let formattedPhone = phoneValue;
                if (phoneValue.length <= 2) formattedPhone = `(${phoneValue}`;
                else if (phoneValue.length <= 6) formattedPhone = `(${phoneValue.slice(0,2)}) ${phoneValue.slice(2)}`;
                else if (phoneValue.length <= 10) formattedPhone = `(${phoneValue.slice(0,2)}) ${phoneValue.slice(2,6)}-${phoneValue.slice(6)}`;
                else formattedPhone = `(${phoneValue.slice(0,2)}) ${phoneValue.slice(2,7)}-${phoneValue.slice(7,11)}`;
                e.target.value = formattedPhone.slice(0,15);
                formData.phone = e.target.value;
            } else {
                formData[name] = value;
            }
        };

        const setStatus = (message, type = 'info') => {
            statusMessage.innerHTML = message;
            statusMessage.style.display = message ? 'block' : 'none';
            statusMessage.className = 'mb-3 p-2 text-sm rounded-lg text-center';
            if (type === 'info') {
                statusMessage.classList.add('bg-blue-100', 'text-blue-700', 'border', 'border-blue-200');
                statusMessage.innerHTML = ICONS.loader + message;
            } else if (type === 'success') {
                statusMessage.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-200');
            } else if (type === 'error') {
                statusMessage.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-200');
            }
        };
        
        const updateSubmitButton = () => {
            if (isSubmitting) {
                submitButton.disabled = true;
                submitButton.innerHTML = `${ICONS.loader}<span>Processando...</span>`;
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = `${ICONS.whatsappSubmit}<span class="hover-text-glow">Iniciar Conversa</span>`;
            }
        };

        const openModal = () => {
            modal.style.display = 'block';
            floatingButton.style.display = 'none';
            nameInput.value = '';
            phoneInput.value = '';
            formData.name = '';
            formData.phone = '';
            setStatus('');
            setTimeout(() => {
                overlay.classList.remove('opacity-0');
                overlay.classList.add('opacity-30');
                panel.classList.remove('slide-in-start');
                panel.classList.add('slide-in-end');
            }, 10);
            setTimeout(() => {
                const animatedElements = panel.querySelectorAll("[data-animate-order]");
                animatedElements.forEach(el => {
                    el.classList.remove("opacity-0", "translate-y-4");
                    const order = el.dataset.animateOrder;
                    el.style.animation = `fadeInUp 0.5s ease-out ${0.1 + (order * 0.05)}s both`;
                });
            }, 200);
        };

        const closeModal = () => {
            if (isSubmitting) return;
            overlay.classList.add('opacity-0');
            overlay.classList.remove('opacity-30');
            panel.classList.add('slide-out');
            panel.classList.remove('slide-in-end');
            setTimeout(() => {
                modal.style.display = 'none';
                floatingButton.style.display = 'flex';
                panel.classList.remove('slide-out');
                panel.classList.add('slide-in-start');
                const animatedElements = panel.querySelectorAll("[data-animate-order]");
                animatedElements.forEach(el => {
                    el.style.animation = '';
                    el.classList.add("opacity-0", "translate-y-4");
                });
            }, 300);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            isSubmitting = true;
            updateSubmitButton();
            setStatus("Enviando dados...", 'info');

            const payload = { ...formData, telefone: formData.phone.replace(/\D/g, '') };

            try {
                await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
                    method: 'POST', mode: 'no-cors', body: JSON.stringify(payload)
                });
                setStatus("Dados enviados! Redirecionando para o WhatsApp...", 'success');
                const message = `Olá! Meu nome é ${formData.name}. Gostaria de mais informações.\n\n📱 Telefone: ${formData.phone}\n\n(Ref: ${formData.gclid ? `GCLID ${formData.gclid}` : ''} ${formData.utm_source ? `Source ${formData.utm_source}` : ''}) \n\nAguardo seu contato!`;
                const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                setTimeout(() => {
                    closeModal();
                    window.open(whatsappUrl, "_blank");
                    isSubmitting = false;
                    updateSubmitButton();
                }, 1500);
            } catch (error) {
                console.error("Erro ao enviar dados para o Google Script:", error);
                setStatus("Erro ao enviar dados. Tente novamente.", 'error');
                isSubmitting = false;
                updateSubmitButton();
            }
        };

        captureUrlParams();
        floatingButton.addEventListener('click', openModal);
        closeModalButton.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        form.addEventListener('submit', handleSubmit);
        nameInput.addEventListener('input', handleInputChange);
        phoneInput.addEventListener('input', handleInputChange);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

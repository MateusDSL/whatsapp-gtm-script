// WhatsApp Button Script - Versão Atualizada para GTM
(function() {
    // --- CONFIGURAÇÕES --- (Altere estes valores)
    const GOOGLE_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxCfahnAV6rMhAyIhMXEchwkMAlcmtQGYQV_0F2Uyn2i9CCt8x0XytNm9Yu8m8YUv5YTw/exec"; // Substitua pela URL do seu Google Apps Script Web App
    const CSS_URL = "https://mateusdsl.github.io/whatsapp-gtm-script/whatsapp-button.css"; // URL para o arquivo CSS. Se hospedar em outro lugar, atualize aqui.
    const SHOW_DELAY_MS = 1000; // Delay em milissegundos para mostrar o botão
    // --- FIM DAS CONFIGURAÇÕES ---

    // --- Variáveis de Estado ---
    let isModalOpen = false;
    let isClosing = false;
    let isOpening = false;
    let showContent = false;
    let isSubmitting = false;
    let submitStatus = null;
    let statusMessage = "";
    let formData = {
        name: "",
        phone: "",
        gclid: "",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_term: "",
        utm_content: ""
    };

    // --- Funções Utilitárias ---
    function formatPhoneNumber(value) {
        const digits = value.replace(/\D/g, "");
        let formattedPhone = digits;
        if (digits.length <= 2) {
            formattedPhone = `(${digits}`;
        } else if (digits.length <= 6) {
            formattedPhone = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
        } else if (digits.length <= 10) {
            formattedPhone = `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
        } else {
            formattedPhone = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
        }
        return formattedPhone.slice(0, 15);
    }

    function setStatus(message, type) {
        statusMessage = message;
        submitStatus = type;
        const statusEl = document.getElementById('whatsapp-status-message');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `whatsapp-status-message whatsapp-status-${type || 'info'}`;
            statusEl.style.display = message ? 'block' : 'none';
        }
    }

    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        formData.gclid = params.get("gclid") || "";
        formData.utm_source = params.get("utm_source") || "";
        formData.utm_medium = params.get("utm_medium") || "";
        formData.utm_campaign = params.get("utm_campaign") || "";
        formData.utm_term = params.get("utm_term") || "";
        formData.utm_content = params.get("utm_content") || "";
    }

    function resetForm() {
        formData.name = "";
        formData.phone = "";
        isSubmitting = false;
        submitStatus = null;
        statusMessage = "";
        
        const nameInput = document.getElementById('whatsapp-name');
        const phoneInput = document.getElementById('whatsapp-phone');
        const statusEl = document.getElementById('whatsapp-status-message');
        const submitBtn = document.getElementById('whatsapp-submit-btn');
        
        if (nameInput) nameInput.value = "";
        if (phoneInput) phoneInput.value = "";
        if (statusEl) statusEl.style.display = 'none';
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                Iniciar Conversa
            `;
        }
    }

    function closeModal() {
        if (isSubmitting) return;
        isClosing = true;
        showContent = false;
        
        const overlay = document.getElementById('whatsapp-modal-overlay');
        const panel = document.getElementById('whatsapp-modal-panel');
        
        if (overlay) overlay.style.opacity = '0';
        if (panel) panel.classList.add('whatsapp-slide-out');
        
        setTimeout(() => {
            isModalOpen = false;
            isClosing = false;
            const container = document.getElementById('whatsapp-modal-container');
            if (container) container.remove();
        }, 300);
    }

    function openModal() {
        isModalOpen = true;
        isOpening = true;
        showContent = false;
        submitStatus = null;
        statusMessage = "";
        resetForm();
        
        createModal();
        
        const overlay = document.getElementById('whatsapp-modal-overlay');
        const panel = document.getElementById('whatsapp-modal-panel');
        
        setTimeout(() => {
            if (overlay) overlay.style.opacity = '1';
            if (panel) panel.classList.add('whatsapp-slide-in-active');
            isOpening = false;
        }, 50);
        
        setTimeout(() => {
            showContent = true;
            const elements = document.querySelectorAll('.whatsapp-fade-in');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 200);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;
        
        const nameInput = document.getElementById('whatsapp-name');
        const phoneInput = document.getElementById('whatsapp-phone');
        const submitBtn = document.getElementById('whatsapp-submit-btn');
        
        if (!nameInput || !phoneInput) return;
        
        formData.name = nameInput.value;
        formData.phone = phoneInput.value;
        
        isSubmitting = true;
        submitStatus = null;
        setStatus("Enviando dados...", "info");
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="whatsapp-spinner">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Processando...
            `;
        }

        if (!GOOGLE_SCRIPT_WEB_APP_URL) {
            console.error("URL do Google Apps Script não configurada!");
            setStatus("Erro de configuração: URL do Google Script não definida.", "error");
            isSubmitting = false;
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        try {
            const payload = {
                nome: formData.name,
                telefone: formData.phone.replace(/\D/g, ''),
                gclid: formData.gclid,
                utm_source: formData.utm_source,
                utm_medium: formData.utm_medium,
                utm_campaign: formData.utm_campaign,
                utm_term: formData.utm_term,
                utm_content: formData.utm_content,
            };

            await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                redirect: 'follow',
                body: JSON.stringify(payload)
            });

            console.log("Tentativa de envio para o Google Script concluída.");
            setStatus("Dados enviados! Redirecionando para o WhatsApp...", "success");
            submitStatus = "success";

            const message = `Olá! Meu nome é ${formData.name}. Gostaria de mais informações.\n\n📱 Telefone: ${formData.phone}\n\n(Ref: ${formData.gclid ? `GCLID ${formData.gclid}` : ''} ${formData.utm_source ? `Source ${formData.utm_source}` : ''}) \n\nAguardo seu contato!`;
            const whatsappUrl = "https://tintim.link/whatsapp/826e2a65-3402-47a3-9dae-9e6a55f5ddb5/0ad8dba1-d477-46fe-b8df-ab703e0415a2";

            window.open(whatsappUrl, "_blank");
            setTimeout(() => {
                resetForm();
                closeModal();
            }, 1500);

        } catch (error) {
            console.error("Erro ao enviar dados para o Google Script:", error);
            setStatus("Erro ao enviar dados. Tente novamente.", "error");
            submitStatus = "error";
            isSubmitting = false;
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    // --- Criação dos Elementos HTML ---
    function createWhatsAppButton() {
        const container = document.createElement('div');
        container.id = 'whatsapp-gtm-container';
        
        const button = document.createElement('button');
        button.className = 'whatsapp-fab';
        button.title = 'Fale conosco pelo WhatsApp';
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/>
            </svg>
        `;
        button.onclick = openModal;
        
        container.appendChild(button);
        document.body.appendChild(container);
    }

    function createModal() {
        // Remover modal existente se houver
        const existingModal = document.getElementById('whatsapp-modal-container');
        if (existingModal) existingModal.remove();
        
        const modalContainer = document.createElement('div');
        modalContainer.id = 'whatsapp-modal-container';
        
        const overlay = document.createElement('div');
        overlay.id = 'whatsapp-modal-overlay';
        overlay.className = 'whatsapp-modal-overlay';
        overlay.style.opacity = '0';
        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };
        
        const panel = document.createElement('div');
        panel.id = 'whatsapp-modal-panel';
        panel.className = 'whatsapp-modal-panel whatsapp-slide-in';
        
        // Header
        const header = document.createElement('div');
        header.className = 'whatsapp-modal-header';
        header.innerHTML = `
            <div class="whatsapp-header-title">
                <div class="whatsapp-header-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                    </svg>
                </div>
                <h2 class="whatsapp-header-text">WhatsApp</h2>
            </div>
            <button id="whatsapp-close-btn" class="whatsapp-close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
            </button>
        `;
        
        // Body
        const body = document.createElement('div');
        body.className = 'whatsapp-modal-body';
        body.innerHTML = `
            <div class="whatsapp-fade-in" style="opacity: 0; transform: translateY(10px); transition: all 0.3s ease;">
                <h3 class="whatsapp-modal-title">Fale Conosco</h3>
                <p class="whatsapp-modal-description">Deixe seus dados e inicie uma conversa no WhatsApp.</p>
            </div>
            
            <div id="whatsapp-status-message" class="whatsapp-status-message" style="display: none;"></div>
            
            <form id="whatsapp-form">
                <div class="whatsapp-form-group whatsapp-fade-in" style="opacity: 0; transform: translateY(10px); transition: all 0.3s ease;">
                    <label for="whatsapp-name" class="whatsapp-form-label">Nome</label>
                    <div class="whatsapp-input-container">
                        <svg class="whatsapp-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <input type="text" id="whatsapp-name" class="whatsapp-input" placeholder="Seu nome completo" required>
                    </div>
                </div>
                
                <div class="whatsapp-form-group whatsapp-fade-in" style="opacity: 0; transform: translateY(10px); transition: all 0.3s ease;">
                    <label for="whatsapp-phone" class="whatsapp-form-label">Telefone (WhatsApp)</label>
                    <div class="whatsapp-input-container">
                        <svg class="whatsapp-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <input type="tel" id="whatsapp-phone" class="whatsapp-input" placeholder="(XX) XXXXX-XXXX" required maxlength="15">
                    </div>
                </div>
                
                <div class="whatsapp-fade-in" style="opacity: 0; transform: translateY(10px); transition: all 0.3s ease; margin-top: 16px;">
                    <button type="submit" id="whatsapp-submit-btn" class="whatsapp-submit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                        </svg>
                        Iniciar Conversa
                    </button>
                </div>
            </form>
        `;
        
        panel.appendChild(header);
        panel.appendChild(body);
        overlay.appendChild(panel);
        modalContainer.appendChild(overlay);
        document.body.appendChild(modalContainer);
        
        // Adicionar event listeners
        document.getElementById('whatsapp-close-btn').onclick = closeModal;
        document.getElementById('whatsapp-form').onsubmit = handleSubmit;
        
        const phoneInput = document.getElementById('whatsapp-phone');
        phoneInput.oninput = (e) => {
            e.target.value = formatPhoneNumber(e.target.value);
        };
    }

    // --- Inicialização ---
    function init() {
        // Injetar CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = CSS_URL;
        document.head.appendChild(link);
        
        // Coletar parâmetros da URL
        getUrlParams();
        
        // Criar botão após delay
        setTimeout(createWhatsAppButton, SHOW_DELAY_MS);
    }

    // Iniciar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

    // --- Inicialização ---
    function init() {
        // Carregar CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = CSS_URL;
        document.head.appendChild(link);
        
        // Aguardar carregamento da página e criar botão
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createWhatsAppButton, SHOW_DELAY_MS);
            });
        } else {
            setTimeout(createWhatsAppButton, SHOW_DELAY_MS);
        }
        
        // Capturar parâmetros da URL
        getUrlParams();
    }
    
    // Inicializar o script
    init();
})();


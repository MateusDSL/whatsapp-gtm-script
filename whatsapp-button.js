// WhatsApp Button Script - VERSÃO FINAL
(function() {
    // --- CONFIGURAÇÕES ---
    const GOOGLE_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxxFYzWMDVTdEWtfSa-WCuqMuRwQJFnqS1za2ivkVNffz-NbMZ2r1V5BSGUV5AxpdZVHw/exec";
    const SUPABASE_URL = 'https://hdqrcmxiyanhqligzrpv.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcXJjbXhpeWFuaHFsaWd6cnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzE0NTYsImV4cCI6MjA2NjcwNzQ1Nn0.efbHgndvp-SHT1TjbjjbXht76Y_fUcRxAPiqeGmCpZU';
    const CSS_URL = "https://mateusdsl.github.io/whatsapp-gtm-script/whatsapp-button.css";
    const WHATSAPP_BASE_URL = "https://tintim.link/whatsapp/826e2a65-3402-47a3-9dae-9e6a55f5ddb5/0ad8dba1-d477-46fe-b8df-ab703e0415a2";
    const SHOW_DELAY_MS = 0;
    const EXPIRATION_TIME_IN_MINUTES = 10;

    // --- INICIALIZAÇÃO DO SUPABASE ---
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- Variáveis de Estado ---
    let isModalOpen = false;
    let isClosing = false;
    let isSubmitting = false;
    let formData = { name: "", phone: "", gclid: "", utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" };

    // --- Funções Utilitárias ---
    function formatPhoneNumber(value) {
        const digits = value.replace(/\D/g, "");
        let formattedPhone = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
        return formattedPhone.slice(0, 15);
    }

    function setStatus(message, type) {
        const statusEl = document.getElementById("whatsapp-status-message");
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `whatsapp-status-message whatsapp-status-${type || "info"}`;
            statusEl.style.display = message ? "block" : "none";
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
    
    function redirectToWhatsApp() {
        const trackingParams = new URLSearchParams();
        if (formData.gclid) trackingParams.append('gclid', formData.gclid);
        if (formData.utm_source) trackingParams.append('utm_source', formData.utm_source);
        if (formData.utm_medium) trackingParams.append('utm_medium', formData.utm_medium);
        if (formData.utm_campaign) trackingParams.append('utm_campaign', formData.utm_campaign);
        if (formData.utm_term) trackingParams.append('utm_term', formData.utm_term);
        if (formData.utm_content) trackingParams.append('utm_content', formData.utm_content);
        const finalUrl = `${WHATSAPP_BASE_URL}?${trackingParams.toString()}`;
        window.open(finalUrl, "_blank");
    }

    function resetForm() {
        isSubmitting = false;
        const nameInput = document.getElementById("whatsapp-name");
        const phoneInput = document.getElementById("whatsapp-phone");
        const submitBtn = document.getElementById("whatsapp-submit-btn");
        if (nameInput) nameInput.value = "";
        if (phoneInput) phoneInput.value = "";
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/></svg>Iniciar Conversa`;
        }
    }

    function closeModal() {
        if (isClosing) return;
        isClosing = true;
        const overlay = document.getElementById("whatsapp-modal-overlay");
        const panel = document.getElementById("whatsapp-modal-panel");
        
        if (overlay) overlay.style.opacity = "0";
        if (panel) panel.classList.add("whatsapp-slide-out");
        
        setTimeout(() => {
            isModalOpen = false;
            isClosing = false;
            const container = document.getElementById("whatsapp-modal-container");
            if (container) container.remove();
        }, 300);
    }

    function openModal() {
        if (isModalOpen) return;
        const widgetWrapper = document.querySelector('.whatsapp-widget-wrapper');
        if (widgetWrapper) widgetWrapper.classList.remove('show');
        isModalOpen = true;
        createModal();
        
        const overlay = document.getElementById("whatsapp-modal-overlay");
        const panel = document.getElementById("whatsapp-modal-panel");
        
        setTimeout(() => {
            if (overlay) overlay.style.opacity = "1";
            if (panel) panel.classList.add("whatsapp-slide-in-active");
            document.querySelectorAll(".whatsapp-fade-in").forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }, index * 100);
            });
        }, 50);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        const nameInput = document.getElementById("whatsapp-name");
        const phoneInput = document.getElementById("whatsapp-phone");

        if (!nameInput || !phoneInput || !nameInput.value || phoneInput.value.replace(/\D/g, "").length < 10) {
            setStatus("Por favor, preencha nome e telefone válidos.", "error");
            return;
        }

        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({ 'event': 'whatsapp_lead_submitted' });
        }

        formData.name = nameInput.value;
        formData.phone = phoneInput.value;
        
        redirectToWhatsApp();

        isSubmitting = true;
        setStatus(null);
        
        const submitBtn = document.getElementById("whatsapp-submit-btn");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="whatsapp-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Enviado!`;
        }
        
       try {
            const { error } = await supabaseClient.from('leads').insert([{ 
                name: formData.name, 
                phone: formData.phone,
                gclid: formData.gclid,
                utm_source: formData.utm_source,
                utm_medium: formData.utm_medium,
                utm_campaign: formData.utm_campaign,
                utm_term: formData.utm_term,
                utm_content: formData.utm_content
            }]);
            if (error) { throw error; }

            const submission = { submitted: true, timestamp: new Date().getTime() };
            localStorage.setItem('whatsappLeadSubmission', JSON.stringify(submission));

        } catch (error) {
            console.error("Erro ao enviar para o Supabase:", error.message);
        }

        const payload = { nome: formData.name, telefone: formData.phone.replace(/\D/g, ""), gclid: formData.gclid, utm_source: formData.utm_source, utm_medium: formData.utm_medium, utm_campaign: formData.utm_campaign, utm_term: formData.utm_term, utm_content: formData.utm_content };
        if (GOOGLE_SCRIPT_WEB_APP_URL) {
            fetch(GOOGLE_SCRIPT_WEB_APP_URL, { method: "POST", mode: "no-cors", cache: "no-cache", redirect: "follow", body: JSON.stringify(payload) })
            .then(() => console.log("Lead enviado para o Google Sheets como backup."))
            .catch(error => console.error("Erro de rede ao enviar para o Google Script:", error));
        }
        
        setTimeout(() => {
            closeModal();
            configureWidgetForDirectRedirect();
        }, 2000);
    }

    function createWidget() {
        const container = document.getElementById("whatsapp-gtm-container") || document.createElement("div");
        container.id = "whatsapp-gtm-container";
        container.innerHTML = '';
        
        let leadSubmittedWithinExpiration = false;
        const submissionDataString = localStorage.getItem('whatsappLeadSubmission');

        if (submissionDataString) {
            const submissionData = JSON.parse(submissionDataString);
            const expirationInMs = EXPIRATION_TIME_IN_MINUTES * 60 * 1000;
            const timeSinceSubmission = new Date().getTime() - submissionData.timestamp;

            if (timeSinceSubmission < expirationInMs) {
                leadSubmittedWithinExpiration = true;
            } else {
                localStorage.removeItem('whatsappLeadSubmission');
            }
        }

        const widgetWrapper = document.createElement("div");
        widgetWrapper.className = "whatsapp-widget-wrapper";
        const button = document.createElement("button");
        button.className = "whatsapp-fab";
        button.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/></svg>`;

        if (leadSubmittedWithinExpiration) {
            button.title = "Fale conosco pelo WhatsApp";
            button.addEventListener('click', redirectToWhatsApp);
            widgetWrapper.appendChild(button);
        } else {
            button.title = "Abrir formulário de contato";
            button.addEventListener('click', openModal);
            const messageBubble = document.createElement("div");
            messageBubble.className = "whatsapp-cta-bubble";
            messageBubble.innerHTML = "Olá! 👋 Como posso te ajudar?";
            widgetWrapper.appendChild(messageBubble);
            widgetWrapper.appendChild(button);
        }
        
        container.appendChild(widgetWrapper);
        document.body.appendChild(container);
    }

    function configureWidgetForDirectRedirect() {
        const container = document.getElementById("whatsapp-gtm-container");
        if(container) {
            createWidget();
            setTimeout(() => {
                const widgetWrapper = document.querySelector('.whatsapp-widget-wrapper');
                if (widgetWrapper) {
                    widgetWrapper.classList.add('show');
                }
            }, 100);
        }
    }

    // **FUNÇÃO REINSERIDA**
    function createModal() {
        const modalContainer = document.getElementById("whatsapp-modal-container") || document.createElement("div");
        modalContainer.id = "whatsapp-modal-container";
        modalContainer.innerHTML = `
        <div id="whatsapp-modal-overlay" class="whatsapp-modal-overlay" style="opacity:0;">
            <div id="whatsapp-modal-panel" class="whatsapp-modal-panel whatsapp-slide-in">
                <div class="whatsapp-modal-header">
                    <div class="whatsapp-header-title">
                        <div class="whatsapp-header-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg></div>
                        <h2 class="whatsapp-header-text">WhatsApp</h2>
                    </div>
                    <button id="whatsapp-close-btn" class="whatsapp-close-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </div>
                <div class="whatsapp-modal-body">
                    <div class="whatsapp-fade-in" style="opacity:0;transform:translateY(10px);transition:all .3s ease">
                        <h3 class="whatsapp-modal-title">Fale Conosco</h3>
                        <p class="whatsapp-modal-description">Deixe seus dados e inicie uma conversa no WhatsApp.</p>
                    </div>
                    <div id="whatsapp-status-message" class="whatsapp-status-message" style="display:none"></div>
                    <form id="whatsapp-form">
                        <div class="whatsapp-form-group whatsapp-fade-in" style="opacity:0;transform:translateY(10px);transition:all .3s ease">
                            <label for="whatsapp-name" class="whatsapp-form-label">Nome</label>
                            <div class="whatsapp-input-container">
                                <svg class="whatsapp-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <input type="text" id="whatsapp-name" class="whatsapp-input" placeholder="Seu nome completo" required>
                            </div>
                        </div>
                        <div class="whatsapp-form-group whatsapp-fade-in" style="opacity:0;transform:translateY(10px);transition:all .3s ease">
                            <label for="whatsapp-phone" class="whatsapp-form-label">Telefone (WhatsApp)</label>
                            <div class="whatsapp-input-container">
                                <svg class="whatsapp-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <input type="tel" id="whatsapp-phone" class="whatsapp-input" placeholder="(XX) XXXXX-XXXX" required maxlength="15">
                            </div>
                        </div>
                        <div class="whatsapp-fade-in" style="opacity:0;transform:translateY(10px);transition:all .3s ease;margin-top:16px">
                            <button type="submit" id="whatsapp-submit-btn" class="whatsapp-submit-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>Iniciar Conversa</button>
                        </div>
                        <p class="whatsapp-modal-footer-text whatsapp-fade-in" style="opacity:0;transform:translateY(10px);transition:all .3s ease;text-align:center;margin-top:20px;font-size:.8em;color:#6b7280">Ao enviar, seus dados serão registrados e você será redirecionado(a) para o WhatsApp.</p>
                    </form>
                </div>
            </div>
        </div>`;
        document.body.appendChild(modalContainer);
        document.getElementById("whatsapp-close-btn").addEventListener('click', closeModal);
        document.getElementById("whatsapp-form").addEventListener('submit', handleSubmit);
        const phoneInput = document.getElementById("whatsapp-phone");
        if (phoneInput) {
            phoneInput.addEventListener("input", (e) => { e.target.value = formatPhoneNumber(e.target.value); });
        }
    }

    function init() {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS_URL;
        document.head.appendChild(link);
        
        const loadWidget = () => {
            createWidget();
            setTimeout(() => {
                const widgetWrapper = document.querySelector('.whatsapp-widget-wrapper');
                if (widgetWrapper) widgetWrapper.classList.add('show');
            }, SHOW_DELAY_MS);
        };
        
        link.onload = loadWidget;
        link.onerror = loadWidget;
        getUrlParams();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

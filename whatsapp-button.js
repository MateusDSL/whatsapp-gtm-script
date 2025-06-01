// WhatsApp Button Script for GTM
(function() {
    // --- CONFIGURAÇÕES --- (Altere estes valores)
    const WHATSAPP_NUMBER = "5549988385377"; // Substitua pelo seu número do WhatsApp (somente números com código do país)
    const GOOGLE_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxCfahnAV6rMhAyIhMXEchwkMAlcmtQGYQV_0F2Uyn2i9CCt8x0XytNm9Yu8m8YUv5YTw/exec"; // Substitua pela URL do seu Google Apps Script Web App
    const CSS_URL = "./whatsapp-button.css"; // URL para o arquivo CSS. Se hospedar em outro lugar, atualize aqui.
    const SHOW_DELAY_MS = 1000; // Delay em milissegundos para mostrar o botão
    // --- FIM DAS CONFIGURAÇÕES ---

    let isOpen = false;
    let isSubmitting = false;

    // --- Funções Utilitárias ---
    function formatPhoneNumber(value) {
        const digits = value.replace(/\D/g, "");
        const maxLength = 11;
        const truncatedDigits = digits.slice(0, maxLength);
        if (truncatedDigits.length <= 2) return `(${truncatedDigits}`;
        if (truncatedDigits.length <= 6) return `(${truncatedDigits.slice(0, 2)}) ${truncatedDigits.slice(2)}`;
        if (truncatedDigits.length <= 10) return `(${truncatedDigits.slice(0, 2)}) ${truncatedDigits.slice(2, 6)}-${truncatedDigits.slice(6)}`;
        return `(${truncatedDigits.slice(0, 2)}) ${truncatedDigits.slice(2, 7)}-${truncatedDigits.slice(7)}`;
    }

    function setStatusMessage(text, type) {
        const statusDiv = document.getElementById("whatsapp-status-message");
        if (!statusDiv) return;

        statusDiv.textContent = text;
        statusDiv.className = `whatsapp-status-message whatsapp-status-${type}`;
        statusDiv.style.display = "flex";
    }

    function clearStatusMessage() {
        const statusDiv = document.getElementById("whatsapp-status-message");
        if (statusDiv) {
            statusDiv.style.display = "none";
            statusDiv.textContent = "";
            statusDiv.className = "whatsapp-status-message";
        }
    }

    function resetForm() {
        const form = document.getElementById("whatsapp-gtm-form");
        if (form) form.reset();
        isSubmitting = false;
        clearStatusMessage();
        const submitBtn = document.getElementById("whatsapp-submit-btn");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                Iniciar Conversa
            `;
        }
    }

    function toggleModal(show) {
        const overlay = document.getElementById("whatsapp-modal-overlay");
        if (!overlay) return;

        if (show) {
            isOpen = true;
            overlay.classList.add("open");
        } else {
            if (isSubmitting) return; // Não fecha se estiver enviando
            isOpen = false;
            overlay.classList.remove("open");
            // Resetar o formulário ao fechar, após a animação
            setTimeout(resetForm, 300);
        }
    }

    // --- Criação dos Elementos HTML ---
    function createWhatsAppWidget() {
        // 0. Cria o container principal
        const container = document.createElement("div");
        container.id = "whatsapp-gtm-container";

        // 1. Cria o Botão Flutuante (FAB)
        const fab = document.createElement("button");
        fab.id = "whatsapp-fab";
        fab.className = "whatsapp-fab";
        fab.setAttribute("aria-label", "Abrir chat no WhatsApp");
        fab.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        `;
        fab.onclick = () => toggleModal(true);
        container.appendChild(fab);

        // 2. Cria o Overlay e Modal
        const overlay = document.createElement("div");
        overlay.id = "whatsapp-modal-overlay";
        overlay.className = "whatsapp-modal-overlay";
        overlay.onclick = (e) => {
            // Fecha se clicar fora do conteúdo do modal
            if (e.target === overlay) {
                toggleModal(false);
            }
        };

        const modalContent = document.createElement("div");
        modalContent.className = "whatsapp-modal-content";
        modalContent.innerHTML = `
            <div class="whatsapp-modal-header">
                <button id="whatsapp-modal-close-btn" class="whatsapp-modal-close-btn" aria-label="Fechar modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <h2 class="whatsapp-modal-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    Iniciar Conversa no WhatsApp
                </h2>
                <p class="whatsapp-modal-description">Preencha seus dados abaixo para iniciar a conversa.</p>
            </div>
            <form id="whatsapp-gtm-form">
                <div class="whatsapp-modal-body">
                    <div class="whatsapp-form-grid">
                        <div class="whatsapp-form-group">
                            <label for="whatsapp-name" class="whatsapp-form-label">Nome</label>
                            <div class="whatsapp-input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user whatsapp-input-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <input type="text" id="whatsapp-name" name="name" placeholder="Seu nome completo" required class="whatsapp-input">
                            </div>
                        </div>
                        <div class="whatsapp-form-group">
                            <label for="whatsapp-email" class="whatsapp-form-label">E-mail</label>
                            <div class="whatsapp-input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail whatsapp-input-icon"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                <input type="email" id="whatsapp-email" name="email" placeholder="seu@email.com" required class="whatsapp-input">
                            </div>
                        </div>
                        <div class="whatsapp-form-group">
                            <label for="whatsapp-phone" class="whatsapp-form-label">Telefone</label>
                            <div class="whatsapp-input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone whatsapp-input-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <input type="tel" id="whatsapp-phone" name="phone" placeholder="(XX) XXXXX-XXXX" required maxlength="15" class="whatsapp-input">
                            </div>
                        </div>
                        <div id="whatsapp-status-message" class="whatsapp-status-message" style="display: none;"></div>
                    </div>
                </div>
                <div class="whatsapp-modal-footer">
                    <button type="submit" id="whatsapp-submit-btn" class="whatsapp-submit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        Iniciar Conversa
                    </button>
                </div>
            </form>
        `;

        overlay.appendChild(modalContent);
        container.appendChild(overlay);

        // 3. Adiciona o container ao body
        document.body.appendChild(container);

        // 4. Adiciona os Event Listeners aos elementos criados
        document.getElementById("whatsapp-modal-close-btn").onclick = () => toggleModal(false);
        const phoneInput = document.getElementById("whatsapp-phone");
        phoneInput.oninput = (e) => {
            e.target.value = formatPhoneNumber(e.target.value);
        };

        const form = document.getElementById("whatsapp-gtm-form");
        form.onsubmit = async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;

            const submitBtn = document.getElementById("whatsapp-submit-btn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 whatsapp-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Enviando...
            `;
            setStatusMessage("Enviando dados...", "info");

            if (!GOOGLE_SCRIPT_WEB_APP_URL) {
                console.error("URL do Google Apps Script não configurada!");
                setStatusMessage("Erro de configuração interna.", "error");
                isSubmitting = false;
                submitBtn.disabled = false;
                 submitBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    Iniciar Conversa
                `;
                return;
            }

            const name = document.getElementById("whatsapp-name").value;
            const email = document.getElementById("whatsapp-email").value;
            const phone = document.getElementById("whatsapp-phone").value;
            const phoneClean = phone.replace(/\D/g, "");
            const dataToSend = { nome: name, telefone: phoneClean, email: email };

            try {
                await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
                    method: "POST",
                    mode: "no-cors",
                    cache: "no-cache",
                    headers: {},
                    redirect: "follow",
                    body: JSON.stringify(dataToSend)
                });

                console.log("Tentativa de envio para o Google Script concluída (no-cors).");
                setStatusMessage("Dados enviados! Redirecionando...", "success");

                const message = `Olá! Meu nome é ${name}. Gostaria de mais informações.\n\n📧 Email: ${email}\n📱 Telefone: ${phone}\n\nAguardo seu contato!`;
                const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

                setTimeout(() => {
                    window.open(whatsappUrl, "_blank");
                    toggleModal(false);
                }, 1500);

            } catch (error) {
                console.error("Erro ao enviar dados para o Google Script:", error);
                setStatusMessage("Erro ao enviar dados. Tente novamente.", "error");
                isSubmitting = false;
                submitBtn.disabled = false;
                 submitBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    Iniciar Conversa
                `;
            }
        };
    }

    // --- Inicialização ---
    function init() {
        // 1. Injenta o CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = CSS_URL;
        document.head.appendChild(link);

        // 2. Cria os elementos HTML após um delay
        setTimeout(() => {
            createWhatsAppWidget();
        }, SHOW_DELAY_MS);
    }

    // Garante que o DOM está pronto antes de iniciar
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();


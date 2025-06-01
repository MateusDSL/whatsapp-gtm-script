// --- INÍCIO DAS CONFIGURAÇÕES ---
const WHATSAPP_NUMBER = "554930194949; // Substitua pelo seu número do WhatsApp
const GOOGLE_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxCfahnAV6rMhAyIhMXEchwkMAlcmtQGYQV_0F2Uyn2i9CCt8x0XytNm9Yu8m8YUv5YTw/exec"; // URL do seu Google Apps Script
const CSS_URL = "https://mateusdsl.github.io/whatsapp-gtm-script/whatsapp-button.css"; // IMPORTANTE: Atualize esta URL no Passo 3 do tutorial do GitHub Pages
// --- FIM DAS CONFIGURAÇÕES ---

// --- SVGs DOS ÍCONES ---
const ICONS = {
  messageCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  loader: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin-manual"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`
};

// --- ESTADO E ELEMENTOS DO DOM ---
let isModalOpen = false;
let isClosing = false;
let isOpening = false;
let showContent = false;
let isSubmitting = false;
let submitStatus = null; // "success", "error"
let statusMessageText = "";
let formData = { name: "", phone: "", email: "" };

let modalElement, overlayElement, panelElement, formElement, nameInput, emailInput, phoneInput, submitButton, statusMessageElement, floatingButtonElement, mainContainerElement;

// --- FUNÇÕES AUXILIARES ---
function createElement(tag, classList = [], attributes = {}, innerHTML = "") {
  const el = document.createElement(tag);
  if (classList.length > 0) el.className = classList.join(" ");
  for (const attr in attributes) el.setAttribute(attr, attributes[attr]);
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function createSVGIcon(iconName, baseClassList = [], hoverClassList = []) {
    const iconContainer = createElement('span', baseClassList);
    iconContainer.innerHTML = ICONS[iconName] || '';
    // Para classes de hover, você precisaria de CSS ou adicionar/remover classes em JS listeners
    return iconContainer;
}


// --- LÓGICA DO MODAL E FORMULÁRIO ---
function openModal() {
  if (!modalElement) return;
  isModalOpen = true;
  isOpening = true;
  showContent = false;
  submitStatus = null;
  statusMessageText = "";
  formData = { name: "", phone: "", email: "" };
  if(nameInput) nameInput.value = "";
  if(emailInput) emailInput.value = "";
  if(phoneInput) phoneInput.value = "";
  updateStatusMessage();
  
  mainContainerElement.style.display = "block"; // Mostra o container do modal
  modalElement.style.display = "block"; // Garante que o modal está visível para animação
  
  // Força reflow para aplicar animação de entrada
  requestAnimationFrame(() => {
    overlayElement.classList.remove("opacity-0");
    overlayElement.classList.add("opacity-30"); // Tailwind: bg-opacity-30
    
    panelElement.classList.remove("slide-in-start");
    panelElement.classList.add("slide-in-end");
  });

  setTimeout(() => {
    isOpening = false;
  }, 50);

  setTimeout(() => {
    showContent = true;
    // Animar conteúdo individualmente (adicionando classes como 'animate-fade-in-up-X')
    const animatedElements = panelElement.querySelectorAll("[data-animate-order]");
    animatedElements.forEach(el => {
        const order = el.dataset.animateOrder;
        el.classList.remove("opacity-0", "translate-y-4"); // Tailwind: opacity-0, translate-y-4
        el.classList.add(`animate-fade-in-up-${order}`);
    });
  }, 200);
}

function closeModal() {
  if (isSubmitting || !modalElement) return;
  isClosing = true;
  showContent = false;

  overlayElement.classList.add("opacity-0");
  overlayElement.classList.remove("opacity-30");
  
  panelElement.classList.remove("slide-in-end");
  panelElement.classList.add("slide-out");

  const animatedElements = panelElement.querySelectorAll("[data-animate-order]");
    animatedElements.forEach(el => {
        const order = el.dataset.animateOrder;
        el.classList.add("opacity-0", "translate-y-4");
        el.classList.remove(`animate-fade-in-up-${order}`);
    });

  setTimeout(() => {
    modalElement.style.display = "none";
    mainContainerElement.style.display = "none";
    isModalOpen = false;
    isClosing = false;
  }, 300);
}

function handleInputChange(e) {
  const { name, value } = e.target;
  if (name === "phone") {
    const phoneValue = value.replace(/\D/g, "");
    let formattedPhone = phoneValue;
    if (phoneValue.length <= 2) {
      formattedPhone = `(${phoneValue}`;
    } else if (phoneValue.length <= 6) {
      formattedPhone = `(${phoneValue.slice(0,2)}) ${phoneValue.slice(2)}`;
    } else if (phoneValue.length <= 10) {
      formattedPhone = `(${phoneValue.slice(0,2)}) ${phoneValue.slice(2,6)}-${phoneValue.slice(6)}`;
    } else {
      formattedPhone = `(${phoneValue.slice(0,2)}) ${phoneValue.slice(2,7)}-${phoneValue.slice(7,11)}`;
    }
    formData[name] = formattedPhone.slice(0,15);
    e.target.value = formData[name];
  } else {
    formData[name] = value;
  }
}

function updateStatusMessage() {
    if (!statusMessageElement) return;
    statusMessageElement.textContent = statusMessageText;
    statusMessageElement.className = 'mb-3 p-2 text-sm rounded-lg text-center'; // Base classes

    if (!statusMessageText) {
        statusMessageElement.style.display = 'none';
        return;
    }
    statusMessageElement.style.display = 'block';

    if (isSubmitting && submitStatus !== 'success' && submitStatus !== 'error') {
        statusMessageElement.classList.add('bg-blue-100', 'text-blue-700', 'border', 'border-blue-200'); // Tailwind
        statusMessageElement.innerHTML = ICONS.loader + ' ' + statusMessageText;
    } else if (submitStatus === "success") {
        statusMessageElement.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-200'); // Tailwind
    } else if (submitStatus === "error") {
        statusMessageElement.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-200'); // Tailwind
    } else {
         statusMessageElement.style.display = 'none';
    }
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!GOOGLE_SCRIPT_WEB_APP_URL) {
    console.error("URL do Google Apps Script não configurada!");
    statusMessageText = "Erro de configuração: URL do Google Script não definida.";
    submitStatus = "error";
    isSubmitting = false;
    updateStatusMessage();
    updateSubmitButtonState();
    return;
  }

  isSubmitting = true;
  submitStatus = null;
  statusMessageText = "Enviando dados...";
  updateStatusMessage();
  updateSubmitButtonState();

  try {
    const body = JSON.stringify({
      nome: formData.name,
      telefone: formData.phone.replace(/\D/g, ''),
      email: formData.email,
    });

    await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // Conforme o original
      cache: 'no-cache',
      redirect: 'follow',
      body: body
    });

    console.log("Tentativa de envio para o Google Script concluída.");
    statusMessageText = "Dados enviados! Redirecionando para o WhatsApp...";
    submitStatus = "success";
    updateStatusMessage();


    const message = `Olá! Meu nome é ${formData.name}. Gostaria de mais informações.\n\n📧 Email: ${formData.email}\n📱 Telefone: ${formData.phone}\n\nAguardo seu contato!`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      closeModal();
      window.open(whatsappUrl, "_blank");
      isSubmitting = false;
      submitStatus = null;
      statusMessageText = "";
      updateStatusMessage();
      updateSubmitButtonState();
    }, 1500);

  } catch (error) {
    console.error("Erro ao enviar dados para o Google Script:", error);
    statusMessageText = "Erro ao enviar dados. Tente novamente.";
    submitStatus = "error";
    isSubmitting = false;
    updateStatusMessage();
    updateSubmitButtonState();
  }
}

function updateSubmitButtonState() {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    const buttonTextSpan = submitButton.querySelector('span');
    const loaderIcon = submitButton.querySelector('svg.animate-spin-manual'); // Procura o loader SVG
    const messageIcon = submitButton.querySelector('svg:not(.animate-spin-manual)'); // Procura o ícone de mensagem

    if (isSubmitting) {
        if (buttonTextSpan) buttonTextSpan.textContent = "Processando...";
        if (loaderIcon) loaderIcon.style.display = 'inline';
        if (messageIcon) messageIcon.style.display = 'none';

    } else {
        if (buttonTextSpan) buttonTextSpan.textContent = "Iniciar Conversa";
        if (loaderIcon) loaderIcon.style.display = 'none';
        if (messageIcon) messageIcon.style.display = 'inline';
    }
}


// --- CRIAÇÃO DO DOM ---
function createDOM() {
  // Container principal que engloba o botão e o modal
  mainContainerElement = createElement('div', ['whatsapp-lead-capture-container', 'font-sans']); // 'font-sans' é do seu CSS jsx

  // 1. Botão Flutuante
  floatingButtonElement = createElement('button', ['fixed', 'bottom-6', 'right-6', 'z-[99]', 'w-14', 'h-14', 'rounded-full', 'bg-[#25D366]', 'hover:bg-[#20BA5A]', 'shadow-lg', 'hover:shadow-xl', 'transition-all', 'duration-300', 'hover:scale-110', 'animate-pulse', 'hover-float'], { title: "Fale conosco pelo WhatsApp" });
  floatingButtonElement.innerHTML = `<span class="message-circle-icon w-6 h-6 text-white hover-rotate">${ICONS.messageCircle}</span>`; // Tailwind classes para o ícone
  floatingButtonElement.onclick = openModal;
  mainContainerElement.appendChild(floatingButtonElement);

  // 2. Modal (inicialmente escondido)
  modalElement = createElement('div', ['fixed', 'inset-0', 'z-[100]']);
  modalElement.style.display = "none"; // Controlado por openModal/closeModal

  // 2a. Overlay
  overlayElement = createElement('div', ['absolute', 'inset-0', 'bg-black', 'transition-opacity', 'duration-300', 'opacity-0']); // Começa opacity-0
  overlayElement.onclick = closeModal;
  modalElement.appendChild(overlayElement);

  // 2b. Painel Deslizante
  panelElement = createElement('div', ['absolute', 'right-0', 'bottom-0', 'h-auto', 'w-full', 'max-w-sm', 'bg-white', 'shadow-2xl', 'rounded-tl-3xl', 'rounded-bl-3xl', 'md:rounded-bl-none', 'spring-animation', 'slide-in-start']); // Tailwind classes + custom animation

  // Cabeçalho do Painel
  const headerPanel = createElement('div', ['flex', 'items-center', 'justify-between', 'p-3', 'border-b', 'border-gray-200', 'bg-[#25D366]', 'rounded-tl-3xl', 'hover-group']);
  const headerTitleDiv = createElement('div', ['flex', 'items-center', 'space-x-3']);
  const headerIconContainer = createElement('div', ['w-8', 'h-8', 'bg-white', 'bg-opacity-20', 'rounded-full', 'flex', 'items-center', 'justify-center', 'hover-pulse']);
  headerIconContainer.innerHTML = `<span class="w-4 h-4 text-white hover-bounce">${ICONS.messageCircle}</span>`; // Tailwind
  const headerTitle = createElement('h2', ['text-lg', 'font-semibold', 'text-white', 'hover-glow'], {}, "WhatsApp");
  headerTitleDiv.append(headerIconContainer, headerTitle);
  const closeButton = createElement('button', ['text-white', 'hover:bg-white', 'hover:bg-opacity-20', 'h-8', 'w-8', 'p-0', 'hover-rotate-close'], { type: 'button' });
  closeButton.innerHTML = `<span class="w-4 h-4 hover-spin">${ICONS.x}</span>`; // Tailwind
  closeButton.onclick = closeModal;
  headerPanel.append(headerTitleDiv, closeButton);
  panelElement.appendChild(headerPanel);

  // Corpo do Painel
  const bodyPanel = createElement('div', ['p-3']);
  
  const titleSection = createElement('div', ['mb-4', 'transition-all', 'duration-500', 'hover-lift-subtle', 'opacity-0', 'translate-y-4'], {'data-animate-order': '1'});
  titleSection.innerHTML = `
    <h3 class="text-base font-medium text-gray-900 mb-1 hover-color-shift">Fale Conosco</h3>
    <p class="text-xs text-gray-600 hover-fade-in">Deixe seus dados e inicie uma conversa no WhatsApp.</p>`;
  bodyPanel.appendChild(titleSection);

  // Status Message Element
  statusMessageElement = createElement('div', ['mb-3', 'p-2', 'text-sm', 'rounded-lg', 'text-center']);
  statusMessageElement.style.display = 'none'; // Inicialmente escondido
  bodyPanel.appendChild(statusMessageElement);
  
  formElement = createElement('form', ['space-y-3']);
  formElement.onsubmit = handleSubmit;

  // Campo Nome
  const nameFieldGroup = createElement('div', ['space-y-1', 'transition-all', 'duration-500', 'hover-field-group', 'opacity-0', 'translate-y-4'], {'data-animate-order': '2'});
  const nameLabel = createElement('label', ['text-sm', 'font-medium', 'text-gray-700', 'hover-label'], { for: 'wlc-name' }, "Nome");
  const nameInputContainer = createElement('div', ['relative', 'hover-input-container']);
  nameInputContainer.innerHTML = `<span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 hover-icon-color transition-colors duration-200">${ICONS.user}</span>`;
  nameInput = createElement('input', ['pl-10', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-transparent', 'px-3', 'py-2', 'text-sm', 'ring-offset-background', 'file:border-0', 'file:bg-transparent', 'file:text-sm', 'file:font-medium', 'placeholder:text-muted-foreground', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:cursor-not-allowed', 'disabled:opacity-50', 'hover-input-focus'], { id: 'wlc-name', name: 'name', type: 'text', placeholder: 'Seu nome completo', required: true });
  nameInput.oninput = handleInputChange;
  nameInputContainer.appendChild(nameInput);
  nameFieldGroup.append(nameLabel, nameInputContainer);
  formElement.appendChild(nameFieldGroup);

  // Campo Email
  const emailFieldGroup = createElement('div', ['space-y-1', 'transition-all', 'duration-500', 'hover-field-group', 'opacity-0', 'translate-y-4'], {'data-animate-order': '3'});
  const emailLabel = createElement('label', ['text-sm', 'font-medium', 'text-gray-700', 'hover-label'], { for: 'wlc-email' }, "E-mail");
  const emailInputContainer = createElement('div', ['relative', 'hover-input-container']);
  emailInputContainer.innerHTML = `<span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 hover-icon-color transition-colors duration-200">${ICONS.mail}</span>`;
  emailInput = createElement('input', ['pl-10', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-transparent', 'px-3', 'py-2', 'text-sm', 'hover-input-focus'], { id: 'wlc-email', name: 'email', type: 'email', placeholder: 'seu@email.com', required: true });
  emailInput.oninput = handleInputChange;
  emailInputContainer.appendChild(emailInput);
  emailFieldGroup.append(emailLabel, emailInputContainer);
  formElement.appendChild(emailFieldGroup);
  
  // Campo Telefone
  const phoneFieldGroup = createElement('div', ['space-y-1', 'transition-all', 'duration-500', 'hover-field-group', 'opacity-0', 'translate-y-4'], {'data-animate-order': '4'});
  const phoneLabel = createElement('label', ['text-sm', 'font-medium', 'text-gray-700', 'hover-label'], { for: 'wlc-phone' }, "Telefone (WhatsApp)");
  const phoneInputContainer = createElement('div', ['relative', 'hover-input-container']);
  phoneInputContainer.innerHTML = `<span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 hover-icon-color transition-colors duration-200">${ICONS.phone}</span>`;
  phoneInput = createElement('input', ['pl-10', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-transparent', 'px-3', 'py-2', 'text-sm', 'hover-input-focus'], { id: 'wlc-phone', name: 'phone', type: 'tel', placeholder: '(XX) XXXXX-XXXX', required: true, maxLength: 15 });
  phoneInput.oninput = handleInputChange;
  phoneInputContainer.appendChild(phoneInput);
  phoneFieldGroup.append(phoneLabel, phoneInputContainer);
  formElement.appendChild(phoneFieldGroup);

  // Botão Submit
  const submitButtonContainer = createElement('div', ['pt-1', 'transition-all', 'duration-500', 'opacity-0', 'translate-y-4'], {'data-animate-order': '5'});
  submitButton = createElement('button', ['w-full', 'bg-[#25D366]', 'hover:bg-[#20BA5A]', 'text-white', 'font-medium', 'py-2.5', 'transition-all', 'duration-200', 'hover-button-premium', 'inline-flex', 'items-center', 'justify-center', 'rounded-md', 'text-sm'], { type: 'submit' });
  // Conteúdo inicial do botão (com loader escondido)
  submitButton.innerHTML = `
    <span class="w-4 h-4 mr-2" style="display:none;">${ICONS.loader}</span>
    <span class="w-4 h-4 mr-2 hover-icon-wiggle">${ICONS.messageCircle}</span>
    <span class="hover-text-glow">Iniciar Conversa</span>`;
  submitButtonContainer.appendChild(submitButton);
  formElement.appendChild(submitButtonContainer);
  bodyPanel.appendChild(formElement);
  
  // Texto Informativo
  const infoTextContainer = createElement('div', ['mt-3', 'pt-3', 'border-t', 'border-gray-100', 'transition-all', 'duration-500', 'hover-info-section', 'opacity-0', 'translate-y-4'], {'data-animate-order': '6'});
  infoTextContainer.innerHTML = `<p class="text-xs text-gray-500 text-center hover-info-text">Ao enviar, seus dados serão registrados e você será redirecionado(a) para o WhatsApp.</p>`;
  bodyPanel.appendChild(infoTextContainer);
  
  panelElement.appendChild(bodyPanel);
  modalElement.appendChild(panelElement);
  mainContainerElement.appendChild(modalElement);
  document.body.appendChild(mainContainerElement);

  // Chamar updateSubmitButtonState para configurar estado inicial do botão
  updateSubmitButtonState();
}

// --- INICIALIZAÇÃO ---
function loadCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = CSS_URL; // Usará a constante configurada
  document.head.appendChild(link);
}

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadCSS();
      createDOM();
    });
  } else {
    loadCSS();
    createDOM();
  }
}

init();

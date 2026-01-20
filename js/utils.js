// ===============================
// UTILIDADES GENERALES
// ===============================

// TOAST NOTIFICATION SYSTEM
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const icons = {
        success: 'bx-check-circle',
        error: 'bx-error-circle',
        warning: 'bx-error',
        info: 'bx-info-circle'
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-600'
    };

    toast.className = `flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white transform translate-x-full transition-all duration-300 ${colors[type]}`;
    toast.innerHTML = `
        <i class='bx ${icons[type]} text-2xl'></i>
        <span class="font-medium">${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
            <i class='bx bx-x text-lg'></i>
        </button>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// FAQ ACCORDION FUNCTIONALITY
function toggleFAQ(faqId) {
    const answer = document.getElementById(faqId + '-answer');
    const icon = document.getElementById(faqId + '-icon');

    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.style.transform = 'rotate(90deg)';
    } else {
        answer.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// DATE AND TIME UPDATE
function updateTags() {
    const now = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = now.toLocaleDateString('es-ES', dateOptions);
    const formattedDate = dateString.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    document.getElementById('date-display').textContent = formattedDate;

    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    document.getElementById('time-display').textContent = timeString;
}

// SIDEBAR FUNCTIONALITY
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    sidebar.classList.toggle('-ml-64');
}

function checkMobileAndCloseSidebar() {
    if (window.innerWidth < 768) {
        if (!sidebar.classList.contains('-ml-64')) {
            sidebar.classList.add('-ml-64');
        }
    }
}

// LOGOUT FUNCTIONALITY
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userCompany');

        // Redirigir al login
        window.location.href = 'login.html';
    }
}

// DROPDOWN FUNCTIONALITY
let activeDropdown = null;

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);

    // Close any other open dropdown
    if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.classList.add('hidden');
    }

    // Toggle current dropdown
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        activeDropdown = dropdown;
    } else {
        dropdown.classList.add('hidden');
        activeDropdown = null;
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (event) {
    const isDropdownButton = event.target.closest('button[onclick*="toggleDropdown"]');
    const isInsideDropdown = event.target.closest('#emails-dropdown, #notifications-dropdown, #profile-dropdown, #help-dropdown');

    if (!isDropdownButton && !isInsideDropdown && activeDropdown) {
        activeDropdown.classList.add('hidden');
        activeDropdown = null;
    }
});

// VIDEO MODAL FUNCTIONALITY
const videoMapping = {
    'Tutorial: Catálogo de Módulos': 'https://www.youtube.com/embed/0xLO8Ecg4NQ',
    'Tutorial: Calculadora de Ganancias': 'https://www.youtube.com/embed/Edywx2HJs8w'
};

let currentVideoTitle = "Tutorial General";

function openVideoModal() {
    const modal = document.getElementById('video-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalPanel = document.getElementById('modal-panel');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = currentVideoTitle;

    // Obtener elementos del modal
    const videoPlayer = document.getElementById('tutorial-video-player');
    const videoSource = document.getElementById('tutorial-video-source');
    const videoContainer = document.getElementById('video-container');
    const youtubeContainer = document.getElementById('youtube-container');
    const youtubeIframe = document.getElementById('youtube-iframe');
    const placeholderContainer = document.getElementById('placeholder-container');

    // Verificar si existe un video para este tutorial
    const videoPath = videoMapping[currentVideoTitle];

    if (videoPath) {
        // Verificar si es un video de YouTube o local
        if (videoPath.includes('youtube.com') || videoPath.includes('youtu.be')) {
            // Es un video de YouTube
            youtubeContainer.classList.remove('hidden');
            videoContainer.classList.add('hidden');
            placeholderContainer.classList.add('hidden');

            // Configurar el iframe de YouTube
            youtubeIframe.src = videoPath;
        } else {
            // Es un video local
            videoContainer.classList.remove('hidden');
            youtubeContainer.classList.add('hidden');
            placeholderContainer.classList.add('hidden');

            // Configurar la fuente del video local
            videoSource.src = videoPath;
            videoPlayer.load();
        }
    } else {
        // No hay video disponible, mostrar placeholder
        videoContainer.classList.add('hidden');
        youtubeContainer.classList.add('hidden');
        placeholderContainer.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalPanel.classList.remove('scale-95', 'opacity-0');
        modalPanel.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalPanel = document.getElementById('modal-panel');

    // Pausar el video local si está reproduciéndose
    const videoPlayer = document.getElementById('tutorial-video-player');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }

    // Limpiar el iframe de YouTube para detener la reproducción
    const youtubeIframe = document.getElementById('youtube-iframe');
    if (youtubeIframe) {
        youtubeIframe.src = '';
    }

    modalBackdrop.classList.add('opacity-0');
    modalPanel.classList.remove('scale-100', 'opacity-100');
    modalPanel.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

// Funciones para manejar el indicador de carga del video
function showVideoLoading() {
    const loadingIndicator = document.getElementById('video-loading');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
}

function hideVideoLoading() {
    const loadingIndicator = document.getElementById('video-loading');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
}

// CHAT ASSISTANT FUNCTIONALITY
const chatWindow = document.getElementById('ai-chat');
let chatInitialized = false;

// Respuestas precargadas del asistente IA
const aiResponses = {
    'default': '¡Gracias por tu mensaje! Soy tu asistente virtual de TecnoPymes. Estoy aquí para ayudarte con cualquier duda sobre la plataforma. ¿En qué puedo ayudarte?',
    'hola': '¡Hola! 👋 Bienvenido a TecnoPymes. Estoy aquí para ayudarte a aprovechar al máximo nuestra plataforma. ¿Qué te gustaría saber?',
    'revisar': 'Revisa tus **ventas diarias**, **tareas pendientes** y si hay **pedidos por atender**. Esto te permitirá priorizar sin perder tu tiempo. 📊',
    'negocio': 'Revisa tus **ventas diarias**, **tareas pendientes** y si hay **pedidos por atender**. Esto te permitirá priorizar sin perder tu tiempo. 📊',
    'empiezo': 'Primero configura la **información principal de tu negocio** en la calculadora y activa los **módulos que consideres más productivos** para ti. 🚀',
    'usar': 'Primero configura la **información principal de tu negocio** en la calculadora y activa los **módulos que consideres más productivos** para ti. 🚀',
    'plataforma': 'Primero configura la **información principal de tu negocio** en la calculadora y activa los **módulos que consideres más productivos** para ti. 🚀',
    'cambiar': 'Sí, los **módulos pueden activarse o desactivarse** según como vaya creciendo tu negocio. Tienes total flexibilidad. ✅',
    'modulos': 'Sí, los **módulos pueden activarse o desactivarse** según como vaya creciendo tu negocio. Tienes total flexibilidad. ✅',
    'después': 'Sí, los **módulos pueden activarse o desactivarse** según como vaya creciendo tu negocio. Tienes total flexibilidad. ✅',
    'dejo': 'Puedes **retomar el uso cuando lo necesites**, sin que afecte el funcionamiento de tu negocio. Tu información estará segura. 🔒',
    'tiempo': 'Puedes **retomar el uso cuando lo necesites**, sin que afecte el funcionamiento de tu negocio. Tu información estará segura. 🔒',
    'gracias': '¡De nada! 😊 Estoy aquí para ayudarte siempre que lo necesites. Si tienes más preguntas, no dudes en escribirme.',
    'ayuda': 'Estoy aquí para ayudarte. Puedes preguntarme:\n\n📋 ¿Qué debería revisar hoy?\n🚀 ¿Cómo empiezo a usar la plataforma?\n🔄 ¿Puedo cambiar los módulos después?\n⏸️ ¿Qué pasa si dejo de usarlo un tiempo?'
};

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Buscar coincidencias en las palabras clave
    for (const [keyword, response] of Object.entries(aiResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }

    return aiResponses['default'];
}

function addMessage(text, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'items-start'} animate-fade-in-up`;

    const bubbleClass = isUser
        ? 'bg-lime-500 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-md'
        : 'bg-white p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-md border';

    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

    messageDiv.innerHTML = `
        <div class="${bubbleClass}" ${!isUser ? 'style="border-color: #e2e8f0; color: var(--text-primary);"' : ''}>
            ${formattedText}
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex items-start animate-fade-in-up';
    typingDiv.innerHTML = `
        <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-md border" style="border-color: #e2e8f0;">
            <div class="flex gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s;"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

function initializeChat() {
    if (!chatInitialized) {
        addMessage('¡Hola! 👋 Soy tu asistente de TecnoPymes. Estoy aquí para guiarte y resolver tus dudas. ¿En qué puedo ayudarte hoy?');
        chatInitialized = true;
    }
}

function sendChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, true);
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getAIResponse(message);
        addMessage(response);
    }, 1000 + Math.random() * 500);
}

function sendQuickMessage(message) {
    document.getElementById('chat-input').value = message;
    sendChatMessage(new Event('submit'));
}

function toggleAssistant() {
    if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
        setTimeout(() => {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            initializeChat();
        }, 10);
    } else {
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            chatWindow.classList.add('hidden');
        }, 300);
    }
}

// MODULE REQUEST MODAL
function requestCustomModule(prefill = "") {
    const modal = document.getElementById('module-request-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (prefill) {
        document.getElementById('module-name').value = prefill;
    }
}

function closeModuleModal() {
    const modal = document.getElementById('module-request-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');

    document.getElementById('module-name').value = '';
    document.getElementById('module-description').value = '';
    document.getElementById('module-email').value = '';
}

function submitModuleRequest() {
    const name = document.getElementById('module-name').value;
    const description = document.getElementById('module-description').value;
    const email = document.getElementById('module-email').value;

    if (!name || !email) {
        showToast('Por favor completa el nombre del módulo y tu email.', 'error');
        return;
    }

    closeModuleModal();
    showToast('¡Solicitud enviada con éxito! Un especialista te contactará pronto a ' + email, 'success');
}

// DARK MODE FUNCTIONALITY
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');

    // Show toast notification
    showToast(isDark ? 'Modo oscuro activado' : 'Modo claro activado', 'info', 2000);
}

// Initialize dark mode on page load
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode');

    // Check if user prefers dark mode
    if (darkMode === 'enabled') {
        document.documentElement.classList.add('dark');
    } else if (darkMode === null) {
        // Check system preference if no setting saved
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        }
    }
}

// PURCHASE SUCCESS MODAL (Roblox Style)
function showPurchaseSuccessModal(modules, total) {
    const modal = document.getElementById('purchase-success-modal');
    const modalContent = document.getElementById('purchase-modal-content');
    const modulesList = document.getElementById('purchase-modules-list');
    const totalElement = document.getElementById('purchase-total');

    // Llenar la lista de módulos
    modulesList.innerHTML = '';
    modules.forEach(module => {
        const moduleItem = document.createElement('div');
        moduleItem.className = 'flex items-center gap-3 p-3 bg-blue-50 rounded-lg';
        moduleItem.innerHTML = `
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class='bx ${module.icon} text-blue-600 text-xl'></i>
            </div>
            <div class="flex-1">
                <p class="font-semibold text-gray-800 text-sm">${module.name}</p>
                <p class="text-xs text-gray-500">$${module.price}/mes</p>
            </div>
            <i class='bx bx-check-circle text-2xl text-green-500'></i>
        `;
        modulesList.appendChild(moduleItem);
    });

    // Actualizar el total
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Mostrar el modal con animación
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
        modalContent.classList.remove('scale-0');
        modalContent.classList.add('modal-show');
    }, 50);

    // Reproducir sonido de éxito (opcional)
    // const successSound = new Audio('path/to/success-sound.mp3');
    // successSound.play().catch(() => {});
}

function closePurchaseModal() {
    const modal = document.getElementById('purchase-success-modal');
    const modalContent = document.getElementById('purchase-modal-content');

    modalContent.classList.remove('modal-show');
    modalContent.classList.add('scale-0');

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

// Initialize on page load
setInterval(updateTags, 1000);
updateTags();
initDarkMode();

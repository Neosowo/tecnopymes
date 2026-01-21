// ===============================
// CARRUSEL DE SIMULACIÓN DE PAGO
// ===============================

let currentPaymentStep = 0;
const totalPaymentSteps = 5; // 5 slides: Revisión, Método, Datos, Procesando, Completado
let selectedPaymentMethod = '';
let paymentCartData = [];
let paymentTotal = 0;
let paymentCompleted = false; // Bandera para evitar compras duplicadas

// Abrir modal de pago
function openPaymentSimulation(cartItems, total) {
    paymentCartData = cartItems;
    paymentTotal = total;
    currentPaymentStep = 0;
    selectedPaymentMethod = '';
    paymentCompleted = false; // Resetear bandera para nueva compra

    // Mostrar modal
    const modal = document.getElementById('payment-simulation-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Llenar el carrito en el paso 1
    updatePaymentCartDisplay();

    // Reset carrusel a la primera posición
    updateCarouselPosition();
    updateProgressBar();
    updateStepTitle();
    updateNavigationButtons();

    // Reset método de pago
    document.getElementById('payment-method-selected').classList.add('hidden');
}

// Cerrar modal
function closePaymentSimulation() {
    const modal = document.getElementById('payment-simulation-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Actualizar display del carrito
function updatePaymentCartDisplay() {
    const container = document.getElementById('payment-cart-items');
    container.innerHTML = '';

    paymentCartData.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200';
        itemEl.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <i class='bx ${item.icon} text-blue-600'></i>
                </div>
                <div>
                    <p class="font-semibold text-gray-800">${item.name}</p>
                    <p class="text-xs text-gray-500">${item.desc}</p>
                </div>
            </div>
            <span class="font-bold text-gray-800">$${item.price.toFixed(2)}</span>
        `;
        container.appendChild(itemEl);
    });

    // Actualizar totales en todos los pasos
    document.getElementById('payment-total-1').textContent = `$${paymentTotal.toFixed(2)}`;
    document.getElementById('payment-total-final').textContent = `$${paymentTotal.toFixed(2)}`;

    // Actualizar monto de transferencia (Slide 5)
    const transferAmount = document.getElementById('transfer-amount');
    if (transferAmount) {
        transferAmount.textContent = paymentTotal.toFixed(2);
    }
}

// Navegar a paso siguiente
function nextPaymentStep() {
    // Validaciones según el paso actual
    if (currentPaymentStep === 1 && !selectedPaymentMethod) {
        // No mostrar toast, solo no avanzar
        return;
    }

    if (currentPaymentStep < totalPaymentSteps - 1) {
        currentPaymentStep++;
        updateCarouselPosition();
        updateProgressBar();
        updateStepTitle();
        updateNavigationButtons();

        // Si es el paso de procesamiento (paso 3), simular animación
        if (currentPaymentStep === 3) {
            simulatePaymentProcessing();
        }
    }
}

// Navegar a paso anterior
function prevPaymentStep() {
    if (currentPaymentStep > 0) {
        currentPaymentStep--;
        updateCarouselPosition();
        updateProgressBar();
        updateStepTitle();
        updateNavigationButtons();
    }
}

// Actualizar posición del carrusel
function updateCarouselPosition() {
    const carousel = document.getElementById('payment-carousel');
    const translateX = -(currentPaymentStep * 100);
    carousel.style.transform = `translateX(${translateX}%)`;
}

// Actualizar barra de progreso
function updateProgressBar() {
    const progressBar = document.getElementById('payment-progress-bar');
    const progress = ((currentPaymentStep + 1) / totalPaymentSteps) * 100;
    progressBar.style.width = `${progress}%`;

    // Actualizar dots
    const dots = document.querySelectorAll('.payment-dot');
    dots.forEach((dot, index) => {
        if (index <= currentPaymentStep) {
            dot.style.background = '#276CE4';
        } else {
            dot.style.background = '#d1d5db';
        }
    });
}

// Actualizar título del paso
function updateStepTitle() {
    const titles = [
        'Paso 1 de 5: Revisión del Carrito',
        'Paso 2 de 5: Selecciona tu Método de Pago',
        'Paso 3 de 5: Información de Pago',
        'Paso 4 de 5: Procesando tu Pago',
        'Paso 5 de 5: ¡Pago Completado!'
    ];
    document.getElementById('payment-step-title').textContent = titles[currentPaymentStep];
}

// Actualizar botones de navegación
function updateNavigationButtons() {
    const prevBtn = document.getElementById('payment-prev-btn');
    const nextBtn = document.getElementById('payment-next-btn');

    // Botón anterior
    if (currentPaymentStep === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    // Botón siguiente
    if (currentPaymentStep === totalPaymentSteps - 1) {
        // Último paso: Pago Completado - cambiar botón a "Completado" y ejecutar la compra
        nextBtn.style.visibility = 'visible';
        nextBtn.innerHTML = '<i class="bx bx-check-circle mr-2"></i>Completado';
        nextBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

        // Ejecutar la compra de módulos automáticamente al llegar a este paso (solo una vez)
        if (!paymentCompleted) {
            paymentCompleted = true;
            completePayment();
        }

        // El botón solo cierra el modal ya que la compra ya se realizó
        nextBtn.onclick = function () {
            closePaymentSimulation();
        };

        // Ocultar botón anterior en el último paso
        prevBtn.style.visibility = 'hidden';
    } else if (currentPaymentStep === 3) {
        // En el paso de procesamiento (paso 3), ocultar los botones
        nextBtn.style.visibility = 'hidden';
        prevBtn.style.visibility = 'hidden';
    } else {
        nextBtn.style.visibility = 'visible';
        prevBtn.style.visibility = 'visible';
        nextBtn.style.background = 'linear-gradient(135deg, #276CE4 0%, #3869F4 100%)';
        nextBtn.innerHTML = 'Siguiente<i class="bx bx-chevron-right ml-2"></i>';
        nextBtn.onclick = nextPaymentStep;
    }
}

// Seleccionar método de pago y avanzar al siguiente paso
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    // Avanzar al slide de información de pago (slide 2)
    currentPaymentStep = 2;
    updateCarouselPosition();
    updateProgressBar();
    updateStepTitle();
    updateNavigationButtons();
}

// Simular procesamiento de pago
function simulatePaymentProcessing() {
    const steps = [
        'processing-step-1',
        'processing-step-2',
        'processing-step-3',
        'processing-step-4'
    ];

    let delay = 0;
    steps.forEach((stepId, index) => {
        setTimeout(() => {
            const stepEl = document.getElementById(stepId);
            stepEl.style.opacity = '1';

            // Cambiar icono a check
            const icon = stepEl.querySelector('i');
            icon.classList.remove('bx-loader-circle');
            icon.classList.add('bx-check-circle');

            // Si es el último paso, avanzar automáticamente
            if (index === steps.length - 1) {
                setTimeout(() => {
                    nextPaymentStep();
                }, 500);
            }
        }, delay);
        delay += 800;
    });
}

// Completar el pago y activar módulos
function completePayment() {
    // Activar módulos del carrito
    paymentCartData.forEach(item => {
        const module = modules.find(m => m.id === item.id);
        if (module) {
            module.active = true;
            addModuleToSidebar(module);
        }
    });

    // Limpiar carrito
    shoppingCart = [];
    updateShoppingCartUI();
    renderModules();
    updateContractedModulesUI();

    // Solo mostrar un toast al finalizar todo el proceso
    setTimeout(() => {
        showToast('¡Compra completada exitosamente! Tus módulos han sido activados.', 'success');
    }, 300);
}

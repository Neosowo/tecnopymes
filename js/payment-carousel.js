// Dev Neos
let currentPaymentStep = 0;
const totalPaymentSteps = 5; 
let selectedPaymentMethod = '';
let paymentCartData = [];
let paymentTotal = 0;
let paymentCompleted = false; 

function openPaymentSimulation(cartItems, total) {
    paymentCartData = cartItems;
    paymentTotal = total;
    currentPaymentStep = 0;
    selectedPaymentMethod = '';
    paymentCompleted = false; 

    
    const modal = document.getElementById('payment-simulation-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    
    updatePaymentCartDisplay();

    
    updateCarouselPosition();
    updateProgressBar();
    updateStepTitle();
    updateNavigationButtons();

    
    document.getElementById('payment-method-selected').classList.add('hidden');
}

function closePaymentSimulation() {
    const modal = document.getElementById('payment-simulation-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

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

    
    document.getElementById('payment-total-1').textContent = `$${paymentTotal.toFixed(2)}`;
    document.getElementById('payment-total-final').textContent = `$${paymentTotal.toFixed(2)}`;

    
    const transferAmount = document.getElementById('transfer-amount');
    if (transferAmount) {
        transferAmount.textContent = paymentTotal.toFixed(2);
    }
}

function nextPaymentStep() {
    
    if (currentPaymentStep === 1 && !selectedPaymentMethod) {
        
        return;
    }

    if (currentPaymentStep < totalPaymentSteps - 1) {
        currentPaymentStep++;
        updateCarouselPosition();
        updateProgressBar();
        updateStepTitle();
        updateNavigationButtons();

        
        if (currentPaymentStep === 3) {
            simulatePaymentProcessing();
        }
    }
}

function prevPaymentStep() {
    if (currentPaymentStep > 0) {
        currentPaymentStep--;
        updateCarouselPosition();
        updateProgressBar();
        updateStepTitle();
        updateNavigationButtons();
    }
}

function updateCarouselPosition() {
    const carousel = document.getElementById('payment-carousel');
    const translateX = -(currentPaymentStep * 100);
    carousel.style.transform = `translateX(${translateX}%)`;
}

function updateProgressBar() {
    const progressBar = document.getElementById('payment-progress-bar');
    const progress = ((currentPaymentStep + 1) / totalPaymentSteps) * 100;
    progressBar.style.width = `${progress}%`;

    
    const dots = document.querySelectorAll('.payment-dot');
    dots.forEach((dot, index) => {
        if (index <= currentPaymentStep) {
            dot.style.background = '#276CE4';
        } else {
            dot.style.background = '#d1d5db';
        }
    });
}

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

function updateNavigationButtons() {
    const prevBtn = document.getElementById('payment-prev-btn');
    const nextBtn = document.getElementById('payment-next-btn');

    
    if (currentPaymentStep === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    
    if (currentPaymentStep === totalPaymentSteps - 1) {
        
        nextBtn.style.visibility = 'visible';
        nextBtn.innerHTML = '<i class="bx bx-check-circle mr-2"></i>Completado';
        nextBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

        
        if (!paymentCompleted) {
            paymentCompleted = true;
            completePayment();
        }

        
        nextBtn.onclick = function () {
            closePaymentSimulation();
        };

        
        prevBtn.style.visibility = 'hidden';
    } else if (currentPaymentStep === 3) {
        
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

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    
    currentPaymentStep = 2;
    updateCarouselPosition();
    updateProgressBar();
    updateStepTitle();
    updateNavigationButtons();
}

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

            
            const icon = stepEl.querySelector('i');
            icon.classList.remove('bx-loader-circle');
            icon.classList.add('bx-check-circle');

            
            if (index === steps.length - 1) {
                setTimeout(() => {
                    nextPaymentStep();
                }, 500);
            }
        }, delay);
        delay += 800;
    });
}

function completePayment() {
    
    paymentCartData.forEach(item => {
        const module = modules.find(m => m.id === item.id);
        if (module) {
            module.active = true;
            addModuleToSidebar(module);
        }
    });

    
    shoppingCart = [];
    updateShoppingCartUI();
    renderModules();
    updateContractedModulesUI();

    
    setTimeout(() => {
        showToast('¡Compra completada exitosamente! Tus módulos han sido activados.', 'success');
    }, 300);
}

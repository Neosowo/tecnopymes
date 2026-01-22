// Dev Neos
const modules = [
    { id: 1, name: 'CRM', desc: 'Gestión avanzada de clientes, pipelines y analítica de ventas.', price: 39.99, active: true, icon: 'bx-briefcase', hideFromCatalog: true },
    { id: 2, name: 'Recursos Humanos', desc: 'Gestión de nóminas, asistencia y portal del empleado.', price: 34.99, active: true, icon: 'bx-group', hideFromCatalog: true },
    { id: 3, name: 'Módulo de Contabilidad', desc: 'Facturación electrónica, registro de gastos e informes financieros.', price: 29.99, active: false, icon: 'bx-calculator' },
    { id: 4, name: 'Control de Inventario', desc: 'Administración de stock con alertas automáticas y soporte para varios almacenes', price: 19.99, active: false, icon: 'bx-box' },
    { id: 5, name: 'Herramientas de Marketing', desc: 'Envío de correos automatizados y gestión de redes sociales', price: 24.99, active: false, icon: 'bx-megaphone' },
    { id: 6, name: 'Gestor de proyectos y tareas', desc: 'Organiza tus proyectos, asigna tareas y lleva el control del tiempo de tu equipo', price: 14.99, active: false, icon: 'bx-task' },
    { id: 7, name: 'Sistema de Soporte al Cliente', desc: 'Mesa de ayuda para gestionar consultas y tickets de clientes', price: 12.50, active: false, icon: 'bx-support' },
    { id: 8, name: 'Ventas Unificadas', desc: 'Reúne en un solo panel todas tus ventas de internet, físicas y redes sociales.', price: 35.00, active: false, icon: 'bx-cart' },
];

let shoppingCart = [];

function toggleModule(id) {
    const module = modules.find(m => m.id === id);
    if (module && !module.active) {

        if (shoppingCart.find(item => item.id === id)) {
            showToast(`${module.name} ya está en el carrito`, 'warning');
            return;
        }


        addToShoppingCart(module);
        showToast(`${module.name} agregado al carrito`, 'success');
    }
}

function addToShoppingCart(module) {
    shoppingCart.push(module);
    updateShoppingCartUI();


    const cartSection = document.getElementById('shopping-cart-section');
    if (cartSection) {
        cartSection.classList.remove('hidden');
    }
}

function updateShoppingCartUI() {
    const itemsContainer = document.getElementById('shopping-cart-items');
    const cartSection = document.getElementById('shopping-cart-section');
    const itemCount = document.getElementById('cart-item-count');

    if (!itemsContainer) return;

    if (shoppingCart.length === 0) {
        if (cartSection) cartSection.classList.add('hidden');
        return;
    }

    if (cartSection) cartSection.classList.remove('hidden');
    if (itemCount) itemCount.textContent = shoppingCart.length;

    itemsContainer.innerHTML = '';

    shoppingCart.forEach(module => {
        const itemEl = document.createElement('div');
        itemEl.className = 'p-3 bg-blue-50 rounded-lg flex items-center justify-between hover:bg-blue-100 transition-colors';
        itemEl.innerHTML = `
            <div class="flex items-center gap-3 flex-1">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class='bx ${module.icon} text-blue-600 text-xl'></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-800 text-sm truncate">${module.name}</p>
                    <p class="text-xs text-gray-500">$${module.price}/mes</p>
                </div>
            </div>
            <button onclick="removeFromShoppingCart(${module.id})" class="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-white/50 transition-colors">
                <i class='bx bx-trash text-lg'></i>
            </button>
        `;
        itemsContainer.appendChild(itemEl);
    });

    updatePlanSummary();
}

function removeFromShoppingCart(id) {
    shoppingCart = shoppingCart.filter(item => item.id !== id);
    updateShoppingCartUI();
    showToast('Módulo eliminado del carrito', 'info');
}

function confirmPurchase() {
    if (shoppingCart.length === 0) {
        showToast('El carrito está vacío', 'warning');
        return;
    }

    const total = shoppingCart.reduce((sum, m) => sum + m.price, 0);


    openPaymentSimulation([...shoppingCart], total);
}

function renderModules(filterText = "") {
    const grid = document.getElementById('modules-grid');
    if (!grid) return;

    grid.innerHTML = "";

    const filtered = modules.filter(m => !m.active && !m.hideFromCatalog && m.name.toLowerCase().includes(filterText.toLowerCase()));

    if (filtered.length === 0) {

        if (filterText === "") {
            grid.innerHTML = `
                <div class="col-span-full text-center py-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200">
                    <i class='bx bx-check-circle text-6xl text-green-500 mb-4'></i>
                    <p class="text-gray-700 text-lg font-bold mb-2">¡Todos los módulos están contratados!</p>
                    <p class="text-gray-500 text-sm">Revisa el menú lateral para acceder a tus módulos.</p>
                </div>
            `;
        } else {
            grid.innerHTML = `
                <div class="col-span-full text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <i class='bx bx-search-alt text-6xl text-gray-300 mb-4'></i>
                    <p class="text-gray-500 text-lg font-medium">No encontramos el módulo "${filterText}"</p>
                    <p class="text-gray-400 text-sm mb-6">Pero podemos crearlo para ti.</p>
                    <button onclick="requestCustomModule('${filterText}')" class="text-blue-600 hover:text-blue-700 font-semibold underline">
                        Solicitar creación de módulo "${filterText}"
                    </button>
                </div>
            `;
        }
        return;
    }

    filtered.forEach(m => {
        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative group flex flex-col";
        card.id = `module-card-${m.id}`;
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-lg bg-lime-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    <i class='bx ${m.active ? 'bxs-check-shield' : m.icon}'></i>
                </div>
                ${m.active ? '<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center"><i class="bx bx-check mr-1"></i>Activo</span>' : ''}
            </div>
            
            <h3 class="font-bold text-gray-800 text-lg mb-2">${m.name}</h3>
            <p class="text-gray-500 text-sm mb-6 flex-grow">${m.desc}</p>
            
            <div class="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div class="flex flex-col">
                    <span class="text-xs text-gray-400">Precio mensual</span>
                    <span class="font-bold text-gray-900 text-lg">$${m.price}</span>
                </div>
                <button onclick="toggleModule(${m.id})" 
                    class="bg-blue-600 hover:bg-blue-700 text-white shadow-lime-200 hover:shadow-lg px-4 py-2 rounded-lg text-sm font-medium transition-all transform active:scale-95">
                    Agregar +
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateContractedModulesUI() {
    const contractedSection = document.getElementById('contracted-modules-section');
    const contractedItemsContainer = document.getElementById('contracted-modules-items');
    const contractedCount = document.getElementById('contracted-count');

    if (!contractedSection || !contractedItemsContainer) {
        console.log('updateContractedModulesUI: Elementos no encontrados');
        return;
    }



    const activeModules = modules.filter(m => m.active && !m.hideFromCatalog);

    if (activeModules.length === 0) {
        contractedSection.classList.add('hidden');
        return;
    }

    contractedSection.classList.remove('hidden');
    contractedCount.textContent = activeModules.length;


    contractedItemsContainer.innerHTML = '';

    activeModules.forEach(module => {
        const card = document.createElement('div');
        card.className = 'contracted-module-card bg-gradient-to-br from-green-50 to-lime-50 p-4 rounded-xl border-2 border-green-200 hover:shadow-md transition-all';
        card.setAttribute('data-module-id', module.id);
        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class='bx ${module.icon} text-green-600 text-xl'></i>
                </div>
                <span class="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                    <i class='bx bx-check-circle'></i>Activo
                </span>
            </div>
            <h4 class="font-bold text-gray-800 mb-1">${module.name}</h4>
            <p class="text-xs text-gray-600 mb-3">${module.desc}</p>
            <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-green-700">$${module.price}/mes</span>
                <button type="button" 
                    class="btn-devolver-module px-3 py-1.5 text-xs bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 font-semibold rounded-lg transition-all duration-200 flex items-center gap-1"
                    onclick="returnContractedModule(${module.id})"
                    data-module-id="${module.id}"
                    data-module-name="${module.name}">
                    <i class='bx bx-undo'></i>
                    Devolver
                </button>
            </div>
        `;
        contractedItemsContainer.appendChild(card);
    });
}

function handleModuleReturn(moduleId, moduleName) {
    console.log('handleModuleReturn llamada:', moduleId, moduleName);

    const module = modules.find(m => m.id === moduleId);

    if (!module) {
        console.error('Módulo no encontrado:', moduleId);
        showToast('Error: Módulo no encontrado', 'error');
        return;
    }

    if (!module.active) {
        console.error('Módulo no está activo:', moduleId);
        showToast('Este módulo ya no está activo', 'warning');
        return;
    }






    console.log('Procesando devolución de:', module.name);
    showToast('Procesando devolución...', 'info');


    module.active = false;


    setTimeout(() => {

        removeModuleFromSidebar(moduleId);


        updateContractedModulesUI();
        renderModules();
        updatePlanSummary();

        showToast(`"${module.name}" ha sido devuelto exitosamente.`, 'success');
        console.log('Devolución completada');
    }, 500);
}

function toggleContractedModules() {
    const content = document.getElementById('contracted-modules-content');
    const icon = document.getElementById('contracted-toggle-icon');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('bx-chevron-down');
        icon.classList.add('bx-chevron-up');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('bx-chevron-up');
        icon.classList.add('bx-chevron-down');
    }
}

function returnContractedModule(moduleId) {
    console.log('returnContractedModule llamada con ID:', moduleId);

    const module = modules.find(m => m.id === moduleId);
    console.log('Módulo encontrado:', module);

    if (!module || !module.active) {
        console.log('Módulo no encontrado o no activo, saliendo...');
        return;
    }







    console.log('Procesando devolución (confirmación omitida por error en navegador)...');

    console.log('Procesando devolución...');
    showToast('Procesando devolución...', 'info');

    setTimeout(() => {

        module.active = false;
        console.log('Módulo desactivado:', module);


        removeModuleFromSidebar(moduleId);


        updateContractedModulesUI();
        renderModules();
        updatePlanSummary();

        showToast(`"${module.name}" ha sido devuelto exitosamente. Se procesará el reembolso correspondiente.`, 'success');
        console.log('Devolución completada exitosamente');
    }, 1000);
}

window.returnContractedModule = returnContractedModule;

function addModuleToSidebar(module) {
    const dynamicMenu = document.getElementById('dynamic-modules-menu');
    if (!dynamicMenu) return;


    if (document.getElementById(`sidebar-module-${module.id}`)) {
        return;
    }


    const placeholderMessage = dynamicMenu.querySelector('p.italic');
    if (placeholderMessage) {
        dynamicMenu.innerHTML = '';
    }

    const menuItem = document.createElement('li');
    menuItem.id = `sidebar-module-${module.id}`;
    menuItem.className = 'animate-slide-in';
    menuItem.innerHTML = `
        <a href="#" id="sidebar-link-${module.id}" onclick="showModuleView(${module.id})"
            class="sidebar-link flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100 group"
            style="color: var(--text-muted);">
            <i class='bx ${module.icon} text-xl mr-3'></i>
            ${module.name}
            <span class="ml-auto bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                Nuevo
            </span>
        </a>
    `;

    dynamicMenu.appendChild(menuItem);


    setTimeout(() => {
        const badge = menuItem.querySelector('span.bg-green-100');
        if (badge) {
            badge.style.opacity = '0';
            setTimeout(() => badge.remove(), 300);
        }
    }, 5000);
}

function showModuleView(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    checkMobileAndCloseSidebar();


    const moduleViewMap = {
        1: 'module-crm-pro-view',
        2: 'module-recursos-humanos-view',
        3: 'module-contabilidad-view',
        4: 'module-inventario-view',
        5: 'module-marketing-view',
        6: 'module-proyectos-view',
        7: 'module-soporte-view',
        8: 'module-ecommerce-view'
    };

    const viewName = moduleViewMap[moduleId];
    if (viewName) {
        showView(viewName);


        const dynamicLink = document.getElementById(`sidebar-link-${moduleId}`);
        if (dynamicLink) {

            document.querySelectorAll('.sidebar-link').forEach(l => {
                l.classList.remove('active');
                l.style.background = 'transparent';
                l.style.color = 'var(--text-muted)';
            });

            dynamicLink.classList.add('active');
            dynamicLink.style.background = 'var(--accent-primary)';
            dynamicLink.style.color = 'white';
        }

        showToast(`Accediendo a ${module.name}...`, 'info');
    } else {
        showToast(`${module.name} - Funcionalidad en desarrollo`, 'info');
        showView('dashboard-view');
    }
}

function removeModuleFromSidebar(moduleId) {
    const menuItem = document.getElementById(`sidebar-module-${moduleId}`);
    if (menuItem) {

        menuItem.style.opacity = '0';
        menuItem.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            menuItem.remove();


            const dynamicMenu = document.getElementById('dynamic-modules-menu');
            if (dynamicMenu && dynamicMenu.children.length === 0) {
                const placeholderLi = document.createElement('li');
                placeholderLi.className = 'px-4 py-2';
                placeholderLi.innerHTML = `
                    <p class="text-xs italic" style="color: var(--text-muted);">
                        No hay módulos contratados
                    </p>
                `;
                dynamicMenu.appendChild(placeholderLi);
            }
        }, 300);
    }
}

let refundCart = [];

const modulePrices = {
    1: 39.99,
    2: 34.99,
    3: 29.99,
    4: 19.99,
    5: 24.99,
    6: 14.99,
    7: 12.50,
    8: 35.00
};

function removeModule(id) {
    const module = modules.find(m => m.id === id);
    if (module && module.active) {

        addToRefundCart(module);
    }
}

function addToRefundCart(module) {

    if (refundCart.find(item => item.id === module.id)) {
        showToast(`"${module.name}" ya está en el carrito de reembolsos`, 'warning');
        return;
    }

    const actualPrice = module.price > 0 ? module.price : modulePrices[module.id] || 19.99;

    const daysAgo = Math.floor(Math.random() * 6) + 1;
    const activationDate = new Date();
    activationDate.setDate(activationDate.getDate() - daysAgo);

    const daysRemaining = 7 - daysAgo;
    const isEligible = daysRemaining > 0;
    const refundAmount = isEligible ? actualPrice : 0;

    refundCart.push({
        id: module.id,
        name: module.name,
        price: actualPrice,
        originalPrice: module.price,
        icon: module.icon,
        activationDate: activationDate,
        daysUsed: daysAgo,
        daysRemaining: Math.max(0, daysRemaining),
        isEligible: isEligible,
        refundAmount: refundAmount
    });

    updateRefundCartUI();
    showToast(`"${module.name}" agregado al carrito de reembolsos`, 'info');
}

function updateRefundCartUI() {
    const itemsContainer = document.getElementById('refund-items-container');
    const totalEl = document.getElementById('refund-total-amount');
    const cartSection = document.getElementById('refund-cart-section');

    if (!itemsContainer || !cartSection) return;

    if (refundCart.length === 0) {
        cartSection.classList.add('hidden');
        itemsContainer.innerHTML = '';
        totalEl.textContent = '$0.00';
        return;
    }

    cartSection.classList.remove('hidden');
    itemsContainer.innerHTML = '';

    let totalRefund = 0;

    refundCart.forEach(item => {
        totalRefund += item.refundAmount;

        const itemEl = document.createElement('div');
        itemEl.className = 'bg-white rounded-xl p-4 border border-gray-100 shadow-sm';
        itemEl.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-lg bg-lime-50 text-blue-600 flex items-center justify-center mr-3">
                        <i class='bx ${item.icon} text-xl'></i>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-800">${item.name}</p>
                        <p class="text-xs text-gray-400">Precio: $${item.price.toFixed(2)}/mes</p>
                    </div>
                </div>
                <button onclick="removeFromRefundCart(${item.id})" class="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <i class='bx bx-x text-xl'></i>
                </button>
            </div>
            <div class="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                ${item.isEligible
                ? `<span class="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center">
                        <i class='bx bx-check mr-1'></i>${item.daysRemaining} días restantes
                       </span>`
                : `<span class="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium flex items-center">
                        <i class='bx bx-x mr-1'></i>Plazo expirado
                       </span>`
            }
                <span class="font-bold text-lg ${item.isEligible ? 'text-green-600' : 'text-gray-400'}">${item.isEligible ? `+$${item.refundAmount.toFixed(2)}` : '$0.00'}</span>
            </div>
        `;
        itemsContainer.appendChild(itemEl);
    });

    totalEl.textContent = `$${totalRefund.toFixed(2)}`;
}

function removeFromRefundCart(id) {
    refundCart = refundCart.filter(item => item.id !== id);
    updateRefundCartUI();
}

function clearRefundCart() {
    refundCart = [];
    updateRefundCartUI();
    showToast('Carrito de reembolsos vaciado', 'info');
}

function confirmRefunds() {
    if (refundCart.length === 0) return;

    const eligibleItems = refundCart.filter(item => item.isEligible);
    const totalRefund = eligibleItems.reduce((sum, item) => sum + item.refundAmount, 0);


    refundCart.forEach(item => {
        const module = modules.find(m => m.id === item.id);
        if (module) {
            module.active = false;


            removeModuleFromSidebar(item.id);


            const card = document.getElementById(`module-card-${item.id}`);
            if (card) {
                const iconDiv = card.querySelector('.flex.items-start.justify-between.mb-4');
                const iconContainer = iconDiv.querySelector('div');
                iconContainer.innerHTML = `<i class='bx ${module.icon}'></i>`;

                const badge = iconDiv.querySelector('span');
                if (badge) badge.remove();


                const priceSection = card.querySelector('.pt-4.border-t.border-gray-50');
                if (priceSection) {
                    priceSection.innerHTML = `
                        <div class="flex flex-col">
                            <span class="text-xs text-gray-400">Precio mensual</span>
                            <span class="font-bold text-gray-900 text-lg">$${module.price}</span>
                        </div>
                        <button onclick="toggleModule(${item.id})" 
                            class="bg-blue-600 hover:bg-blue-700 text-white shadow-lime-200 hover:shadow-lg px-4 py-2 rounded-lg text-sm font-medium transition-all transform active:scale-95">
                            Agregar +
                        </button>
                    `;
                }
            }
        }
    });


    refundCart = [];
    updateRefundCartUI();
    updatePlanSummary();

    if (totalRefund > 0) {
        showToast(`¡Reembolso procesado! Se acreditarán $${totalRefund.toFixed(2)} a tu método de pago`, 'success');
    } else {
        showToast('Módulos eliminados. No había reembolsos elegibles.', 'info');
    }
}

function updatePlanSummary() {

    const purchasedModules = modules.filter(m => m.active && !m.hideFromCatalog);
    const total = purchasedModules.reduce((sum, m) => sum + m.price, 0);


    const cartTotal = shoppingCart.reduce((sum, m) => sum + m.price, 0);
    const cartCount = shoppingCart.length;

    document.getElementById('total-modules').textContent = cartCount;
    document.getElementById('total-price').textContent = `$${cartTotal.toFixed(2)}`;
}

document.getElementById('module-search')?.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const moduleCards = document.querySelectorAll('#modules-grid > div');
    moduleCards.forEach(card => {
        const title = card.querySelector('h3');
        if (title) {
            const moduleName = title.textContent.toLowerCase();
            if (moduleName.includes(searchText)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
});

function initializeModules() {

    modules.forEach(module => {
        if (module.active) {
            addModuleToSidebar(module);
        }
    });


    updateContractedModulesUI();


    renderModules();
}

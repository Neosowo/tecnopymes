// Completar el pago y activar módulos
function completePayment() {
    console.log('=== INICIANDO COMPRA ===');
    console.log('Módulos en paymentCartData:', paymentCartData);
    console.log('Módulos en shoppingCart global:', shoppingCart);

    // Usar paymentCartData que es la copia local del carrito
    if (paymentCartData && paymentCartData.length > 0) {
        paymentCartData.forEach(item => {
            console.log('Procesando módulo:', item.name, 'ID:', item.id);
            const module = modules.find(m => m.id === item.id);
            if (module) {
                console.log('Módulo encontrado, activando:', module.name);
                module.active = true;
                addModuleToSidebar(module);
                console.log('Módulo activado:', module.name, 'Active:', module.active);
            } else {
                console.error('No se encontró el módulo con ID:', item.id);
            }
        });
    } else {
        console.error('paymentCartData está vacío o no existe!');
    }

    // Limpiar carrito global
    shoppingCart.length = 0; // Vaciar el array manteniendo la referencia
    console.log('Carrito limpiado:', shoppingCart);

    // Actualizar todas las vistas
    updateShoppingCartUI();
    renderModules();
    updateContractedModulesUI();

    console.log('=== COMPRA COMPLETADA ===');
    console.log('Módulos activos:', modules.filter(m => m.active));

    // Solo mostrar un toast al finalizar todo el proceso
    setTimeout(() => {
        showToast('¡Compra completada exitosamente! Tus módulos han sido activados.', 'success');
    }, 300);
}

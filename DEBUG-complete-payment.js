// ===============================
// INSTRUCCIONES DE DEPURACIÓN
// ===============================

/*
PASO 1: Reemplaza la función completePayment() en payment-carousel.js
        (líneas 232-253) con el código de abajo.

PASO 2: Guarda el archivo

PASO 3: Recarga la página en el navegador

PASO 4: Abre la consola del navegador (F12 → pestaña Console)

PASO 5: Agrega módulos al carrito y completa el proceso de pago

PASO 6: Observa los mensajes en la consola y copia TODO lo que aparezca
*/

// ========================================
// CÓDIGO PARA REEMPLAZAR - INICIO
// ========================================

// Completar el pago y activar módulos
function completePayment() {
    console.log('%c=== INICIANDO COMPRA ===', 'background: #222; color: #bada55; font-size: 16px; font-weight: bold;');
    console.log('📦 Módulos en paymentCartData:', paymentCartData);
    console.log('🛒 Módulos en shoppingCart global:', shoppingCart);
    console.log('📋 Todos los módulos disponibles:', modules);

    // Usar paymentCartData que es la copia local del carrito
    if (paymentCartData && paymentCartData.length > 0) {
        console.log(`✅ paymentCartData tiene ${paymentCartData.length} módulos`);

        paymentCartData.forEach((item, index) => {
            console.log(`\n--- Procesando módulo ${index + 1} ---`);
            console.log('  📌 Nombre:', item.name);
            console.log('  🆔 ID:', item.id);
            console.log('  💰 Precio:', item.price);

            const module = modules.find(m => m.id === item.id);

            if (module) {
                console.log('  ✅ Módulo encontrado en array modules');
                console.log('  📊 Estado antes:', { active: module.active, name: module.name });

                module.active = true;
                console.log('  🔄 Activando módulo...');

                // Verificar si la función existe
                if (typeof addModuleToSidebar === 'function') {
                    addModuleToSidebar(module);
                    console.log('  ✅ addModuleToSidebar ejecutado');
                } else {
                    console.error('  ❌ addModuleToSidebar NO existe!');
                }

                console.log('  📊 Estado después:', { active: module.active, name: module.name });
            } else {
                console.error(`  ❌ NO se encontró el módulo con ID: ${item.id}`);
                console.error('  🔍 Buscando en modules:', modules.map(m => ({ id: m.id, name: m.name })));
            }
        });
    } else {
        console.error('❌ paymentCartData está vacío o no existe!');
        console.error('   Valor actual:', paymentCartData);
    }

    console.log('\n🧹 Limpiando carrito global...');
    shoppingCart.length = 0;
    console.log('   Carrito después de limpiar:', shoppingCart);

    console.log('\n🔄 Actualizando vistas...');

    // Verificar que las funciones existen
    if (typeof updateShoppingCartUI === 'function') {
        updateShoppingCartUI();
        console.log('   ✅ updateShoppingCartUI ejecutado');
    } else {
        console.error('   ❌ updateShoppingCartUI NO existe!');
    }

    if (typeof renderModules === 'function') {
        renderModules();
        console.log('   ✅ renderModules ejecutado');
    } else {
        console.error('   ❌ renderModules NO existe!');
    }

    if (typeof updateContractedModulesUI === 'function') {
        updateContractedModulesUI();
        console.log('   ✅ updateContractedModulesUI ejecutado');
    } else {
        console.error('   ❌ updateContractedModulesUI NO existe!');
    }

    console.log('%c=== COMPRA COMPLETADA ===', 'background: #222; color: #4CAF50; font-size: 16px; font-weight: bold;');
    const activeModules = modules.filter(m => m.active);
    console.log('🎯 Total de módulos activos:', activeModules.length);
    console.log('📋 Módulos activos:', activeModules.map(m => ({ id: m.id, name: m.name })));

    // Solo mostrar un toast al finalizar todo el proceso
    setTimeout(() => {
        if (typeof showToast === 'function') {
            showToast('¡Compra completada exitosamente! Tus módulos han sido activados.', 'success');
        } else {
            console.error('❌ showToast NO existe!');
            alert('¡Compra completada exitosamente! Tus módulos han sido activados.');
        }
    }, 300);
}

// ========================================
// CÓDIGO PARA REEMPLAZAR - FIN
// ========================================

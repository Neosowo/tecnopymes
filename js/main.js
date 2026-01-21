// Dev Neos
(function () {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
})();

function showView(viewName) {
    checkMobileAndCloseSidebar();
    const dashboard = document.getElementById('dashboard-view');
    const catalog = document.getElementById('catalog-view');
    const calculator = document.getElementById('calculator-view');
    const tutoriales = document.getElementById('tutoriales-view');
    const soporte = document.getElementById('soporte-view');
    const faq = document.getElementById('faq-view');
    const crmClientes = document.getElementById('crm-clientes-view');
    const crmOportunidades = document.getElementById('crm-oportunidades-view');
    const crmComisiones = document.getElementById('crm-comisiones-view');
    const crmLineas = document.getElementById('crm-lineas-view');
    const planSummary = document.getElementById('plan-summary');
    const mainScrollArea = document.getElementById('main-scroll-area');

    const resetAnim = (el) => {
        if (!el) return;
        el.classList.remove('animate-fade-in-up');
        void el.offsetWidth;
        el.classList.add('animate-fade-in-up');
    };

    
    if (mainScrollArea) {
        mainScrollArea.scrollTop = 0;
    }

    
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        link.style.background = 'transparent';
        link.style.color = 'var(--text-muted)';
    });

    const linkMap = {
        'dashboard': 'nav-dashboard',
        'dashboard-view': 'nav-dashboard',
        'catalog': 'nav-catalog',
        'catalog-view': 'nav-catalog',
        'calculator': 'nav-calculator',
        'calculator-view': 'nav-calculator',
        'tutoriales': 'nav-tutoriales',
        'tutoriales-view': 'nav-tutoriales',
        'soporte': 'nav-soporte',
        'soporte-view': 'nav-soporte',
        'faq': 'nav-faq',
        'faq-view': 'nav-faq',
        'module-crm-pro-view': 'nav-crm',
        'module-recursos-humanos-view': 'nav-rrhh'
    };

    let activeId = linkMap[viewName];

    
    if (!activeId && viewName.startsWith('module-')) {
        
        
        
        document.querySelectorAll('.sidebar-link').forEach(link => {
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${viewName}'`)) {
                activeId = link.id;
            }
        });
    }

    if (activeId) {
        const activeLink = document.getElementById(activeId);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.style.background = 'var(--accent-primary)';
            activeLink.style.color = 'white';
        }
    }

    
    dashboard.classList.add('hidden');
    catalog.classList.add('hidden');
    calculator.classList.add('hidden');
    if (tutoriales) tutoriales.classList.add('hidden');
    if (soporte) soporte.classList.add('hidden');
    if (faq) faq.classList.add('hidden');
    if (crmClientes) crmClientes.classList.add('hidden');
    if (crmOportunidades) crmOportunidades.classList.add('hidden');
    if (crmComisiones) crmComisiones.classList.add('hidden');
    if (crmLineas) crmLineas.classList.add('hidden');

    
    const moduleViews = [
        'module-crm-pro-view',
        'module-recursos-humanos-view',
        'module-contabilidad-view',
        'module-inventario-view',
        'module-marketing-view',
        'module-proyectos-view',
        'module-soporte-view',
        'module-ecommerce-view'
    ];
    moduleViews.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) view.classList.add('hidden');
    });

    
    if (planSummary) {
        planSummary.classList.add('hidden');
    }

    
    if (viewName === 'dashboard-view' || viewName === 'dashboard') {
        dashboard.classList.remove('hidden');
        resetAnim(dashboard);
    } else if (viewName === 'catalog-view' || viewName === 'catalog') {
        catalog.classList.remove('hidden');
        resetAnim(catalog);
        planSummary.classList.remove('hidden');
        updatePlanSummary();
    } else if (viewName === 'calculator-view' || viewName === 'calculator') {
        calculator.classList.remove('hidden');
        resetAnim(calculator);
    } else if (viewName === 'tutoriales-view' || viewName === 'tutoriales') {
        if (tutoriales) {
            tutoriales.classList.remove('hidden');
            resetAnim(tutoriales);
        }
    } else if (viewName === 'soporte-view' || viewName === 'soporte') {
        if (soporte) {
            soporte.classList.remove('hidden');
            resetAnim(soporte);
        }
    } else if (viewName === 'faq-view' || viewName === 'faq') {
        if (faq) {
            faq.classList.remove('hidden');
            resetAnim(faq);
        }
    } else if (viewName === 'crm-clientes-view' || viewName === 'crm-clientes') {
        crmClientes.classList.remove('hidden');
        resetAnim(crmClientes);
    } else if (viewName === 'crm-oportunidades-view' || viewName === 'crm-oportunidades') {
        crmOportunidades.classList.remove('hidden');
        resetAnim(crmOportunidades);
    } else if (viewName === 'crm-comisiones-view' || viewName === 'crm-comisiones') {
        crmComisiones.classList.remove('hidden');
        resetAnim(crmComisiones);
    } else if (viewName === 'crm-lineas-view' || viewName === 'crm-lineas') {
        crmLineas.classList.remove('hidden');
        resetAnim(crmLineas);
    } else {
        
        const moduleView = document.getElementById(viewName);
        if (moduleView) {
            moduleView.classList.remove('hidden');
            resetAnim(moduleView);
        } else {
            
            catalog.classList.remove('hidden');
            resetAnim(catalog);
            planSummary.classList.remove('hidden');
            updatePlanSummary();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showView('catalog'); 
    
    initializeModules();
});

document.querySelectorAll('nav a')[0]?.addEventListener('click', () => {
    showView('catalog');
    checkMobileAndCloseSidebar();
});

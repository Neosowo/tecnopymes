// Dev Neos
function updateCalculator() {
    
    const sales = parseFloat(document.getElementById('calc-sales').value) || 0;
    const fixedExpenses = parseFloat(document.getElementById('calc-fixed-expenses').value) || 0;
    const variableCosts = parseFloat(document.getElementById('calc-variable-costs').value) || 0;
    const hours = parseFloat(document.getElementById('calc-hours').value) || 0;
    const hourValue = parseFloat(document.getElementById('calc-hour-value').value) || 0;
    const errorsCount = parseFloat(document.getElementById('calc-errors-count').value) || 0;
    const errorCost = parseFloat(document.getElementById('calc-error-cost').value) || 0;

    
    const laborCost = hours * hourValue;
    const inefficiencyCost = errorsCount * errorCost;
    const realUtility = sales - variableCosts - fixedExpenses - laborCost - inefficiencyCost;
    const margin = sales > 0 ? (realUtility / sales) * 100 : 0;
    const productivity = hours > 0 ? (sales / hours) : 0;

    
    document.getElementById('res-labor-cost').textContent = `$${laborCost.toLocaleString()}`;
    document.getElementById('res-inefficiency-cost').textContent = `$${inefficiencyCost.toLocaleString()}`;
    document.getElementById('res-real-utility').textContent = `$${realUtility.toLocaleString()}`;
    document.getElementById('res-margin').textContent = `${margin.toFixed(1)}%`;
    document.getElementById('res-productivity').textContent = `$${productivity.toFixed(0).toLocaleString()}`;

    
    
    const maxRef = Math.max(sales, laborCost + inefficiencyCost + Math.abs(realUtility), 100);

    const laborPerc = Math.min(100, (laborCost / maxRef) * 100);
    const errorPerc = Math.min(100, (inefficiencyCost / maxRef) * 100);
    const utilityPerc = realUtility > 0 ? Math.min(100, (realUtility / maxRef) * 100) : 0;

    document.getElementById('bar-labor').style.width = `${laborPerc}%`;
    document.getElementById('bar-errors').style.width = `${errorPerc}%`;
    document.getElementById('bar-utility').style.width = `${utilityPerc}%`;

    
    const marginEl = document.getElementById('res-margin');
    if (margin > 30) marginEl.style.color = '#65a30d'; 
    else if (margin > 10) marginEl.style.color = '#5f79ee'; 
    else if (margin > 0) marginEl.style.color = '#eba026'; 
    else marginEl.style.color = '#ef4444'; 
}

function resetCalculator() {
    const inputs = ['calc-sales', 'calc-fixed-expenses', 'calc-variable-costs', 'calc-hours', 'calc-hour-value', 'calc-errors-count', 'calc-error-cost'];
    inputs.forEach(id => document.getElementById(id).value = '');
    updateCalculator();
    showToast('Calculadora reiniciada', 'info');
}

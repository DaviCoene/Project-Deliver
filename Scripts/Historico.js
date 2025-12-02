// HISTORY TABLE

tableBody = document.querySelector('#historyTable tbody');

let orderData = [];

function normalizeStatus(status){
    return status.toLowerCase().replace(/\s/g, '').replace('í','i').replace('ã','a').replace('ç','c');
}

function createRow(data){
    const row = document.createElement('tr');

    // - ID PEDIDO -
    let tdID = document.createElement('td');
    tdID.textContent = data.id;
    row.appendChild(tdID);

    // - STATUS -
    let tdStatus = document.createElement('td');
    let statusSpan = document.createElement('span');

    statusSpan.classList.add('status', normalizeStatus(data.status));
    statusSpan.textContent = data.status;

    tdStatus.appendChild(statusSpan);
    row.appendChild(tdStatus);

    // - ITEM -
    let tdItem = document.createElement('td');

    data.itens.forEach(itemClass => {
        let itemSpan = document.createElement('span');
        itemSpan.classList.add('item', itemClass)
        tdItem.appendChild(itemSpan);
    });
    row.appendChild(tdItem);

    /// - CLIENTE -
    let tdClient = document.createElement('td');
    tdClient.textContent = data.cliente;
    row.appendChild(tdClient);

    return row;
}

tableBody.innerHTML = ''; // Limpar linhas de exemplo

orderData.forEach(data => {
    const newRow = createRow(data);
    tableBody.appendChild(newRow);
});


// QUERY TABLE

const queryTableBody = document.querySelector('#queryTable tbody');

let queryData = [

];

function normalizeService(service) {
    return service.toLowerCase().replace(/\s/g, '').replace('ã', 'a').replace('ç', 'c');
}

function createQueryRow(data) {
    const row = document.createElement('tr');

    let tdID = document.createElement('td');
    tdID.textContent = data.id;
    row.appendChild(tdID);

    let tdItem = document.createElement('td');

    data.itens.forEach(itemClass => {
        let itemSpan = document.createElement('span');
        itemSpan.classList.add('item', itemClass);
        tdItem.appendChild(itemSpan);
    });
    row.appendChild(tdItem);

    let tdService = document.createElement('td');
    let serviceSpan = document.createElement('span');

    serviceSpan.classList.add('status', normalizeService(data.service));
    serviceSpan.textContent = data.service;

    tdService.appendChild(serviceSpan);
    row.appendChild(tdService);

    return row;
}

queryTableBody.innerHTML = ''; 

queryData.forEach(data => {
    const newRow = createQueryRow(data);
    queryTableBody.appendChild(newRow);
});
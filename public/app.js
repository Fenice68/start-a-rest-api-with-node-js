// Client interattivo per testare la REST API Node.js

const API_BASE = '/api';

// Elementi DOM
const itemsList = document.getElementById('items-list');
const btnRefresh = document.getElementById('btn-refresh');
const btnToggleCreate = document.getElementById('btn-toggle-create');
const createFormContainer = document.getElementById('create-form-container');
const formTitle = document.getElementById('form-title');
const itemForm = document.getElementById('item-form');
const itemIdInput = document.getElementById('item-id');
const itemTitleInput = document.getElementById('item-title');
const itemPriceInput = document.getElementById('item-price');
const itemCategoryInput = document.getElementById('item-category');
const itemDescInput = document.getElementById('item-description');
const btnCancelItem = document.getElementById('btn-cancel-item');
const searchInput = document.getElementById('search-input');
const btnCheckHealth = document.getElementById('btn-check-health');
const jsonViewer = document.getElementById('json-viewer');
const responseStatus = document.getElementById('response-status');
const responseMethodUrl = document.getElementById('response-method-url');
const btnCopyJson = document.getElementById('btn-copy-json');
const apiStatusBadge = document.getElementById('api-status-badge');

let currentItems = [];

// Funzione di utilità per visualizzare la risposta HTTP
function displayResponse(method, url, status, data) {
  responseMethodUrl.textContent = `${method} ${url}`;
  responseStatus.textContent = `${status} ${status >= 200 && status < 300 ? 'OK' : 'ERR'}`;
  
  if (status >= 200 && status < 300) {
    responseStatus.className = 'badge badge-success';
  } else {
    responseStatus.className = 'badge badge-danger';
  }

  jsonViewer.textContent = JSON.stringify(data, null, 2);
}

// Chiamata API Health
async function checkHealth() {
  const url = `${API_BASE}/health`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResponse('GET', url, res.status, data);
    
    if (res.ok) {
      apiStatusBadge.className = 'badge badge-success';
      apiStatusBadge.innerHTML = '<span class="status-dot"></span> API Attiva';
    }
  } catch (err) {
    displayResponse('GET', url, 500, { error: err.message });
    apiStatusBadge.className = 'badge badge-danger';
    apiStatusBadge.innerHTML = '<span class="status-dot"></span> Server Non Raggiungibile';
  }
}

// Carica tutti gli articoli
async function fetchItems(search = '') {
  let url = `${API_BASE}/items`;
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }

  itemsList.innerHTML = '<div class="loading-state">Caricamento in corso...</div>';

  try {
    const res = await fetch(url);
    const result = await res.json();
    displayResponse('GET', url, res.status, result);

    if (res.ok && result.success) {
      currentItems = result.data;
      renderItems(currentItems);
    } else {
      itemsList.innerHTML = `<div class="empty-state">Errore: ${result.error || 'Impossibile caricare gli articoli'}</div>`;
    }
  } catch (err) {
    displayResponse('GET', url, 500, { error: err.message });
    itemsList.innerHTML = `<div class="empty-state">Errore di connessione al server: ${err.message}</div>`;
  }
}

// Render lista articoli
function renderItems(items) {
  if (!items || items.length === 0) {
    itemsList.innerHTML = '<div class="empty-state">Nessun articolo trovato. Clicca su "Nuovo Articolo" per aggiungerne uno!</div>';
    return;
  }

  itemsList.innerHTML = items
    .map(
      item => `
      <div class="item-card" data-id="${item.id}">
        <div class="item-info">
          <div class="item-top">
            <span class="item-id">#${item.id}</span>
            <span class="item-title">${escapeHtml(item.title)}</span>
            ${item.category ? `<span class="item-category">${escapeHtml(item.category)}</span>` : ''}
          </div>
          ${item.description ? `<p class="item-desc">${escapeHtml(item.description)}</p>` : ''}
          <div class="item-price">€ ${Number(item.price).toFixed(2)}</div>
        </div>
        <div class="item-actions">
          <button class="btn btn-small btn-secondary" onclick="viewItem(${item.id})">Visualizza</button>
          <button class="btn btn-small btn-outline" onclick="editItem(${item.id})">Modifica</button>
          <button class="btn btn-small btn-danger" onclick="deleteItem(${item.id})">Elimina</button>
        </div>
      </div>
    `
    )
    .join('');
}

// Dettaglio articolo
window.viewItem = async function(id) {
  const url = `${API_BASE}/items/${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResponse('GET', url, res.status, data);
  } catch (err) {
    displayResponse('GET', url, 500, { error: err.message });
  }
};

// Modifica articolo
window.editItem = function(id) {
  const item = currentItems.find(i => i.id === id);
  if (!item) return;

  itemIdInput.value = item.id;
  itemTitleInput.value = item.title;
  itemPriceInput.value = item.price;
  itemCategoryInput.value = item.category || '';
  itemDescInput.value = item.description || '';

  formTitle.textContent = `Modifica Articolo #${item.id}`;
  createFormContainer.classList.remove('hidden');
  itemTitleInput.focus();
};

// Eliminazione articolo
window.deleteItem = async function(id) {
  if (!confirm(`Sei sicuro di voler eliminare l'articolo #${id}?`)) {
    return;
  }

  const url = `${API_BASE}/items/${id}`;
  try {
    const res = await fetch(url, { method: 'DELETE' });
    const data = await res.json();
    displayResponse('DELETE', url, res.status, data);

    if (res.ok) {
      fetchItems(searchInput.value.trim());
    }
  } catch (err) {
    displayResponse('DELETE', url, 500, { error: err.message });
  }
};

// Salva articolo (Crea o Aggiorna)
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = itemIdInput.value;
  const isEditing = Boolean(id);

  const payload = {
    title: itemTitleInput.value.trim(),
    price: parseFloat(itemPriceInput.value),
    category: itemCategoryInput.value.trim(),
    description: itemDescInput.value.trim()
  };

  const url = isEditing ? `${API_BASE}/items/${id}` : `${API_BASE}/items`;
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    displayResponse(method, url, res.status, data);

    if (res.ok) {
      resetForm();
      fetchItems(searchInput.value.trim());
    }
  } catch (err) {
    displayResponse(method, url, 500, { error: err.message });
  }
});

function resetForm() {
  itemIdInput.value = '';
  itemForm.reset();
  formTitle.textContent = 'Crea Nuovo Articolo';
  createFormContainer.classList.add('hidden');
}

// Event Listeners
btnToggleCreate.addEventListener('click', () => {
  if (createFormContainer.classList.contains('hidden')) {
    resetForm();
    createFormContainer.classList.remove('hidden');
    itemTitleInput.focus();
  } else {
    createFormContainer.classList.add('hidden');
  }
});

btnCancelItem.addEventListener('click', resetForm);

btnRefresh.addEventListener('click', () => {
  fetchItems(searchInput.value.trim());
});

btnCheckHealth.addEventListener('click', checkHealth);

let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchItems(e.target.value.trim());
  }, 300);
});

btnCopyJson.addEventListener('click', () => {
  navigator.clipboard.writeText(jsonViewer.textContent).then(() => {
    const orig = btnCopyJson.textContent;
    btnCopyJson.textContent = 'Copiato!';
    setTimeout(() => {
      btnCopyJson.textContent = orig;
    }, 1500);
  });
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inizializzazione automatica
checkHealth();
fetchItems();

// Products page JavaScript - CRUD operations with DataTables

let table;
let currentProductId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeDataTable();
    initializeModals();
    initializeEventListeners();
});

function initializeDataTable() {
    table = $('#productsTable').DataTable({
        ajax: {
            url: '/products/api/list',
            dataSrc: 'products',
            error: function(xhr, error, thrown) {
                showToast('Error al cargar productos', 'error');
            }
        },
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { 
                data: 'descripcion',
                render: function(data) {
                    return data || '<em>Sin descripción</em>';
                }
            },
            { 
                data: 'precio',
                render: function(data) {
                    return '$' + parseFloat(data).toLocaleString('es-CO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            },
            { data: 'cantidad' },
            {
                data: null,
                orderable: false,
                render: function(data, type, row) {
                    return '<button class="btn btn-edit" onclick="editProduct(' + row.id + ')" title="Modificar">✏️ Modificar</button>' +
                           '<button class="btn btn-delete" onclick="confirmDelete(' + row.id + ', \'' + row.nombre.replace(/'/g, "\\'") + '\')" title="Eliminar">🗑️ Eliminar</button>';
                }
            }
        ],
        pageLength: 10,
        language: {
            search: "Buscar por nombre:",
            lengthMenu: "Mostrar _MENU_ productos",
            info: "Mostrando _START_ a _END_ de _TOTAL_ productos",
            infoEmpty: "No hay productos disponibles",
            infoFiltered: "(filtrado de _MAX_ productos totales)",
            zeroRecords: "No se encontraron productos",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        },
        order: [[0, 'desc']]
    });
}

function initializeModals() {
    const productModal = document.getElementById('productModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeBtns = document.querySelectorAll('.close');
    
    closeBtns.forEach(btn => {
        btn.onclick = function() {
            closeModals();
        };
    });
    
    window.onclick = function(event) {
        if (event.target === productModal || event.target === deleteModal) {
            closeModals();
        }
    };
}

function initializeEventListeners() {
    document.getElementById('btnAddProduct').addEventListener('click', openCreateModal);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('btnCancel').addEventListener('click', closeModals);
    document.getElementById('btnCancelDelete').addEventListener('click', closeModals);
    document.getElementById('closeDelete').addEventListener('click', closeModals);
    document.getElementById('btnConfirmDelete').addEventListener('click', handleDelete);
    
    const form = document.getElementById('productForm');
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity('Por favor, complete este campo');
            } else if (this.validity.typeMismatch) {
                this.setCustomValidity('Por favor, ingrese un valor válido');
            } else if (this.validity.rangeUnderflow) {
                this.setCustomValidity('El valor debe ser mayor o igual a ' + this.min);
            }
        });
        input.addEventListener('input', function() {
            this.setCustomValidity('');
        });
    });
}

function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Agregar Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    currentProductId = null;
    clearFormErrors();
    document.getElementById('productModal').style.display = 'block';
}

async function editProduct(id) {
    try {
        const response = await fetch('/products/' + id);
        if (!response.ok) throw new Error('Error al obtener producto');
        
        const product = await response.json();
        
        console.log('Producto recibido:', product);
        console.log('Precio del producto:', product.precio, typeof product.precio);
        
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productId').value = product.id;
        document.getElementById('nombre').value = product.nombre;
        document.getElementById('descripcion').value = product.descripcion || '';
        const precioInput = document.getElementById('precio');
        precioInput.value = product.precio;
        console.log('Valor asignado al input precio:', precioInput.value);
        document.getElementById('cantidad').value = product.cantidad;
        
        currentProductId = id;
        clearFormErrors();
        document.getElementById('productModal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar el producto', 'error');
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    clearFormErrors();
    
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value)
    };
    
    if (formData.nombre.length < 3) {
        showFieldError('nombre', 'El nombre debe tener al menos 3 caracteres');
        return;
    }
    
    if (formData.precio <= 0 || isNaN(formData.precio)) {
        showFieldError('precio', 'El precio debe ser mayor a 0');
        return;
    }
    
    if (formData.cantidad < 0 || isNaN(formData.cantidad)) {
        showFieldError('cantidad', 'La cantidad debe ser un número positivo');
        return;
    }
    
    try {
        const url = currentProductId ? '/products/' + currentProductId : '/products';
        const method = currentProductId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message, 'success');
            closeModals();
            table.ajax.reload();
        } else {
            showToast(data.error || 'Error al guardar el producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al comunicarse con el servidor', 'error');
    }
}

function confirmDelete(id, name) {
    currentProductId = id;
    document.getElementById('deleteProductName').textContent = name;
    document.getElementById('deleteModal').style.display = 'block';
}

async function handleDelete() {
    if (!currentProductId) return;
    
    try {
        const response = await fetch('/products/' + currentProductId, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message, 'success');
            closeModals();
            table.ajax.reload();
        } else {
            showToast(data.error || 'Error al eliminar el producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al comunicarse con el servidor', 'error');
    }
}

function closeModals() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('deleteModal').style.display = 'none';
    currentProductId = null;
}

function showFieldError(fieldId, message) {
    const errorSpan = document.getElementById(fieldId + '-error');
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
}

function clearFormErrors() {
    const errorSpans = document.querySelectorAll('.field-error');
    errorSpans.forEach(span => {
        span.textContent = '';
        span.style.display = 'none';
    });
}

function showToast(message, type) {
    type = type || 'info';
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-message">' + message + '</span>';
    
    container.appendChild(toast);
    
    setTimeout(function() { toast.classList.add('show'); }, 10);
    
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { container.removeChild(toast); }, 300);
    }, 3000);
}

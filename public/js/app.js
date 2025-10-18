document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('profileForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form) return;
    
    const validators = {
        tipoDocumento: {
            required: true,
            validate: (value) => {
                const validTypes = ['CC', 'TI', 'CE', 'PAS', 'NIT'];
                return validTypes.includes(value);
            },
            message: 'Debes seleccionar un tipo de documento válido'
        },
        
        numeroDocumento: {
            required: true,
            validate: (value) => {
                const regex = /^[0-9]{6,15}$/;
                return regex.test(value);
            },
            message: 'El número de documento debe tener entre 6 y 15 dígitos'
        },
        
        direccion: {
            required: false,
            validate: (value) => {
                if (!value) return true;
                return value.length >= 5 && value.length <= 100;
            },
            message: 'La dirección debe tener entre 5 y 100 caracteres'
        },
        
        telefono: {
            required: false,
            validate: (value) => {
                if (!value) return true;
                const regex = /^[+]?[0-9\s\-()]+$/;
                const digitsOnly = value.replace(/[^\d]/g, '');
                return regex.test(value) && digitsOnly.length >= 7;
            },
            message: 'El teléfono debe tener al menos 7 dígitos y solo contener números, espacios, guiones, paréntesis y +'
        }
    };
    
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + '-error');
        
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + '-error');
        
        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        if (!validator) return true;
        
        if (validator.required && (!value || value.trim() === '')) {
            showError(fieldName, 'Este campo es obligatorio');
            return false;
        }
        
        if (value && value.trim() !== '' && !validator.validate(value)) {
            showError(fieldName, validator.message);
            return false;
        }
        
        clearError(fieldName);
        return true;
    }
    
    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearError(fieldName);
                }
            });
        }
    });
    
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        Object.keys(validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const fieldValid = validateField(fieldName, field.value);
                if (!fieldValid) isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            return false;
        }
        
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
    });
    
    const telefonoField = document.getElementById('telefono');
    if (telefonoField) {
        telefonoField.addEventListener('input', function() {
            let value = this.value.replace(/[^\d+\s\-()]/g, '');
            this.value = value;
        });
    }
    
    const numeroDocumentoField = document.getElementById('numeroDocumento');
    if (numeroDocumentoField) {
        numeroDocumentoField.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });
    }
    
    const infoButtons = document.querySelectorAll('[data-toggle-info]');
    infoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-toggle-info');
            const target = document.getElementById(targetId);
            if (target) {
                target.style.display = target.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
});

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Texto copiado al portapapeles', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Texto copiado al portapapeles', 'success');
    } catch (err) {
        showNotification('No se pudo copiar el texto', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
});
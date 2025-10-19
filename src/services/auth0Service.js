import dotenv from 'dotenv';

dotenv.config();

class Auth0Service {
  constructor() {
    this.domain = process.env.AUTH0_ISSUER_BASE_URL;
    this.clientId = process.env.AUTH0_M2M_CLIENT_ID || process.env.AUTH0_CLIENT_ID;
    this.clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET || process.env.AUTH0_CLIENT_SECRET;
    this.audience = `${this.domain}/api/v2/`;
    this.tokenCache = null;
    this.tokenExpiry = null;
  }

  async getManagementToken() {
    if (this.tokenCache && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.tokenCache;
    }

    try {
      console.log('🔄 Obteniendo token de Auth0 Management API...');
      console.log('📍 Domain:', this.domain);
      console.log('📍 Client ID:', this.clientId);
      console.log('📍 Audience:', this.audience);
      
      const response = await fetch(`${this.domain}/oauth/token`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: this.audience,
          grant_type: 'client_credentials'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error HTTP:', response.status, response.statusText);
        console.error('❌ Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Token obtenido exitosamente. Expira en:', data.expires_in, 'segundos');

      this.tokenCache = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.tokenCache;
    } catch (error) {
      console.error('❌ Error obteniendo token de Management API:', error.message);
      throw new Error('No se pudo obtener el token de acceso a Auth0');
    }
  }

  async updateUserMetadata(userId, userMetadata) {
    try {
      const token = await this.getManagementToken();
      console.log('🔄 Actualizando metadata para usuario:', userId);
      console.log('📄 Datos a actualizar:', JSON.stringify(userMetadata, null, 2));
      
      const response = await fetch(`${this.audience}users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_metadata: userMetadata
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error actualizando usuario:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Usuario actualizado exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error actualizando metadatos del usuario:', error.message);
      throw new Error('No se pudieron actualizar los datos del usuario');
    }
  }

  async getUserById(userId) {
    try {
      const token = await this.getManagementToken();
      console.log('🔄 Obteniendo información del usuario:', userId);
      
      const response = await fetch(`${this.audience}users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error obteniendo usuario:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Información de usuario obtenida exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error obteniendo información del usuario:', error.message);
      throw new Error('No se pudo obtener la información del usuario');
    }
  }

  validateUserData(userData) {
    const errors = [];

    if (userData.tipoDocumento) {
      const tiposValidos = ['CC', 'TI', 'CE', 'PAS', 'NIT'];
      if (!tiposValidos.includes(userData.tipoDocumento)) {
        errors.push('Tipo de documento inválido');
      }
    }

    if (userData.numeroDocumento) {
      if (!/^[0-9]+$/.test(userData.numeroDocumento)) {
        errors.push('El número de documento debe contener solo números');
      }
      if (userData.numeroDocumento.length < 6 || userData.numeroDocumento.length > 15) {
        errors.push('El número de documento debe tener entre 6 y 15 dígitos');
      }
    }

    if (userData.telefono) {
      if (!/^[+]?[0-9\s\-()]+$/.test(userData.telefono)) {
        errors.push('El teléfono debe contener solo números, espacios, guiones, paréntesis y el símbolo +');
      }
      if (userData.telefono.replace(/[^\d]/g, '').length < 7) {
        errors.push('El teléfono debe tener al menos 7 dígitos');
      }
    }

    if (userData.direccion) {
      if (userData.direccion.length < 5 || userData.direccion.length > 100) {
        errors.push('La dirección debe tener entre 5 y 100 caracteres');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitizeUserData(userData) {
    const sanitized = {};

    if (userData.tipoDocumento) {
      sanitized.tipoDocumento = userData.tipoDocumento.toUpperCase().trim();
    }

    if (userData.numeroDocumento) {
      sanitized.numeroDocumento = userData.numeroDocumento.trim();
    }

    if (userData.telefono) {
      sanitized.telefono = userData.telefono.trim();
    }

    if (userData.direccion) {
      sanitized.direccion = userData.direccion.trim();
    }

    return sanitized;
  }
}

export default new Auth0Service();

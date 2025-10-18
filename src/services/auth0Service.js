import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class Auth0Service {
  constructor() {
    this.domain = process.env.AUTH0_ISSUER_BASE_URL;
    this.clientId = process.env.AUTH0_CLIENT_ID;
    this.clientSecret = process.env.AUTH0_CLIENT_SECRET;
    this.audience = `${this.domain}/api/v2/`;
    this.tokenCache = null;
    this.tokenExpiry = null;
  }

  /**
   * Obtiene un token de acceso para la Management API de Auth0
   */
  async getManagementToken() {
    // Si tenemos un token válido en cache, lo retornamos
    if (this.tokenCache && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.tokenCache;
    }

    try {
      const response = await axios.post(`${this.domain}/oauth/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
        grant_type: 'client_credentials'
      });

      this.tokenCache = response.data.access_token;
      // El token expira en una hora menos 5 minutos para seguridad
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      return this.tokenCache;
    } catch (error) {
      console.error('Error obteniendo token de Management API:', error.response?.data || error.message);
      throw new Error('No se pudo obtener el token de acceso a Auth0');
    }
  }

  /**
   * Actualiza los metadatos del usuario en Auth0
   * @param {string} userId - ID del usuario en Auth0
   * @param {object} userMetadata - Metadatos a actualizar
   */
  async updateUserMetadata(userId, userMetadata) {
    try {
      const token = await this.getManagementToken();
      
      const response = await axios.patch(
        `${this.audience}users/${userId}`,
        {
          user_metadata: userMetadata
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error actualizando metadatos del usuario:', error.response?.data || error.message);
      throw new Error('No se pudieron actualizar los datos del usuario');
    }
  }

  /**
   * Obtiene la información completa del usuario desde Auth0
   * @param {string} userId - ID del usuario en Auth0
   */
  async getUserById(userId) {
    try {
      const token = await this.getManagementToken();
      
      const response = await axios.get(
        `${this.audience}users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error.response?.data || error.message);
      throw new Error('No se pudo obtener la información del usuario');
    }
  }

  /**
   * Valida los datos de entrada antes de enviarlos a Auth0
   * @param {object} userData - Datos del usuario a validar
   */
  validateUserData(userData) {
    const errors = [];

    // Validar tipo de documento
    if (userData.tipoDocumento) {
      const tiposValidos = ['CC', 'TI', 'CE', 'PAS', 'NIT'];
      if (!tiposValidos.includes(userData.tipoDocumento)) {
        errors.push('Tipo de documento inválido');
      }
    }

    // Validar número de documento
    if (userData.numeroDocumento) {
      if (!/^[0-9]+$/.test(userData.numeroDocumento)) {
        errors.push('El número de documento debe contener solo números');
      }
      if (userData.numeroDocumento.length < 6 || userData.numeroDocumento.length > 15) {
        errors.push('El número de documento debe tener entre 6 y 15 dígitos');
      }
    }

    // Validar teléfono
    if (userData.telefono) {
      if (!/^[+]?[0-9\s\-()]+$/.test(userData.telefono)) {
        errors.push('El teléfono debe contener solo números, espacios, guiones, paréntesis y el símbolo +');
      }
      if (userData.telefono.replace(/[^\d]/g, '').length < 7) {
        errors.push('El teléfono debe tener al menos 7 dígitos');
      }
    }

    // Validar dirección
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

  /**
   * Sanitiza los datos de entrada
   * @param {object} userData - Datos del usuario a sanitizar
   */
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
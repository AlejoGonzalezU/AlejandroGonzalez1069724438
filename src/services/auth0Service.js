import dotenv from 'dotenv';

dotenv.config();

/**
 * Auth0Service - Service layer for Auth0 Management API interactions
 * Handles authentication, user data retrieval, and user metadata updates
 * Implements token caching to optimize API calls
 */
class Auth0Service {
  /**
   * Constructor - Initializes the Auth0 service with environment variables
   * Sets up token caching mechanism for Management API access
   */
  constructor() {
    this.domain = process.env.AUTH0_ISSUER_BASE_URL;
    // Use M2M (Machine to Machine) credentials for Management API, fallback to regular credentials
    this.clientId = process.env.AUTH0_M2M_CLIENT_ID || process.env.AUTH0_CLIENT_ID;
    this.clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET || process.env.AUTH0_CLIENT_SECRET;
    this.audience = `${this.domain}/api/v2/`;
    this.tokenCache = null; // Cached access token
    this.tokenExpiry = null; // Token expiration timestamp
  }

  /**
   * Obtains an access token for Auth0 Management API
   * Uses cached token if available and not expired
   * Token is cached for (expires_in - 5 minutes) to ensure validity
   * 
   * @returns {Promise<string>} Access token for Management API
   * @throws {Error} If token acquisition fails
   */
  async getManagementToken() {
    // Return cached token if still valid
    if (this.tokenCache && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.tokenCache;
    }

    try {
      // Request new token using client credentials flow
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
        console.error('Error:', response.status, response.statusText);
        console.error('Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Cache token with 5-minute buffer before expiration
      this.tokenCache = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.tokenCache;
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error('No se pudo obtener el token de acceso a Auth0');
    }
  }

  /**
   * Updates user metadata in Auth0 user profile
   * User metadata is custom data stored with the user profile
   * 
   * @param {string} userId - Auth0 user ID (format: provider|id, e.g., 'google-oauth2|123456')
   * @param {Object} userMetadata - Object containing metadata fields to update
   * @param {string} [userMetadata.tipoDocumento] - Document type (CC, TI, CE, PAS, NIT)
   * @param {string} [userMetadata.numeroDocumento] - Document number
   * @param {string} [userMetadata.direccion] - User address
   * @param {string} [userMetadata.telefono] - Phone number
   * @returns {Promise<Object>} Updated user object from Auth0
   * @throws {Error} If update fails
   */
  async updateUserMetadata(userId, userMetadata) {
    try {
      const token = await this.getManagementToken();
      
      // PATCH request to update user metadata
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
        console.error('Error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error('No se pudieron actualizar los datos del usuario');
    }
  }

  /**
   * Retrieves complete user information from Auth0 by user ID
   * Includes profile data, metadata, and Auth0-specific fields
   * 
   * @param {string} userId - Auth0 user ID (format: provider|id)
   * @returns {Promise<Object>} Complete user object from Auth0
   * @returns {string} return.email - User email
   * @returns {string} return.name - User full name
   * @returns {Object} return.user_metadata - Custom user metadata
   * @throws {Error} If user retrieval fails
   */
  async getUserById(userId) {
    try {
      const token = await this.getManagementToken();
      
      // GET request to retrieve user data
      const response = await fetch(`${this.audience}users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error('No se pudo obtener la información del usuario');
    }
  }

  /**
   * Validates user data against business rules
   * Performs comprehensive validation for all user metadata fields
   * 
   * @param {Object} userData - User data to validate
   * @param {string} [userData.tipoDocumento] - Document type to validate
   * @param {string} [userData.numeroDocumento] - Document number to validate
   * @param {string} [userData.telefono] - Phone number to validate
   * @param {string} [userData.direccion] - Address to validate
   * @returns {Object} Validation result
   * @returns {boolean} return.isValid - True if all validations pass
   * @returns {string[]} return.errors - Array of error messages
   */
  validateUserData(userData) {
    const errors = [];

    // Validate document type
    if (userData.tipoDocumento) {
      const tiposValidos = ['CC', 'TI', 'CE', 'PAS', 'NIT'];
      if (!tiposValidos.includes(userData.tipoDocumento)) {
        errors.push('Tipo de documento inválido');
      }
    }

    // Validate document number (only digits, 6-15 chars)
    if (userData.numeroDocumento) {
      if (!/^[0-9]+$/.test(userData.numeroDocumento)) {
        errors.push('El número de documento debe contener solo números');
      }
      if (userData.numeroDocumento.length < 6 || userData.numeroDocumento.length > 15) {
        errors.push('El número de documento debe tener entre 6 y 15 dígitos');
      }
    }

    // Validate phone number (digits, spaces, dashes, parentheses, plus sign)
    if (userData.telefono) {
      if (!/^[+]?[0-9\s\-()]+$/.test(userData.telefono)) {
        errors.push('El teléfono debe contener solo números, espacios, guiones, paréntesis y el símbolo +');
      }
      // Must have at least 7 digits (ignoring formatting chars)
      if (userData.telefono.replace(/[^\d]/g, '').length < 7) {
        errors.push('El teléfono debe tener al menos 7 dígitos');
      }
    }

    // Validate address length
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
   * Sanitizes user data by trimming whitespace and normalizing formats
   * Prepares data for storage in Auth0
   * 
   * @param {Object} userData - Raw user data from form input
   * @param {string} [userData.tipoDocumento] - Document type to sanitize
   * @param {string} [userData.numeroDocumento] - Document number to sanitize
   * @param {string} [userData.telefono] - Phone number to sanitize
   * @param {string} [userData.direccion] - Address to sanitize
   * @returns {Object} Sanitized user data object
   */
  sanitizeUserData(userData) {
    const sanitized = {};

    // Normalize document type to uppercase and trim
    if (userData.tipoDocumento) {
      sanitized.tipoDocumento = userData.tipoDocumento.toUpperCase().trim();
    }

    // Trim document number
    if (userData.numeroDocumento) {
      sanitized.numeroDocumento = userData.numeroDocumento.trim();
    }

    // Trim phone number
    if (userData.telefono) {
      sanitized.telefono = userData.telefono.trim();
    }

    // Trim address
    if (userData.direccion) {
      sanitized.direccion = userData.direccion.trim();
    }

    return sanitized;
  }
}

// Export singleton instance
export default new Auth0Service();

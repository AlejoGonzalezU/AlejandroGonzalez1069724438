import auth0Service from '../services/auth0Service.js';

/**
 * ProfileController - Handles all profile-related HTTP requests
 * Manages user profile viewing, editing, and updating operations
 * Integrates with Auth0 service layer for data persistence
 */
class ProfileController {
  /**
   * Home page handler
   * Displays welcome page with authentication-aware content
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.oidc - OpenID Connect data from auth middleware
   * @param {Object} req.oidc.user - Authenticated user object (if logged in)
   * @param {Object} res - Express response object
   * @returns {void} Renders the index view
   */
  async home(req, res) {
    try {
      res.render('index', { 
        user: req.oidc.user,
        title: 'Inicio - Auth0 App',
        currentPage: 'home'
      });
    } catch (error) {
      console.error('Error en home:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        title: 'Error'
      });
    }
  }

  /**
   * User profile page handler
   * Retrieves and displays complete user information from Auth0
   * Requires authentication
   * 
   * @param {Object} req - Express request object
   * @param {Function} req.oidc.isAuthenticated - Function to check auth status
   * @param {Object} req.oidc.user - Current user object
   * @param {string} req.oidc.user.sub - Auth0 user ID
   * @param {Object} res - Express response object
   * @returns {void} Renders profile view or redirects to home if not authenticated
   */
  async profile(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.redirect('/');
      }

      const userId = req.oidc.user.sub;
      const userInfo = await auth0Service.getUserById(userId);

      res.render('profile', { 
        user: userInfo,
        title: 'Mi Perfil',
        currentPage: 'profile'
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.render('profile', { 
        user: req.oidc.user,
        error: 'No se pudo cargar la información actualizada del perfil',
        title: 'Mi Perfil',
        currentPage: 'profile'
      });
    }
  }

  /**
   * Edit profile form handler (GET)
   * Displays form pre-populated with current user metadata
   * Requires authentication
   * 
   * @param {Object} req - Express request object
   * @param {Function} req.oidc.isAuthenticated - Function to check auth status
   * @param {Object} req.oidc.user - Current user object
   * @param {string} req.oidc.user.sub - Auth0 user ID
   * @param {Object} res - Express response object
   * @returns {void} Renders edit form view
   */
  async editForm(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.redirect('/');
      }

      const userId = req.oidc.user.sub;
      const userInfo = await auth0Service.getUserById(userId);

      res.render('editProfile', { 
        user: userInfo,
        meta: userInfo.user_metadata || {},
        errors: [],
        success: false,
        title: 'Editar Perfil',
        currentPage: 'editProfile'
      });
    } catch (error) {
      console.error('Error mostrando formulario de edición:', error);
      res.render('editProfile', { 
        user: req.oidc.user,
        meta: req.oidc.user.user_metadata || {},
        errors: ['No se pudo cargar la información del perfil'],
        success: false,
        title: 'Editar Perfil',
        currentPage: 'editProfile'
      });
    }
  }

  /**
   * Update profile handler (POST)
   * Processes form submission, validates data, and updates Auth0 user metadata
   * Requires authentication
   * 
   * @param {Object} req - Express request object
   * @param {Function} req.oidc.isAuthenticated - Function to check auth status
   * @param {Object} req.oidc.user - Current user object
   * @param {string} req.oidc.user.sub - Auth0 user ID
   * @param {Object} req.body - Form data from POST request
   * @param {string} req.body.tipoDocumento - Document type from form
   * @param {string} req.body.numeroDocumento - Document number from form
   * @param {string} req.body.direccion - Address from form
   * @param {string} req.body.telefono - Phone number from form
   * @param {Object} res - Express response object
   * @returns {void} Re-renders edit form with success/error messages
   */
  async updateProfile(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.redirect('/');
      }

      const userId = req.oidc.user.sub;
      
      // Extract form data
      const userData = {
        tipoDocumento: req.body.tipoDocumento,
        numeroDocumento: req.body.numeroDocumento,
        direccion: req.body.direccion,
        telefono: req.body.telefono
      };

      // Sanitize input data
      const sanitizedData = auth0Service.sanitizeUserData(userData);
      
      // Validate sanitized data
      const validation = auth0Service.validateUserData(sanitizedData);
      
      // If validation fails, return form with errors
      if (!validation.isValid) {
        const userInfo = await auth0Service.getUserById(userId);
        return res.render('editProfile', {
          user: userInfo,
          meta: { ...userInfo.user_metadata, ...sanitizedData },
          errors: validation.errors,
          success: false,
          title: 'Editar Perfil',
          currentPage: 'editProfile'
        });
      }

      // Update user metadata in Auth0
      await auth0Service.updateUserMetadata(userId, sanitizedData);
      
      // Retrieve updated user data
      const updatedUser = await auth0Service.getUserById(userId);

      // Return form with success message
      res.render('editProfile', {
        user: updatedUser,
        meta: updatedUser.user_metadata || {},
        errors: [],
        success: 'Perfil actualizado exitosamente',
        title: 'Editar Perfil',
        currentPage: 'editProfile'
      });

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      
      // Try to show form with error message
      try {
        const userInfo = await auth0Service.getUserById(req.oidc.user.sub);
        res.render('editProfile', {
          user: userInfo,
          meta: { ...userInfo.user_metadata, ...req.body },
          errors: ['Error al actualizar el perfil. Por favor, intenta nuevamente.'],
          success: false,
          title: 'Editar Perfil',
          currentPage: 'editProfile'
        });
      } catch (innerError) {
        // Fallback if we can't even retrieve user info
        res.render('editProfile', {
          user: req.oidc.user,
          meta: req.body,
          errors: ['Error al actualizar el perfil. Por favor, intenta nuevamente.'],
          success: false,
          title: 'Editar Perfil',
          currentPage: 'editProfile'
        });
      }
    }
  }

  /**
   * 404 Not Found handler
   * Displays error page for non-existent routes
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {void} Renders error view with 404 status
   */
  notFound(req, res) {
    res.status(404).render('error', {
      message: 'Página no encontrada',
      title: 'Error 404'
    });
  }

  /**
   * Global error handler middleware
   * Catches and displays application errors
   * 
   * @param {Error} err - Error object
   * @param {number} [err.status] - HTTP status code
   * @param {string} err.message - Error message
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   * @returns {void} Renders error view with appropriate status code
   */
  error(err, req, res, next) {
    console.error('Error general:', err);
    res.status(err.status || 500).render('error', {
      message: err.message || 'Error interno del servidor',
      title: 'Error'
    });
  }
}

// Export singleton instance
export default new ProfileController();

import auth0Service from '../services/auth0Service.js';

class ProfileController {
  /**
   * Muestra la página principal
   */
  async home(req, res) {
    try {
      res.render('index', { 
        user: req.oidc.user,
        title: 'Inicio - Auth0 App'
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
   * Muestra el perfil del usuario
   */
  async profile(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.redirect('/');
      }

      // Obtener información actualizada del usuario desde Auth0
      const userId = req.oidc.user.sub;
      const userInfo = await auth0Service.getUserById(userId);

      res.render('profile', { 
        user: userInfo,
        title: 'Mi Perfil'
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.render('profile', { 
        user: req.oidc.user,
        error: 'No se pudo cargar la información actualizada del perfil',
        title: 'Mi Perfil'
      });
    }
  }

  /**
   * Muestra el formulario de edición de perfil
   */
  async editForm(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.redirect('/');
      }

      const userId = req.oidc.user.sub;
      const userInfo = await auth0Service.getUserById(userId);

      res.render('edit', { 
        user: userInfo,
        meta: userInfo.user_metadata || {},
        errors: [],
        success: false,
        title: 'Editar Perfil'
      });
    } catch (error) {
      console.error('Error mostrando formulario de edición:', error);
      res.render('edit', { 
        user: req.oidc.user,
        meta: req.oidc.user.user_metadata || {},
        errors: ['No se pudo cargar la información del perfil'],
        success: false,
        title: 'Editar Perfil'
      });
    }
  }

  /**
   * Procesa la actualización del perfil
   */
  async updateProfile(req, res) {
    try {
      if (!req.oidc.isAuthenticated()) {
        return res.redirect('/');
      }

      const userId = req.oidc.user.sub;
      const userData = {
        tipoDocumento: req.body.tipoDocumento,
        numeroDocumento: req.body.numeroDocumento,
        direccion: req.body.direccion,
        telefono: req.body.telefono
      };

      // Sanitizar datos
      const sanitizedData = auth0Service.sanitizeUserData(userData);

      // Validar datos
      const validation = auth0Service.validateUserData(sanitizedData);
      
      if (!validation.isValid) {
        const userInfo = await auth0Service.getUserById(userId);
        return res.render('edit', {
          user: userInfo,
          meta: { ...userInfo.user_metadata, ...sanitizedData },
          errors: validation.errors,
          success: false,
          title: 'Editar Perfil'
        });
      }

      // Actualizar en Auth0
      await auth0Service.updateUserMetadata(userId, sanitizedData);

      // Obtener información actualizada
      const updatedUser = await auth0Service.getUserById(userId);

      res.render('edit', {
        user: updatedUser,
        meta: updatedUser.user_metadata || {},
        errors: [],
        success: 'Perfil actualizado exitosamente',
        title: 'Editar Perfil'
      });

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      
      try {
        const userInfo = await auth0Service.getUserById(req.oidc.user.sub);
        res.render('edit', {
          user: userInfo,
          meta: { ...userInfo.user_metadata, ...req.body },
          errors: ['Error al actualizar el perfil. Por favor, intenta nuevamente.'],
          success: false,
          title: 'Editar Perfil'
        });
      } catch (innerError) {
        res.render('edit', {
          user: req.oidc.user,
          meta: req.body,
          errors: ['Error al actualizar el perfil. Por favor, intenta nuevamente.'],
          success: false,
          title: 'Editar Perfil'
        });
      }
    }
  }

  /**
   * Maneja errores 404
   */
  notFound(req, res) {
    res.status(404).render('error', {
      message: 'Página no encontrada',
      title: 'Error 404'
    });
  }

  /**
   * Maneja errores generales
   */
  error(err, req, res, next) {
    console.error('Error general:', err);
    res.status(err.status || 500).render('error', {
      message: err.message || 'Error interno del servidor',
      title: 'Error'
    });
  }
}

export default new ProfileController();
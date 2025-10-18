# Aplicación Auth0 con Clean Architecture

Esta es una aplicación Node.js que utiliza Auth0 para autenticación y permite a los usuarios gestionar su información personal a través de formularios bonitos y funcionales.

## 🚀 Características

- ✅ **Autenticación segura** con Auth0
- ✅ **Formularios responsivos** y bonitos
- ✅ **Validaciones del lado cliente y servidor**
- ✅ **Arquitectura limpia** organizada por capas
- ✅ **Gestión de metadatos de usuario**
- ✅ **Interfaz moderna** con CSS custom
- ✅ **Experiencia de usuario optimizada**

## 📁 Estructura del Proyecto

```
Application/
├── src/
│   ├── controllers/     # Lógica de controladores
│   ├── services/        # Servicios de negocio
│   └── routes/          # Definición de rutas
├── views/               # Plantillas EJS
├── public/
│   ├── css/            # Estilos CSS
│   └── js/             # JavaScript del frontend
├── server.js           # Archivo principal del servidor
└── package.json        # Dependencias y configuración
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

El archivo `.env` ya está configurado con tus credenciales de Auth0:

### 3. Ejecutar la aplicación

Para usar la versión original:
```bash
node server.js
```

## 🎨 Características de la Interfaz

### Formularios estilizados
- **Diseño moderno** con gradientes y sombras
- **Validaciones en tiempo real** con JavaScript
- **Mensajes de error claros** y bien posicionados
- **Estados de carga** en botones
- **Responsive design** para móviles y desktop

### Validaciones Implementadas
- **Tipo de documento**: Selección obligatoria entre CC, TI, CE, PAS, NIT
- **Número de documento**: Entre 6 y 15 dígitos, solo números
- **Dirección**: Entre 5 y 100 caracteres (opcional)
- **Teléfono**: Mínimo 7 dígitos, formato flexible (opcional)

## 🏗️ Clean Architecture (Simplificada)

### Controladores (`src/controllers/`)
- **profileController.js**: Maneja la lógica de las rutas de perfil
- Separación clara entre lógica de presentación y negocio

### Servicios (`src/services/`)
- **auth0Service.js**: Interactúa con la API de Auth0 Management
- Validaciones de datos de negocio
- Manejo de tokens de acceso

### Rutas (`src/routes/`)
- **index.js**: Define todas las rutas de la aplicación
- Organización clara de endpoints

## 📱 Páginas Disponibles

### `/` - Página Principal
- Bienvenida diferenciada para usuarios autenticados/no autenticados
- Navegación clara hacia otras secciones

### `/profile` - Perfil del Usuario
- Visualización completa de los datos del usuario
- Información separada por categorías
- JSON completo para desarrolladores

### `/edit` - Editar Perfil
- Formulario completo con validaciones
- Campos pre-poblados con datos existentes
- Validaciones del lado cliente y servidor

## 🔧 Funcionalidades Técnicas

### Gestión de Metadatos Auth0
- Actualización de `user_metadata` a través de Management API
- Obtención de tokens de acceso automática
- Cache de tokens para optimización

### Validaciones Robustas
- **Cliente**: JavaScript con validaciones en tiempo real
- **Servidor**: Validaciones en el servicio antes de enviar a Auth0
- Sanitización de datos de entrada

### Manejo de Errores
- Páginas de error personalizadas
- Mensajes de error claros para el usuario
- Logging de errores en servidor

## 🎯 Próximas Mejoras

- [ ] Subida de fotos de perfil
- [ ] Más campos de información personal
- [ ] Notificaciones por email
- [ ] Historial de cambios
- [ ] API REST para uso externo

## 🚨 Notas Importantes

1. **Seguridad**: Las credenciales de Auth0 están en el archivo `.env`. En producción, usa variables de entorno seguras.

2. **Management API**: Para que funcione la edición de perfil, asegúrate de que tu aplicación Auth0 tenga permisos para la Management API.

3. **Archivos nuevos**: Se crearon versiones mejoradas de las vistas con sufijo `-new`. Para usar la versión mejorada, renombra:
   - `index-new.ejs` → `index.ejs`
   - `profile-new.ejs` → `profile.ejs`
   - `edit-new.ejs` → `edit.ejs`

## 📞 Soporte

Si encuentras algún problema o tienes preguntas sobre la implementación, revisa:

1. Los logs del servidor en la consola
2. La configuración de Auth0 en el dashboard
3. Los permisos de la Management API
4. Las validaciones en el navegador (F12 → Console)

¡Disfruta tu nueva aplicación Auth0 con formularios bonitos! 🎉
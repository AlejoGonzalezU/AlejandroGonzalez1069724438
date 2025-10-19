# Aplicación ASW ITM 2025-II

Esta es una aplicación Node.js que utiliza Auth0 para autenticación y permite a los usuarios gestionar su información personal a través de formularios estilizados y funcionales.

## 🚀 Características

- ✅ **Autenticación segura** con Auth0
- ✅ **Formularios responsivos** y estilizados
- ✅ **Validaciones del lado cliente y servidor**
- ✅ **Arquitectura limpia** organizada por capas
- ✅ **Gestión de metadatos de usuario**
- ✅ **Interfaz moderna** con CSS custom
- ✅ **Experiencia de usuario optimizada**
- ✅ **Auth0 Management API** integrada con credenciales M2M
- ✅ **Fetch API nativo** (sin dependencias externas de HTTP)
- ✅ **Código completamente documentado** en inglés

## 📁 Estructura del Proyecto

```
Application/
├── src/
│   ├── controllers/     # Lógica de controladores
│   │   └── profileController.js
│   ├── services/        # Servicios de negocio
│   │   └── auth0Service.js
│   └── routes/          # Definición de rutas
│       └── index.js
├── views/               # Plantillas EJS
│   ├── index.ejs       # Página principal
│   ├── profile.ejs     # Vista de perfil
│   ├── edit.ejs        # Formulario de edición
│   ├── error.ejs       # Página de errores
│   └── partials/       # Componentes reutilizables
│       └── nav.ejs     # Navegación dinámica
├── public/
│   ├── css/            # Estilos CSS
│   │   └── styles.css
│   └── js/             # JavaScript del frontend
│       └── app.js
├── server.js           # Archivo principal del servidor
├── .env                # Variables de entorno (no versionado)
├── .env.example        # Ejemplo de configuración
└── package.json        # Dependencias y configuración
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example` y configura las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Configuración de Auth0 para autenticación
AUTH0_SECRET=your-random-secret-string
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Credenciales de Auth0 Management API (M2M)
AUTH0_M2M_CLIENT_ID=your-m2m-client-id
AUTH0_M2M_CLIENT_SECRET=your-m2m-client-secret
AUTH0_AUDIENCE=https://your-tenant.auth0.com
```

### 3. Configurar Auth0 Management API

**⚠️ Paso crítico para que funcione la edición de perfiles:**

1. Ve a tu [Dashboard de Auth0](https://manage.auth0.com/)
2. Navega a **Applications > APIs**
3. Selecciona **Auth0 Management API**
4. Ve a la pestaña **Machine to Machine Applications**
5. Autoriza tu aplicación M2M y otorga los siguientes permisos:
   - `read:users` - Para leer información de usuarios
   - `update:users` - Para actualizar perfiles de usuarios
   - `update:users_app_metadata` - Para actualizar metadatos personalizados

Sin estos permisos, verás errores como:
```
Client is not authorized to access resource server
```

### 4. Ejecutar la aplicación

```bash
node server.js
```

La aplicación estará disponible en `http://localhost:3000`

## 🎨 Características de la Interfaz

### Formularios estilizados
- **Diseño moderno** con gradientes y sombras
- **Validaciones en tiempo real** con JavaScript
- **Mensajes de error claros** y bien posicionados
- **Estados de carga** en botones
- **Responsive design** para móviles y desktop
- **Navegación dinámica** que cambia según el estado de autenticación

### Validaciones Implementadas

#### Cliente (JavaScript)
- Validación en tiempo real mientras el usuario escribe
- Feedback visual inmediato (campos rojos, mensajes de error)
- Prevención de envío de formularios inválidos

#### Servidor (Node.js)
- **Tipo de documento**: Selección obligatoria entre CC, TI, CE, PAS, NIT
- **Número de documento**: Entre 6 y 15 dígitos, solo números
- **Dirección**: Entre 5 y 100 caracteres (opcional)
- **Teléfono**: Mínimo 7 dígitos, formato flexible con +, espacios, guiones y paréntesis (opcional)

## 🏗️ Clean Architecture (Simplificada)

### Capa de Presentación
- **Views (EJS)**: Plantillas del lado del servidor
- **Public Assets**: CSS y JavaScript del cliente
- Navegación dinámica con componentes reutilizables

### Capa de Controladores (`src/controllers/`)
- **profileController.js**: Maneja todas las rutas relacionadas con perfiles
  - `home()` - Página principal
  - `profile()` - Vista de perfil del usuario
  - `editForm()` - Formulario de edición (GET)
  - `updateProfile()` - Procesamiento de actualización (POST)
  - `notFound()` - Manejo de errores 404
  - `error()` - Middleware de errores global

### Capa de Servicios (`src/services/`)
- **auth0Service.js**: Capa de abstracción para Auth0 Management API
  - `getManagementToken()` - Obtención y cache de tokens de acceso
  - `getUserById()` - Recuperación de datos de usuario
  - `updateUserMetadata()` - Actualización de metadatos
  - `validateUserData()` - Validaciones de negocio
  - `sanitizeUserData()` - Limpieza y normalización de datos

### Capa de Rutas (`src/routes/`)
- **index.js**: Define todos los endpoints HTTP
- Separación clara entre rutas GET y POST
- Integración con middleware de autenticación

## 📱 Páginas Disponibles

### `/` - Página Principal
- Bienvenida diferenciada para usuarios autenticados/no autenticados
- Navegación clara hacia otras secciones
- Información básica del usuario si está autenticado

### `/profile` - Perfil del Usuario
- Visualización completa de los datos del usuario
- Información separada por categorías:
  - Datos básicos de Auth0
  - Información personal (metadatos)
  - JSON completo para desarrolladores
- Manejo de errores graceful

### `/edit` - Editar Perfil
- Formulario completo con validaciones
- Campos pre-poblados con datos existentes
- Validaciones del lado cliente y servidor
- Mensajes de éxito/error claros
- Vista previa de información actual

### `/login` - Iniciar Sesión
- Redirección automática a Auth0 Universal Login
- Manejo seguro de tokens y sesiones

### `/logout` - Cerrar Sesión
- Cierre de sesión en Auth0 y aplicación
- Redirección a página principal

## 🔧 Funcionalidades Técnicas

### Gestión de Metadatos Auth0
- Actualización de `user_metadata` a través de Management API
- Obtención de tokens de acceso automática con client credentials flow
- **Cache de tokens** para optimización (5 minutos antes de expiración)
- Manejo robusto de errores con mensajes descriptivos

### Auth0 Management API Integration
- **Fetch API nativo** de Node.js (v18+)
- Sin dependencias externas (axios removido)
- Credenciales M2M (Machine to Machine) separadas
- Control explícito de respuestas HTTP
- Logging detallado para debugging

### Validaciones Robustas
- **Cliente**: JavaScript con validaciones en tiempo real
- **Servidor**: Doble capa de validación
  1. `sanitizeUserData()` - Limpieza de datos
  2. `validateUserData()` - Validación de reglas de negocio
- Prevención de inyección de datos maliciosos
- Normalización de formatos (uppercase, trim)

### Manejo de Errores
- Páginas de error personalizadas
- Mensajes de error claros para el usuario
- Logging completo en servidor con emojis para fácil identificación
- Fallback graceful en caso de fallos de API
- Captura de errores en múltiples niveles

### Seguridad
- Tokens de acceso cacheados de forma segura
- Credenciales en variables de entorno
- Validación de autenticación en rutas protegidas
- Sanitización de inputs del usuario
- Separación de credenciales de login vs Management API

## 🔬 Documentación del Código

Todo el código está completamente documentado en inglés siguiendo el estándar JSDoc:

- **Comentarios de clase**: Descripción del propósito de cada clase
- **Comentarios de método**: Explicación detallada de cada función
- **Parámetros**: Tipo, nombre y descripción de cada parámetro
- **Retornos**: Tipo y descripción de valores de retorno
- **Errores**: Documentación de excepciones que puede lanzar

Ejemplo:
```javascript
/**
 * Updates user metadata in Auth0 user profile
 * 
 * @param {string} userId - Auth0 user ID (format: provider|id)
 * @param {Object} userMetadata - Object containing metadata fields
 * @returns {Promise<Object>} Updated user object from Auth0
 * @throws {Error} If update fails
 */
async updateUserMetadata(userId, userMetadata) {
  // Implementation...
}
```

## 🎯 Estado del Proyecto

- [x] Configurar el formulario de logueo de Auth0
- [x] Integración completa con Auth0 Management API
- [x] Funcionalidad de actualización de datos de usuario
- [x] Documentación completa del código (JSDoc)
- [x] Validaciones cliente y servidor
- [x] Manejo robusto de errores
- [x] Cache de tokens optimizado
- [x] Navegación dinámica
- [x] Diseño responsive
- [ ] Diagrama de flujo de la aplicación
- [ ] Tests unitarios
- [ ] Tests de integración

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** (v18+) - Runtime de JavaScript
- **Express** (v5.1.0) - Framework web
- **express-openid-connect** (v2.19.2) - Middleware de Auth0
- **EJS** (v3.1.10) - Motor de plantillas
- **dotenv** (v17.2.3) - Gestión de variables de entorno

### Frontend
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Validaciones del cliente
- **Google Fonts** (Inter) - Tipografía

### APIs y Servicios
- **Auth0 Authentication API** - Login/Logout
- **Auth0 Management API** - Gestión de usuarios
- **Fetch API** - Peticiones HTTP nativas

## 📞 Soporte

Si encuentras algún problema o tienes preguntas sobre la implementación, debes obtener:

1. Las 7 esferas del dragón.
2. Un pelo de la barba de Severus Snape.
3. El One Piece.
4. Un 5 en una materia con Delio.

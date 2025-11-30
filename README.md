# Aplicación CRUD con Auth0 - ASW ITM 2025-II

Aplicación Node.js full-stack que combina autenticación segura con Auth0 y gestión completa de productos mediante operaciones CRUD. Incluye gestión de perfiles de usuario, almacenamiento en CSV, DataTables para visualización interactiva, pruebas unitarias con Vitest y pipeline de CI/CD automatizado con GitHub Actions.

## 🚀 Características Principales

### Autenticación y Perfiles
- ✅ **Autenticación segura** con Auth0 (express-openid-connect)
- ✅ **Gestión de perfiles de usuario** con Auth0 Management API
- ✅ **Formularios de edición** responsivos y validados
- ✅ **Metadatos de usuario** personalizados (documento, dirección, teléfono)

### Sistema CRUD de Productos
- ✅ **Operaciones CRUD completas** (Create, Read, Update, Delete)
- ✅ **Almacenamiento en CSV** con manejo robusto de archivos
- ✅ **DataTables 1.13.7** con paginación, búsqueda y ordenamiento
- ✅ **Localización en español** (interfaz y mensajes)
- ✅ **Soft delete** (eliminación lógica manteniendo histórico)
- ✅ **IDs secuenciales** generados automáticamente
- ✅ **Modales Bootstrap** para crear y editar productos
- ✅ **Toasts de notificación** para feedback visual

### Arquitectura y Calidad
- ✅ **Clean Architecture** organizada por capas (routes → controllers → services)
- ✅ **Validaciones dual layer** (cliente y servidor)
- ✅ **Defense in Depth** para seguridad
- ✅ **Pruebas unitarias** con Vitest (14 tests, 100% pasando)
- ✅ **CI/CD Pipeline** con GitHub Actions (tests automáticos, security scanning)
- ✅ **Multi-version testing** (Node 18, 20, 22)
- ✅ **Código documentado** con JSDoc en inglés
- ✅ **ES Modules** (import/export)
- ✅ **Fetch API nativo** sin dependencias externas

## 📁 Estructura del Proyecto

```
Application/
├── .github/
│   └── workflows/
│       └── CI.yml                  # GitHub Actions CI pipeline
├── src/
│   ├── controllers/           # Lógica de controladores (manejo de requests/responses)
│   │   ├── profileController.js    # Gestión de perfiles de usuario
│   │   └── productController.js    # Gestión de productos (CRUD)
│   ├── services/              # Servicios de negocio (lógica de dominio)
│   │   ├── auth0Service.js         # Integración con Auth0 Management API
│   │   └── productService.js       # Lógica CRUD, CSV, validaciones
│   └── routes/                # Definición de rutas HTTP
│       ├── index.js                # Rutas de perfil y autenticación
│       └── productRoutes.js        # Rutas de productos (/products/*)
├── views/                     # Plantillas EJS (server-side rendering)
│   ├── index.ejs                   # Página principal con bienvenida
│   ├── profile.ejs                 # Vista de perfil de usuario
│   ├── editProfile.ejs             # Formulario de edición de perfil
│   ├── products.ejs                # Gestión de productos con DataTables
│   ├── error.ejs                   # Página de errores personalizada
│   └── layout.ejs                  # Layout base reutilizable
├── public/
│   ├── css/
│   │   └── styles.css              # Estilos globales, modales, DataTables
│   ├── js/
│   │   ├── app.js                  # Validaciones del formulario de perfil
│   │   └── products.js             # Lógica frontend de productos (modales, fetch)
│   └── favicon.svg                 # Icono de la aplicación
├── data/
│   └── productos.csv               # Almacenamiento de productos (CSV)
├── tests/
│   ├── productService.test.js      # Suite de pruebas unitarias (Vitest)
│   └── README.md                   # Documentación de testing
├── server.js                  # Archivo principal del servidor Express
├── .env                       # Variables de entorno (no versionado)
├── .env.example               # Ejemplo de configuración
├── package.json               # Dependencias y scripts npm
└── README.md                  # Este archivo
```

## 🛠️ Instalación y Configuración

### Requisitos Previos
- **Node.js v18+** (para soporte nativo de Fetch API y ES Modules)
- **npm** (gestor de paquetes)
- **Cuenta de Auth0** (gratuita en [auth0.com](https://auth0.com))

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# Puerto del servidor
PORT=3000

# Configuración de Auth0 para autenticación de usuarios
AUTH0_SECRET=your-random-secret-string-min-32-chars
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Credenciales de Auth0 Management API (M2M - Machine to Machine)
AUTH0_M2M_CLIENT_ID=your-m2m-client-id
AUTH0_M2M_CLIENT_SECRET=your-m2m-client-secret
AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
```

**Nota importante sobre `AUTH0_SECRET`:**
- Debe tener al menos 32 caracteres
- Puedes generarlo con: `openssl rand -base64 32`

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

#### Modo producción:
```bash
npm start
```

#### Modo desarrollo (auto-reload con --watch):
```bash
node server.js
```

La aplicación estará disponible en `http://localhost:3000`

### 5. Ejecutar pruebas unitarias

```bash
# Ejecutar una vez (CI mode)
npm run test:run

# Modo watch (desarrollo)
npm test

# Con interfaz visual (opcional)
npm run test:ui

# Con reporte de cobertura (requiere @vitest/coverage-v8)
npm run test:coverage
```

## 🎨 Características de la Interfaz

### Gestión de Perfiles de Usuario
- **Formularios estilizados** con diseño moderno (gradientes, sombras, animaciones)
- **Validaciones en tiempo real** con JavaScript vanilla
- **Mensajes de error claros** y bien posicionados
- **Estados de carga** en botones durante envío
- **Responsive design** para móviles, tablets y desktop
- **Layout reutilizable** con navegación dinámica según estado de autenticación

### Sistema de Productos
- **DataTables interactivo** con:
  - Paginación (10, 25, 50, 100 registros)
  - Búsqueda en tiempo real
  - Ordenamiento por columnas
  - Localización completa en español
  - Formato de precios COP (pesos colombianos)
- **Modales Bootstrap 5** para crear/editar productos
- **Toasts de notificación** (éxito, error, advertencia)
- **Confirmación de eliminación** con SweetAlert2
- **Badges de estado** (activo/inactivo)
- **Botones de acción** agrupados por operación

### Validaciones Implementadas

#### Perfiles de Usuario
**Cliente (JavaScript):**
- Validación en tiempo real mientras el usuario escribe
- Feedback visual inmediato (campos rojos, mensajes de error)
- Prevención de envío de formularios inválidos

**Servidor (Node.js):**
- **Tipo de documento**: Selección obligatoria (CC, TI, CE, PAS, NIT)
- **Número de documento**: Entre 6 y 15 dígitos, solo números
- **Dirección**: Entre 5 y 100 caracteres (opcional)
- **Teléfono**: Mínimo 7 dígitos, formato flexible con +, espacios, guiones y paréntesis (opcional)

#### Productos
**Cliente y Servidor (Defense in Depth):**
- **Nombre**: Mínimo 3 caracteres, obligatorio
- **Descripción**: Campo opcional pero sin límite
- **Precio**: Mayor a 0, solo números positivos
- **Cantidad**: Entero positivo (≥ 0), no acepta decimales

## 🏗️ Clean Architecture (Simplificada)

### Capa de Presentación
- **Views (EJS)**: Plantillas server-side rendering
  - `layout.ejs` - Template base reutilizable
  - `index.ejs` - Página de inicio
  - `profile.ejs` - Vista de perfil
  - `editProfile.ejs` - Formulario de edición de perfil
  - `products.ejs` - Gestión de productos con DataTables
  - `error.ejs` - Página de errores personalizada
- **Public Assets**: CSS y JavaScript del cliente
  - `styles.css` - Estilos globales, modales, DataTables
  - `app.js` - Validaciones de perfil
  - `products.js` - Lógica frontend de productos
  - `favicon.svg` - Icono SVG

### Capa de Controladores (`src/controllers/`)
Maneja todas las rutas HTTP y coordina entre la capa de presentación y servicios.

**profileController.js**:
- `home()` - Página principal con bienvenida personalizada
- `profile()` - Vista de perfil del usuario autenticado
- `editProfileForm()` - Formulario de edición de perfil (GET)
- `updateProfile()` - Procesamiento de actualización de perfil (POST)
- `notFound()` - Manejo de errores 404
- `error()` - Middleware de errores global

**productController.js**:
- `getProductsPage()` - Renderiza página de gestión de productos
- `getProducts()` - API endpoint que devuelve JSON de productos activos
- `createProduct()` - Crea un nuevo producto (POST JSON)
- `updateProduct()` - Actualiza producto existente (PUT JSON)
- `deleteProduct()` - Elimina producto (soft delete) (DELETE JSON)

### Capa de Servicios (`src/services/`)
Contiene la lógica de negocio y acceso a datos.

**auth0Service.js**: Capa de abstracción para Auth0 Management API
- `getManagementToken()` - Obtención y cache de tokens de acceso M2M
- `getUserById()` - Recuperación de datos de usuario desde Auth0
- `updateUserMetadata()` - Actualización de metadatos de usuario
- `validateUserData()` - Validaciones de reglas de negocio
- `sanitizeUserData()` - Limpieza y normalización de datos

**productService.js**: Lógica CRUD y persistencia en CSV
- `readProducts()` - Lee todos los productos del CSV
- `getActiveProducts()` - Filtra solo productos activos
- `getProductById()` - Obtiene un producto por ID
- `createProduct()` - Crea producto con ID secuencial
- `updateProduct()` - Actualiza producto existente
- `deleteProduct()` - Soft delete (marca activo=false)
- `validateProductData()` - Validaciones de productos
- `parseCSVLine()` - Parser CSV robusto (maneja comillas y comas)
- `escapeCSVField()` - Escapa campos para evitar corrupción
- `setCSVPath()` / `getCSVPath()` - Inyección de ruta (útil para tests)

### Capa de Rutas (`src/routes/`)
Define todos los endpoints HTTP y aplica middleware.

**index.js**: Rutas de autenticación y perfiles
- `GET /` - Página principal
- `GET /profile` - Vista de perfil (requiere auth)
- `GET /edit` - Formulario de edición (requiere auth)
- `POST /update` - Actualización de perfil (requiere auth)

**productRoutes.js**: Rutas de gestión de productos
- `GET /products` - Página de productos (requiere auth)
- `GET /products/api` - Lista de productos JSON (requiere auth)
- `POST /products/api` - Crear producto (requiere auth)
- `PUT /products/api/:id` - Actualizar producto (requiere auth)
- `DELETE /products/api/:id` - Eliminar producto (requiere auth)

## 📱 Páginas y Endpoints

### Páginas Públicas
#### `GET /` - Página Principal
- Bienvenida diferenciada para usuarios autenticados/no autenticados
- Navegación clara hacia otras secciones
- Información básica del usuario si está autenticado
- Botón de acceso rápido a productos para usuarios autenticados

#### `GET /login` - Iniciar Sesión
- Redirección automática a Auth0 Universal Login
- Manejo seguro de tokens y sesiones OAuth2
- Callback automático tras autenticación exitosa

#### `GET /logout` - Cerrar Sesión
- Cierre de sesión en Auth0 y aplicación
- Limpieza de cookies y tokens
- Redirección a página principal

### Páginas Protegidas (Requieren Autenticación)
#### `GET /profile` - Perfil del Usuario
- Visualización completa de los datos del usuario
- Información separada por categorías:
  - **Datos de Auth0**: email, nombre, foto de perfil
  - **Información personal**: tipo y número de documento, dirección, teléfono
  - **JSON completo** para desarrolladores (collapsible)
- Botón de edición rápida
- Manejo de errores graceful (si Auth0 falla)

#### `GET /edit` - Editar Perfil
- Formulario completo con validaciones duales
- Campos pre-poblados con datos existentes
- Validaciones del lado cliente (tiempo real)
- Validaciones del lado servidor (seguridad)
- Vista previa de información actual
- Mensajes de éxito/error claros con toasts

#### `POST /update` - Actualizar Perfil
- Procesamiento de datos del formulario
- Sanitización y validación de inputs
- Actualización de `user_metadata` en Auth0
- Respuesta JSON con resultado de operación
- Manejo de errores detallado

#### `GET /products` - Gestión de Productos
- Página completa de gestión CRUD
- DataTables con datos cargados vía Fetch API
- Modales para crear y editar productos
- Botones de acción por fila (editar, eliminar)
- Búsqueda, paginación y ordenamiento integrados

### API Endpoints (REST JSON)
#### `GET /products/api` - Listar Productos
- Retorna JSON con array de productos activos
- Formato: `[{ id, nombre, descripcion, precio, cantidad, activo }]`
- Usado por DataTables para renderizar tabla

#### `POST /products/api` - Crear Producto
- Body JSON: `{ nombre, descripcion, precio, cantidad }`
- Validaciones: nombre ≥ 3 chars, precio > 0, cantidad ≥ 0
- Genera ID secuencial automático
- Retorna: producto creado con ID asignado

#### `PUT /products/api/:id` - Actualizar Producto
- Params: `id` del producto
- Body JSON: `{ nombre, descripcion, precio, cantidad }`
- Valida existencia del producto
- Mantiene estado de `activo` sin modificar
- Retorna: producto actualizado

#### `DELETE /products/api/:id` - Eliminar Producto (Soft Delete)
- Params: `id` del producto
- Marca `activo = false` sin eliminar físicamente
- Permite mantener histórico de productos
- Retorna: `{ success: true }`

## 🔧 Funcionalidades Técnicas

### Sistema de Productos con CSV
- **Almacenamiento en archivo CSV** (`data/productos.csv`)
- **Parser CSV robusto** que maneja:
  - Campos con comas internas (descripción larga)
  - Comillas dobles (escaping correcto)
  - Saltos de línea en descripciones
- **Generación de IDs secuenciales** automática
- **Soft delete** para mantener histórico sin pérdida de datos
- **Transacciones atómicas** (lectura → modificación → escritura)
- **Inyección de ruta CSV** para testing sin side effects

### Gestión de Metadatos Auth0
- Actualización de `user_metadata` vía Management API
- **Obtención automática de tokens** con client credentials flow (OAuth2)
- **Cache inteligente de tokens** (renovación 5 minutos antes de expirar)
- Manejo robusto de errores con mensajes descriptivos
- Separación de credenciales: login (user) vs Management API (M2M)

### Auth0 Management API Integration
- **Fetch API nativo** de Node.js v18+ (sin axios ni dependencias externas)
- Credenciales M2M (Machine to Machine) separadas del flujo de login
- Control explícito de respuestas HTTP con manejo de errores
- Reintentos automáticos en caso de token expirado

### Validaciones Robustas (Defense in Depth)
**Capa 1 - Cliente (JavaScript):**
- Validaciones en tiempo real mientras el usuario escribe
- Feedback visual inmediato (bordes rojos, mensajes)
- Prevención de envío si hay errores

**Capa 2 - Servidor (Node.js):**
1. `sanitizeUserData()` / `sanitizeProductData()` - Limpieza de datos
2. `validateUserData()` / `validateProductData()` - Validación de reglas
- Prevención de inyección de datos maliciosos
- Normalización de formatos (uppercase para documentos, trim)
- Validación de tipos de datos (números, strings, rangos)

### Manejo de Errores y Logging
- **Páginas de error personalizadas** (`error.ejs`)
- **Mensajes de error claros** para el usuario final
- **Fallback graceful** en caso de fallos de API (muestra datos parciales)
- **Captura de errores en múltiples niveles**:
  - Try-catch en servicios
  - Middleware de errores global
  - Validación preventiva

### Seguridad
- **Tokens de acceso cacheados** de forma segura en memoria
- **Credenciales en variables de entorno** (.env no versionado)
- **Validación de autenticación** en todas las rutas protegidas
- **Sanitización de inputs** del usuario antes de procesamiento
- **Separación de concerns**: credenciales de login ≠ Management API
- **Soft delete** en lugar de eliminación física (auditoría)
- **HTTPS recomendado** en producción (Auth0 requirement)

### Testing y Calidad
- **Vitest 4.0.9** como framework de pruebas
- **14 tests unitarios** cubriendo todas las operaciones CRUD:
  - 4 tests de CREATE (1 éxito + 3 errores de validación)
  - 3 tests de READ (2 éxitos + 1 producto inexistente)
  - 3 tests de UPDATE (1 éxito + 2 errores)
  - 2 tests de DELETE (1 éxito + 1 error)
  - 2 tests de VALIDATION (1 éxito + 1 múltiples errores)
- **Archivo CSV temporal** para tests (sin afectar datos reales)
- **Patrón AAA** (Arrange-Act-Assert) para claridad
- **100% de tests pasando** (verificado en cada commit)

## 🔬 Documentación del Código

Todo el código está completamente documentado en inglés siguiendo el estándar **JSDoc**:

- **Comentarios de clase**: Descripción del propósito y responsabilidades
- **Comentarios de método**: Explicación detallada de funcionalidad
- **Parámetros**: Tipo, nombre y descripción de cada parámetro
- **Retornos**: Tipo y descripción de valores de retorno
- **Errores**: Documentación de excepciones que puede lanzar (`@throws`)

### Ejemplos de Documentación

#### Auth0 Service
```javascript
/**
 * Updates user metadata in Auth0 user profile
 * 
 * @param {string} userId - Auth0 user ID (format: provider|id)
 * @param {Object} userMetadata - Object containing metadata fields
 * @returns {Promise<Object>} Updated user object from Auth0
 * @throws {Error} If update fails or user not found
 */
async updateUserMetadata(userId, userMetadata) {
  // Implementation...
}
```

#### Product Service
```javascript
/**
 * Creates a new product with sequential ID
 * Validates data and appends to CSV file
 * 
 * @param {Object} productData - Product data
 * @param {string} productData.nombre - Product name (min 3 chars)
 * @param {string} [productData.descripcion] - Product description (optional)
 * @param {number} productData.precio - Product price (must be positive)
 * @param {number} productData.cantidad - Product quantity (integer ≥ 0)
 * @returns {Promise<Object>} Created product object with assigned ID
 * @throws {Error} If validation fails or creation fails
 */
async createProduct(productData) {
  // Implementation...
}
```

Toda la documentación interna sigue este estándar para facilitar:
- **Mantenimiento** del código a largo plazo
- **Onboarding** de nuevos desarrolladores
- **Generación automática** de docs con herramientas como JSDoc
- **Autocompletado** en IDEs modernos (VSCode, WebStorm)

## 🎯 Estado del Proyecto

### Actividad 3 - Autenticación y Perfiles ✅
- [x] Configurar Auth0 Universal Login
- [x] Integración completa con Auth0 Management API
- [x] Funcionalidad de actualización de datos de usuario
- [x] Validaciones cliente y servidor (Defense in Depth)
- [x] Manejo robusto de errores
- [x] Cache de tokens optimizado
- [x] Navegación dinámica según estado de autenticación
- [x] Diseño responsive y accesible
- [x] Documentación completa del código (JSDoc)

### Actividad 4 - CRUD de Productos ✅
- [x] Sistema CRUD completo (Create, Read, Update, Delete)
- [x] Almacenamiento persistente en CSV
- [x] DataTables con paginación, búsqueda y ordenamiento
- [x] Localización completa en español
- [x] Modales Bootstrap para formularios
- [x] Toasts de notificación
- [x] Soft delete para auditoría
- [x] Validaciones duales (cliente + servidor)
- [x] API REST con JSON
- [x] Manejo de errores detallado
- [x] **Pruebas unitarias con Vitest (14 tests, 100% pasando)**
- [x] Archivo CSV temporal para tests (sin side effects)
- [x] Documentación de testing (`tests/README.md`)

### Actividad 5 - CI/CD Pipeline ✅
- [x] GitHub Actions workflow configurado
- [x] Ejecución automática de tests en cada PR
- [x] Ejecución automática de tests en push a main
- [x] Tests en múltiples versiones de Node.js (18, 20, 22)
- [x] Security audit con npm audit
- [x] Secret scanning con TruffleHog
- [x] Build verification automática
- [x] Coverage report generation
- [x] Comentarios automáticos en PRs con resultados
- [x] Status checks requeridos para merge
- [x] Cancelación automática de workflows obsoletos
- [x] Jobs paralelos para optimizar tiempos
- [x] Cache de node_modules para velocidad

### Pendientes / Mejoras Futuras 📋
- [ ] Tests de integración (end-to-end con Playwright)
- [ ] Migración de CSV a base de datos (PostgreSQL/MongoDB)
- [ ] Paginación del lado servidor (actualmente cliente)
- [ ] Upload de imágenes para productos
- [ ] Exportación de productos a Excel/PDF
- [ ] Filtros avanzados por precio y categoría
- [ ] Historial de cambios (audit log)
- [ ] API pública con autenticación JWT
- [ ] Internacionalización (i18n) multiidioma
- [ ] Deployment automático a producción (Vercel/Heroku)

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** (v18+) - Runtime de JavaScript con soporte nativo de Fetch API
- **Express** (v5.1.0) - Framework web minimalista y flexible
- **express-openid-connect** (v2.19.2) - Middleware de Auth0 para autenticación
- **EJS** (v3.1.10) - Motor de plantillas server-side
- **dotenv** (v17.2.3) - Gestión de variables de entorno
- **ES Modules** - import/export moderno (no CommonJS)

### Frontend
- **CSS3** - Estilos modernos con:
  - Variables CSS (`:root`)
  - Flexbox y Grid Layout
  - Animaciones y transiciones suaves
  - Media queries para responsive
- **JavaScript ES6+** - Código moderno con:
  - Fetch API para peticiones asíncronas
  - Async/await
  - Arrow functions
  - Destructuring
  - Template literals
- **Bootstrap 5** - Framework CSS para modales y componentes
- **DataTables 1.13.7** - Tablas interactivas con paginación y búsqueda
- **SweetAlert2** - Alertas y confirmaciones elegantes
- **Google Fonts** (Inter) - Tipografía moderna y legible

### APIs y Servicios Externos
- **Auth0 Authentication API** - Login/Logout con OAuth2/OIDC
- **Auth0 Management API** - Gestión de usuarios y metadatos
- **Fetch API** - Peticiones HTTP nativas (sin axios ni librerías)

### Testing
- **Vitest** (v4.0.9) - Framework de testing ultrarrápido
  - Compatible con sintaxis de Jest
  - Soporte nativo para ES Modules
  - Hot Module Replacement (HMR)
  - Interfaz UI opcional (`@vitest/ui`)
  - Coverage report con `@vitest/coverage-v8`
- **Node.js Test Runner** - APIs nativas de Node.js (fs/promises, os)

### CI/CD
- **GitHub Actions** - Automatización de workflows
  - Pipeline CI completo en `.github/workflows/CI.yml`
  - Tests automáticos en PRs y pushes
  - Security scanning y audit
  - Multi-version testing (Node 18, 20, 22)
  - Coverage reports automáticos

### Almacenamiento
- **CSV** - Archivos de texto plano separados por comas
  - Portable y fácil de inspeccionar
  - No requiere base de datos
  - Perfecto para prototipos y aprendizaje

### DevOps y Tooling
- **Git** - Control de versiones
- **npm** - Gestor de paquetes
- **Node --watch** - Auto-reload en desarrollo (flag nativo)
- **JSDoc** - Documentación inline con tipado

## 🧪 Pruebas Unitarias

### Framework y Configuración
Utilizamos **Vitest 4.0.9** por sus ventajas:
- ⚡ **Velocidad**: 10x más rápido que Jest
- � **ES Modules nativos**: Sin configuración adicional
- 🔥 **HMR**: Re-ejecuta solo tests afectados por cambios
- ✅ **API compatible con Jest**: Fácil migración y curva de aprendizaje baja

### Estructura de Tests
```
tests/
├── productService.test.js    # 14 tests unitarios del servicio CRUD
└── README.md                 # Documentación detallada de testing
```

### Cobertura de Tests (14 tests, 100% pasando)

#### CREATE - `createProduct()` (4 tests)
- ✅ **Éxito**: Crear producto con datos válidos
- ❌ **Error**: Nombre inválido (< 3 caracteres)
- ❌ **Error**: Precio inválido (≤ 0)
- ❌ **Error**: Cantidad inválida (negativa)

#### READ - `getProductById()` y `getActiveProducts()` (3 tests)
- ✅ **Éxito**: Obtener producto existente por ID
- ❌ **Error**: Producto inexistente (retorna null)
- ✅ **Éxito**: Filtrar solo productos activos

#### UPDATE - `updateProduct()` (3 tests)
- ✅ **Éxito**: Actualizar producto existente
- ❌ **Error**: Intentar actualizar producto inexistente
- ❌ **Error**: Actualizar con datos inválidos

#### DELETE - `deleteProduct()` (2 tests)
- ✅ **Éxito**: Soft delete (marca activo=false)
- ❌ **Error**: Intentar eliminar producto inexistente

#### VALIDATION - `validateProductData()` (2 tests)
- ✅ **Éxito**: Validar datos correctos
- ❌ **Error**: Detectar múltiples errores simultáneamente

### Estrategia de Testing
**Archivo CSV temporal por test suite:**
- Cada test utiliza un archivo temporal en `os.tmpdir()`
- Inyección de ruta con `setCSVPath()` (agregado al servicio)
- No hay side effects ni corrupción de datos reales
- Limpieza automática después de cada test

**Patrón AAA (Arrange-Act-Assert):**
```javascript
it('✅ Caso exitoso: Debe crear un producto válido', async () => {
  // Arrange - Preparar datos de entrada
  const newProduct = {
    nombre: 'Nuevo Producto',
    descripcion: 'Descripción del nuevo producto',
    precio: 5000,
    cantidad: 50
  };

  // Act - Ejecutar la operación
  const result = await productService.createProduct(newProduct);

  // Assert - Verificar resultados
  expect(result).toBeDefined();
  expect(result.id).toBe(4); // ID secuencial
  expect(result.nombre).toBe('Nuevo Producto');
  expect(result.activo).toBe(true);
});
```

### Comandos de Testing
```bash
# Ejecutar una vez (CI mode)
npm run test:run

# Modo watch (desarrollo, re-ejecuta al detectar cambios)
npm test

# Con interfaz visual (opcional)
npm run test:ui

# Con reporte de cobertura
npm run test:coverage  # Requiere @vitest/coverage-v8
```

### Resultado de Ejecución
```
✓ tests/productService.test.js (14 tests) 13ms
  ✓ ProductService - CRUD Operations (14)
    ✓ CREATE - createProduct() (4)
    ✓ READ - getProductById() (2)
    ✓ READ - getActiveProducts() (1)
    ✓ UPDATE - updateProduct() (3)
    ✓ DELETE - deleteProduct() [Soft Delete] (2)
    ✓ VALIDATION - validateProductData() (2)

Test Files  1 passed (1)
     Tests  14 passed (14)
  Duration  102ms
```

### Beneficios de las Pruebas
- ✅ **Confianza en refactorización**: Cambios sin miedo a romper funcionalidad
- ✅ **Documentación viva**: Los tests describen el comportamiento esperado
- ✅ **Detección temprana de bugs**: Errores encontrados antes de producción
- ✅ **Integración continua**: Ready para CI/CD pipelines (GitHub Actions, Jenkins)

Ver documentación completa en [`tests/README.md`](./tests/README.md)

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

El proyecto incluye un pipeline de CI/CD completo que se ejecuta automáticamente en cada Pull Request y push a `main`. El workflow está definido en `.github/workflows/CI.yml`.

### Triggers
- **Pull Requests** hacia la rama `main`
- **Push directo** a la rama `main`
- **Cancelación automática** de workflows obsoletos si se hace un nuevo push

### Jobs Paralelos

#### 1. Security Checks 🔒
- **npm audit**: Detecta vulnerabilidades en dependencias (nivel moderate o superior)
- **TruffleHog**: Escanea secretos expuestos (API keys, tokens, contraseñas)
- **Node.js**: Versión 20 LTS
- **Continue on error**: Los warnings no bloquean el pipeline

#### 2. Tests ✅
- **Multi-version testing**: Node.js 18, 20, 22 (matriz paralela)
- **Test execution**: `npm run test:run` (14 tests unitarios)
- **Coverage report**: Generado automáticamente en Node 20
- **Artifacts**: Coverage report subido como artefacto de GitHub
- **Fail-fast disabled**: Continúa testing en otras versiones aunque una falle

#### 3. Build Verification 📦
- **Build script detection**: Detecta automáticamente si existe `npm run build`
- **Optional execution**: Solo ejecuta si el script existe
- **Node.js**: Versión 20 LTS
- **Validación**: Asegura que el proyecto pueda compilar correctamente

#### 4. PR Comment 💬
- **Comentarios automáticos** en Pull Requests con:
  - Estado de todos los checks (✅/❌)
  - Resultados de tests en Node 18, 20, 22
  - Security audit status
  - Secret scanning status
  - Build verification status
  - Coverage summary (lines, statements, functions, branches)
- **Permisos**: Requiere `pull-requests: write`
- **Condicional**: Solo se ejecuta en PRs, no en push directo

#### 5. CI Success 🏆
- **Status check final** que agrega todos los resultados
- **Bloqueador de merge**: Si falla, no permite merge del PR
- **Always run**: Se ejecuta incluso si algún job anterior falla
- **Agregación**: Verifica que security, test y build hayan sido exitosos

### Optimizaciones

#### Cache de node_modules
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```
Reduce el tiempo de instalación de ~30s a ~5s en ejecuciones subsecuentes.

#### Jobs Paralelos
Los jobs `security`, `test` y `build` se ejecutan simultáneamente, reduciendo el tiempo total del pipeline de ~3min a ~1min.

#### Cancelación de Workflows
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
Cancela automáticamente workflows anteriores si se hace un nuevo push, ahorrando recursos.

### Configuración Requerida en GitHub

#### 1. Branch Protection Rules
Para que el CI bloquee merges si fallan los tests:

1. **Settings** → **Branches** → **Add branch protection rule**
2. Branch name pattern: `main`
3. Activar:
   - ✅ **Require status checks to pass before merging**
   - Seleccionar: `CI Success`
   - ✅ **Require branches to be up to date before merging**

#### 2. Workflow Permissions
Para que el CI pueda comentar en PRs:

1. **Settings** → **Actions** → **General**
2. **Workflow permissions**:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### Resultados del Pipeline

#### En Pull Requests
```
✅ Security Checks - passed (20s)
✅ Tests (Node 18) - passed (25s)
✅ Tests (Node 20) - passed (23s)
✅ Tests (Node 22) - passed (24s)
✅ Build Verification - passed (18s)
✅ PR Comment with Results - passed (5s)
✅ CI Success - passed (2s)
```

#### Comentario Automático en PR
```markdown
## ✅ CI Pipeline Results

**Status:** All checks passed! 🎉

### Test Results
- ✅ Unit tests passed on Node 18, 20, 22
- ✅ Security audit completed
- ✅ No secrets detected
- ✅ Build verification passed

📊 **Coverage Summary:**
- Lines: 85.4%
- Statements: 84.2%
- Functions: 78.9%
- Branches: 72.1%

---
*Automated comment by GitHub Actions*
```

### Comandos Útiles

```bash
# Ejecutar tests localmente (simula CI)
npm run test:run

# Ver coverage localmente
npm run test:coverage

# Verificar que no hay secretos expuestos (requiere TruffleHog local)
# brew install trufflesecurity/trufflehog/trufflehog
trufflehog filesystem . --only-verified
```

### Troubleshooting CI

#### Tests fallan en CI pero pasan localmente
- Verifica la versión de Node.js: `node --version`
- Asegúrate de usar `npm ci` en lugar de `npm install`
- Revisa si hay dependencias de dev faltantes

#### Secret scanning detecta falsos positivos
- Agrega un `.trufflehog.yml` para excluir patrones específicos
- Usa `continue-on-error: true` en ese step (ya configurado)

#### Coverage report no se genera
- Verifica que `@vitest/coverage-v8` esté instalado: `npm list @vitest/coverage-v8`
- El workflow ya tiene `continue-on-error: true` para no bloquear si falla

#### Workflow no comenta en PR
- Revisa los permisos en **Settings** → **Actions** → **General**
- Asegúrate de que `pull-requests: write` esté habilitado

## 📞 Soporte y Contacto

Si encuentras algún problema o tienes preguntas sobre la implementación:

1. **Revisa la documentación**:
   - Este README principal
   - `tests/README.md` para testing
   - Comentarios JSDoc en el código fuente

2. **Verifica la configuración**:
   - Variables de entorno en `.env`
   - Permisos de Auth0 Management API
   - Versión de Node.js (debe ser v18+)

3. **Debugging**:
   - Revisa los logs del servidor (emojis ✅/❌ para facilitar identificación)
   - Verifica la consola del navegador (F12)
   - Ejecuta tests unitarios para verificar integridad del servicio

4. **Problemas comunes**:
   - **"Client is not authorized"**: Faltan permisos en Auth0 Management API
   - **"Product not found"**: ID incorrecto o producto eliminado (soft delete)
   - **Tests fallan**: Verifica que `data/productos.csv` exista y tenga permisos de escritura

---

## 👨‍💻 Autor

**Alejandro González**  
Taller de Aplicaciones y Servicios Web - ITM 2025-II

## 📄 Licencia

ISC License - Proyecto educativo para el Instituto Tecnológico Metropolitano (ITM)

---

**Nota**: Este proyecto es parte de las actividades académicas del curso de Aplicaciones y Servicios Web. Combina las Actividades 3 (Auth0 + Perfiles), 4 (CRUD + Testing) y 5 (CI/CD Pipeline) en una aplicación full-stack completa con automatización de calidad.

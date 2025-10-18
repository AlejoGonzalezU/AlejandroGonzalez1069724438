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

Configura el archivo `.env` con las credenciales de app de Auth0. Una versión de efecto se encuentra en el repositorio.

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

- [x] Configurar el formulario de logueo de Auth0
- [ ] Modificar el Universal Login de Auth0
- [ ] Espacio para modificar los datos del usuario
- [x] Funcionalidad de actualización de datos de usuario
- [ ] Consumir la API de Auth0 para guardar los datos
- [x] Documentación 
- [ ] Diagrama de flujo

## 📞 Soporte

Si encuentras algún problema o tienes preguntas sobre la implementación, debes obtener:

1. Las 7 esferas del dragón.
2. Un pelo de la barba de Severus Snape.
3. El One Piece.
4. Un 5 en una materia con Delio.


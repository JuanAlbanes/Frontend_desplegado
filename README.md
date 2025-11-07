# Slack Personalizado - Frontend

Frontend de Slack construido con React y Vite. Interfaz de usuario para sistema de mensajería en tiempo real.

## 🚀 Características

- 💬 **Chat en tiempo real** 
- 🏢 **Gestión de espacios de trabajo CRUD completo reflejado en DB en la nube Mongoatlas**
- 📁 **Canales y mensajes directos**
- 👥 **Gestión de usuarios sistema de autentificacion registro , login y reestablecimiento de contraseña**
- 🎨 **Interfaz estilo Slack con CSS personalizado**
- 📱 **Diseño responsive**
- 🔐 **Autenticación de usuarios**

## 🛠️ Tecnologías

- **Frontend:** React 18, Vite
- **Estilo:** CSS puro
- **Ruteo:** React-Router
- **HTTP:** Fetch API / Axios
- **Manejo de estado:** React Hooks (useState, useContext)
- **alertas** sweetalert2
- **iconos** react-icons

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/JuanAlbanes/Frontend_prueba_sin_mock.git
cd Frontend_prueba_sin_mock

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
Configura las variables en .env.local:

🎯 Scripts
bash
# Desarrollo
npm run dev


🏗️ Estructura del Proyecto

src/
├── assets/     
├── config/  
│   ├── environment.js   
├── constants/    
│   ├── http.js
│   └── localstorage.js
├── hooks/  
│   ├── useFetch.jsx
│   ├── useForm.jsx
├── Middlewares/  
│   ├── AuthMiddlewares.jsx
├── normalize/
│   ├── normalize.css      
├── Screens/        
│   ├── LoginScreen
|   │   ├── LoginScreen.jsx
|   │   ├── LoginScreen.css
│   ├── RegisterScreen
|   │   ├── RegisterScreen.jsx
|   │   ├── RegisterScreen.css
│   ├── ResetPasswordScreen
|   │   ├── ResetpasswordScreen.jsx
|   │   ├── ResetpasswordScreen.css
├── services/   
│   ├── authService.js
│   ├── messageService.js
│   ├── userService.js  
├── slack/      
│   ├── Components
|   │   ├── ChannelList/
|   │   ├── Chat/
|   │   ├── ChatHeader/
|   │   ├── Layout/
|   │   ├── LoaderSpinner/
|   │   ├── Message/
|   │   ├── NewMessageForm/
|   │   ├── WorkspaceItem/
|   │   ├── WorkspaceList/
│   ├── Context
|   │   ├── MessageContext.jsx
|   │   ├── UserContext.jsx
|   │   ├── WorkspaceContext.jsx
│   ├── Screens
|   │   ├── ChatScreen/
|   │   ├── ComfirmInvitation/  
|   │   ├── WorkspaceListScreen/
│   ├── services
|   │   ├── channelService.js
|   │   ├── memberService.js
|   │   ├── messageService-slack.js
|   │   ├── workspaceService.js
├── App.jsx
└── main.jsx  
├── .env
└── .env.example
├── .gitignore
└── index.html
├── package.json
└── vercel.json


🔌 Configuración Backend
Este frontend requiere el backend correspondiente ejecutándose


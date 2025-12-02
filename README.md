# 🍩 Simpsons Episode Finder (for fun)

Una aplicación web moderna para explorar, descubrir y gestionar tus episodios favoritos de Los Simpson. Encuentra episodios por rating, fecha de emisión, temporada, o descubre nuevos episodios de forma aleatoria.

## ✨ Features

- 🔍 **Búsqueda inteligente** - Busca episodios por nombre o descripción
- ⭐ **Sistema de ratings** - Rating bayesiano para encontrar los mejores episodios
- 📊 **Estadísticas completas** - Visualiza estadísticas globales de la serie
- 🎲 **Episodio aleatorio** - Descubre episodios random basados en tus filtros
- ✅ **Tracking de episodios vistos** - Marca y gestiona los episodios que ya viste
- 🕐 **Watch later** - Guarda episodios para ver después
- 💯 **Valoración personal** - Califica los episodios con tu propio rating (0.5 - 10)
- 🔐 **Autenticación con Firebase** - Sistema de login/registro seguro
- 📱 **PWA** - Instálala como app en tu dispositivo móvil
- 🎨 **Diseño responsive** - Perfecta en móvil, tablet y desktop
- 🌈 **UI temática de Los Simpson** - Colores y estética inspirada en la serie

## 🚀 Stack Tecnológico

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **API:** The Movie Database (TMDB)
- **PWA:** vite-plugin-pwa

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase (gratuita)
- TMDB API Key (gratuita)

## 🔧 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/ramireznicc/simpsons-episode-finder.git
   cd simpsons-episode-finder
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**

   Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Luego edita `.env` con tus credenciales:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=tu-api-key-aqui
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-project-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   VITE_FIREBASE_APP_ID=tu-app-id

   # TMDB API Configuration
   VITE_TMDB_API_KEY=tu-tmdb-api-key-aqui
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador en** `http://localhost:5173`

## 🔑 Obtener las API Keys

### Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Authentication (Email/Password)
4. Habilita Firestore Database
5. En configuración del proyecto, copia las credenciales de tu app web

Para más detalles, revisa [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### TMDB
1. Crea una cuenta en [TMDB](https://www.themoviedb.org/signup)
2. Ve a [Settings > API](https://www.themoviedb.org/settings/api)
3. Solicita una API Key (es gratis)
4. Copia tu API Key v3

## 📜 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Genera el build de producción
npm run preview  # Preview del build de producción
npm run lint     # Ejecuta ESLint
```

## 🎨 Características de Diseño

- **Paleta de colores temática:**
  - Simpson Sky: `#6db9d8` (Azul cielo)
  - Simpson Yellow: `#FFD90F` (Amarillo icónico)
  - Simpson Cream: `#FFF8DC` (Crema suave)
  - Simpson Orange: `#FFA500` (Naranja vibrante)
  - Simpson Green: `#76C043` (Verde fresco)
  - Simpson Red: `#E63946` (Rojo de acento)

- **Tipografía:**
  - Display: Rock Salt (para títulos)
  - Body: Poppins (para texto)

- **Componentes personalizados:**
  - Cards con bordes suaves y sombras
  - Animaciones fluidas
  - Modales responsive
  - Drawer lateral para gestión de episodios
  - Sistema de tabs mejorado

## 🏗️ Estructura del Proyecto

```
simpsons-episode-finder/
├── public/             # Archivos estáticos
├── src/
│   ├── api/           # Integración con TMDB API
│   ├── components/    # Componentes React
│   ├── config/        # Configuración (Firebase)
│   ├── context/       # React Context (Auth)
│   ├── hooks/         # Custom hooks
│   ├── services/      # Servicios (Firebase)
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Entry point
├── .env.example       # Template de variables de entorno
├── tailwind.config.js # Configuración de Tailwind
└── vite.config.ts     # Configuración de Vite
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Si tienes ideas para mejorar la app:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 👨‍💻 Autor

**Nicolás Ramírez** - [@ramireznicc](https://github.com/ramireznicc)

---

<div align="center">

Hecho con ❤️ por [ramireznicc](https://github.com/ramireznicc)

**¡D'oh!** Si te gusta el proyecto, ¡no olvides darle una ⭐!

</div>

# Configuración de Firebase para Simpsons Episode Finder

Esta guía te ayudará a configurar Firebase para tu aplicación.

## Paso 1: Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" (Add project)
3. Nombra tu proyecto (ej: "simpsons-episode-finder")
4. Deshabilita Google Analytics (opcional para este proyecto)
5. Haz clic en "Crear proyecto"

## Paso 2: Registrar tu aplicación web

1. En el dashboard del proyecto, haz clic en el ícono web `</>` para agregar una app web
2. Nombra tu app (ej: "Simpsons App")
3. **NO** marques "Firebase Hosting" por ahora
4. Haz clic en "Registrar app"
5. **Guarda las credenciales** que aparecen (apiKey, authDomain, etc.)

## Paso 3: Configurar Authentication

1. En el menú lateral, ve a **Build** > **Authentication**
2. Haz clic en "Get started"
3. En la pestaña "Sign-in method", haz clic en "Email/Password"
4. **Activa** la opción "Email/Password"
5. Haz clic en "Guardar"

## Paso 4: Configurar Firestore Database

1. En el menú lateral, ve a **Build** > **Firestore Database**
2. Haz clic en "Create database"
3. Selecciona el modo de prueba: **"Start in production mode"**
4. Elige una ubicación cercana (ej: "us-central")
5. Haz clic en "Enable"

### Configurar reglas de seguridad

Una vez creada la base de datos, ve a la pestaña **"Rules"** y reemplaza las reglas con esto:

\`\`\`
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden leer y escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

Haz clic en "Publish" para guardar las reglas.

## Paso 5: Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Abre el archivo `.env` y reemplaza los valores con tus credenciales de Firebase:
   \`\`\`
   VITE_FIREBASE_API_KEY=tu-api-key-aqui
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-project-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   VITE_FIREBASE_APP_ID=tu-app-id
   \`\`\`

3. **¡IMPORTANTE!** Nunca subas el archivo `.env` a Git. Ya está incluido en `.gitignore`.

## Paso 6: Ejecutar la aplicación

\`\`\`bash
npm run dev
\`\`\`

## Estructura de datos en Firestore

La aplicación crea documentos en la colección `users` con la siguiente estructura:

\`\`\`javascript
{
  watchedEpisodes: ["S1E1", "S1E2", ...],
  watchLaterEpisodes: ["S2E5", "S3E10", ...]
}
\`\`\`

Cada usuario tiene su propio documento identificado por su `userId` (uid de Firebase Authentication).

## Cómo funciona el login

- Los usuarios ingresan un **nombre de usuario** y **contraseña**
- El sistema convierte el username en un email ficticio: `username@simpsons.local`
- Si el usuario no existe, se crea automáticamente
- Cada usuario tiene sus propios episodios guardados en Firestore

## Solución de problemas

### Error: "Firebase: Error (auth/email-already-in-use)"
- Esto es normal, significa que el usuario ya existe. El login debería funcionar.

### Error: "Missing or insufficient permissions"
- Verifica que las reglas de Firestore estén configuradas correctamente (Paso 4)
- Asegúrate de que el usuario esté autenticado antes de intentar acceder a Firestore

### La aplicación no se conecta a Firebase
- Verifica que el archivo `.env` exista y tenga las credenciales correctas
- Asegúrate de reiniciar el servidor de desarrollo después de crear/modificar el `.env`

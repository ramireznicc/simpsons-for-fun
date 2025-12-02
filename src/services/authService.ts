import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../config/firebase";

/**
 * Inicia sesión con un usuario existente
 * Usamos el username como email ficticio: username@simpsons.local
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  const email = `${username.toLowerCase()}@simpsons.local`;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
      throw new Error("Usuario no encontrado. Por favor, regístrate primero.");
    }

    if (error.code === "auth/wrong-password") {
      throw new Error("Contraseña incorrecta");
    }

    throw new Error(`Error al iniciar sesión: ${error.message}`);
  }
};

/**
 * Registra un nuevo usuario
 * Usamos el username como email ficticio: username@simpsons.local
 */
export const registerUser = async (
  username: string,
  password: string
): Promise<User> => {
  const email = `${username.toLowerCase()}@simpsons.local`;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Establecer el displayName como el username
    await updateProfile(userCredential.user, {
      displayName: username,
    });

    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Este nombre de usuario ya está en uso. Por favor, elige otro o inicia sesión.");
    }

    if (error.code === "auth/weak-password") {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    throw new Error(`Error al registrar usuario: ${error.message}`);
  }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(`Error al cerrar sesión: ${error.message}`);
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

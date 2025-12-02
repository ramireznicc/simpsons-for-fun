import React, { useState } from "react";
import { LogIn, Lock, UserPlus, Heart } from "lucide-react";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSignup: (username: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Por favor ingresa tu nombre de usuario");
      return;
    }

    if (!password) {
      setError("Por favor ingresa tu contraseña");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        await onLogin(username.trim(), password);
      } else {
        await onSignup(username.trim(), password);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${mode === "login" ? "iniciar sesión" : "registrarse"}`);
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-simpsonSky flex flex-col px-4">
      {/* Contenedor centrado para header y form */}
      <div className="flex-1 flex flex-col items-center pt-12 pb-24 sm:pt-16 sm:pb-32">
        {/* Header decorativo */}
        <div className="mb-8 text-center">
          <h1 className="font-rock tracking-wide text-slate-900 drop-shadow-sm flex flex-col items-center gap-3">
            <span className="text-6xl sm:text-7xl">🍩</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-4xl">Simpsons</span>
              <span className="text-lg sm:text-xl text-slate-700 font-normal">(for fun)</span>
            </div>
          </h1>
        </div>

        {/* Card de login */}
        <div className="w-full max-w-md">
        <div className="bg-simpsonCream/95 rounded-2xl sm:rounded-3xl shadow-soft p-6 sm:p-8 border border-white/70">
          {/* Pestañas */}
          <div className="flex gap-1.5 mb-6 p-1.5 bg-white/60 backdrop-blur-sm rounded-xl border border-simpsonSky/20 shadow-sm">
            <button
              type="button"
              onClick={() => mode !== "login" && switchMode()}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                mode === "login"
                  ? "bg-simpsonYellow text-slate-900 shadow-lg scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => mode !== "signup" && switchMode()}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                mode === "signup"
                  ? "bg-simpsonYellow text-slate-900 shadow-lg scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Título */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-6 sm:mb-8">
            {mode === "login" ? "¡Ay, caramba! Entra ya" : "¡Mmm... nuevo usuario!"}
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-simpsonRed/10 border border-simpsonRed/30 text-simpsonRed text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: Homero, Marge, Bart..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white
                  focus:border-simpsonYellow focus:outline-none focus:ring-2 focus:ring-simpsonYellow/20
                  transition-all placeholder:text-slate-400 text-slate-900"
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white
                    focus:border-simpsonYellow focus:outline-none focus:ring-2 focus:ring-simpsonYellow/20
                    transition-all placeholder:text-slate-400 text-slate-900"
                  disabled={isLoading}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white
                      focus:border-simpsonYellow focus:outline-none focus:ring-2 focus:ring-simpsonYellow/20
                      transition-all placeholder:text-slate-400 text-slate-900"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!username.trim() || !password || (mode === "signup" && !confirmPassword) || isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                bg-simpsonYellow text-slate-900 font-bold text-lg shadow-lg
                hover:bg-simpsonYellow/90 hover:shadow-xl
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-simpsonYellow disabled:active:scale-100
                transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                  <span>{mode === "login" ? "Ingresando..." : "Registrando..."}</span>
                </>
              ) : (
                <>
                  {mode === "login" ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Ingresar</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Crear cuenta</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-sm text-white/90">
        <p className="flex items-center justify-center gap-1">
          Hecho con <Heart className="w-4 h-4 text-simpsonYellow fill-simpsonYellow inline-block" /> por{" "}
          <a
            href="https://github.com/ramireznicc"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline decoration-white/50 hover:decoration-white transition-all"
          >
            ramireznicc
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;

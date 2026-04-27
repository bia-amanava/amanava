// src/services/authService.ts

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("amanava_token", data.token);
      localStorage.setItem("amanava_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || "Email ou senha incorretos" };
    }
  } catch (error) {
    return { success: false, error: "Erro ao conectar ao servidor" };
  }
}

export function logout() {
  localStorage.removeItem("amanava_token")
  localStorage.removeItem("amanava_user")
}

export function isAuthenticated() {
  return !!localStorage.getItem("amanava_token")
}

export function getCurrentUser() {
  const user = localStorage.getItem("amanava_user")
  return user ? JSON.parse(user) : null
}

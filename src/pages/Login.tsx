// src/pages/Login.jsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/authService"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e: any) {
    e.preventDefault()
    const result = await login(email, password)

    if (result.success) {
      navigate("/") // Redireciona pro Dashboard
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md border border-gray-200 shadow-sm">
        
        {/* Logo / Marca */}
        <div className="flex justify-center mb-4">
          <img 
            src="/logo.png" 
            alt="Amanava Logo" 
            className="h-20 object-contain"
            onError={(e) => {
              // Fallback caso a imagem ainda não tenha sido enviada pro file explorer
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-12 h-12 rounded-lg bg-amanava-green flex items-center justify-center">
                  <span class="text-white font-bold text-3xl leading-none">a</span>
                </div>
              `;
            }}
          />
        </div>
        <h1 className="text-amanava-black text-2xl font-bold text-center mb-1">
          Amanava
        </h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          CFO as a Service
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-amanava-black font-medium text-sm mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-white text-gray-900 border border-gray-200 
                         rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amanava-green transition-shadow"
            />
          </div>

          <div>
            <label className="text-amanava-black font-medium text-sm mb-1.5 block">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white text-gray-900 border border-gray-200 
                         rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amanava-green transition-shadow"
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-amanava-coral text-sm text-center font-medium bg-amanava-coral/10 py-2 rounded-md">{error}</p>
          )}

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-amanava-green hover:bg-[#235a4f] text-white 
                       font-semibold py-3 rounded-lg transition-colors mt-2 shadow-sm"
          >
            Entrar
          </button>
        </form>

        {/* Hint de usuários fictícios (remover depois) */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-xs text-center font-semibold mb-2 uppercase tracking-wider">
            🧪 Credenciais de Demonstração
          </p>
          <div className="space-y-1">
            <p className="text-gray-600 text-xs text-center">
              <span className="font-medium text-amanava-black">Sócio:</span> ricardo@amanava.com / ricardo123
            </p>
            <p className="text-gray-600 text-xs text-center">
              <span className="font-medium text-amanava-black">Executiva:</span> ana@amanava.com / ana123
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

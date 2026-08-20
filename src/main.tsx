import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Checa por uma versão nova do app assim que abre e a cada 60s enquanto a
// aba estiver aberta, e ativa a atualização na hora (sem depender do usuário
// fechar o app ou dar refresh manual para deixar de ver a versão em cache).
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    registration.update()
    setInterval(() => registration.update(), 60_000)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

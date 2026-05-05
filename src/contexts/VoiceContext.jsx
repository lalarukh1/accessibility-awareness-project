import { createContext, useContext, useState, useCallback } from 'react'

const VoiceContext = createContext(null)

export function VoiceProvider({ children }) {
  const [status, setStatus] = useState('idle') // idle | listening | thinking | speaking

  const updateStatus = useCallback((s) => setStatus(s), [])

  return (
    <VoiceContext.Provider value={{ status, updateStatus }}>
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoice = () => useContext(VoiceContext)

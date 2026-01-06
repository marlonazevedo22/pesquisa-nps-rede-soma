'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Tracking de acesso único
    const visitorId = localStorage.getItem('visitorId') || crypto.randomUUID()
    localStorage.setItem('visitorId', visitorId)

    // Registrar acesso
    supabase.from('acessos').insert({
      ip_hash: visitorId, // usando visitorId como hash
      user_agent: navigator.userAgent,
    }).then(() => {
      console.log('Acesso registrado')
    })
  }, [])

  const handleScoreSelect = (score: number) => {
    // Salvar temporariamente ou passar via state
    sessionStorage.setItem('npsScore', score.toString())
    sessionStorage.setItem('startTime', new Date().getTime().toString())
    router.push('/questionario')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center">
        <div className="mb-6">
          <Image src="/logo.png" alt="Rede Soma Av. Sete" width={128} height={128} className="mx-auto" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Bem-vindo à Rede Soma Av. Sete</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6">De 0 a 10, qual a probabilidade de nos recomendar?</p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-6">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleScoreSelect(i)}
              className="bg-blue-600 text-white px-2 sm:px-3 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

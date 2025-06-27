import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="text-3xl font-bold underline text-blue-600">
               Tailwind fonctionne 🎉
          </div>
      </div>
    </>
  )
}

export default App

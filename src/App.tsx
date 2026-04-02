import { Board } from './components/Board'
import { useState } from 'react'

function App() {
  const [isActive, setIsActive] = useState(false)
  const handleStartGameVsHuman = () => {
    setIsActive(true)
  }

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
      <nav
        className='absolute top-0 left-0 w-full h-16 bg-gray-900 flex items-center justify-center'
      >
        <h1 className='text-white text-2xl font-bold'>Chess at Home</h1>

      </nav>
      <div className="flex items-center justify-center bg-gray-900">
        <Board isActive={isActive} startGameVsHuman={handleStartGameVsHuman}/>
      </div>
    </div>
  )
}

export default App

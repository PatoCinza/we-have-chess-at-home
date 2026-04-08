import { Board } from './components/Board'
import { useState } from 'react'
import { Chess } from 'chess.js'
import { Scoreboard } from './components/Scoreboard'

function App() {
  const [isActive, setIsActive] = useState(false)
  const [chess] = useState(() => new Chess())
  const [position, setPosition] = useState(chess.fen())

  const handleStartGameVsHuman = () => {
    setIsActive(true)
  }

  return (
    <div className='min-h-screen h-full bg-gray-900 flex items-center justify-center'>
      <nav
        className='absolute top-0 left-0 w-full h-16 bg-gray-900 flex items-center justify-center'
      >
        <h1 className='text-white text-2xl font-bold'>Chess at Home</h1>
      </nav>
      <div className="grid grid-cols-3 w-full">
        <div className=""></div>
        <div className="flex items-center justify-center bg-gray-900">
          <Board isActive={isActive} startGameVsHuman={handleStartGameVsHuman} chess={chess} position={position} setPosition={setPosition}/>
        </div>
        <div className="w-60 h-20 ml-auto mr-12">
          <Scoreboard chess={chess} setPosition={setPosition}/>
        </div>
      </div>
    </div>
  )
}

export default App

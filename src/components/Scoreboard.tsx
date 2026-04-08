import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'

export function Scoreboard({ chess, setPosition }: { chess: Chess, setPosition: (position: string) => void }) {
  const [currentPlayer, setCurrentPlayer] = useState<string>('w')

  useEffect(() => {
    setCurrentPlayer(chess.turn() as 'w' | 'b')
  }, [chess.turn()])

  const showCurrentPlayer = (currentPlayer: string) => {
    return currentPlayer === 'w' ? 'White' : 'Black'
  }

  const getMoves = (color: string) => {
    const n = color === 'White' ? 0 : 1;
    return (chess.history() || []).filter((_, i) => i % 2 === n).map((move, i) => {
      return <p key={i} className="text-white text-2xl">{move}</p>
    })
  }

  const History = ({ color }: { color: string }) => {
    return (
      <div className="flex flex-col items-center justify-top">
        <h2 className="text-white text-2xl text-left font-bold">{color}</h2>
        { getMoves(color) }
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl font-bold mb-8">{showCurrentPlayer(currentPlayer)} to play</h1>
      <div className="grid grid-cols-2 gap-4 w-full min-h-96 max-h-96 overflow-y-auto">
        <History color="White" />
        <History color="Black" />
      </div>
      <button className="mt-8 text-white text-2xl font-bold bg-blue-500 px-4 py-2 rounded-md" onClick={() => {
        chess.reset()
        setPosition(chess.fen())
      }}>Reset</button>
      <button className="mt-8 text-white text-2xl font-bold bg-blue-500 px-4 py-2 rounded-md" onClick={() => {
        fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_ANTHROPIC_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20260319',
            messages: [
              { role: 'system', content: 'You are a helpful assistant that generates chess moves.' },
              { role: 'user', content: 'Generate a chess move for the following position: ' + chess.fen() }
            ],
          }),
        }).then(response => response.json()).then(data => {
          console.log(data)
        })
      }}>Get AI Move</button>

    </div>
  )
}
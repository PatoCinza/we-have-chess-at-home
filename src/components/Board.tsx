type Color = 'white' | 'black'
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

interface Piece {
  color: Color
  type: PieceType
}

type Square = Piece | null
type BoardState = Square[][]

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']
const BACK_RANK: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

function createInitialBoard(): BoardState {
  const board: BoardState = Array.from({ length: 8 }, () => Array(8).fill(null))

  BACK_RANK.forEach((type, col) => {
    board[0][col] = { color: 'black', type }
    board[1][col] = { color: 'black', type: 'pawn' }
    board[6][col] = { color: 'white', type: 'pawn' }
    board[7][col] = { color: 'white', type }
  })

  return board
}

const INITIAL_BOARD = createInitialBoard()

export function Board({ isActive, startGameVsHuman }: { isActive: boolean, startGameVsHuman: () => void }) {
  return (
    <div className="inline-grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-1">
      {!isActive && (
        <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-gray-800/70 rounded-lg shadow-lg px-8 py-6 flex flex-col items-center">
            <h2 className="text-white text-2xl font-bold mb-2">Game Not Started</h2>
            <p className="text-gray-300 mb-4">Please start a game to begin playing chess.</p>
            <div className="flex gap-4">
              <button onClick={startGameVsHuman} className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">Start Game vs Human</button>
              <button disabled={true} className="disabled:cursor-not-allowed bg-blue-500 text-white px-4 py-2 rounded-md">Start Game vs AI</button>
            </div>
          </div>
        </div>
      )}
      {/* Rank labels */}
      <div className="flex flex-col">
        {RANKS.map(rank => (
          <div key={rank} className="w-5 h-16 flex items-center justify-center text-sm text-gray-500 font-medium select-none">
            {rank}
          </div>
        ))}
      </div>

      {/* Board squares */}
      <div className="border border-gray-700">
        {RANKS.map((rank, row) => (
          <div key={rank} className="flex">
            {FILES.map((file, col) => {
              const isLight = (row + col) % 2 === 0
              const piece = INITIAL_BOARD[row][col]
              return (
                <div
                  key={file}
                  className={`w-16 h-16 flex items-center justify-center ${
                    isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'
                  }`}
                >
                  {piece && (
                    <img
                      src={`/pieces/${piece.color} ${piece.type}.svg`}
                      alt={`${piece.color} ${piece.type}`}
                      className="w-12 h-12 select-none"
                      draggable={false}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Corner spacer */}
      <div />

      {/* File labels */}
      <div className="flex">
        {FILES.map(file => (
          <div key={file} className="w-16 h-5 flex items-center justify-center text-sm text-gray-500 font-medium select-none">
            {file}
          </div>
        ))}
      </div>
    </div>
  )
}

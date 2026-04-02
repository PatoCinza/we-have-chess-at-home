import React from 'react'

type PromotionPiece = 'q' | 'r' | 'b' | 'n'

interface PromotionWindowProps {
  color: 'w' | 'b'
  onSelect: (piece: PromotionPiece) => void
  onClose?: () => void
}

const PIECES: PromotionPiece[] = ['q', 'r', 'b', 'n']

export function PromotionWindow({ color, onSelect, onClose }: PromotionWindowProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
        <h2 className="text-white text-xl font-medium mb-2">Choose a promotion</h2>
        <div className="flex gap-4 mb-2">
          {PIECES.map(piece => (
            <button
              key={piece}
              className="focus:outline-none"
              onClick={() => onSelect(piece)}
              tabIndex={0}
              aria-label={`Promote to ${piece}`}
            >
              <img
                src={`/pieces/${color === 'w' ? 'white' : 'black'} ${{
                  q: 'queen',
                  r: 'rook',
                  b: 'bishop',
                  n: 'knight',
                }[piece]}.svg`}
                alt={piece}
                className="w-14 h-14"
                draggable={false}
              />
            </button>
          ))}
        </div>
        {onClose && (
          <button
            className="text-gray-400 mt-1 text-sm underline hover:text-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default PromotionWindow
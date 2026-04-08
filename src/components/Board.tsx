import { useState } from 'react'
import { Chess } from 'chess.js'
import type { Square as ChessSquare } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import PromotionWindow from './PromotionWindow'

const PIECE_MAP: Record<string, string> = {
  wP: 'white pawn', wN: 'white knight', wB: 'white bishop',
  wR: 'white rook',  wQ: 'white queen',  wK: 'white king',
  bP: 'black pawn', bN: 'black knight', bB: 'black bishop',
  bR: 'black rook',  bQ: 'black queen',  bK: 'black king',
}

const BOARD_SIZE = 512
const SQUARE_SIZE = BOARD_SIZE / 8

const customPieces = Object.fromEntries(
  Object.entries(PIECE_MAP).map(([code, name]) => [
    code,
    () => (
      <img src={`/pieces/${name}.svg`} style={{ width: SQUARE_SIZE, height: SQUARE_SIZE }} draggable={false} />
    ),
  ])
)

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']

export function Board({ isActive, startGameVsHuman, chess, position, setPosition }:
  { isActive: boolean, startGameVsHuman: () => void, chess: Chess, position: string, setPosition: (position: string) => void }) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({})
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null)

  function getMoveOptions(square: string) {
    const moves = chess.moves({ square: square as ChessSquare, verbose: true })
    if (!moves.length) { setOptionSquares({}); return }
    const styles: Record<string, React.CSSProperties> = {}
    moves.forEach(m => {
      styles[m.to] = {
        background: chess.get(m.to as ChessSquare)
          ? 'radial-gradient(circle, rgba(0,0,0,.2) 60%, transparent 65%)'
          : 'radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 30%)',
      }
    })
    styles[square] = { background: 'rgba(255,255,0,0.4)' }
    setOptionSquares(styles)
  }

  function tryMove(from: string, to: string, promotion?: string) {
    try {
      const result = chess.move({ from, to, promotion })
      if (result) setPosition(chess.fen())
    } catch {
      // illegal move
    }
    setSelectedSquare(null)
    setOptionSquares({})
    setPendingPromotion(null)
  }

  function isPromotionMove(from: string, to: string) {
    const piece = chess.get(from as ChessSquare)
    if (piece?.type !== 'p') return false
    const targetRank = to.charAt(1)
    return (piece.color === 'w' && targetRank === '8') || (piece.color === 'b' && targetRank === '1')
  }

  function onSquareClick({ square }: { square: string }) {
    if (!isActive) return
    const piece = chess.get(square as ChessSquare)

    // If no square is selected, select the clicked square if the piece is the correct color
    if (!selectedSquare) {
      if (piece?.color === chess.turn()) {
        setSelectedSquare(square)
        getMoveOptions(square)
      }
      return
    }

    // If the clicked square is the same as the selected square, deselect the square
    if (selectedSquare === square) {
      setSelectedSquare(null)
      setOptionSquares({})
      return
    }

    // If the user clicks another piece, select the square and get the move options
    if (piece?.color === chess.turn()) {
      setSelectedSquare(square)
      getMoveOptions(square)
      return
    }

    if (isPromotionMove(selectedSquare, square)) {
      setPendingPromotion({ from: selectedSquare, to: square })
      return
    }

    tryMove(selectedSquare, square)
  }

  function onPieceDrop({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) {
    if (!targetSquare) return false
    if (isPromotionMove(sourceSquare, targetSquare)) {
      setPendingPromotion({ from: sourceSquare, to: targetSquare })
      return true
    }
    tryMove(sourceSquare, targetSquare)
    return true
  }

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
          <div key={rank} className="w-5 flex items-center justify-center text-sm text-gray-500 font-medium select-none" style={{ height: SQUARE_SIZE }}>
            {rank}
          </div>
        ))}
      </div>

      {/* Board */}
      <div style={{ width: BOARD_SIZE }}>
        <Chessboard
          options={{
            position,
            onSquareClick,
            onPieceDrop,
            pieces: customPieces,
            squareStyles: optionSquares,
            boardStyle: { width: BOARD_SIZE, height: BOARD_SIZE },
            darkSquareStyle: { backgroundColor: '#b58863' },
            lightSquareStyle: { backgroundColor: '#f0d9b5' },
          }}
        />
      </div>

      {/* Corner spacer */}
      <div />

      {/* File labels */}
      <div className="flex">
        {FILES.map(file => (
          <div key={file} className="flex items-center justify-center text-sm text-gray-500 font-medium select-none" style={{ width: SQUARE_SIZE, height: 20 }}>
            {file}
          </div>
        ))}
      </div>

      {pendingPromotion && (
        <PromotionWindow
          color={chess.turn() as 'w' | 'b'}
          onSelect={piece => tryMove(pendingPromotion.from, pendingPromotion.to, piece)}
          onClose={() => setPendingPromotion(null)}
        />
      )}
    </div>
  )
}

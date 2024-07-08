import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`}  onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState(Array(9).fill(null));

  const winnerData = calculateWinner(squares);
  const winner = winnerData ? winnerData[0] : null;
  const col1 = winnerData ? winnerData[1] : null;
  const col2 = winnerData ? winnerData[2] : null;
  const col3 = winnerData ? winnerData[3] : null;
  

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    // setSquares(nextSquares);
    onPlay(nextSquares);
    // setXIsNext(!xIsNext);
  }

  return (
    <>
      <p>
      {
        winner ? <>Winner:<strong>{winner}</strong></> : <><strong>{ xIsNext ? "X" : "O" }</strong>'s move</>
      }
      </p>
      

      {
        [1, 2, 3].map((row) => (
          <div key={`board-row-${row}`} className="board-row">
            {
              [1, 2, 3].map(
                (col) => {
                  const index = 3 * (row - 1) + (col - 1);
                  const highlight = (index === col1 || index === col2 || index === col3);
                  return (
                  <Square
                    highlight = {highlight}
                    key={`square-${row}-${col}`}
                    onSquareClick={() => handleClick(index)}
                    value={squares[index]}
                  />
                )}
              )
            }
          </div>
        ))
      }
    </>
  );
}

export default function Game() {
  
  const [history, setHistory] = useState([Array(0).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  
  }

  function jumpTo(nextMove) {
    // const slicedHistory = history.slice(0,nextMove+1);
    // setHistory(slicedHistory);
    setCurrentMove(nextMove);  
  }
  
  const moves = history.map((squares, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
    
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>        
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(`${squares[a]} has won`)
      return [squares[a], a, b, c];
    }
  }
  return [null, null, null, null];
}
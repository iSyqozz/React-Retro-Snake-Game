import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'


const speeds = {
  easy: 150,
  medium: 75,
  hard: 30,
}

const opposites = {
  d: 'u',
  u: 'd',
  l: 'r',
  r: "l"
}

const init_coords = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }]
const init_apple = { x: 20, y: 20 }

const Game = ({ HighScore, setHighScore, setScore, Score }) => {
  const [Diff, setDiff] = useState('easy');
  const [Dir, setDir] = useState('r');
  const [Playing, setPlaying] = useState(false);
  const [Snake, setSnake] = useState(init_coords);
  const [Apple, setApple] = useState(init_apple);
  const [ArrowKey, setArrowKey] = useState('r');

  function isSnake(ele) {
    for (var pixel of Snake) {
      const x = pixel.x
      const y = pixel.y
      if (ele.x === x && ele.y === y) {
        return true
      }
    }
    return false
  }

  function isApple(ele) {
    const x = Apple.x
    const y = Apple.y
    if (ele.x === x && ele.y === y) {
      return true
    }
    return false
  }

  const generateRandomPosition = () => {
    const gridSize = 30; // Size of the grid

    while (true) {
      const randomX = Math.floor(Math.random() * gridSize);
      const randomY = Math.floor(Math.random() * gridSize);
      const randomPosition = { x: randomX, y: randomY };

      // Check if the random position is not within the snake's body
      if (!isSnake(randomPosition)) {
        return randomPosition;
      }
    }
  };



  const startGameLoop = () => {

    var new_dir = Dir;

    if (!(ArrowKey === opposites[Dir])) {
      new_dir = ArrowKey;
    }


    const head_x = Snake[Snake.length - 1].x;
    const head_y = Snake[Snake.length - 1].y;

    const next_x = (head_x + (new_dir === 'r' ? 1 : new_dir === 'l' ? -1 : 0) + 30) % 30;
    const next_y = (head_y + (new_dir === 'd' ? 1 : new_dir === 'u' ? -1 : 0) + 30) % 30;

    const is_apple = (isApple({ x: next_x, y: next_y }))
    const is_snake = (isSnake({ x: next_x, y: next_y }))

    var new_snake;

    if (!is_apple) {
      new_snake = [...Snake.slice(1), { x: next_x, y: next_y }];
    } else {
      new_snake = [...Snake, { x: next_x, y: next_y }];
      const newApplePosition = generateRandomPosition();
      setApple(newApplePosition);
      setScore(Score + 1);
    }

    setSnake(new_snake);
    setDir(new_dir)

    if (is_snake) {
      setPlaying(false)
      if (Score > HighScore) {
        toast.success('New High Score!', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      setHighScore(Math.max(Score, HighScore))
      setScore(0);
      setDir('r');
      setApple(init_apple)
      setSnake(init_coords)
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (Playing) {
        startGameLoop()
      }
    }, speeds[Diff]);

  }, [Snake, Playing]);

  useEffect(() => {
    console.log('effect');
    const handleKeyDown = (event) => {
      // Update the ArrowKeys state based on the arrow key pressed
      switch (event.key) {
        case 'ArrowUp':
          setArrowKey('u');
          break;
        case 'ArrowLeft':
          setArrowKey('l');
          break;
        case 'ArrowRight':
          setArrowKey('r');
          break;
        case 'ArrowDown':
          setArrowKey('d');
          break;
        default:
          break;
      }
    };
    // Attach event listeners for keydown and keyup events
    window.addEventListener('keydown', handleKeyDown);
    // Clean up the event listeners when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  useEffect(() => {
    console.log(Dir)
  }, [Dir])

  return (
    <div className='center-flex'>
      <div className='game-wrapper'>
        <div className='top-section'>
          <div className='curr-score'>Score: {Score}</div>
          <div className='difficulty'>
            <div className={Diff === 'easy' ? 'choosen-difficulty' : ''} onClick={() => { setDiff('easy') }}>Easy</div>
            <div className={Diff === 'medium' ? 'choosen-difficulty' : ''} onClick={() => { setDiff('medium') }}>Medium</div>
            <div className={Diff === 'hard' ? 'choosen-difficulty' : ''} onClick={() => { setDiff('hard') }}>Hard</div>
          </div>
        </div>
        <div className='game-grid'>
          {
            Array.from({ length: 30 }, (_, y) => (
              Array.from({ length: 30 }, (_, x) => {
                const position = { x: x, y: y };
                return (
                  <div
                    key={JSON.stringify(position)}
                    className={
                      'grid-element' + (isSnake(position) && Playing ? ' snake-part' : (isApple(position) && Playing ? ' apple' : ''))
                    }
                  >
                  </div>
                );
              })
            ))
          }
        </div>
        <div className='bottom-section center-flex'>
          {
            !Playing ?
              <div className='center-flex' onClick={() => { setPlaying(true) }}>Play</div>
              :
              <div className='center-flex' onClick={() => {
                setPlaying(false);
                if (Score > HighScore) {
                  toast.success('New High Score!', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
                }
                setHighScore(Math.max(Score, HighScore));
                setScore(0);
                setDir('r');
                setApple(init_apple);
                setSnake(init_coords);
              }
              }>Stop</div>
          }
        </div>
      </div>
    </div>
  )
}
export default Game
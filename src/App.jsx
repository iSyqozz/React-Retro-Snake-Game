import {useState} from 'react'
import "./App.css"
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import Highscore from './components/Highscore'
import Game from './components/Game'
import { toast,ToastContainer } from 'react-toastify'


const App = () => {
  const [HighScore,setHighScore] = useState(0);
  const [Score,setScore] = useState(0);
  return (
    <>
      <Navbar/>
      <Highscore HighScore={HighScore}/>
      <Game HighScore={HighScore} setHighScore={setHighScore} setScore={setScore} Score={Score}/>
      <ToastContainer position="bottom-left"/>
    </>
  )
}

export default App
import React from 'react'

const Highscore = ({HighScore, Score}) => {
  
  
  return (
    <div className='HighScore center-flex'>
        <div>High Score<br/>{HighScore}</div>
    </div>
  )
}

export default Highscore
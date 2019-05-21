import React from 'react';
import GameField from './components/gameField';
import { shuffleCells } from './utils';

function App() {
  return (
    <div className="App">
      <GameField shuffleFn={shuffleCells}/>
    </div>
  );
}

export default App;

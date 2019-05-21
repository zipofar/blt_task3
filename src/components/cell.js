import React from 'react';

export default (props) => {
  const { cellId, game, gameState, handleClick } = props;
  const cell = game[cellId];
  return gameState === 'empty' ? getEmptyCell(cellId) : getColorCell(cell, handleClick);
}

const getColorCell = (cell, handleClick) => {
  const colorClass = cell.isShow ? `game-field__col__${cell.color}` : 'game-field__col__color-none';
  return(
    <div
      className={`game-field__col ${colorClass}`}
      onClick={handleClick}
    />
  );
}

const getEmptyCell = (cellId) => (
  <div
    className="game-field__col game-field__col__color-none"
  />
);

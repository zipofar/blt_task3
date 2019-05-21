import React from 'react';

export default function Cell(props) {
  const { cell, gameIsEmpty } = props;
  if(_.isEmpty(game)) {
    return(
      <div
        key={`cell-${cell.id}`}
        className="game-field__col game-field__col__color-none"
      />
    );
  }
  const colorClass = cell.isShow ? `game-field__col__${cell.color}` : 'game-field__col__color-none';
  return(
    <div
      key={`cell-${cell.id}`}
      className={`game-field__col ${colorClass}`}
      onClick={() => (this.handleClick(cell.id))}
    />
  );
};

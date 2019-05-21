import React from 'react';
import _ from 'lodash';
import './gameField.css';
import Timer from './timer';
import Cell from './cell';

export default class GameField extends React.Component {
  static defaultProps = { gameDimension: 4 }

  constructor (props) {
    super(props);
    this.state = { game: {}, prevCell: {}, gameState: 'stop' }
    this.timer = React.createRef();
  }

  componentDidUpdate() {
    const { gameState } = this.state;
    if (this.gameIsFinish() && gameState === 'play') {
      this.setState({ gameState: 'stop' })
      const { minutes, sec, fakeMilisec } = this.timer.current.state;
      const congratsMsg = `You are winner!\nElapsed time: ${minutes}:${sec}.${fakeMilisec}`;
      alert(congratsMsg);
    }
  }

  buildColorCells (countPairs) {
    const { shuffleFn } = this.props;
    return Array(countPairs)
      .fill(0)
      .map((_e, i) => ([`color-${i + 1}`, `color-${i + 1}`]))
      .flat()
      .sort(shuffleFn);
  }

  generateGame () {
    const { gameDimension } = this.props;
    const cells = this.buildColorCells(gameDimension * 2);
    const game = cells.reduce((a, e, i) => ({...a, [i + 1]: { color: e, isShow: false, inGame: true, id: i + 1 }}), {});
    this.setState({ game, gameState: 'play' });
  }

  gameIsFinish () {
    const { game } = this.state;
    const hiddenCell = _.find(game, { inGame: true });
    return _.isUndefined(hiddenCell);
  }

  check (numCell) {
    const { game, prevCell } = this.state;
    const currentCell = game[numCell];

    if (currentCell.inGame === false) {
      return;
    }

    if (_.isEmpty(prevCell)) {
      this.setState({ prevCell: currentCell });
      return;
    }

    if (currentCell.color === prevCell.color && currentCell.id !== prevCell.id) {
      this.setState({ prevCell: {} });
      this.setState({ game: { ...game, [prevCell.id]: { ...prevCell, inGame: false }, [currentCell.id]: { ...currentCell, inGame: false } } });
      return;
    }

    if (currentCell.color !== prevCell.color) {
      this.setState({ game: { ...game, [prevCell.id]: { ...prevCell, isShow: false }, [currentCell.id]: { ...currentCell, isShow: false } } });
      this.setState({ prevCell: {} });
    }
  }

  handleClick (numCell) {
    const { game, prevCell } = this.state;
    const currentCell = game[numCell];
    this.setState({ game: { ...game, [currentCell.id]: { ...currentCell, isShow: true } } });
    setTimeout(() => this.check(numCell), 500);
  }

  prevCellIsPairOfCurrentCell (currentCell) {
    const { prevCell } = this.state;
    return currentCell.color === prevCell.color;
  }

  buildField () {
    const { gameDimension } = this.props;
    const { game } = this.state;
    const gameIsEmpty = _.isEmpty(game);

    return(
      Array(gameDimension)
      .fill(0)
      .map((_e, i) => {
        const numRow = i + 1;
        return(
          <div key={`row-${numRow}`} className="game-field__row">
            {this.buildRow(numRow, gameIsEmpty)}
          </div>
        );
      })
    );
  }

  buildRow (numRow, gameIsEmpty) {
    const { gameDimension } = this.props;
    return(
      Array(gameDimension)
      .fill(0)
      .map((_e, i) => {
        const startNumColumn = (gameDimension * numRow) - gameDimension + 1;
        const cellId = startNumColumn + i;
        const cell = game[cellId];
        const props = { cell, gameIsEmpty };
        return <Cell { ...props } />;
      })
    );
  }

  render() {
    const { gameState } = this.state;
    const timerIsStart = gameState === 'play';
    return (
      <div>
        <div className="game-field">
          {this.buildField()}
        </div>
        <button onClick={() => (this.generateGame())}>Start</button>
        <Timer ref={this.timer} timerIsStart={timerIsStart} />
      </div>
    );
  }
}

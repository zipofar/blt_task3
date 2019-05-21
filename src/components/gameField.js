import React from 'react';
import _ from 'lodash';
import './gameField.css';
import Timer from './timer';
import Cell from './cell';

export default class GameField extends React.Component {
  static defaultProps = { gameDimension: 4 }

  constructor (props) {
    super(props);
    this.state = { game: {}, prevCell: {}, gameState: 'empty' }
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
      const newPrevCell = { ...prevCell, inGame: false };
      const newCurrentCell = { ...currentCell, inGame: false };
      this.setState({ game: { ...game, [prevCell.id]: newPrevCell, [currentCell.id]: newCurrentCell } });
      this.setState({ prevCell: {} });
      return;
    }

    if (currentCell.color !== prevCell.color) {
      const newPrevCell = { ...prevCell, isShow: false };
      const newCurrentCell = { ...currentCell, isShow: false };
      this.setState({ game: { ...game, [prevCell.id]: newPrevCell, [currentCell.id]: newCurrentCell } });
      this.setState({ prevCell: {} });
    }
  }

  handleClick (numCell) {
    const { game } = this.state;
    const currentCell = game[numCell];
    this.setState({ game: { ...game, [currentCell.id]: { ...currentCell, isShow: true } } });
    setTimeout(() => this.check(numCell), 500);
  }

  buildField () {
    const { gameDimension } = this.props;
    return(
      Array(gameDimension)
      .fill(0)
      .map((_e, i) => {
        const numRow = i + 1;
        return(
          <div key={`row-${numRow}`} className="game-field__row">
            {this.buildRow(numRow)}
          </div>
        );
      })
    );
  }

  buildRow (numRow) {
    const { gameDimension } = this.props;
    const { game, gameState } = this.state;
    return(
      Array(gameDimension)
      .fill(0)
      .map((_e, i) => {
        const startNumColumn = (gameDimension * numRow) - gameDimension + 1;
        const cellId = startNumColumn + i;
        const handleClick = () => (this.handleClick(cellId));
        const props = { cellId, game, gameState, handleClick };
        return <Cell key={cellId} { ...props } />;
      })
    );
  }

  render() {
    const { gameState } = this.state;
    return (
      <div>
        <div className="game-field">
          {this.buildField()}
        </div>
        <button onClick={() => (this.generateGame())}>Start</button>
        <Timer ref={this.timer} timerIsStart={gameState === 'play'} />
      </div>
    );
  }
}

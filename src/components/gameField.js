import React from 'react';
import _ from 'lodash';
import './gameField.css';
import Timer from './timer';

export default class GameField extends React.Component {
  static defaultProps = { game_dimension: 4 }

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

  generate_colors (count_pairs) {
    return Array(count_pairs)
      .fill(0)
      .map((_e, i) => ([`color-${i + 1}`, `color-${i + 1}`]))
      .flat()
      .sort((a, b) => (Math.random() - 0.5));
  }

  generate_game () {
    const { game_dimension } = this.props;
    const colors = this.generate_colors(game_dimension * 2);
    const game = colors.reduce((a, e, i) => ({...a, [i + 1]: { color: e, isShow: false, inGame: true, id: i + 1 }}), {});
    this.setState({ game, gameState: 'play' });
  }

  gameIsFinish () {
    const { game } = this.state;
    const hiddenCell = _.find(game, { inGame: true });
    return _.isUndefined(hiddenCell);
  }

  check (num_cell) {
    const { game, prevCell } = this.state;
    const currentCell = game[num_cell];

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

  handle_click (num_cell) {
    const { game, prevCell } = this.state;
    const currentCell = game[num_cell];
    this.setState({ game: { ...game, [currentCell.id]: { ...currentCell, isShow: true } } });
    setTimeout(() => this.check(num_cell), 500);
  }

  prevCellIsPairOfCurrentCell (currentCell) {
    const { prevCell } = this.state;
    return currentCell.color === prevCell.color;
  }

  build_field () {
    const { game_dimension } = this.props;
    return(
      Array(game_dimension)
      .fill(0)
      .map((_e, i) => {
        const num_row = i + 1;
        return(
          <div key={`row-${num_row}`} className="game-field__row">
            {this.build_row(num_row)}
          </div>
        );
      })
    );
  }

  build_row (num_row) {
    const { game } = this.state;
    const { game_dimension } = this.props;
    return(
      Array(game_dimension)
      .fill(0)
      .map((_e, i) => {
        const start_num_col = (game_dimension * num_row) - game_dimension + 1;
        const num_cell = start_num_col + i;
        if(_.isEmpty(game)) {
          return(
            <div
              key={`cell-${num_cell}`}
              className="game-field__col game-field__col__color-none"
            />
          );
        }
        const currentCell = game[num_cell];
        const colorClass = currentCell.isShow ? `game-field__col__${currentCell.color}` : 'game-field__col__color-none';
        return(
          <div
            key={`cell-${num_cell}`}
            className={`game-field__col ${colorClass}`}
            onClick={() => (this.handle_click(num_cell))}
          />
        );
      })
    );
  }

  render() {
    const { gameState } = this.state;
    const timerIsStart = gameState === 'play';
    return (
      <div>
        <div className="game-field">
          {this.build_field()}
        </div>
        <button onClick={() => (this.generate_game())}>Start</button>
        <Timer ref={this.timer} timerIsStart={timerIsStart} />
      </div>
    );
  }
}

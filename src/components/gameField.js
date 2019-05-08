import React from 'react';
import _ from 'lodash';
import './gameField.css';

export default class GameField extends React.Component {
  static defaultProps = { game_dimension: 4 }
  state = {game: {}, prevCell: {}}

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
    const game = colors.reduce((a, e, i) => ({...a, [i + 1]: { color: e, isShow: false, id: i + 1 }}), {});
    this.setState({ game });
  }

  handle_click (num_cell) {
    const { game, prevCell } = this.state;
    const currentCell = game[num_cell];
    const findedPairCell = _.find(game, (o) => (o.color === currentCell.color && o.id !== currentCell.id));
    if (currentCell.isShow && findedPairCell.isShow) {
      this.setState({ prevCell: {} });
      return;
    }

    if (_.isEmpty(prevCell)) {
      this.setState({ prevCell: currentCell });
      this.setState({ game: { ...game, [currentCell.id]: { ...currentCell, isShow: true } } });
      return;
    }

    if (currentCell.id === prevCell.id) {
      this.setState({ prevCell: {} });
      this.setState({ game: { ...game, [currentCell.id]: { ...currentCell, isShow: !currentCell.isShow } } });
      return;
    }

    if (currentCell.color === prevCell.color && currentCell.id !== prevCell.id) {
      this.setState({ prevCell: {} });
      this.setState({ game: { ...game, [currentCell.id]: { ...currentCell, isShow: true } } });
      return;
    }

    if (currentCell.color !== prevCell.color) {
      this.setState({ prevCell: {} });
      this.setState({ game: { ...game, [prevCell.id]: { ...prevCell, isShow: false } } });
      console.log(findedPairCell)
      return;
    }
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
    return (
      <div>
        <div className="game-field">
          {this.build_field()}
        </div>
        <button onClick={() => (this.generate_game())}>Start</button>
      </div>
    );
  }
}

import React from 'react';
import './gameField.css';

export default class GameField extends React.Component {
  state = {game: {}}

  generate_colors (count_pairs) {
    return Array(count_pairs)
      .fill(0)
      .map((_, i) => ([`color-${i}`, `color-${i}`]))
      .flat();
  }

  generate_game_data (count_pairs) {
    const shuffled_colors = this.generate_colors(count_pairs).sort((a, b) => (Math.random() - 0.5));

    return Array(count_pairs * 2)
      .fill(0)
      .map((_, i) => (shuffled_colors[i]));
  }

  generate_game () {
    this.setState({game: {}});
  }

  build_field (size) {
    return(
      Array(size)
      .fill(0)
      .map((_, i) => {
        const num_row = i + 1;
        return(
          <div key={`row-${i}`} className="game-field__row">
            {this.build_row(size, num_row)}
          </div>
        );
      })
    );
  }

  build_row (size, num_row) {
    return(
      Array(size)
      .fill(0)
      .map((_, i) => {
        const start_num_col = (size * num_row) - size + 1;
        return(
          <div
            key={`col-${start_num_col + i}`}
            ncol={`col-${start_num_col + i}`}
            className="game-field__col game-field__col__color-none"
          />
        );
      })
    );
  }

  render() {
    return (
      <div>
        <div className="game-field">
          {this.build_field(4)}
        </div>
        <button onClick={() => (this.generate_game)}>Start</button>
      </div>
    );
  }
}

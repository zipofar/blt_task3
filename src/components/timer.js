import React from 'react';

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { minutes: 0, sec: 0, milisec: 0, fakeMilisec: '000' }
  }

  componentDidUpdate(prevProps) {
    if (this.props.timerIsStart === true && prevProps.timerIsStart === false) {
      this.startTimer();
      return;
    }

    if (this.props.timerIsStart === false && prevProps.timerIsStart === true) {
      this.stopTimer();
      return;
    }
  }

  startTimer() {
    this.timerIdMilisec = setInterval(() => this.incMilisec(), 100);
    this.timerIdSec = setInterval(() => this.incSec(), 1000);
    this.timerIdMinutes = setInterval(() => this.incMin(), 60000);
  }

  stopTimer() {
    clearInterval(this.timerIdMilisec);
    clearInterval(this.timerIdSec);
    clearInterval(this.timerIdMinutes);
  }

  incMilisec() {
    const { milisec } = this.state;
    const newMilisec = milisec > 899 ? 0 : milisec + 100;
    const fakeMilisec = this.buildMilisec(newMilisec);
    this.setState({ milisec: newMilisec, fakeMilisec })
  }

  incSec() {
    const { sec } = this.state;
    const newSec = sec < 59 ? sec + 1 : 0;
    this.setState({ sec: newSec })
  }

  incMin() {
    const { minutes } = this.state;
    this.setState({ minutes: minutes + 1 })
  }

  buildMilisec(milisec) {
    if (milisec === 0) {
      return '000';
    }
    if (milisec < 100) {
      return `0${this.getRandom()}`;
    }
    return milisec +this.getRandom();
  }

  getRandom() {
    return Math.floor(Math.random() * (99 - 10)) + 10;
  }

  render() {
    const { minutes, sec, fakeMilisec } = this.state;
    return <p>{minutes}:{sec}.{fakeMilisec}</p>
  }
}

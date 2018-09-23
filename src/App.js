import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Monome from './Monome'

class App extends Component {
  ROWS = 8
  COLS = 8

  constructor(props) {
    super(props);

    let tileStates = [];

    while (tileStates.length < this.ROWS * this.COLS) tileStates.push(false);

    this.state = {
      tileStates,
      current: 0,
      audioCtx: new AudioContext(),
    }
  }

  createOscillator = (freq) => {
    let oscillator = this.state.audioCtx.createOscillator();
    let gainNode = this.state.audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.state.audioCtx.destination)
    gainNode.gain.value = 0

    oscillator.type = 'sine';
    oscillator.frequency.value = freq; // value in hertz
    oscillator.start();

    return gainNode;
  }

  playNote = (gainId) => {
    console.log('Playing.. ' + gainId)
    const gainNode = this.state.gainNodes[gainId];

    gainNode.gain.value = 1;

    let interval = setInterval(() => {
      gainNode.gain.value -= 0.05;
      if (gainNode.gain.value <= 0) clearInterval(interval)
    }, 100)
  }

  componentDidMount() {
    let gainNodes = [];
    let notes = [783.99, 659.25, 523.25, 440, 349.23, 293.66, 246.94, 196.00];

    for (let i = 0; i < this.ROWS * this.COLS; i++) {
      let noteId = Math.floor(i / this.COLS);
      console.log(notes[noteId])
      gainNodes.push(this.createOscillator(notes[noteId]));
    }

    this.setState({ gainNodes })

    setInterval(() => {
      this.setState(prevState => ({ current: (prevState.current + 1) % this.COLS }))
    }, 500)
  }

  toggleTile = (i) => {
    this.setState(prevState => {
      prevState.tileStates[i] = !prevState.tileStates[i];
      return prevState;
    })
  }

  render() {
    return (
      <div className="App">
        <Monome
          playNote={this.playNote}
          tiles={this.state.tileStates}
          toggleTile={this.toggleTile}
          current={this.state.current}
          />
      </div>
    );
  }
}

export default App;

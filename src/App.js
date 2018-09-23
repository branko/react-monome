import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Monome from './Monome'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tileStates: [
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false
      ],
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
    }, 50)
  }

  componentDidMount() {
    let gainNodes = [];
    let notes = [783.99, 659.25, 523.25, 440];

    for (let i = 0; i < 16; i++) {
      let noteId = Math.floor(i / 4);
      console.log(notes[noteId])
      gainNodes.push(this.createOscillator(notes[noteId]));
    }

    this.setState({ gainNodes })

    setInterval(() => {
      this.setState(prevState => ({ current: (prevState.current + 1) % 4 }))
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

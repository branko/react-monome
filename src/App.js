import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Monome from './Monome';
import noteFrequencies from './notes.json'

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
    // Creates an oscillator locked to the input frequences,
    // returns just the gainNode for volume manipulation

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
    const gainNode = this.state.gainNodes[gainId];

    gainNode.gain.value = 1;

    let interval = setInterval(() => {
      gainNode.gain.value -= 0.05;
      if (gainNode.gain.value <= 0) clearInterval(interval)
    }, 100)
  }

  generateNewNotes = () => {
    let audioCtx = new AudioContext();

    let gainNodes = [];
    let nf = noteFrequencies;

    // These notes sound nice
    // let notes = [
    //   nf['D5'], nf['C5'], nf['B4'], nf['A4'], nf['G4'], nf['F4'], nf['E4'], nf['D4'],
    // ]

    let notes = []

    for (let i = 0; i < 8; i++) {
      let possibleNotes = Object.keys(noteFrequencies)
      let noteId = Math.floor(Math.random() * possibleNotes.length);
      let note = possibleNotes[noteId];

      notes.push(noteFrequencies[note])
    }

    notes = notes.sort((a, b) => b - a)

    for (let i = 0; i < this.ROWS * this.COLS; i++) {
      let noteId = Math.floor(i / this.COLS);
      console.log(notes[noteId])
      gainNodes.push(this.createOscillator(notes[noteId]));
    }

    this.setState({ audioCtx, gainNodes })
  }

  componentDidMount() {
    this.generateNewNotes()

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
        <input
          type="button"
          value="New Notes"
          onClick={this.generateNewNotes}
          />
      </div>
    );
  }
}

export default App;

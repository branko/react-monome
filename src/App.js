import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Knob from './Knob';
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
      currentRow: 0,
      audioCtx: new AudioContext(),
      maxVolume: 1,
      decayFactor: 0.9,
      tempo: 80,
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
    // If a rerender happened while the note tile was still active
    // We do not want to play it again
    if (this.state.alreadyPlayedThisInterval) return

    const gainNode = this.state.gainNodes[gainId];

    gainNode.gain.value = this.state.maxVolume;

    let interval = setInterval(() => {
      gainNode.gain.value *= this.state.decayFactor

      if (gainNode.gain.value <= 0) {
        clearInterval(interval);
        gainNode.gain.value = 0
      }
    }, 50)
    this.setState({ alreadyPlayedThisInterval: true })
  }

  generateNotes = () => {
    let audioCtx = new AudioContext();

    let gainNodes = [];
    let nf = noteFrequencies;

    // These notes sound nice
    let notes = [
      nf['D5'], nf['C5'], nf['B4'], nf['A4'],
      nf['G4'], nf['F4'], nf['E4'], nf['D4'],
    ]

    // Randomized notes
    // let notes = []
    //
    // for (let i = 0; i < 8; i++) {
    //   let possibleNotes = Object.keys(noteFrequencies)
    //   let noteId = Math.floor(Math.random() * possibleNotes.length);
    //   let note = possibleNotes[noteId];
    //
    //   notes.push(noteFrequencies[note])
    // }
    //
    // notes = notes.sort((a, b) => b - a)

    for (let i = 0; i < this.ROWS * this.COLS; i++) {
      let noteId = Math.floor(i / this.COLS);
      gainNodes.push(this.createOscillator(notes[noteId]));
    }

    this.setState({ audioCtx, gainNodes })
  }

  generateRandomPattern = () => {
    let tileStates = [];

    let rows = [0, 1, 2, 3, 4, 5, 6, 7]
    let shuffled = []

    while (rows.length > 0) {
      let idx = Math.floor(Math.random() * rows.length);
      shuffled.push(rows.splice(idx, 1)[0])
    }

    while (tileStates.length < this.ROWS * this.COLS) tileStates.push(false);

    for (let i = 0; i < 8; i++) {
      tileStates[i * 8 + shuffled[i]] = true
    }

    this.setState({
      tileStates
    })
  }

  bpmToMillisecondsPerNote = (bpm) => {
    const MS_IN_MINUTE = 1000 * 60;

    return MS_IN_MINUTE / (bpm * 4);
  }

  startInterval = (bpm) => {
    clearInterval(this.tempoInterval)

    this.tempoInterval = setInterval(() => {

      if (this.state.scheduleTempoChange) {
        this.setState(prevState => ({
          currentRow: (prevState.currentRow + 1) % this.COLS,
          alreadyPlayedThisInterval: false,
          scheduleTempoChange: false
        }),
          () => {
            const newBPM = this.bpmToMillisecondsPerNote(this.state.tempo)
            this.startInterval(newBPM)
          }
        )

        return;
      }

      this.setState(prevState => ({
        currentRow: (prevState.currentRow + 1) % this.COLS,
        alreadyPlayedThisInterval: false,
      }))
    }, bpm)
  }

  componentDidMount() {
    this.generateNotes()

    this.startInterval(this.bpmToMillisecondsPerNote(this.state.tempo));
  }

  toggleTile = (i) => {
    this.setState(prevState => {
      prevState.tileStates[i] = !prevState.tileStates[i];
      return prevState;
    })
  }

  handleDecayChange = (newValue) => {
    this.setState({ decayFactor: newValue });
  };

  handleTempoChange = (newValue) => {
    this.setState({ tempo: newValue });
  };

  handleTempoChangeEnd = (newValue) => {
    this.setState({
      scheduleTempoChange: true,
    })
  }

  render() {
    return (
      <div className="App instrument">
        <Monome
          playNote={this.playNote}
          tiles={this.state.tileStates}
          toggleTile={this.toggleTile}
          currentRow={this.state.currentRow}
        />
        <div className="controls">
          <div className="knob">
            <h3>Note Length</h3>
            <Knob
              value={this.state.decayFactor}
              onChange={this.handleDecayChange}
              max={0.99}
              min={0.7}
              step={0.01}
              width={100}
              height={100}
              />
          </div>
          <div className="knob">
            <h3>Tempo</h3>
            <Knob
              value={this.state.tempo}
              onChange={this.handleTempoChange}
              onChangeEnd={this.handleTempoChangeEnd}
              max={150}
              min={50}
              step={1}
              width={100}
              height={100}
              />
          </div>
          <input
            type="button"
            value="Generate Random Pattern"
            onClick={this.generateRandomPattern}
            />
        </div>

      </div>
    );
  }
}

export default App;

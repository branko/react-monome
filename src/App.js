import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Monome from './Monome'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tileStates: [
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false
      ],
      current: 0,
    }


  }

  componentDidMount() {
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
          tiles={this.state.tileStates}
          toggleTile={this.toggleTile}
          current={this.state.current}
          />
      </div>
    );
  }
}

export default App;

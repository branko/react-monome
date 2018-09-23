import React, { Component } from 'react'
import MonomeTile from './MonomeTile'

class Monome extends Component {
  render() {

    const tiles = this.props.tiles.map((t, i) => {
      return (
        <MonomeTile
          playNote={this.props.playNote}
          active={ i % 8 === this.props.current }
          key={i}
          tileId={i}
          enabled={t}
          toggleTile={this.props.toggleTile}
          />)
    })

    return (<div className="monome">
      {tiles}
    </div>)
  }
}

export default Monome;

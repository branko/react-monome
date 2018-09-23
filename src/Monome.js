import React, { Component } from 'react'
import MonomeTile from './MonomeTile'

class Monome extends Component {
  render() {

    const tiles = this.props.tiles.map((t, i) => {
      return (
        <MonomeTile
          active={ i % 4 === this.props.current }
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

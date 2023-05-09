import './App.css';
import React from 'react';
import Game from './Game.js';
import LogMenu from './LogMenu';
import TestingChild from './TestingChild';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="App">
        <h1>Vislice</h1>
        <LogMenu />
        <Game />
        <TestingChild />
      </div>
    );
  }
}

export default App;
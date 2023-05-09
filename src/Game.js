import './Game.css';
import React from 'react';

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      life: 7,
      word: "",
      tried: "",
      found: [],
      win: false,
    }
    this.handleClick = this.handleClick.bind(this);
    this.eventListener = this.eventListener.bind(this);
    this.fetchWord = this.fetchWord.bind(this);
  }

  eventListener(event) {
    this.setState((state) => {
      if (!event.key) return;
      let lowerKey = event.key.toLowerCase()
      let regEx1 = /..|[\W]|\d/
      let regEx2 = /[čžš]/
      let testKey1 = regEx1.test(lowerKey);
      let testKey2 = regEx2.test(lowerKey);
      if (testKey1 === true && testKey2 === true) {
        testKey1 = false;
      }
      let found = state.found;
      let tried = state.tried;
      let word = state.word;
      let life = state.life;
      let arrayWord = word.split("")
      let wordHasLetter = word.indexOf(lowerKey);
      let checkForWin = found.join("").indexOf(" ")
      let aboutToWin = found.join("").lastIndexOf(" ");
      let checkForRepeats = tried.split("").indexOf(lowerKey);
      
      if (checkForWin !== -1 && checkForRepeats === -1 && testKey1 === false) {

        if (wordHasLetter >= 0 && aboutToWin === checkForWin) {
          for (let i = 0; arrayWord.length > i; i++) {
            if (arrayWord[i] !== found[i] && arrayWord[i] === lowerKey) {
              found[i] = lowerKey;
            }
          }
          return {
            win: true,
            tried: tried + " " + lowerKey,
            found: found
          }
        }

        else if (wordHasLetter < 0 && life > 0) {
          if (tried.length === 0) {
            return {
              tried: lowerKey,
              life: life-1
            }
          } else {
            return {
              tried: tried + " " + lowerKey,
              life: life-1
            }
          }
        }

        else if (wordHasLetter >= 0) {
          for (let i = 0; arrayWord.length > i; i++) {
            if (arrayWord[i] !== found[i] && arrayWord[i] === lowerKey) {
              found[i] = lowerKey;
            }
          }
          if (tried.length === 0) {
            return {
              tried: lowerKey,
              found: found
            }
          } else {
            return {
              tried: tried + " " + lowerKey,
              found: found
            }
          }
        }

      }

    });
  }

  componentDidMount() {
    this.handleClick()
    document.addEventListener("keydown", this.eventListener)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.eventListener)
  }

  async fetchWord() {
    let fetchedWord = await fetch("http://localhost:3000/words/random");
    let processedWord = await fetchedWord.json();
    return processedWord.normalizedWord;
  }

  async handleClick() {
    const randomWord = await this.fetchWord()
    this.setState(() => {
      return {
        life: 7,
        word: randomWord,
        found: randomWord.split("").map(el => " "),
        tried: "",
        win: false
      }
    })
  }

  render() {
    let life = this.state.life
    let found = this.state.found
    let checkForWin = found.join("").indexOf(" ")

    let wordNotFound = <b>{this.state.word}</b>;
    let letters = found.map((el, index) => <div className="letters" key={el+index}>{el}</div>);

    let winState = <h3>! Zvezdica živi !</h3>;
    let loseState = <h3>... Zvezdica je umrla ...</h3>;
    let playState = <h3>Reši zvezdico</h3>
    
    let alt = `Vislice - preostaja ti${life} življenja.`
    let link = `Vislice_${life}.png`
    const img = <img src={link} className="image" alt={alt} />
    const imgWin = <img src="Vislice_7.png" className="image" alt={alt} />;

    return (
      <div className="Game">
        <p className="life-box">Življenje: <b>{life}</b></p>
        <div>
          <p>Iskana beseda je: {life < 1 && wordNotFound}</p>
          <div className="letters-box">{letters}</div>
        </div>
        <br />
        <button onClick={this.handleClick}>Izberi besedo</button>
        <p>Že uporabljeno: <b>{this.state.tried}</b></p>
        <div>
          {this.state.win === false ? img : imgWin}
          {life > 0 && checkForWin !== -1 && playState}
          {life < 1 && loseState}
          {checkForWin === -1 && winState}
        </div>
      </div>
    );
  }
}

export default Game;
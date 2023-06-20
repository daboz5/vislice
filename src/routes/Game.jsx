import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import useAppStore from '../Store.ts';
import apiURL from '../utils/api_url.ts';
import './Game.css';

const Game = () => {
  const [life, setLife] = useState(7);
  const [word, setWord] = useState("");
  const [wordId, setWordId] = useState(0);
  const [tried, setTried] = useState("");
  const [found, setFound] = useState([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const menuState = useAppStore(state => state.menuState);
  
  useEffect(() => {
    handleClick();
  }, []);

  const eventListener = useCallback((event) => {
    if (menuState || lost || won) {
      return
    }
    let lowerKey = event.key.toLowerCase()

    let regEx1 = /..|[\W]|\d/
    let regEx2 = /[čžš]/
    let regEx3 = /[qwđćyx]/
    let testKey1 = regEx1.test(lowerKey);
    let testKey2 = regEx2.test(lowerKey);
    let testKey3 = regEx3.test(lowerKey);
    let testsResult = true;
    if (testKey1 === true) {
      testsResult = false;
    }
    if (testKey1 === true && testKey2 === true) {
      testsResult = true;
    }
    if (testKey1 === false && testKey3 === true) {
      testsResult = false;
    }

    let arrayWord = word.split("")
    let wordHasLetter = word.indexOf(lowerKey);
    let checkForRepeats = tried.split("").indexOf(lowerKey);

    if (checkForRepeats === -1 && testsResult) {

      if (wordHasLetter < 0 && life > 0) {
        if (tried.length === 0) {
          setTried(lowerKey);
          setLife(life-1);
        } else {
          setTried(tried + " " + lowerKey);
          setLife(life-1);
        }

        if (life === 0) {
          setLost(true);
        }
      }

      else if (wordHasLetter >= 0) {
        for (let i = 0; arrayWord.length > i; i++) {
          if (arrayWord[i] !== found[i] && arrayWord[i] === lowerKey) {
            found[i] = lowerKey;
          }
        }
        if (tried.length === 0) {
          setTried(lowerKey);
          setFound(found);
        } else {
          setTried(tried + " " + lowerKey);
          setFound(found);

          let checkForWin = found.join("").indexOf(" ");
          if (checkForWin === -1) {
            setWon(true);
            handleWin();
          }
        }
      }
    }
  }, [word, tried, menuState])

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  }, [eventListener]);

  const handleClick = async () => {
    let Word = await fetch(apiURL + "/words/random")
      .then(response => response.json());
    let normalWord = Word.normalizedWord;
    let idWord = Word.id;
    console.log(idWord, normalWord)
    setLife(7);
    setWord(normalWord);
    setWordId(idWord)
    setFound(normalWord.split("").map(el => " "));
    setTried("");
    setWon(false);
    setLost(false);

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      credentials: "include"
  };

    await fetch(apiURL + "/guesses/me", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result));
  }

  const handleWin = async () => {
    var raw = JSON.stringify({
      "wordId": wordId,
      "guesses": tried.split(" ")
    });

    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow',
        credentials: "include"
    };

    await fetch(apiURL + "/guesses", requestOptions)
    .then(response => response.json())
    .then((result) => {
      console.log(result)
    })
    .catch(error => {
        console.log(error);
        toast.error = (
            `Nekaj je šlo narobe.
            Znova poskusite kasneje ali nas opozorite o napaki.`
        );
    });
  }

  let checkForWin = found.join("").indexOf(" ")

  let wordNotFound = <b>{word}</b>;
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
        <h1>Vislice</h1>
        <p className="life-box">Življenje: <b>{life}</b></p>
        <div>
            <p>Iskana beseda je: {life < 1 && wordNotFound}</p>
            <div className="letters-box">{letters}</div>
        </div>
        <br />
        <button onClick={handleClick}>Nova beseda</button>
        <p>Že uporabljeno: <b>{tried}</b></p>
        <div>
            {won === false ? img : imgWin}
            {life > 0 && checkForWin !== -1 && playState}
            {life < 1 && loseState}
            {checkForWin === -1 && winState}
        </div>
    </div>
  );
}

export default Game;
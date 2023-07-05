import { useState, useEffect, useCallback } from 'react';
import apiURL from '../utils/api_url';
import useFetch from '../utils/useFetch';
import useLocalStorage from '../utils/useLocalStorage';
import './Game.css';

export default function Game () {
  const [life, setLife] = useState(7);
  const [word, setWord] = useState("");
  const [wordId, setWordId] = useState(0);
  const [tried, setTried] = useState("");
  const [found, setFound] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const { getData } = useLocalStorage();
  const menuOpened = getData("menuOpened");

  const { postFetch } = useFetch();
  
  useEffect(() => {
    handleClick();
  }, []);

  const eventListener = useCallback((event) => {
    if (menuOpened || lost || won) {
      return
    }
    let lowerKey: string = event.key.toLowerCase();

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
        let newFound: string[] = found;
        for (let i = 0; arrayWord.length > i; i++) {
          if (arrayWord[i] !== found[i] && arrayWord[i] === lowerKey) {
            newFound[i] = lowerKey;
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
  }, [word, tried, menuOpened])

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  }, [eventListener]);

  const handleClick = async () => {
    let Word = await fetch(apiURL + "/words/random")
      .then(response => response.json());
    let normalWord: string = Word.normalizedWord;
    let idWord = Word.id;
    //console.log(idWord, normalWord)
    setLife(7);
    setWord(normalWord);
    setWordId(idWord)
    setFound(normalWord.split("").map(() => " "));
    setTried("");
    setWon(false);
    setLost(false);
  }

  const handleWin = () => {
    const input = {
      "wordId": wordId,
      "guesses": tried.split(" ")
    }
    postFetch("/guesses", input);
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
            <div className="letters-box">
              {word ?
                letters :
                "Povezave s serverjem ni bilo mogoče vzpostaviti."
              }
            </div>
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
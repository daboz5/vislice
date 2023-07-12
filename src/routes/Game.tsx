import { useEffect } from 'react';
import { Word } from '../type';
import useGame from '../utils/useGame';
import useLocalStorage from '../utils/useLocalStorage';
import './Game.css';

export default function Game () {

  const {
    won,
    lost,
    game,
    checkForWin,
    letters,
    handleClick,
    eventListener
  } = useGame();

  const { getData } = useLocalStorage();

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  }, [eventListener]);

  const word: Word = getData("word");

  return (
    <section className="Game">

      <h1>Vislice</h1>
      <p>Življenje: <b>{game.life}</b></p>
      <p>
        Iskana beseda je: {won && word.word}{lost && word.word}
      </p>
      {lost && <p>{word.definition}</p>}
      {won && <p>{word.definition}</p>}
      <div className="lettersBox">
        {
          word ?
          letters :
          "Povezave s serverjem ni bilo mogoče vzpostaviti."
        }
      </div>

      <button
        id="newWordBtn"
        onClick={() => handleClick()}>
        Nova beseda
      </button>

      <p>Že uporabljeno: <b>{game.tried}</b></p>

      <div>
        {
          won === false ?
          <img
            src={`Vislice_${game.life}.png`}
            className="image"
            alt={`Preostaja ${game.life} življenja`}
          /> :
          <img
            src="Vislice_7.png"
            className="image"
            alt={`${game.life} življenja`}
          />
        }
        {
          game.life > 0 &&
          checkForWin !== -1 &&
          <h3>Reši zvezdico</h3>
        }
        {
          game.life < 1 &&
          <h3>... Zvezdica je umrla ...</h3>
        }
        {
          checkForWin === -1 &&
          <h3>! Zvezdica živi !</h3>
        }
      </div>

    </section>
  );
}
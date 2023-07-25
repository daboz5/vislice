import { useEffect } from 'react';
import useAppStore from '../Store';
import useGame from '../utils/useGame';
import Help from '../game/Help';
import './Game.css';

export default function Game () {

  const {
    word,
    darkMode,
    panic,
    game,
    won,
    lost
  } = useAppStore();

  const {
    gameOn,
    found,
    used,
    napis,
    handlePanicBtn,
    handleClick,
    eventListener,
    probability
  } = useGame();

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  }, [eventListener]);

  return (
    <section className="Game">

      <Help />

      <h1>Vislice</h1>
      <div id="lifeBox">
        <div
          id="panicBtnBox"
          onClick={() => handlePanicBtn()}>
          <div
            id="panicBtn"
            style={panic.style}>
            </div>
        </div>
        <p id="life">Življenje: <b>{game.life}</b></p>
      </div>
      <p
        id="iskanaBeseda">
        Iskana beseda je: <b>{won !== lost && word?.word}</b>
      </p>
      <div className="lettersBox" inputMode='none'>
        {
          word === null && gameOn ?
            "Povezave s serverjem ni bilo mogoče vzpostaviti." :
            won !== lost ?
              <div id="defBox"><p id="wordDefinition">{word?.definition}</p></div> :
              found
        }
      </div>

      <button
        id="newWordBtn"
        onClick={() => handleClick()}>
        Nova beseda
      </button>

      {
        won || lost ?
        <p id="uporabljeno">Verjetnost zmage je bila {probability()}</p> :
        <p id="uporabljeno">Že uporabljeno: <b>{used}</b></p>
      }
      <div>
        <img
          src={`Vislice_${game.life}${darkMode ? "-dark" : ""}.png`}
          className="image"
          alt={`Preostaja ${game.life} življenja`}
        />
        {
          game.life > 0 && napis.action ? napis.action :
              lost && napis.lost ? napis.lost :
              won && napis.won
        }
      </div>

    </section>
  );
}
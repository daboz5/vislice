import { useEffect } from 'react';
import useAppStore from '../Store';
import useGame from '../utils/useGame';
import Help from '../game/Help';
import './Game.css';
import useRoot from '../utils/useRoot';

export default function Game() {

  const {
    word,
    darkMode,
    panic,
    game,
    won,
    lost
  } = useAppStore();

  const {
    boxShadowStyleBtn,
    handleBtnClickStyle
  } = useRoot();

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
        className="button"
        onClick={() => handleClick()}
        onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
        onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false)}
        onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false)}
        style={{ boxShadow: boxShadowStyleBtn }}>
        Nova beseda
      </button>

      {
        won || lost ?
          <p id="uporabljeno">Verjetnost slepe zmage je bila {probability()}</p> :
          <p id="uporabljeno">Že uporabljeno: <b>{used}</b></p>
      }
      <div id="gameVisuals">
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

    </section >
  );
}
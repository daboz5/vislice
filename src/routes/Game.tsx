import { useEffect } from 'react';
import useAppStore from '../Store';
import useGame from '../utils/useGame';
import './Game.css';

export default function Game () {

  const {
    word,
    darkMode,
  } = useAppStore();

  const {
    gameOn,
    won,
    lost,
    game,
    found,
    used,
    napis,
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

      <h1>Vislice</h1>
      <p id="life">Življenje: <b>{game.life}</b></p>
      <p
        id="iskanaBeseda">
        Iskana beseda je: <b>{won !== lost && word?.word}</b>
      </p>
      <div className="lettersBox" inputMode='none'>
        {
          word === null && gameOn ?
            "Povezave s serverjem ni bilo mogoče vzpostaviti." :
            won !== lost ?
              <p id="wordDefinition">{word?.definition}</p> :
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
        <p id="uporabljeno">Povprečna verjetnost zmage je bila {probability()}</p> :
        <p id="uporabljeno">Že uporabljeno: <b>{used}</b></p>
      }

      <div>
        {
          won === false ?
          <img
            src={`Vislice_${game.life}${darkMode ? "-dark" : ""}.png`}
            className="image"
            alt={`Preostaja ${game.life} življenja`}
          /> :
          <img
            src={`Vislice_7${darkMode && "-dark"}.png`}
            className="image"
            alt={`${game.life} življenja`}
          />
        }
        {
          game.life > 0 &&
          !won && !lost &&
          napis.action
        }
        {
          lost &&
          napis.lost
        }
        {
          won &&
          napis.won
        }
      </div>

    </section>
  );
}
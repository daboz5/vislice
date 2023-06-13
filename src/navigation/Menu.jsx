import { useState } from 'react';
import useAppStore from '../Store.ts';
import Login from './Login.jsx';
import Register from './Register.jsx';
import './Menu.css';

const Menu = () => {

  const { menuState, changeMenuState, profilePic } = useAppStore();

  const [registration, setRegistration] = useState(false);
  const [regString, setRegString] = useState(<>Potrebuješ nov račun? Klikni tukaj.</>);

  const changeMenuType = () => {
    if (registration) {
      setRegString(<>Potrebuješ nov račun? Klikni tukaj.</>);
    } else {
      setRegString(<>Že imaš račun? Klikni tukaj.</>);
    }
    setRegistration(!registration);
  }

  const btn = (
    <div className="loginButton"
      onClick={() => changeMenuState()}
      ><img
        className="loginButtonImage"
        src={profilePic ?
          profilePic :
          "user-astronaut-solid.svg"
        }
        style={profilePic ?
          {maxHeight: "100%", maxWidth: "100%"} :
          {maxHeight: "75%", maxWidth: "75%"}
        }
        alt="Slika profila"
      />
    </div>
  );
      
  return menuState ?
    <div className="Login">
      <div
        className="screen"
        onClick={() => changeMenuState()}>
      </div>
      {btn}
      <div className="loginMenu-box">
        {registration === false ?
          <Login/> :
          <Register />
        }
        <button
          className="button button-subtle"
          onClick={changeMenuType}
          rel="noopener noreferrer"
          >{regString}
        </button>
      </div>
    </div> :
    
    btn;
}

export default Menu;
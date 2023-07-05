import { useState } from 'react';
import useAppStore from '../Store';
import Login from './Login';
import Register from './Register';
import useLocalStorage from '../utils/useLocalStorage';
import './Menu.css';

const Menu = () => {

  const { profilePic, menuOpened, switchMenuState } = useAppStore();

  const { storeData } = useLocalStorage();
  
  const [registration, setRegistration] = useState(false);
  const [regString, setRegString] = useState(<>Potrebuješ nov račun? Klikni tukaj.</>);
  
  const handleBtnClick = () => {
    storeData("menuOpened", !menuOpened);
    switchMenuState(!menuOpened);
  }
  
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
      onClick={() => handleBtnClick()}
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
      
  return menuOpened ?
    <div className="Login">
      <div
        className="screen"
        onClick={() => handleBtnClick()}>
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
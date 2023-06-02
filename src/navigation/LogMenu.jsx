import { useState } from 'react';
import useAppStore from '../Store.ts';
import Login from './Login';
import Register from './Register';
import Button from '../app/Button';
import './LogMenu.css';

const LogMenu = () => {

  const { menuState, changeMenuState, profilePic } = useAppStore();

  const [registration, setRegistration] = useState(false);
  const [regString, setRegString] = useState(<>Potrebuješ nov račun? Klikni tukaj.</>);
  const [online, setOnline] = useState(false);

  const handleChangeMenuType = () => {
    if (registration) {
      setRegString(<>Potrebuješ nov račun? Klikni tukaj.</>);
    } else {
      setRegString(<>Že imaš račun? Klikni tukaj.</>);
    }
    setRegistration(!registration);
  }
  
  const reportLoginStatus = () => {
    setOnline(!online);
  }

  const btn = (
    <div className="loginButton"
      onClick={() => changeMenuState()}
      ><img
        className="loginButtonImage"
        src={online ?
          profilePic :
          "user-astronaut-solid.svg"
        }
        style={online ?
          {maxHeight: "100%", maxWidth: "100%"} :
          {maxHeight: "75%", maxWidth: "75%"}
        }
        alt="Slika profila"
      />
    </div>
  );
      
  return menuState ?
    (<div className="Login">
      <div
        className="screen"
        onClick={() => changeMenuState()}>
      </div>
      {btn}
      <div className="loginMenu-box">
        {registration === false ?
        <Login
          online={online}
          reportLoginStatus={() => reportLoginStatus()}
        /> :
        <Register />}
        <Button
          button="subtle"
          onClick={handleChangeMenuType}>
          {regString}
        </Button>
      </div>
    </div>) :
    btn;
}

export default LogMenu;
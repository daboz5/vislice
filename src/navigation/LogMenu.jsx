import { useState, useContext } from 'react';
import { MenuContext } from '../routes/Root';
import Login from './Login';
import Register from './Register';
import Button from '../app/Button';
import './LogMenu.css';

const LogMenu = () => {

  const {menuState, setMenuState, accPic} = useContext(MenuContext);

  const [registration, setRegistration] = useState(false);
  const [regChange, setRegChange] = useState(<>Potrebuješ nov račun? Klikni tukaj.</>);
  const [online, setOnline] = useState(false);

  const handleChangeMenuState = () => {
    setMenuState(!menuState)
  }
  
  const handleChangeMenuType = () => {
    if (registration) {
      setRegChange(<>Potrebuješ nov račun? Klikni tukaj.</>);
    } else {
      setRegChange(<>Že imaš račun? Klikni tukaj.</>);
    }
    setRegistration(!registration);
  }
  
  const reportLoginStatus = () => {
    setOnline(!online);
  }

  const btn = (
    <div className="loginButton">
      {accPic ?
        <img
        className="loginButtonImage"
        src={"user-astronaut-solid.svg"}
        onClick={handleChangeMenuState}
        alt="Slika profila"
        /> :
        <img
          className="loginButtonImageDef"
          src={"user-astronaut-solid.svg"}
          onClick={handleChangeMenuState}
          alt="Slika profila"
        />
      }
    </div>
  );
      
  return menuState ?
    (<div className="Login">
      <div
        className="screen"
        onClick={handleChangeMenuState}>
      </div>
      {btn}
      <div className="loginMenu-box">
        {registration === false ?
        <Login
          online={online}
          reportStatus={() => reportLoginStatus()}
        /> :
        <Register />}
        <Button
          button="subtle"
          onClick={handleChangeMenuType}>
          {regChange}
        </Button>
      </div>
    </div>) :
    btn;
}

export default LogMenu;
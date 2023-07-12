import useAppStore from '../Store';
import useMenu from '../utils/useMenu';
import Login from './Login';
import Register from './Register';
import LogedIn from './LogedIn';
import './Menu.css';

export default function Menu () {

  const { online, menuOpened, profPic } = useAppStore();
  const { menuType, handleBtnClick, cngMenuType } = useMenu();

  const btn = (
    <div className="loginButton"
      onClick={() => handleBtnClick()}>
      <img
        className="loginButtonImage"
        src={
          profPic ?
          profPic :
          "user-astronaut-solid.svg"
        }
        style={
          profPic ?
          {maxHeight: "100%", maxWidth: "100%"} :
          {maxHeight: "75%", maxWidth: "75%"}
        }
        alt="Slika profila"
      />
    </div>
  )

  return menuOpened ?

    <div className="Login">

      <div
        className="screen"
        onClick={() => handleBtnClick()}>
      </div>

      {btn}

      <div className="loginMenu-box">
        {
          (menuType.regOpened === true) ?
            <Register/> :
            (online === false) ?
              <Login/> :
              <LogedIn/>
        }
        <button
          className="button button-subtle"
          onClick={() => cngMenuType()}
          rel="noopener noreferrer">
          {menuType.string}
        </button>
      </div>

    </div> :
    
    btn;
}
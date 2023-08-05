import { useEffect } from "react";
import useAppStore from '../Store';
import useMenu from '../utils/useMenu';
import Login from './Login';
import Register from './Register';
import LogedIn from './LogedIn';
import Chains from '../assets/Chains';
import './Menu.css';

export default function Menu() {

  const { user, darkMode, menuOpened } = useAppStore();
  const {
    menuType,
    btn,
    darkBtn,
    handleBtnClick,
    cngMenuType
  } = useMenu();

  useEffect(() => {
  }, [user?.id, user?.profPic]);

  return <>
    <div id="mainBox" className="swingNav">
      <div id="navAnimation">
        <Chains />
        {btn}
        <div id="darkBtnAnimation">
          <Chains />
          {darkBtn}
        </div>
      </div>
    </div>
    {menuOpened &&
      <div className="Login">
        <div
          className="screen"
          onClick={() => handleBtnClick()}>
        </div>
        <div
          id="loginMenuBox"
          style={{
            boxShadow: darkMode ?
              `2px -2px 2px 1px white,
              2px -2px 10px 1px black,
              -1px 2px 5px 2px black,
              -2px 3px 3px 1px white` :
              `1px -1px 3px 1px white,
              -1px 2px 5px 2px black`
          }}>
          {(menuType.regOpened === true) ?
            <Register /> :
            (user) ?
              <LogedIn /> :
              <Login />
          }
          <button
            className="button button-subtle"
            onClick={() => cngMenuType()}
            rel="noopener noreferrer">
            {menuType.string}
          </button>
        </div>
      </div>}
  </>
}
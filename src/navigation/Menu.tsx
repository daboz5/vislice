import { useEffect } from "react";
import useAppStore from '../Store';
import useMenu from '../utils/useMenu';
import Login from './Login';
import Register from './Register';
import LogedIn from './LogedIn';
import Chains from '../assets/Chains';
import './Menu.css';

export default function Menu() {

  const { user, menuOpened } = useAppStore();
  const { menuType, btn, darkBtn, handleBtnClick, cngMenuType } = useMenu();

  useEffect(() => {
  }, [user?.id, user?.profPic]);

  return <>
    <div id="mainBox">
      <Chains />
      {btn}
      <Chains />
      {darkBtn}
    </div>
    {menuOpened &&
      <div className="Login">
        <div
          className="screen"
          onClick={() => handleBtnClick()}>
        </div>
        <div className="loginMenuBox">
          {
            (menuType.regOpened === true) ?
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
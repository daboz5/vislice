import useAppStore from '../Store';
import useMenu from '../utils/useMenu';
import Login from './Login';
import Register from './Register';
import LogedIn from './LogedIn';
import './Menu.css';
import Chains from '../assets/Chains';

export default function Menu() {

  const { user, menuOpened } = useAppStore();
  const { menuType, btn, darkBtn, handleBtnClick, cngMenuType } = useMenu();

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
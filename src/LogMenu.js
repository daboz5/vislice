
import React from 'react';
import './LogMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons'
import Login from './Login';
import Register from './Register';
import Button from './Button';


class LogMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            logMenu: false,
            registration: false,
            registrationChange: <>Potrebuješ nov račun? Klikni tukaj.</>,
            online: false,
            id: "",
            email: ""
        }

    this.handleLogMenu = this.handleLogMenu.bind(this);
    this.handleChangeMenuType = this.handleChangeMenuType.bind(this);
    this.reportLoginStatus = this.reportLoginStatus.bind(this);
    }

    handleLogMenu() {
      this.setState(state => {return {logMenu: !state.logMenu}})
    }
    
    reportLoginStatus() {
      this.setState((state) => {
        return {
          online: !state.online
        }})
    }

    handleChangeMenuType() {
      this.setState(state => {
        if (state.registration) {
          return {registrationChange: <>Potrebuješ nov račun? Klikni tukaj.</>}
        } else {
          return {registrationChange: <>Že imaš račun? Klikni tukaj.</>}
        }
      })
      this.setState(state => {return {registration: !state.registration}})
    }

    render() {
      const logMenu = this.state.logMenu;
      const registration = this.state.registration;
      const btn =
          (<div className="loginButton-box">
              <button className="loginButon" onClick={this.handleLogMenu}>
              <FontAwesomeIcon icon={faUserAstronaut} />
              </button>
          </div>);
        
      return logMenu ?
        (<div className="Login">
          <div className="screen"></div>
          {btn}
          <div className="loginMenu-box">
            {registration === false ?
            <Login online={this.state.online} returnData={() => this.reportLoginStatus()} /> :
            <Register />}
            <Button button="subtle" onClick={this.handleChangeMenuType}>{this.state.registrationChange}</Button>
          </div>
        </div>) :
        btn;
      }
    }

export default LogMenu;

import React from 'react';
import Button from './Button';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sloError: null,
      serverError: null,
      confirmator: null,
      emailInput: "",
      passInput: ""
    }
  this.handleEmailInput = this.handleEmailInput.bind(this);
  this.handlePassInput = this.handlePassInput.bind(this);
  this.handleLogin = this.handleLogin.bind(this);
  this.handleLogout = this.handleLogout.bind(this);
  this.handleReset = this.handleReset.bind(this);
  }

  handleEmailInput(event) {
    this.setState(() => {return {emailInput: event.target.value}})
  }

  handlePassInput(event) {
    this.setState(() => {return {passInput: event.target.value}})
  }

  handleReset() {
    this.setState({
      emailError: null,
      passwordError: null,
      serverError: null,
      confirmator: null,
      sloError: null
    })
  }

  handleLogin(event) {
    event.preventDefault();
    this.handleReset();
    const pass = this.state.passInput;
    const email = this.state.emailInput;
    
    if (email !== "" | pass !== "") {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
      "email": email,
      "password": pass
      });

      var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
      };

      fetch("http://localhost:3000/auth/signin", requestOptions)
        .then(response => {
          return response.json()})
        .then(result => {
          console.log(result)
          this.props.reportLoginStatus();
          if (!result.error) {
            this.setState({confirmator: <>Uspešno ste se prijavili</>})

          } else {
            throw new Error(result.message || this.setState({serverError: <>Nekaj je šlo narobe, poskusite kasneje.</>}))
          }
        })
        .catch(error => {
          console.log("error" , error)
          let sloError = null
          switch(error.message) {
            case ("User not found"):
              sloError = <>Email ali geslo sta napačna.</>
              break
            default:
              sloError = <>Nekaj je šlo narobe.<br/> Znova poskusite kasneje ali nas opozorite o napaki.</>
          }
          this.setState({serverError: sloError})
        });
    }
  }

  handleLogout() {
    this.props.reportLoginStatus();
  }

  render() {
      return this.props.online ?
          (<div className='loginMenu'>
              <div className='userInfo'>Zmage: INFO</div>
              <div className='userInfo'>Porazi: INFO</div>
              <div className='userInfo'>Razmerje: INFO</div>
              <Button button="normal" onClick={this.handleLogout}>Uporabniški račun</Button>
              <Button button="normal" onClick={this.handleLogout}>Izpiši me</Button>
          </div>) :
          (<form className="loginMenu">
              <h4>Vpis</h4>
              <p className='inputText'>Uporabniški email:</p>
                  <input className='inputField' onChange={this.handleEmailInput} name="Username" />
              <p className='inputText'>Geslo:</p>
                  <input className='inputField' onChange={this.handlePassInput} name="Password1" />
                  {this.state.serverError && <p className="error">{this.state.serverError}</p>}
                  {this.state.confirmator && <p className="popUp">{this.state.confirmator}</p>}
              <Button button="normal" onClick={this.handleLogin}>Vpiši me</Button>
          </form>)
  }
}

export default Login;
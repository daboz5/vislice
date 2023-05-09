
import React from 'react';
import Button from './Button';

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          emailError: null,
          passwordError: null,
          serverError: null,
          sloError: null,
          confirmator: null,
          emailInput: "",
          passInput1: "",
          passInput2: ""
        }
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handlePassInput1 = this.handlePassInput1.bind(this);
    this.handlePassInput2 = this.handlePassInput2.bind(this);
    this.handleCreateAcc = this.handleCreateAcc.bind(this);
    this.handleReset = this.handleReset.bind(this);
    }

    handleEmailInput(event) {
      this.setState(() => {return {emailInput: event.target.value}})
    }

    handlePassInput1(event) {
      this.setState(() => {return {passInput1: event.target.value}})
    }

    handlePassInput2(event) {
      this.setState(() => {return {passInput2: event.target.value}})
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

    async handleCreateAcc(event) {

      event.preventDefault();
      this.handleReset();

      const email = this.state.emailInput;
      const pass1 = this.state.passInput1;
      const pass2 = this.state.passInput2;

      const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
      const passCheck1 = passRegex.test(pass1);
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      const emailCheck = emailRegex.test(email);
      
      if (email !== "" && pass1 !== "" && pass2 !== "") {
        
        if (!emailCheck | !passCheck1) {
          if (!emailCheck) {this.setState({emailError: <>Neustrezen email. Prosimo, vnesite: &ensp;- primer@primer.kul</>})}
          if (!passCheck1) {this.setState({passwordError: <>Neustrezno geslo. Prosimo, vnesite:<br />&ensp;- vsaj 6 znakov<br />&ensp;- vsaj ena črka in vsaj ena številka</>})}
        }
        else if (pass1 !== pass2 ) {this.setState({passwordError: <>Gesli se ne ujemata.</>})}
        else {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var data = JSON.stringify({
            "email": email,
            "password": pass1
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
          };
          
          fetch("http://localhost:3000/auth/signup", requestOptions)
            .then(response => response.json())
            .then(result => {
              if (!result.error) {
                this.setState({confirmator: <>Račun je bil uspešno ustvarjen.<br />Sedaj se lahko prijaviš.</>})
              } else {
                throw new Error(result.message || this.setState({serverError: <>Nekaj je šlo narobe, poskusite kasneje.</>}))
              }
            })
            .catch(error => {
              let sloError = null
              switch(error.message) {
                case ("Email in use"):
                  sloError = <>Email je že v uporabi.</>
                  break
                default:
                  sloError = <>Nekaj je šlo narobe, poskusite znova kasneje ali nas opozorite o napaki.</>
              }
              this.setState({serverError: sloError})
            });
        }
      }
    }

    render() {        
      return this.state.sloError ?
          (this.state.sloError && <div className='loginMenu'>{this.state.sloError}</div>) :
          (<form className="loginMenu">
              <h4>Ustvari nov račun</h4>
              <p className='inputText'>Uporabniški email:</p>
              <div>
                  <input className='inputField' onChange={this.handleEmailInput}/>
                  {this.state.emailError && <p className="error">{this.state.emailError}</p>}
              </div>
              <p className='inputText'>Dvakrat vpiši lokalno geslo:</p>
              <div>
                  <input className='inputField' onChange={this.handlePassInput1}/>
                  <input className='inputField' onChange={this.handlePassInput2}/>
                  {this.state.passwordError && <p className="error">{this.state.passwordError}</p>}
                  {this.state.serverError && <p className="error">{this.state.serverError}</p>}
                  {this.state.confirmator && <p className="popUp">{this.state.confirmator}</p>}
              </div>
              <Button button="normal" onClick={this.handleCreateAcc}>Ustvari račun</Button>
          </form>)
    }
}

export default Register;
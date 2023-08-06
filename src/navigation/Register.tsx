import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import useAppStore from '../Store';
import useMenu from '../utils/useMenu';
import useRoot from '../utils/useRoot';

export default function Register() {

  const {
    accConfirm,
    serverError,
  } = useAppStore();

  const {
    mailErr,
    passErr,
    showPass,
    onSubmit,
    setShowPass,
    eventListener,
  } = useMenu();

  const { boxShadowStyleBtnDef, handleBtnClickStyle } = useRoot();

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="loginMenu">
      <h4>Ustvari nov račun</h4>
      <p className='inputText'>Uporabniški email:</p>
      <input
        inputMode='email'
        className='inputField inputEmail'
        {...register("logEmail", {
          required: true,
          minLength: 3
        })}
      />
      {mailErr &&
        <p className="error">
          {mailErr}</p>}

      <p className='inputText'>Dvakrat vpiši geslo:</p>
      <input
        inputMode='none'
        type={showPass ? "text" : "password"}
        className='inputField inputPassword'
        {...register("logPassword1", {
          required: true,
          minLength: 1
        })}
      />
      <input
        inputMode='none'
        type={showPass ? "text" : "password"}
        className='inputField inputPassword'
        {...register("logPassword2", {
          required: true,
          minLength: 1
        })}
      />
      <img
        className='eye'
        src={showPass ? "eye-opened.svg" : "eye-closed.svg"}
        onClick={() => setShowPass(!showPass)}
        alt="show-password-icon"
      />

      {passErr &&
        <p className="error">
          {passErr}</p>}
      {serverError &&
        <p className="error">
          {serverError}</p>}
      {accConfirm &&
        <p className="popUp">
          {accConfirm}</p>}

      <button
        type="submit"
        className="button loginBtn"
        onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
        onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
        onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
        style={{ boxShadow: boxShadowStyleBtnDef }}
        rel="noopener noreferrer">
        Ustvari račun
      </button>

    </form>
  )
}
import { useEffect } from 'react';
import useMenu from '../utils/useMenu';
import useAppStore from '../Store';
import useRoot from '../utils/useRoot';
import Signal from '../assets/Signal';

export default function Login() {

  const {
    mailErr,
    passErr,
    showPass,
    isInitialLoading,
    handleReset,
    onSubmit,
    register,
    eventListener,
    setShowPass,
    handleSubmit,
  } = useMenu();

  const { serverError, menuType, switchMenuType } = useAppStore();

  const { boxShadowStyleBtnDef, handleBtnClickStyle } = useRoot();

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="loginMenu">
      <h4>
        {menuType ?
          "Ustvari nov račun" :
          "Vpis"
        }
      </h4>
      <p className='inputText'>Email:</p>
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

      <p className='inputText'>{menuType ? "Dvakrat vpiši geslo" : "Vpiši geslo"}:</p>
      <input
        inputMode='none'
        type={showPass ? "text" : "password"}
        {...register("logPassword1", {
          required: true,
          minLength: 1
        })}
      />
      {menuType &&
        <input
          inputMode='none'
          type={showPass ? "text" : "password"}
          {...register("logPassword2", {
            required: true,
            minLength: 1
          })}
        />}
      {passErr &&
        <p className="error">
          {passErr}</p>}
      <img
        className='eye'
        src={showPass ? "eye-opened.svg" : "eye-closed.svg"}
        onClick={() => setShowPass(!showPass)}
        alt="show-password-icon"
      />
      {serverError &&
        <p className="serverError error">
          {serverError}</p>}

      <button
        type="submit"
        disabled={isInitialLoading}
        className="button loginBtn"
        onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
        onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
        onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
        style={{ boxShadow: boxShadowStyleBtnDef }}
        rel="noopener noreferrer">
        {isInitialLoading ?
          <>
            Iščem
            <Signal />
          </> :
          menuType ?
            "Ustvari račun" :
            "Vpiši me"
        }
      </button>

      <button
        className="button button-subtle"
        onClick={() => {
          switchMenuType();
          handleReset();
        }}
        rel="noopener noreferrer">
        {menuType ?
          "Že imaš račun?" :
          "Potrebuješ nov račun?"
        } Klikni tukaj.
      </button>

    </form>
  )
}
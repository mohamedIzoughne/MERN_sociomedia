import { useContext } from "react"
import { context } from "../store/context"
import classes from "./Sign.module.css"
import useInput from "../hooks/use-input"
import { Link } from "react-router-dom"
import useHttp from "../hooks/use-http"
import { useNavigate } from "react-router-dom"
import Loader from "../UI/Loader"
import ErrorMessage from "../UI/ErrorMessage"
import ReactDOM from "react-dom"
import Overlay from "../UI/Overlay"

type responseType = { token: string; userId: string; expirationDate: Date }

const Login = () => {
  const ctx = useContext(context)
  const navigate = useNavigate()

  const { sendData, isLoading, errorMessage, setErrorMessage } = useHttp()

  const toggleModal = () => {
    setErrorMessage("")
  }

  const {
    inputValue: enteredEmail,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    inputClasses: emailClasses,
    inputIsValid: emailIsValid,
  } = useInput(true)

  const {
    inputValue: enteredPassword,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    inputClasses: passwordClasses,
    inputIsValid: passwordIsValid,
  } = useInput()

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()

    const formIsValid = emailIsValid && passwordIsValid

    if (!formIsValid) {
      toggleModal()
      setErrorMessage("Form is not valid")
      return
    }

    const userInfo = {
      email: enteredEmail,
      password: enteredPassword,
    }

    const options = {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    }

    sendData<responseType>("auth/login", options, (response) => {
      const { token, userId, expirationDate } = response!

      ctx.loginHandler(token, userId, expirationDate)
      navigate("/")
    })
  }

  return (
    <form onSubmit={formSubmitHandler} className={classes.form}>
      <p>
        <b>Welcome for SocioMedia, The Social Media for Social people !</b>
      </p>
      <div className={emailClasses}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
      </div>
      <div className={passwordClasses}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
      </div>
      <button type="submit">Login</button>
      <Link to={"/signup"}>don't have an account ? sign up here</Link>
      {isLoading && <Loader />}
      {errorMessage &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={toggleModal} />
            <ErrorMessage message={errorMessage} toggleModal={toggleModal} />
          </>,
          document.getElementById("modals")!
        )}
    </form>
  )
}

export default Login

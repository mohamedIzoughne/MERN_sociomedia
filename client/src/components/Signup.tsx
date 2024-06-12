import classes from './Sign.module.css'
import useInput from '../hooks/use-input'
import { Link, useNavigate } from 'react-router-dom'
import useHttp from '../hooks/use-http'
import { useState } from 'react'
import Loader from '../UI/Loader'
import ErrorMessage from '../UI/ErrorMessage'
import ReactDOM from 'react-dom'
import Overlay from '../UI/Overlay'

const Signup = () => {
  const navigate = useNavigate()
  const [userImage, setUserImage] = useState<File>()
  const { sendData, isLoading, errorMessage, setErrorMessage } = useHttp()

  const toggleModal = () => {
    setErrorMessage('')
  }

  const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.currentTarget.files
    if (filesList) {
      setUserImage(filesList[0])
    }
  }

  const {
    inputValue: enteredFirstName,
    inputChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    inputClasses: firstNameClasses,
    inputIsValid: firstNameIsValid,
  } = useInput()

  const {
    inputValue: enteredLastName,
    inputChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    inputClasses: lastNameClasses,
    inputIsValid: lastNameIsValid,
  } = useInput()

  const {
    inputValue: enteredLocation,
    inputChangeHandler: locationChangeHandler,
    inputBlurHandler: locationBlurHandler,
    inputClasses: locationClasses,
    inputIsValid: locationIsValid,
  } = useInput()

  const {
    inputValue: enteredWork,
    inputChangeHandler: workChangeHandler,
    inputBlurHandler: workBlurHandler,
    inputClasses: workClasses,
    inputIsValid: workIsValid,
  } = useInput()

  const {
    inputValue: enteredPassword,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    inputClasses: passwordClasses,
    inputIsValid: passwordIsValid,
  } = useInput()

  const {
    inputValue: enteredEmail,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    inputClasses: emailClasses,
    inputIsValid: emailIsValid,
  } = useInput(true)

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()

    const formIsValid =
      emailIsValid &&
      firstNameIsValid &&
      lastNameIsValid &&
      passwordIsValid &&
      locationIsValid &&
      workIsValid

    if (!formIsValid) {
      console.log('Form is invalid')
      window.alert('Form is invalid')
      return
    }

    const userInfo = {
      fullName: enteredFirstName + ' ' + enteredLastName,
      email: enteredEmail,
      password: enteredPassword,
      location: enteredLocation,
      work: enteredWork,
    }

    const infosData = new FormData()

    let key: keyof typeof userInfo
    for (key in userInfo) {
      infosData.append(key, userInfo[key])
    }

    if (userImage) {
      infosData.append('image', userImage)
    }

    const options = {
      method: 'POST',
      body: infosData,
    }

    sendData('auth/register', options, () => {
      navigate('/login')
    })
  }

  return (
    <form
      onSubmit={formSubmitHandler}
      className={classes.form + ' bg-white dark:bg-[#303030]'}
    >
      <p>
        <b>Welcome for Sociapedia, The Social Media for Social people !</b>
      </p>
      <div className={firstNameClasses}>
        <label htmlFor='first'>First name</label>
        <input
          type='text'
          id='first'
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
        />
      </div>
      <div className={lastNameClasses}>
        <label htmlFor='last'>Last name</label>
        <input
          type='text'
          id='last'
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
        />
      </div>
      <div className={locationClasses}>
        <label htmlFor='location'>Location</label>
        <input
          id='location'
          type='text'
          onBlur={locationBlurHandler}
          onChange={locationChangeHandler}
        />
      </div>
      <div className={workClasses}>
        <label htmlFor='work'>Work</label>
        <input
          id='work'
          type='text'
          onBlur={workBlurHandler}
          onChange={workChangeHandler}
        />
      </div>
      <div className='form-control'>
        <input
          type='file'
          className='file-upload'
          onChange={imageChangeHandler}
        />
      </div>
      <div className={emailClasses}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
      </div>
      <div className={passwordClasses}>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
      </div>
      <button type='submit'>Sign up</button>
      <Link to={'/login'}>Already have an account ? login here</Link>
      {isLoading && <Loader />}
      {errorMessage &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={toggleModal} />
            <ErrorMessage message={errorMessage} toggleModal={toggleModal} />
          </>,
          document.getElementById('modals')!
        )}
    </form>
  )
}

export default Signup

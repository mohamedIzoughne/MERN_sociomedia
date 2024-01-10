import { useState } from 'react'

const useInput = (isEmail: boolean = false) => {
  const [inputValue, setInputValue] = useState('')
  const [inputIsTouched, setIsTouched] = useState(false)
  let inputIsInvalid = false
  if (isEmail) {
    inputIsInvalid = inputIsTouched && !inputValue.includes('@')
  } else {
    inputIsInvalid = inputIsTouched && !(inputValue.trim().length > 4)
  }
  const inputClasses = inputIsInvalid ? 'form-control invalid' : 'form-control'

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const inputBlurHandler = () => {
    setIsTouched(true)
  }

  type resultTypes = {
    inputValue: string,
    inputChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    inputBlurHandler: () => void,
    inputClasses: string,
    inputIsValid: boolean
  }

  const result: resultTypes = {
    inputValue,
    inputChangeHandler,
    inputBlurHandler,
    inputClasses,
    inputIsValid: !inputIsInvalid,
  }

  return result
}

export default useInput

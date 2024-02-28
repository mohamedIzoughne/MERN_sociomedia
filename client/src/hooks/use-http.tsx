import { useCallback, useState } from 'react'

type optionsType = {
  method?: string
  body?: string | FormData
  headers?: { 'Content-Type'?: string; Authorization?: string }
}

const useHttp = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const sendData = useCallback(async function <responseType>(
    endpoint: string,
    options: optionsType,
    successHandler: (data?: responseType) => void
  ) {
    setIsLoading(true)
    try {
      const url = (import.meta.env.VITE_SERVER_API || '') + endpoint
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        successHandler(data)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      if (err instanceof Error) setErrorMessage(err.message)
    }

    setIsLoading(false)
  },
  [])

  return { sendData, isLoading, errorMessage, setErrorMessage }
}

export default useHttp

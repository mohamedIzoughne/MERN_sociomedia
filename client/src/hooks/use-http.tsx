import { useCallback, useState } from "react"

type optionsType = {
  method?: string
  body?: string | FormData
  headers?: { "Content-Type"?: string; Authorization?: string }
}

const useHttp = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const sendData = useCallback(async function <responseType>(
    endpoint: string,
    options: optionsType,
    successHandler: (data?: responseType) => void
  ) {
    console.log(import.meta.env.VITE_SERVER_API)
    setIsLoading(true)
    try {
      const response = await fetch(
        `${(import.meta.env.VITE_SERVER_API || "") + endpoint}`,
        options
      )
      const data = await response.json()
      if (response.ok) {
        successHandler(data)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      setErrorMessage(err.message)
    }

    setIsLoading(false)
  },
  [])

  return { sendData, isLoading, errorMessage, setErrorMessage }
}

export default useHttp

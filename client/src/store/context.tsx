import { createContext, useCallback, useEffect, useState } from "react"
import useHttp from "../hooks/use-http"
import { useNavigate } from "react-router-dom"

type MODE_TYPE = "light" | "night"

type contextTypes = {
  userId: string
  token: string
  mode: MODE_TYPE
  loginHandler: (userId: string, token: string, expirationDate: Date) => void
  switchMode: () => void
  isLoggedIn: boolean
  logoutHandler: () => void
}

const defaultContext: contextTypes = {
  userId: "",
  token: "",
  mode: "light",
  loginHandler: () => {},
  logoutHandler: () => {},
  switchMode: () => {},
  isLoggedIn: false,
}

const calculateRemainingTime = (expirationDate: Date | string) => {
  const currentTime = new Date().getTime()
  const adjExpirationTime = new Date(expirationDate).getTime()
  const remainingDuration = adjExpirationTime - currentTime
  return remainingDuration
}

export const context = createContext<contextTypes>(defaultContext)

export const ContextProvider: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  const isLoggedInStorage = window.localStorage.getItem("isLoggedIn")
  const tokenInStorage = window.localStorage.getItem("token")
  const userIdInStorage = window.localStorage.getItem("userId")
  const expiresInDate = window.localStorage.getItem("expiresIn")
  const [token, setToken] = useState<string>(tokenInStorage || "")
  const [mode, setMode] = useState<MODE_TYPE>("light")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!isLoggedInStorage)
  const [userId, setUserId] = useState<string>(userIdInStorage || "")
  const navigate = useNavigate()
  const { sendData } = useHttp()

  const logoutHandler = () => {
    localStorage.setItem("isLoggedIn", "")
    localStorage.setItem("token", "")
    localStorage.setItem("userId", "")
    localStorage.setItem("expiresIn", "")
    setToken("")
    setUserId("")
    setIsLoggedIn(false)
    navigate("/login")
  }

  const checkIfTimeExpired = useCallback(() => {
    if (!expiresInDate) {
      return false
    }
    const now = new Date().getTime()
    const expiresIn = new Date(expiresInDate).getTime()
    const difference = expiresIn - now
    const timeIsExpired = difference <= 0
    if (timeIsExpired) {
      logoutHandler()
    } else {
      const remainingDuration = calculateRemainingTime(expiresInDate)
      setTimeout(logoutHandler, remainingDuration)
    }
    return timeIsExpired
  }, [expiresInDate])

  useEffect(() => {
    checkIfTimeExpired()
  }, [checkIfTimeExpired, sendData, token, userId])

  const loginHandler = (
    token: string,
    userId: string,
    expirationDate: Date
  ): void => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
    localStorage.setItem("expiresIn", expirationDate.toString())
    setToken(token)
    setUserId(userId)
    setIsLoggedIn(true)

    const remainingDuration = calculateRemainingTime(expirationDate)
    setTimeout(logoutHandler, remainingDuration)
  }

  const modeHandler = (): void => {
    setMode((prevMode: MODE_TYPE) => {
      if (prevMode === "light") return "night"
      return "light"
    })
  }

  const value: contextTypes = {
    token,
    loginHandler,
    mode,
    switchMode: modeHandler,
    isLoggedIn,
    userId,
    logoutHandler,
  }

  return <context.Provider value={value}>{children}</context.Provider>
}

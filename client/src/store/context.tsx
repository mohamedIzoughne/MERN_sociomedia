import { createContext, useCallback, useEffect, useState } from 'react'
import useHttp from '../hooks/use-http'
import { useNavigate } from 'react-router-dom'
import { userType } from '../types'
type MODE_TYPE = 'light' | 'dark'

type contextTypes = {
  userId: string
  token: string
  mode: MODE_TYPE
  loginHandler: (userId: string, token: string, expirationDate: Date) => void
  switchMode: () => void
  isLoggedIn: boolean
  logoutHandler: () => void
  isLightMode: boolean
  user: userType
  updateUser: () => void
  postPublishIsShown: boolean
  togglePostPublishIsShown: () => void
  chatHandler: () => void
  showChat: boolean
  chattedTo: { id: string; name: string; imageUrl: string }
  chatsHandler: (id: string, name: string, imageUrl: string) => void
}

const userDefault: userType = {
  email: '',
  friends: [],
  fullName: '',
  location: '',
  password: '',
  work: '',
  imageUrl: '',
  posts: [],
  profileViews: 0,
  socialProfiles: {},
  _id: '',
  impressionsOnPosts: 0,
}

const defaultContext: contextTypes = {
  userId: '',
  token: '',
  mode: 'light',
  loginHandler: () => {},
  logoutHandler: () => {},
  switchMode: () => {},
  isLoggedIn: false,
  isLightMode: true,
  user: userDefault,
  updateUser: () => {},
  postPublishIsShown: false,
  togglePostPublishIsShown: () => {},
  chatHandler: () => {},
  showChat: false,
  chattedTo: { id: '', name: '', imageUrl: '' },
  chatsHandler: () => {},
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
  const isLoggedInStorage = localStorage.getItem('isLoggedIn')
  const tokenInStorage = localStorage.getItem('token')
  const userIdInStorage = localStorage.getItem('userId')
  const expiresInDate = localStorage.getItem('expiresIn')
  const modeStorage: MODE_TYPE =
    localStorage.getItem('mode') === 'light' ? 'light' : 'dark'

  // states
  const [token, setToken] = useState<string>(tokenInStorage || '')
  const [mode, setMode] = useState<MODE_TYPE>(modeStorage)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!isLoggedInStorage)
  const [userId, setUserId] = useState<string>(userIdInStorage || '')
  const [user, setUser] = useState<userType>(userDefault)
  const [postPublishIsShown, setPostPublishIsShown] = useState<boolean>(false)
  const [showChat, setShowChat] = useState<boolean>(false)
  const [chattedTo, setChattedTo] = useState(defaultContext.chattedTo)
  const navigate = useNavigate()
  const { sendData } = useHttp()

  const logoutHandler = () => {
    localStorage.setItem('isLoggedIn', '')
    localStorage.setItem('token', '')
    localStorage.setItem('userId', '')
    localStorage.setItem('expiresIn', '')
    setToken('')
    setUserId('')
    setIsLoggedIn(false)
    navigate('/login')
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

  useEffect(() => {
    if (modeStorage === 'dark') document.documentElement.classList.add('dark')
  })

  const loginHandler = (
    token: string,
    userId: string,
    expirationDate: Date
  ): void => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('expiresIn', expirationDate.toString())
    setToken(token)
    setUserId(userId)
    setIsLoggedIn(true)

    const remainingDuration = calculateRemainingTime(expirationDate)
    setTimeout(logoutHandler, remainingDuration)
  }

  const modeHandler = (): void => {
    document.documentElement.classList.toggle('dark')

    setMode((prevMode: MODE_TYPE) => {
      if (prevMode === 'light') {
        localStorage.setItem('mode', 'dark') // is this a bad practice or not: using localstorage inside setState ?
        return 'dark'
      }
      localStorage.setItem('mode', 'light')
      return 'light'
    })
  }

  const updateUser = useCallback(() => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }

    sendData<{ user: userType }>(`profile/${userId}`, options, (res) => {
      const user = res?.user
      setUser(user || userDefault)
    })
  }, [sendData, userId, token])

  const chatHandler = () => {
    setShowChat((prev: boolean) => !prev)
  }

  const togglePostPublishIsShown = () =>
    setPostPublishIsShown((showPostPublish) => !showPostPublish)

  const chatsHandler = (id: string, name: string, imageUrl: string) => {
    setChattedTo({ id, name, imageUrl })
  }

  const value: contextTypes = {
    token,
    loginHandler,
    mode,
    switchMode: modeHandler,
    isLoggedIn,
    userId,
    logoutHandler,
    isLightMode: mode === 'light',
    user,
    updateUser,
    postPublishIsShown,
    togglePostPublishIsShown,
    showChat,
    chatHandler,
    chattedTo,
    chatsHandler,
  }

  return <context.Provider value={value}>{children}</context.Provider>
}

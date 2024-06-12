import React from 'react'
import ProtectedRoute from '../utils/ProtectedRoute'
import Home from '../pages/Home'
import SignUpPage from '../pages/SignupPage'

const UserPage = React.lazy(() => import('../pages/UserPage'))
const FriendsPage = React.lazy(() => import('../pages/FriendsPage'))

export default [
  {
    id: 'home',
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    id: 'user_page',
    path: '/user/:targetId',
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
  },
  {
    id: 'friends',
    path: '/friends',
    element: (
      <ProtectedRoute>
        <FriendsPage />
      </ProtectedRoute>
    ),
  },
  {
    id: 'signup',
    path: '/signup',
    element: <SignUpPage hasAccount={false} />,
  },
  {
    id: 'login',
    path: '/login',
    element: <SignUpPage hasAccount={true} />,
  },
]

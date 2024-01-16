import "./App.css"
import { Routes, Route } from "react-router-dom"
import SignUpPage from "./pages/SignupPage"
import Home from "./pages/Home"
import ProtectedRoute from "./utils/ProtectedRoute"
import UserPage from "./pages/UserPage"

export type friendType = {
  friendId: string
  name: string
  location: string
  imageUrl: string
}

export type userType = {
  email: string
  friends: friendType[] | []
  fullName: string
  location: string
  password: string
  work: string
  imageUrl: string
  posts: []
  profileViews: number
  socialProfiles: {
    [key: string]: string
  }
  _id: string
}

export type commentsType =
  | {
      _id: string
      content: string
      creatorId: string
      creatorName: string
      creatorImageUrl: string
    }[]
  | []

export type postType = {
  _id: string
  content: string
  imageUrl: string
  creator: {
    id: string
    name: string
    location: string
    imageUrl: string
  }
  likes: number
  comments: commentsType
}

export type postsType = postType[] | []

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:targetId"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<SignUpPage hasAccount={false} />} />
      <Route path="/login" element={<SignUpPage hasAccount={true} />} />
    </Routes>
  )
}

export default App

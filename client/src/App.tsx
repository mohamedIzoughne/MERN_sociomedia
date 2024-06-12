import './App.css'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
import Chat from './components/Chat'
import { useContext } from 'react'
import { context } from './store/context'
import { Suspense } from 'react'
import routes from './routes'
import Loader from './UI/Loader'

function App() {
  const { showChat } = useContext(context)

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.id} path={route.path} element={route.element} />
        ))}
      </Routes>
      {showChat && (
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      )}
    </Suspense>
  )
}

export default App

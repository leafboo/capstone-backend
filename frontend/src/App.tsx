import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'

function App() {
  

  return (
    <>
      <Routes >
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />

        <Route element={<ProtectedRoutes />}>
        
        </Route>

      </Routes>
    </>
  )
}

export default App

import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import { AuthContext } from './context/AuthContext'
import { useState } from 'react'

function App() {

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const value = { isAuthenticated, setIsAuthenticated }
  

  return (
    <>
  	    <AuthContext.Provider value={value}>

      		<Routes >
				<Route path='/' element={<LandingPage />} />
				<Route path='/signup' element={<SignUp />} />
				<Route path='/login' element={<Login />} />

				<Route element={<ProtectedRoutes />}>
					<Route path='/dashboard' element={<Dashboard />} />
				</Route>

			</Routes>
        
		</AuthContext.Provider>
    </>
  )
}

export default App

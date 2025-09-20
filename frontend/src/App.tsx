import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import { AuthContext } from './context/AuthContext'
import { useState } from 'react'
import resourcesApi from './api/resources'

function App() {
	// look at cookies if the access token of the browser is valid
	const localStorageValue = localStorage.getItem("isUserAuthenticated") === "true" ? true : false;
	const [isAuthenticated, setIsAuthenticated] = useState(localStorageValue || false); // !!localStorage converts the string to boolean
	const value = { isAuthenticated, setIsAuthenticated }

	// Do I need to move this function to ProtectedRoutes component?	
	const checkAuthentication = async() => {
		try {

			await resourcesApi.getUser();
			setIsAuthenticated(true);
			localStorage.setItem("isUserAuthenticated", "true");
			
		} catch(err) {
			console.error(err);
			setIsAuthenticated(false);
			localStorage.setItem("isUserAuthenticated", "false");
		}
	}
	checkAuthentication();

	console.log(`User authenticated: ${isAuthenticated}`)
  

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

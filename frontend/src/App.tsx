import { Routes, Route } from 'react-router'
import PageNotFound from './pages/PageNotFound'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import RoutesForUnauthenticatedUsers from './utils/RoutesForUnauthenticatedUsers'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import Workspaces from './pages/Workspaces'
import Workspace from './pages/Workspace'
import PasswordChange from './pages/PasswordChange'
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

			await resourcesApi.getUserDetails();
			setIsAuthenticated(true);
			localStorage.setItem("isUserAuthenticated", "true");
			
		} catch(err) {
			console.error(err);
			setIsAuthenticated(false);
			localStorage.setItem("isUserAuthenticated", "false");
		}
	}
	checkAuthentication();


  return (
    <>
  	    <AuthContext.Provider value={value}>

      		<Routes >

				<Route element={<RoutesForUnauthenticatedUsers />}>
				  	<Route path='/' element={<LandingPage />} />
				  	<Route path='/signup' element={<SignUp />} />
				  	<Route path='/login' element={<Login />} />
				</Route>

				<Route element={<ProtectedRoutes />}>
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/passwordChange' element={<PasswordChange />} />
					<Route path='/workspaces' element={<Workspaces />} />
					<Route path='/workspaces/:workspaceId' element={<Workspace />} />
				</Route>

				<Route path='*' element={<PageNotFound />} />

			</Routes>
        
		</AuthContext.Provider>
    </>
  )
}

export default App

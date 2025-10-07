import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import authApi from "../api/auth";

function Login() {
	const { setIsAuthenticated } = useContext(AuthContext);
	let navigate = useNavigate();

	// IF USER IS ALREADY AUTHENTICATED, DO NOT SHOW THEM THIS PAGE

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
  		const userName = formData.get("nameEmail") as string;
  		const password = formData.get("password") as string;

		try {
			await authApi.loginUser(userName, password);
			localStorage.setItem("isUserAuthenticated", "true");
			setIsAuthenticated(true);
			navigate("/dashboard");

		} catch(err) {
			console.error(err);
			setIsAuthenticated(false);
		}
	}
	

  	return (
    	<>
      		<h2 className="font-bold text-[5rem]">Login</h2>
      		<form onSubmit={handleSubmit}>
        		<label htmlFor="nameEmail">username or email</label> <br />
        		<input id='nameEmail' name='nameEmail' type="text" className='border' /> <br />
        		<label htmlFor="password">password</label> <br />
        		<input id='password' name='password' type="password" className='border' /> <br />
        		<button type='submit' className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" >Log in</button> 
      		</form> 
   	 	</>
  	)
}

export default Login;

import {login} from '../utils/ProtectedRoutes.tsx';

function Login() {
	async function loginUser(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

	    const userName = formData.get("nameEmail")
		const password = formData.get("password");

		try {
			const response = await fetch('http://localhost:4000/login', {
            	method: 'POST',
				credentials: 'include',
            	headers: {
             	   "Content-Type": "application/json"
            	},
            	body: JSON.stringify({userName: userName, password: password})
			});
			const jwtTokens = await response.json();
			console.log(jwtTokens);

		} catch (err) {
			console.error(err);
		}	
		

	    
	}

  return (
    <>
      <h2 className="font-bold text-[5rem]">Login</h2>
      <form onSubmit={loginUser}>
        <label htmlFor="nameEmail">username or email</label> <br />
        <input id='nameEmail' name='nameEmail' type="text" className='border' /> <br />
        <label htmlFor="password">password</label> <br />
        <input id='password' name='password' type="text" className='border' /> <br />
        <button type='submit' className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" >Log in</button> 
      </form> 
    </>
  )
}

export default Login;

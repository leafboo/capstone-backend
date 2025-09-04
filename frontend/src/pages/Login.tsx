import { useState } from 'react'

function Login() {
  async function loginUser(event: FormData) {
    const userName = event.get("userName");
    const email = event.get("email");
    const password = event.get("password");

    const url = "http://localhost:3000/users/login";
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: userName, email: email, password: password })
      });
      const result = await response.json();
      console.log(result);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <h2 className="font-bold text-[5rem]">Login</h2>
      <form action={loginUser}>
        <label htmlFor="nameEmail">username or email</label> <br />
        <input id='nameEmail' type="text" className='border' /> <br />
        <label htmlFor="password">password</label> <br />
        <input id='password' type="text" className='border' /> <br />
        <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" >Log in</button> 
      </form> 
    </>
  )
}

export default Login;

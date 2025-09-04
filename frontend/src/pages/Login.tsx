import { useState } from 'react'

function Login() {
  

  return (
    <>
      <h2 className="font-bold text-[5rem]">Login</h2>
      <form action="">
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

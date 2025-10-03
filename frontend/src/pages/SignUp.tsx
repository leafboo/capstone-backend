import { useNavigate } from "react-router";



function SignUp() {

  const navigate = useNavigate();
 
  async function signUpUser(event: FormData) {
    const userName = event.get("userName");
    const email = event.get("email");
    const password = event.get("password");
    
    const url = "http://localhost:3000/users";

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: userName, email: email, password: password })
      });
      
      navigate("/login");

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <h2 className="font-bold text-[5rem]">Signup</h2>
      <form action={signUpUser}>
        <label htmlFor="email">email</label> <br />
        <input id='email' type="text" name='email' className='border' required /> <br />
        <label htmlFor="username">username</label> <br />
        <input id='username' type="text" name='userName' className='border' required /> <br />
        <label htmlFor="password">password</label> <br />
        <input id='password' type="password" name='password' className='border' required /> <br />
 
        <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" >Submit</button> 
      </form>
    </>
  )
}

export default SignUp;

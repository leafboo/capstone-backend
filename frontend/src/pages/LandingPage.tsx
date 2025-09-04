import { Link } from "react-router";

function LandingPage() {
  

  return (
    <>
      <h1 className="text-[5rem] font-bold">Landing Page</h1>
      <Link to="/signup" className="border border-black p-[.5rem]" >Sign up</Link>    
      <Link to="/login" className="border border-black p-[.5rem]" >Login</Link>
    </>
  )
}

export default LandingPage;

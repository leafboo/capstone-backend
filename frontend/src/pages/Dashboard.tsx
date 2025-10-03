import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import WorkspaceRow from "../components/WorkspaceRow";
import resourcesApi from "../api/resources";
import authApi from "../api/auth";

type UserType = {
    userId: string;
    userName: string;
    email: string;
    salt: string;
    hash: string;
}

type WorkspaceType = {
    Id: number;
    Name: string;
    DateCreated: string;
    UserId: number;
}

function getMySQLDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}




export default function Dashboard() {
    const { setIsAuthenticated } = useContext(AuthContext);


    const [userDetails, setUserDetails] = useState<UserType>();
    const [userWorkspaces, setUserWorkspaces] = useState<WorkspaceType[]>();
    

    const date = getMySQLDate();



    useEffect(() => {
        const getUserData = async() => {
            try {
                const {Id, UserName, Email, Salt, Hash} = await resourcesApi.getUserDetails();
                setUserDetails({
                    userId: Id,
                    userName: UserName,
                    email: Email,
                    salt: Salt,
                    hash: Hash
                });
            } catch(err) {
                console.error(err);
            }
        }
        getUserData();

        handleGetWorkspaces();
    }, []);


    async function handleLogout() {
        try {
            await authApi.logoutUser();
            setIsAuthenticated(false);
        } catch(err) {
            console.error(err);
        }
    }

    async function handleCreationOfWorkspace(event: FormData) {
        const workspaceName = event.get("workspaceName") as string;
        
        try {
            console.log(await resourcesApi.addWorkspace(workspaceName, date));
            handleGetWorkspaces();
        } catch(err) {
            console.error(err);
        }
        
    }

    async function handleGetWorkspaces() {
        try {
            const workspaces = await resourcesApi.getWorkspaces();
            setUserWorkspaces(workspaces);
        } catch(err) {
            console.error(err);
        }
    }


    const userWorkspacesElement = userWorkspaces?.map(({Id, Name}) => (
        <WorkspaceRow id={Id} workspaceName={Name} handleGetWorkspaces={handleGetWorkspaces} />
    ));


    
    
    // do some fetch request to the endpoint "/users/me"

    return (
        <>
            <h2>Welcome {userDetails?.userName}</h2><br />
            
            <div>User Details:</div>
            <ul className="list-disc">
                <li>User Name: {userDetails?.userName}</li>
                <li>User Email: {userDetails?.email}</li>
                <li>More User details to be added...</li>
            </ul> <br />


            <form action={handleCreationOfWorkspace}>
                <input type="text" placeholder="Enter workspace name" className="border" name="workspaceName" required />
                <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" >Generate workspace</button><br />
            </form>
            <span>Your workspaces: </span>
            {userWorkspacesElement}   


            <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" onClick={handleLogout} >Log out</button> 
        </>
    )
}
import { useParams } from "react-router"
import resourcesApi from "../api/resources";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Workspace() {

    const navigate = useNavigate();

    const { workspaceId } = useParams();
    const parsedWorkspaceId = workspaceId ? parseInt(workspaceId, 10) : undefined;

    async function handleGetWorkspace() {
        if (parsedWorkspaceId === undefined) {
            return;
        }
        try {
            const workspaceDetails = await resourcesApi.getWorkspace(parsedWorkspaceId);
            if (workspaceDetails.length === 0) {
                navigate("/404");
            }
        } catch (err) {
            navigate("*");
            console.error(err);
        }
        
    }

    useEffect(() => {
        handleGetWorkspace();
    }, [])

    return (
        <>
            <div>workspace id: {workspaceId}</div>
            Welcome to the workspace page
        </>
    )
}
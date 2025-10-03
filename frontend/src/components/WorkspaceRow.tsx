import { useNavigate } from "react-router"
import resourcesApi from "../api/resources";

type WorkspaceRowType = {
    id: number;
    workspaceName: string;
    handleGetWorkspaces: () => void
}


export default function WorkspaceRow(props: WorkspaceRowType) {

    const navigate = useNavigate();

    function goToWorkspace() {
        navigate("/workspace/id")
    }

    async function handleDeleteWorkspace() {
        try {
            await resourcesApi.deleteWorkspace(props.id);
            props.handleGetWorkspaces();
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className="mt-3">
                <span onClick={goToWorkspace} className="items-center px-3 py-[.45rem] border cursor-pointer">
                    {props?.workspaceName}
                </span>

                <button onClick={handleDeleteWorkspace} className="items-center px-3 py-1 border border-red-500 text-red-500 cursor-pointer">
                    x
                </button>
            </div>
        </>
    )
}
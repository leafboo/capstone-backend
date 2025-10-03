type WorkspaceRowType = {
    id: number;
    workspaceName: string;
}


export default function WorkspaceRow(props: WorkspaceRowType) {

    function goToWorkspace() {

    }

    return (
        <>
            <div onClick={goToWorkspace}>
                {props?.workspaceName}
            </div>
        </>
    )
}
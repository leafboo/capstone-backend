import { useParams } from "react-router"
import LiteratureMatrixTable from "../components/LiteratureMatrixTable";
import resourcesApi from "../api/resources";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


type ResearchPaperType = {
    Id: number;
    Title: string;
    Authors: string;
    PublicationYear: string;
    Keywords: string;
    Abstract: string;
    Methods: string;
    Findings: string;
    WorkspaceId: number;
    APA: string;
    IEEE: string;
}


export default function Workspace() {

    const [researchPapers, setResearchPapers] = useState<ResearchPaperType[]>();

    const navigate = useNavigate();

    const { workspaceId } = useParams();
    const parsedWorkspaceId = workspaceId ? parseInt(workspaceId, 10) : undefined;
    const researchPapersForTable = researchPapers?.map(researchPaper => ({
        Title: researchPaper.Title,
        Authors: researchPaper.Authors,
        PublicationYear: researchPaper.PublicationYear,
        Keywords: researchPaper.Keywords,
        Abstract: researchPaper.Abstract,
        Methods: researchPaper.Methods,
        Findings: researchPaper.Findings
    })) ?? [];


    useEffect(() => {
        handleGetWorkspace();
        handleGetResearchPapers();
    }, [])



    async function handleGetWorkspace() {
        if (!parsedWorkspaceId) return; 
        try {
            const workspaceDetails = await resourcesApi.getWorkspace(parsedWorkspaceId);
            if (workspaceDetails.length === 0) {
                navigate("/404");
            }
        } catch (err) {
            navigate("/404");
            console.error(err);
        }
        
    }


    async function handleGetResearchPapers() {
        if (!parsedWorkspaceId) return;

        try {
            const researchPapers = await resourcesApi.getResearchPapers(parsedWorkspaceId);
            setResearchPapers(researchPapers);
        } catch(err) {
            console.error(err); 
        }
    }

    async function handleAddResearchPapers(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();


        if (!parsedWorkspaceId) return;

        const form = event.currentTarget;
        const data = new FormData(form);

        const title = data.get("title") as string;
        const authors = data.get("authors") as string;
        const keywords = data.get("keywords") as string;
        const publicationYear = data.get("publicationYear") as string;
        const abstract = data.get("abstract") as string;
        const methods = data.get("methods") as string;
        const findings = data.get("findings") as string;
        const apa = data.get("apa") as string;
        const ieee = data.get("ieee") as string;
        

        try {
            await resourcesApi.addResearchPaper(parsedWorkspaceId, title, authors, keywords, publicationYear, abstract, methods, findings, apa, ieee);
            handleGetResearchPapers();
        } catch(err) {
            console.error(err);
        }

        form.reset();
    }


    return (
        <>
            <div>workspace id: {workspaceId}</div>
            <div>Welcome to the workspace page</div> <br />
            <form onSubmit={handleAddResearchPapers}>
                <label htmlFor="">Title</label>
                <textarea name="title" required className="border" ></textarea>
                <label htmlFor="">Authors</label>
                <textarea name="authors" required className="border" ></textarea>
                <label htmlFor="">Keywords</label>
                <textarea name="keywords" required className="border" ></textarea>
                <label htmlFor="">Publication Year</label>
                <input name="publicationYear" required className="border"/> <br />
                <label htmlFor="">Abstract</label>
                <textarea name="abstract" required className="border"></textarea>
                <label htmlFor="">Methods</label>
                <textarea name="methods" required className="border" ></textarea>
                <label htmlFor="">Findings</label>
                <textarea name="findings" required className="border" ></textarea>
                <label htmlFor="">APA</label>
                <textarea name="apa" required className="border" ></textarea>
                <label htmlFor="">IEEE</label>
                <textarea name="ieee" required className="border" ></textarea>
                <br />
                <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" >Add Research Paper</button>
            </form>
            <LiteratureMatrixTable researchPapersForTable={researchPapersForTable} />
        </>
    )
}
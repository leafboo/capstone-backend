import LiteratureMatrixRow from "./LiteratureMatrixRow"
import { type ResearchPaperType } from "../types/types";


type LitMatrixPropType = {
    researchPapersForTable: ResearchPaperType[]
}


export default function LiteratureMatrixTable({researchPapersForTable}: LitMatrixPropType) {

    const litMatrixRowElement = researchPapersForTable?.map(({Title, Authors, PublicationYear, Abstract, Keywords, Methods, Findings}) => (
        <LiteratureMatrixRow Title={Title} Authors={Authors} PublicationYear={PublicationYear} Abstract={Abstract} Keywords={Keywords} Methods={Methods} Findings={Findings} />
    ));


    return (
        <>
            <div className="flex justify-center text-[30px] font-bold"> Literature Matrix</div><br />
            <table className=" w-[80rem] ml-auto mr-auto text-left" id="my-table">
                <thead>
                    <tr>
                        <th className="p-[1rem] border-[1px]">Title</th>
                        <th className="p-[1rem] border-[1px]">Authors</th>
                        <th className="p-[1rem] border-[1px]">Publication Year</th>
                        <th className="p-[1rem] border-[1px]">Keywords</th>
                        <th className="p-[1rem] border-[1px]">Abstract</th>
                        <th className="p-[1rem] border-[1px]">Methods</th>
                        <th className="p-[1rem] border-[1px]">Findings</th>
                    </tr>
                </thead>
                <tbody>
                    {litMatrixRowElement}
                </tbody>
            </table>
        </>
    )
}
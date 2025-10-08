import resourcesApi from "../api/resources";

type litMatrixRowType = {
    handleDeleteResearchPaper: (researchPaperId: number) => Promise<void>;
    Id: number;
    Title: string;
    Authors: string;
    PublicationYear: string;
    Abstract: string;
    Keywords: string;
    Methods: string;
    Findings: string;
}


export default function LiteratureMatrixRow({handleDeleteResearchPaper, Id, Title, Authors, PublicationYear, Abstract, Keywords, Methods, Findings}: litMatrixRowType) {

    function updateTableCell(event: React.KeyboardEvent<HTMLTableCellElement>) {
        
        if (event.key === 'Enter') {
            event.preventDefault();

            const columnName = event.currentTarget.id;
            const updatedColumnValue = event.currentTarget.textContent; 

            resourcesApi.updateResearchPaperColumn(Id, columnName, updatedColumnValue);
            event.currentTarget.blur();
        }
        
    }

    

    return (
        <>
            <tr>
                <td id="Title" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Title}</td>
                <td id="Authors" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Authors}</td>
                <td id="PublicationYear" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{PublicationYear}</td>
                <td id="Keywords" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Keywords}</td>
                <td id="Abstract" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell} >{Abstract}</td>
                <td id="Methods" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Methods}</td>
                <td id="Findings" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Findings}</td>
                <td className="p-[1rem] border-[1px] cursor-pointer hover:bg-red-700 hover:border-red-700 hover:text-white" onClick={()=> { handleDeleteResearchPaper(Id) }}>x</td>
            </tr>
        </>
    )
}
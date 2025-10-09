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


    function handleResetInnerHtml(event: React.FocusEvent<HTMLTableCellElement>) {
        let data = "";
        switch(event.currentTarget.id) {
            case "Title": 
                data = Title;
                break;
            case "Authors": 
                data = Authors;
                break;
            case "PublicationYear":
                data = PublicationYear;
                break;
            case "Abstract": 
                data = Abstract;
                break;
            case "Keywords":
                data = Keywords;
                break;
            case "Methods":
                data = Methods;
                break;
            case "Findings":
                data = Findings;
                break;
            default:
                console.warn("Could not identify the ResearchPapers column you edited");

        }
        if (data.length != 0) {
            event.currentTarget.innerHTML = data;
        }
    }
    
    

    return (
        <>
            <tr>
                <td id="Title" className="p-[1rem] border-[1px]" contentEditable suppressContentEditableWarning onKeyDown={updateTableCell} onBlur={handleResetInnerHtml}>{Title}</td>
                <td id="Authors" className="p-[1rem] border-[1px]" contentEditable suppressContentEditableWarning onKeyDown={updateTableCell} onBlur={handleResetInnerHtml}>{Authors}</td>
                <td id="PublicationYear" className="p-[1rem] border-[1px]" contentEditable suppressContentEditableWarning onKeyDown={updateTableCell} onBlur={handleResetInnerHtml}>{PublicationYear}</td>
                <td id="Keywords" className="p-[1rem] border-[1px]" contentEditable suppressContentEditableWarning onKeyDown={updateTableCell} onBlur={handleResetInnerHtml}>{Keywords}</td>
                <td id="Abstract" className="p-[1rem] border-[1px]" contentEditable suppressContentEditableWarning onKeyDown={updateTableCell} onBlur={handleResetInnerHtml} >{Abstract}</td>
                <td id="Methods" className="p-[1rem] border-[1px]" contentEditable suppressContentEditableWarning onKeyDown={updateTableCell} onBlur={handleResetInnerHtml}>{Methods}</td>
                <td id="Findings" className="p-[1rem] border-[1px]" contentEditable suppressContentEditableWarning onKeyDown={updateTableCell} onBlur={handleResetInnerHtml}>{Findings}</td>
                <td className="p-[1rem] border-[1px] cursor-pointer hover:bg-red-700 hover:border-red-700 hover:text-white" onClick={()=> { handleDeleteResearchPaper(Id) }}>x</td>
            </tr>
        </>
    )
}
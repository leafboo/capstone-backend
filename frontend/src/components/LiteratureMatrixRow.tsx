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
            console.log(event.currentTarget.id + ": " + event.currentTarget.textContent);
            event.currentTarget.blur();
        }
        
    }

    return (
        <>
            <tr>
                <td id="title" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Title}</td>
                <td id="authors" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Authors}</td>
                <td id="publicationYear" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{PublicationYear}</td>
                <td id="keywords" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Keywords}</td>
                <td id="abstract" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell} >{Abstract}</td>
                <td id="methods" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Methods}</td>
                <td id="findings" className="p-[1rem] border-[1px]" contentEditable onKeyDown={updateTableCell}>{Findings}</td>
                <td className="p-[1rem] border-[1px] cursor-pointer hover:bg-red-700 hover:border-red-700 hover:text-white" onClick={()=> { handleDeleteResearchPaper(Id) }}>x</td>
            </tr>
        </>
    )
}
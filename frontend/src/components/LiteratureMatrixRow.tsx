type litMatrixRowType = {
    Title: string;
    Authors: string;
    PublicationYear: string;
    Abstract: string;
    Keywords: string;
    Methods: string;
    Findings: string;
}

export default function LiteratureMatrixRow({Title, Authors, PublicationYear, Abstract, Keywords, Methods, Findings}: litMatrixRowType) {
    return (
        <>
            <tr>
                <td className="p-[1rem] border-[1px]">{Title}</td>
                <td className="p-[1rem] border-[1px]">{Authors}</td>
                <td className="p-[1rem] border-[1px]">{PublicationYear}</td>
                <td className="p-[1rem] border-[1px]">{Keywords}</td>
                <td className="p-[1rem] border-[1px]">{Abstract}</td>
                <td className="p-[1rem] border-[1px]">{Methods}</td>
                <td className="p-[1rem] border-[1px]">{Findings}</td>
            </tr>
        </>
    )
}
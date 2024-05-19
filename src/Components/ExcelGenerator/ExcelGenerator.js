import * as FileSaver from 'file-saver';
import XSLX from 'sheetjs-style';

const ExportExcel = ({ excelData, fileName, sheetName }) => {
    const exportToExcel = () => {
        console.log(excelData, fileName, sheetName);
        const ws = XSLX.utils.json_to_sheet(excelData);
        const wb = {Sheets: {[sheetName]: ws}, SheetNames: [sheetName]};
        const excelBuffer = XSLX.write(wb, {bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8'});
        FileSaver.saveAs(data, fileName+'.xlsx');
    };

    return <>
        <button onClick={()=> exportToExcel()}>Exportar excel</button>
    </>
}

export default ExportExcel

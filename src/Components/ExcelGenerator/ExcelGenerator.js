import * as FileSaver from 'file-saver';
import XSLX from 'sheetjs-style';

const ExportExcel = ({ excelData, fileName, sheetName }) => {
    const exportToExcel = () => {
        const docData = [];
        for (const data of excelData) {
            const newItem = {}
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const element = data[key];
                    newItem[key.replace(/_/gm, ' ').toLocaleUpperCase()] = element;
                }
            }
            docData.push(newItem);
        }

        const ws = XSLX.utils.json_to_sheet(docData);
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

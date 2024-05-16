import './Reports.css';

import { GeneralCXCReport, DocumentFormat } from '../../Components'

import {useState} from 'react';

function Reports () {
    const [report, setReport] = useState(null)



    return <div className="reportsPage">
        <div className="reportsMenu">
            <button onClick={() => setReport(0)}>Reporte general CXC</button>
            <button onClick={() => setReport(1)}>Documento</button>
        </div>
        {report === 0 &&
            <GeneralCXCReport />
        }
        {report === 1 &&
            <DocumentFormat />
        }
    </div>
}

export default Reports;

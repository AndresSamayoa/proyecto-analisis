import './Reports.css';

import { GeneralCXCReport } from '../../Components'

import {useState} from 'react';

function Reports () {
    const [report, setReport] = useState(null)



    return <div className="reportsPage">
        <div className="reportsMenu">
            <button onClick={() => setReport(0)}>Reporte general CXC</button>
        </div>
        {report == 0 &&
            <GeneralCXCReport />
        }
    </div>
}

export default Reports;
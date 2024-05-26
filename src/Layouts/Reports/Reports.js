import './Reports.css';

import {
    GeneralCXCReport,
    DocumentFormat,
    CustomerFrecuencyReportProductQuantity,
    CustomerFrecuencyReportTotalValue,
    CustomerFrecuencyReportFrecuency
} from '../../Components'

import {useState} from 'react';

function Reports () {
    const [report, setReport] = useState(null)



    return <div className="reportsPage">
        <div className="reportsMenu">
            <button onClick={() => setReport(0)}>Reporte de Cobranza</button>
            <button onClick={() => setReport(1)}>Documento</button>
            <button onClick={() => setReport(2)}>Clientes frecuentes (cantidad)</button>
            <button onClick={() => setReport(3)}>Clientes frecuentes (valor)</button>
            <button onClick={() => setReport(4)}>Clientes frecuentes (frecuencia)</button>
        </div>
        {report === 0 &&
            <GeneralCXCReport />
        }
        {report === 1 &&
            <DocumentFormat />
        }
        {report === 2 &&
            <CustomerFrecuencyReportProductQuantity />
        }
        {report === 3 &&
            <CustomerFrecuencyReportTotalValue />
        }
        {report === 4 &&
            <CustomerFrecuencyReportFrecuency />
        }
    </div>
}

export default Reports;

import './Reports.css';

import {
    GeneralCXCReport,
    DocumentFormat,
    CustomerFrecuencyReportProductQuantity,
    CustomerFrecuencyReportTotalValue,
    CustomerFrecuencyReportFrecuency,
    SalesByRangeReport,
    CustomerAcountReport,
    PaymentByRangeReport
} from '../../Components'

import {useState} from 'react';

function Reports () {
    const [report, setReport] = useState(null)



    return <div className="reportsPage">
        <div className="reportsMenu">
            <button onClick={() => setReport(0)}>Reporte de Cobranza</button>
            <button onClick={() => setReport(5)}>Ventas por fecha</button>
            <button onClick={() => setReport(6)}>Estado de cuentas</button>
            <button onClick={() => setReport(7)}>Pagos por fecha</button>
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
        {report === 5 &&
            <SalesByRangeReport />
        }
        {report === 6 &&
            <CustomerAcountReport />
        }
        {report === 7 &&
            <PaymentByRangeReport />
        }
    </div>
}

export default Reports;

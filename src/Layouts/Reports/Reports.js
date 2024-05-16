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
            <DocumentFormat 
                cliente="CLIENTE OG"
                direccion="3 ave 3-33 zona 3 Guatemala"
                telefono="12345678"
                email="cliente@mail.com"
                serie="12"
                numero="236342"
                numero_transmision="abc-123-def-456"
                fecha="20/10/2023"
                total="20"
                items={[{
                        cantidad: 2,
                        nombre_producto: 'TEST 1',
                        precio_unitario: 5,
                        descuento: 0,
                        total: 10,
                    },{
                        cantidad: 2,
                        nombre_producto: 'TEST 2',
                        precio_unitario: 5,
                        descuento: 0,
                        total: 10,
                }]}
            />
        }
    </div>
}

export default Reports;
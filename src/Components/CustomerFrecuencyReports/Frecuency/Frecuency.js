import '../CustomerFrecuencyReport.css';
import logo from '../../../Assets/Logo.png';
import ExportExcel from '../../ExcelGenerator/ExcelGenerator';

import axios from 'axios';
import XMLParser from 'react-xml-parser';
import * as moment from 'moment';
import { usePDF } from 'react-to-pdf';
import { useState, useEffect } from 'react';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function Frecuency () {

    const {toPDF, targetRef} = usePDF({filename: `ClientesFrecuentesFrecuencia(${moment().format('DD-MM-YYYY hh:mm')}).pdf`});

    const [mensajeTabla, setMensajeTabla] = useState('');
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);

    const getRows = (data) => {
        if (data.length <= 0) return;

        let respuesta = []
        for (const item of data) {
            respuesta.push(
                <tr className='itemCustomerFrecuencyRow'>
                    <td>{item.cliente}</td>
                    <td>{item.razon_social}</td>
                    <td>{item.email_cliente}</td>
                    <td>{item.telefono_cliente}</td>
                    <td>{item.total}</td>
                </tr>
            );
        }

        setTableData(respuesta);
    }

    const getData = async () => {
        try {
            setTableData([]);
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_reportes.asmx/Reporte_clientes_frecuentes_frecuencia',
                validateStatus: status => true
            })

            if (respuesta.status >= 200 && respuesta.status < 300) {
                const data = new XMLParser().parseFromString(respuesta.data)
                const tempData = [];
                if(data.children[1].children.length < 1) {
                    return;
                };
                for (const item of data.children[1].children[0].children) {
                    console.log(item.children)
                    tempData.push({
                        cliente: item.children.find(obj => obj.name === 'CLIENTE') ? item.children.find(obj => obj.name === 'CLIENTE').value : null, 
                        razon_social: item.children.find(obj => obj.name === 'RAZON_SOCIAL') ? item.children.find(obj => obj.name === 'RAZON_SOCIAL').value : null, 
                        email_cliente: item.children.find(obj => obj.name === 'CORREO_ELECTRONICO') ? item.children.find(obj => obj.name === 'CORREO_ELECTRONICO').value : null, 
                        telefono_cliente: item.children.find(obj => obj.name === 'TELEFONO') ? item.children.find(obj => obj.name === 'TELEFONO').value : null, 
                        total: item.children.find(obj => obj.name === 'TOTAL_VENTAS') ? item.children.find(obj => obj.name === 'TOTAL_VENTAS').value : null, 
                    })
                }
                setExcelData(tempData);
                getRows(tempData);
            } else {
                setMensajeTabla('Error ' + respuesta.status + ': ' + respuesta.data);
            }
        } catch (error) {
            setMensajeTabla('Error: ' + error.message);
        }
    }

    useEffect(() => {
        getData();
        }, []
    );

    return <div>
        <div className='controlsContainer'>
            <button onClick={getData}>Cargar datos</button>
            <button onClick={() => toPDF()}>Exportar PDF</button>
            <ExportExcel 
                excelData={excelData} 
                fileName={`ClientesFrecuentesFrecuencia(${moment().format('DD-MM-YYYY hh:mm')})`}
                sheetName="Reporte" />
        </div>
        <div className='messageContainer'>
            <p className="tableMessage">{mensajeTabla}</p>
        </div>
        <div className='customerFrecuencyReportContainer' ref={targetRef}>
            <div className='tableCustomerFrecuencyContainer'>
            </div>
            <div className='titleCustomerFrecuencyContainer'>
                <img src={logo} className='imagelogo'/>
                <h1 className='ReportCustomerFrecuencyTitle'>Clientes frecuentes (Cantidad compras)</h1>
            </div>
            <div className='tableCustomerFrecuencyContainer'>
                <table className='tableCustomerFrecuencyData'>
                    <thead>
                        <tr>
                            <th>Cliente id</th>
                            <th>Razon social</th>
                            <th>Email</th>
                            <th>Telefono</th>
                            <th>Cantidad de compras</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default Frecuency;

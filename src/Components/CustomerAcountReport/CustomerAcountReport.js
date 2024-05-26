import './CustomerAcountReport.css';
import logo from '../../Assets/Logo.png';
import ExportExcel from '../ExcelGenerator/ExcelGenerator';

import axios from 'axios';
import XMLParser from 'react-xml-parser';
import * as moment from 'moment';
import { usePDF } from 'react-to-pdf';
import { useState, useEffect } from 'react';
import querystring from 'querystring';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function CustomerAcountReport () {

    const [mensajeTabla, setMensajeTabla] = useState('');
    const [cliente, setCliente] = useState('');
    const [fechaInicial, setFechaInicial] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);

    const {toPDF, targetRef} = usePDF({filename: `Estado de cuentas(${fechaInicial} - ${fechaFinal}).pdf`});

    const getRows = (data) => {
        if (data.length <= 0) return;

        let respuesta = [];
        for (const item of data) {
            respuesta.push(
                <tr className='itemRow'>
                    <td>{item.venta}</td>
                    <td>{item.nit}</td>
                    <td>{item.cliente}</td>
                    <td>{item.email_cliente}</td>
                    <td>{item.telefono_cliente}</td>
                    <td>{item.serie}</td>
                    <td>{item.numero}</td>
                    <td>{item.uuid}</td>
                    <td>Q.{item.total}</td>
                    <td>Q.{item.total_abonado}</td>
                    <td>Q.{item.total_por_pagar}</td>
                    <td>{moment(item.fecha_venta).format('DD-MM-YYYY')}</td>
                    <td>{moment(item.fecha_vencimiento).format('DD-MM-YYYY')}</td>
                    <td>{item.vencido > 0 ? 'Si' : 'No'}</td>
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
                url: net_base_url+'/CXC_reportes.asmx/Reporte_estado_cuentas_cliente',
                data: querystring.stringify({
                    cliente: cliente,
                    fecha_inicial: fechaInicial,
                    fecha_final: fechaFinal,
                }),
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
                        venta: item.children.find(obj => obj.name === 'VENTA') ? item.children.find(obj => obj.name === 'VENTA').value : null, 
                        nit: item.children.find(obj => obj.name === 'NIT') ? item.children.find(obj => obj.name === 'NIT').value : null, 
                        cliente: item.children.find(obj => obj.name === 'CLIENTE') ? item.children.find(obj => obj.name === 'CLIENTE').value : null, 
                        email_cliente: item.children.find(obj => obj.name === 'EMAIL_CLIENTE') ? item.children.find(obj => obj.name === 'EMAIL_CLIENTE').value : null, 
                        telefono_cliente: item.children.find(obj => obj.name === 'TELEFONO_CLIENTE') ? item.children.find(obj => obj.name === 'TELEFONO_CLIENTE').value : null, 
                        serie: item.children.find(obj => obj.name === 'SERIE') ? item.children.find(obj => obj.name === 'SERIE').value : null, 
                        numero: item.children.find(obj => obj.name === 'NUMERO') ? item.children.find(obj => obj.name === 'NUMERO').value : null, 
                        uuid: item.children.find(obj => obj.name === 'UUID') ? item.children.find(obj => obj.name === 'UUID').value : null, 
                        total: item.children.find(obj => obj.name === 'TOTAL') ? item.children.find(obj => obj.name === 'TOTAL').value : null, 
                        total_abonado: item.children.find(obj => obj.name === 'TOTAL_ABONADO') ? item.children.find(obj => obj.name === 'TOTAL_ABONADO').value : null, 
                        total_por_pagar: item.children.find(obj => obj.name === 'TOTAL_POR_PAGAR') ? item.children.find(obj => obj.name === 'TOTAL_POR_PAGAR').value : null, 
                        fecha_venta: item.children.find(obj => obj.name === 'FECHA_VENTA') ? item.children.find(obj => obj.name === 'FECHA_VENTA').value : null, 
                        fecha_vencimiento: item.children.find(obj => obj.name === 'FECHA_VENCIMIENTO') ? item.children.find(obj => obj.name === 'FECHA_VENCIMIENTO').value : null, 
                        vencido: item.children.find(obj => obj.name === 'VENCIDO') ? item.children.find(obj => obj.name === 'VENCIDO').value : null, 
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

    return <div>
        <div className='controlsContainer'>
            <div className='controlItem'>
                <label>Cliente (codigo)</label>
                <input type='number' onChange={e=> {setCliente(e.target.value)}}/>
            </div>
            <div className='controlItem'>
                <label>Fecha inicial</label>
                <input type='date' onChange={e=> {e.target.value ? setFechaInicial(moment(e.target.value).format('YYYY-MM-DD')) : setFechaInicial(null)}}/>
            </div>
            <div className='controlItem'>
                <label>Fecha inicial</label>
                <input type='date' onChange={e=> {e.target.value ? setFechaFinal(moment(e.target.value).format('YYYY-MM-DD')) : setFechaFinal(null)}}/>
            </div>
            <button onClick={getData}>Cargar datos</button>
            <button onClick={() => toPDF()}>Exportar PDF</button>
            <ExportExcel 
                excelData={excelData} 
                fileName={`Estado de cuentas(${fechaInicial} - ${fechaFinal})`}
                sheetName="Reporte" />
        </div>
        <div className='messageContainer'>
            <p className="tableMessage">{mensajeTabla}</p>
        </div>
        <div className='cxcReportContainer' ref={targetRef}>
            <div className='tableContainer'>
            </div>
            
            <div className='titleContainer'>
                <img src={logo} className='imagelogo'/>
                <h1 className='ReportTitle'>Estado de cuentas({fechaInicial} - {fechaFinal})</h1>
            </div>
            <div className='tableCenterer'>
                <div className='tableContainer'>
                    <table className='tableData'>
                        <thead>
                            <tr>
                                <th>Venta</th>
                                <th>Nit</th>
                                <th>Cliente</th>
                                <th>Email cliente</th>
                                <th>Telefono cliente</th>
                                <th>Serie</th>
                                <th>Numero</th>
                                <th>UUID</th>
                                <th>Total venta</th>
                                <th>Total abonado</th>
                                <th>Total por pagar</th>
                                <th>Fecha venta</th>
                                <th>Fecha vencimiento</th>
                                <th>Vencido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}

export default CustomerAcountReport;

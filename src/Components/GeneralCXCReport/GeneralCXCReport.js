import './GeneralCXCReport.css';

import axios from 'axios';
import XMLParser from 'react-xml-parser';
import * as moment from 'moment';
import { useState, useEffect } from 'react';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function GeneralCXCReport () {

    const [mensajeTabla, setMensajeTabla] = useState('');
    const [tableData, setTableData] = useState([]);

    const getRows = (data) => {
        if (data.length <= 0) return;

        let respuesta = []
        let lastClient = data[0].cliente;
        let clientAcum = 0;
        for (const item of data) {
            if (item.cliente === lastClient) {
                clientAcum += Number(item.total_por_pagar);
                respuesta.push(
                    <tr className='itemRow'>
                        <td>{item.venta}</td>
                        <td>{item.cliente}</td>
                        <td>{item.email_cliente}</td>
                        <td>{item.telefono_cliente}</td>
                        <td>Q.{item.total}</td>
                        <td>Q.{item.total_abonado}</td>
                        <td>Q.{item.total_por_pagar}</td>
                        <td>{moment(item.fecha_venta).format('DD-MM-YYYY')}</td>
                        <td>{moment(item.fecha_vencimiento).format('DD-MM-YYYY')}</td>
                        <td>{item.vencido > 0 ? 'Si' : 'No'}</td>
                    </tr>
                );
            } else {
                respuesta.push(
                    <tr>
                        <td colSpan={7}><b>Total por pagar {lastClient}</b></td>
                        <td colSpan={3}><b>Q.{clientAcum.toFixed(2)}</b></td>
                    </tr>
                );
                respuesta.push(
                    <tr className='itemRow'>
                        <td>{item.venta}</td>
                        <td>{item.cliente}</td>
                        <td>{item.email_cliente}</td>
                        <td>{item.telefono_cliente}</td>
                        <td>Q.{Number(item.total).toFixed(2)}</td>
                        <td>Q.{Number(item.total_abonado).toFixed(2)}</td>
                        <td>Q.{Number(item.total_por_pagar).toFixed(2)}</td>
                        <td>{moment(item.fecha_venta).format('DD-MM-YYYY')}</td>
                        <td>{moment(item.fecha_vencimiento).format('DD-MM-YYYY')}</td>
                        <td>{item.vencido > 0 ? 'Si' : 'No'}</td>
                    </tr>
                );
                clientAcum = Number(item.total_por_pagar);;
                lastClient = item.cliente;
            }
        }
        respuesta.push(
            <tr>
                <td colSpan={7}><b>Total por pagar {lastClient}</b></td>
                <td colSpan={3}><b>Q.{clientAcum.toFixed(2)}</b></td>
            </tr>
        );

        setTableData(respuesta);
    }

    const getData = async () => {
        try {
            setTableData([]);
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/fun_reporte_general_cxc',
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
                        cliente: item.children.find(obj => obj.name === 'CLIENTE') ? item.children.find(obj => obj.name === 'CLIENTE').value : null, 
                        email_cliente: item.children.find(obj => obj.name === 'EMAIL_CLIENTE') ? item.children.find(obj => obj.name === 'EMAIL_CLIENTE').value : null, 
                        telefono_cliente: item.children.find(obj => obj.name === 'TELEFONO_CLIENTE') ? item.children.find(obj => obj.name === 'TELEFONO_CLIENTE').value : null, 
                        total: item.children.find(obj => obj.name === 'TOTAL') ? item.children.find(obj => obj.name === 'TOTAL').value : null, 
                        total_abonado: item.children.find(obj => obj.name === 'TOTAL_ABONADO') ? item.children.find(obj => obj.name === 'TOTAL_ABONADO').value : null, 
                        total_por_pagar: item.children.find(obj => obj.name === 'TOTAL_POR_PAGAR') ? item.children.find(obj => obj.name === 'TOTAL_POR_PAGAR').value : null, 
                        fecha_venta: item.children.find(obj => obj.name === 'FECHA_VENTA') ? item.children.find(obj => obj.name === 'FECHA_VENTA').value : null, 
                        fecha_vencimiento: item.children.find(obj => obj.name === 'FECHA_VENCIMIENTO') ? item.children.find(obj => obj.name === 'FECHA_VENCIMIENTO').value : null, 
                        vencido: item.children.find(obj => obj.name === 'VENCIDO') ? item.children.find(obj => obj.name === 'VENCIDO').value : null, 
                    })
                }
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
            <button onClick={getData}>Exportar PDF</button>
            <button onClick={getData}>Cargar datos</button>
        </div>
        <div className='messageContainer'>
            <p className="tableMessage">{mensajeTabla}</p>
        </div>
        <div className='cxcReportContainer'>
            <div className='tableContainer'>
                <h1>Reporte general CXC</h1>
            </div>
            <div className='tableContainer'>
                <table className='tableData'>
                    <thead>
                        <tr>
                            <th>Venta</th>
                            <th>Cliente</th>
                            <th>Email cliente</th>
                            <th>Telefono cliente</th>
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
}

export default GeneralCXCReport;
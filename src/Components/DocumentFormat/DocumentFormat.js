import './DocumentFormat.css';
import logo from '../../Assets/Logo.png';

import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import * as moment from 'moment';
import { usePDF } from 'react-to-pdf';
import { useState } from 'react';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function DocumentFormat() {
    const {toPDF, targetRef} = usePDF({filename: `Factura(${moment().format('DD-MM-YYYY hh:mm')}).pdf`});

    const [mensajeTabla, setMensajeTabla] = useState('');
    const [param, setParam] = useState('');
    const [cliente, setCliente] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [nit, setNit] = useState('');
    const [serie, setSerie] = useState('');
    const [numero, setNumero] = useState('');
    const [numeroTransmision, setNumeroTransmision] = useState('');
    const [fechaTransmision, setFechaTransmision] = useState('');
    const [fechaAnulacion, setFechaAnulacion] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [total, setTotal] = useState(0);
    const [tableData, setTableData] = useState([]);

    const clearForm = () => {
        setMensajeTabla('');
        setParam('');
        setCliente('');
        setDireccion('');
        setTelefono('');
        setEmail('');
        setNit('');
        setSerie('');
        setNumero('');
        setNumeroTransmision('');
        setFechaTransmision('');
        setFechaAnulacion('');
        setTipoDocumento('');
        setTotal(0);
        setTableData([]);
    }

    const formatItems = (items) => {
        const tempData = [];
        for (const item of items) {
            tempData.push(
                <tr className='itemRow'>
                    <td>{item.cantidad}</td>
                    <td>{item.nombre_producto}</td>
                    <td>{item.precio_unitario}</td>
                    <td>{item.descuento}</td>
                    <td>Q.{item.total}</td>
                </tr>
            );
        }
        setTableData(tempData);
    };

    const getData = async () => {
        try {
            clearForm();
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Documento.asmx/Encabezado_documento',
                data: querystring.stringify({
                    iddocumento: param,
                }),
                validateStatus: status => true
            })

            if (respuesta.status >= 200 && respuesta.status < 300) {
                const data = new XMLParser().parseFromString(respuesta.data)
                if(data.children[1].children.length < 1) {
                    setMensajeTabla('Documento no encontrado');
                    return;
                };

                const itemHeader = data.children[1].children[0].children[0];

                setCliente(itemHeader.children.find(obj => obj.name === 'RAZON_SOCIAL_CLIENTE') ? itemHeader.children.find(obj => obj.name === 'RAZON_SOCIAL_CLIENTE').value : null);
                setDireccion(itemHeader.children.find(obj => obj.name === 'DIRECCION_CLIENTE') ? itemHeader.children.find(obj => obj.name === 'DIRECCION_CLIENTE').value : null);
                setTelefono(itemHeader.children.find(obj => obj.name === 'TELEFONO_CLIENTE') ? itemHeader.children.find(obj => obj.name === 'TELEFONO_CLIENTE').value : null);
                setEmail(itemHeader.children.find(obj => obj.name === 'EMAIL_CLIENTE') ? itemHeader.children.find(obj => obj.name === 'EMAIL_CLIENTE').value : null);
                setNit(itemHeader.children.find(obj => obj.name === 'NIT_CLIENTE') ? itemHeader.children.find(obj => obj.name === 'NIT_CLIENTE').value : null);
                setSerie(itemHeader.children.find(obj => obj.name === 'SERIE_DOCUMENTO') ? itemHeader.children.find(obj => obj.name === 'SERIE_DOCUMENTO').value : null);
                setNumero(itemHeader.children.find(obj => obj.name === 'NUMERO_DOCUMENTO') ? itemHeader.children.find(obj => obj.name === 'NUMERO_DOCUMENTO').value : null);
                setNumeroTransmision(itemHeader.children.find(obj => obj.name === 'NUMERO_EMISION_DOCUMENTO') ? itemHeader.children.find(obj => obj.name === 'NUMERO_EMISION_DOCUMENTO').value : null);
                setFechaTransmision(itemHeader.children.find(obj => obj.name === 'FECHA_EMISION_DOCUMENTO') ? itemHeader.children.find(obj => obj.name === 'FECHA_EMISION_DOCUMENTO').value : null);
                setTotal(itemHeader.children.find(obj => obj.name === 'VALOR_DOCUMENTO') ? itemHeader.children.find(obj => obj.name === 'VALOR_DOCUMENTO').value : null);
                setFechaAnulacion(itemHeader.children.find(obj => obj.name === 'FECHA_ANULACION_DOCUMENTO') ? itemHeader.children.find(obj => obj.name === 'FECHA_ANULACION_DOCUMENTO').value : null);
                setTipoDocumento(itemHeader.children.find(obj => obj.name === 'TIPO_DOCUMENTO') ? itemHeader.children.find(obj => obj.name === 'TIPO_DOCUMENTO').value : null);

                getDetails();

            } else {
                setMensajeTabla('Error ' + respuesta.status + ': ' + respuesta.data);
            }
        } catch (error) {
            setMensajeTabla('Error: ' + error.message);
        }
    }

    const getDetails = async () => {
        try {
            setTableData([]);
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Documento.asmx/detalle_documento',
                data: querystring.stringify({
                    iddocumento: param,
                }),
                validateStatus: status => true
            })

            if (respuesta.status >= 200 && respuesta.status < 300) {
                const data = new XMLParser().parseFromString(respuesta.data)
                const tempData = [];
                if(data.children[1].children.length < 1) {
                    setMensajeTabla('Documento no encontrado');
                    return;
                };

                const items = data.children[1].children[0];

                for (const item of items.children) {
                    tempData.push({
                        cantidad: item.children.find(obj => obj.name === 'CANTIDAD') ? item.children.find(obj => obj.name === 'CANTIDAD').value : null,
                        nombre_producto: item.children.find(obj => obj.name === 'DESCRIPCION') ? item.children.find(obj => obj.name === 'DESCRIPCION').value : null,
                        precio_unitario: item.children.find(obj => obj.name === 'PRECIO') ? item.children.find(obj => obj.name === 'PRECIO').value : null,
                        descuento: item.children.find(obj => obj.name === 'DESCUENTO') ? item.children.find(obj => obj.name === 'DESCUENTO').value : null,
                        total: item.children.find(obj => obj.name === 'SUBTOTAL') ? item.children.find(obj => obj.name === 'SUBTOTAL').value : null,
                    })   
                }

                formatItems(tempData);

            } else {
                setMensajeTabla('Error ' + respuesta.status + ': ' + respuesta.data);
            }
        } catch (error) {
            setMensajeTabla('Error: ' + error.message);
        }
    }

    return <div className='doc'>
            <div className='controlsContainer'>
                <button onClick={() => toPDF()}>Exportar PDF</button>
                <div className='searcherContainer'>
                    <input type='number' value={param} onChange={(e)=>{e.preventDefault(); setParam(e.target.value);}}/>
                    <button onClick={getData}>Cargar datos</button>
                </div>
            </div>
            <div className='messageContainer'>
                <p className="tableMessage">{mensajeTabla}</p>
            </div>
            <div className='documentCenterer'  ref={targetRef}>
                <div className="documentContainer">
                    <div className="headerDocumentContainer">
                        <div className='headerDocumentItem'>
                            <h1>CXC</h1>
                            <h2>Direccion z.1 Guatemala</h2>
                            <h2>12345678</h2>
                            <h2>correo@mail.com</h2>
                        </div>
                        <div className='headerDocumentItem'>
                            <h1>{tipoDocumento.toUpperCase()}</h1>
                            <img className='imagelogo' src={logo} alt='cxc_logo'/>
                        </div>
                    </div>
                    <div className="headerDocumentContainer">
                        <div className='headerDocumentItem'>
                            <h1>Facturando a</h1>
                            <h2>{cliente}</h2>
                            <h2>{direccion}</h2>
                            <h2>{telefono}</h2>
                            <h2>{email}</h2>
                            <h2>{nit}</h2>
                        </div>
                        <div className='headerDocumentItem'>
                            <h2>Serie: {serie}</h2>
                            <h2>Numero: {numero}</h2>
                            <h2>UUID: {numeroTransmision}</h2>
                            <h2>Fecha: {fechaTransmision ? moment(fechaTransmision).format('DD-MM-YYYY') : ''}</h2>
                            {fechaAnulacion && <h2>Fecha de anulacion: {fechaAnulacion ? moment(fechaAnulacion).format('DD-MM-YYYY') : ''}</h2>}
                        </div>
                    </div>
                    <div className="tableDocumentContainer">
                        <table className='tableDocumentData'>
                            <thead>
                                <tr>
                                    <th>Cantidad</th>
                                    <th>Descripcion</th>
                                    <th>Precio U.</th>
                                    <th>Descuento (%)</th>
                                    <th>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData}
                                <td colSpan={4}><b>Total</b></td>
                                <td colSpan={1}><b>Q.{total}</b></td>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </div>
}

export default DocumentFormat;

import './PaymentCrudContainer.css'

import DataTable from 'react-data-table-component';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';
import axios from 'axios';

import PaymentForm from '../PaymentForm/PaymentForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function PaymentCrudContainer (props) {
    
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.abonoId,
        },
        {
            name: '',
            selector: row => {
                return <button onClick={() => {updateForm(row)}} >Actualizar</button>
            },
        },
        {
            name: '',
            selector: row => {
                return <button onClick={() => {deleteRow(row.abonoId)}} >Borrar</button>
            },
        },
        {
            name: 'Venta',
            selector: row => row.numeroAutorizacionVenta,
        },
        {
            name: 'Valor',
            selector: row => row.valor,
        },
        {
            name: 'Tipo de pago',
            selector: row => row.tipoPago,
        },
        {
            name: 'Numero de autorizacion',
            selector: row => row.numeroAutorizacion,
        }
    ];

    const [abonoId, setAbonoId] = useState(0);
    const [numeroAutorizacion, setNumeroAutorizacion] = useState(0);
    const [valor, setValor] = useState(0);
    const [tipoPago, setTipoPago] = useState(0);
    const [mensajeIngreso, setMensajeIngreso] = useState('');
    const [mensajeTabla, setMensajeTabla] = useState('');
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Abono.asmx/AbonoMostrar',
                data: querystring.stringify({
                    id_abono: props.ventaId
                }),
                validateStatus: status => true
            })

            if (respuesta.status >= 200 && respuesta.status < 300) {
                const data = new XMLParser().parseFromString(respuesta.data)
                const tempData = [];
                if(data.children[1].children.length < 1) {
                    setTableData([]);
                    return;
                };
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        abonoId: item.children.find(obj => obj.name === 'ABO_ABONO') ? item.children.find(obj => obj.name === 'ABO_ABONO').value : null,
                        ventaId: props.ventaId,
                        numeroAutorizacionVenta: item.children.find(obj => obj.name === 'VEN_NO_AUTORIZACION') ? item.children.find(obj => obj.name === 'VEN_NO_AUTORIZACION').value : null,
                        valor: item.children.find(obj => obj.name === 'ABO_VALOR') ? item.children.find(obj => obj.name === 'ABO_VALOR').value : null,
                        tipoPago: item.children.find(obj => obj.name === 'ABO_TIPO_PAGO') ? item.children.find(obj => obj.name === 'ABO_TIPO_PAGO').value : null,
                        numeroAutorizacion: item.children.find(obj => obj.name === 'ABO_NO_AUTORIZADO') ? item.children.find(obj => obj.name === 'ABO_NO_AUTORIZADO').value : null,
                    })
                }
                setTableData(tempData);
            } else {
                setMensajeTabla('Error ' + respuesta.status + ': ' + respuesta.data);
            }
        } catch (error) {
            setMensajeTabla('Error: ' + error.message);
        }
    }

    const updateForm = (row) => {
        setAbonoId(row.abonoId);
        setValor(row.valor);
        setTipoPago(row.tipoPago);
        setNumeroAutorizacion(row.numeroAutorizacion);
    };

    const clearForm = () => {
        setAbonoId(0);
        setValor(0);
        setTipoPago('');
        setNumeroAutorizacion('');
        setMensajeIngreso('');
    };

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (abonoId > 0) {
            url = net_base_url+'CXC_Abono.asmx/Abonoactualizar'
            method = 'POST';
            data = querystring.stringify({
                P_ABONO_ID: abonoId,
                P_NOVENTA_ID: props.ventaId,
                P_NO_AUTORIZACION: numeroAutorizacion,
                P_FLVALOR: valor,
                P_TIPO_PAGO: tipoPago,
            });
        } else {
            url = net_base_url+'/CXC_Abono.asmx/Abonoguardar';
            method = 'POST';
            data = querystring.stringify({
                P_NOVENTA_ID: props.ventaId,
                P_NO_AUTORIZACION: numeroAutorizacion,
                P_FLVALOR: valor,
                P_TIPO_PAGO: tipoPago,
            });
        }
        try {
            const respuesta = await axios({
                method: method,
                url: url,
                data: data, 
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                validateStatus: status => true
            })

            // const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                getData();
                clearForm();
                setMensajeIngreso('Exito en la operacion');
            } else {
                setMensajeIngreso(respuesta.data);
            }
        } catch (error) {
            setMensajeIngreso('Error: ' + error.message);
        }
    };

    const deleteRow = async (paymentId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Abono.asmx/ClientesEliminar',
                data: querystring.stringify({
                    ID_ABONO: paymentId
                }),
                validateStatus: status => true
            })

            // const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
               getData();
            } else {
                setMensajeTabla('Error ' + respuesta.status + ': ' + respuesta.data);
            }
        } catch (error) {
            setMensajeTabla('Error: ' + error.message)
        }
    } 

    useEffect(() => {
        getData();
        }, [props.ventaId]
    );

    return <>
        <div className="formSegment">
            <PaymentForm 
                onSubmit={onSubmit}
                clearForm={clearForm}
                setAbonoId={setAbonoId}
                setValor={setValor}
                setTipoPago={setTipoPago}
                setNumeroAutorizacion={setNumeroAutorizacion}
                abonoId={abonoId}
                valor={valor}
                tipoPago={tipoPago}
                numeroAutorizacion={numeroAutorizacion}
                mensajeIngreso={mensajeIngreso}
            />
        </div>
        <div className="tableSegment">
            <p className="tableMessage">{mensajeTabla}</p>
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default PaymentCrudContainer;

import './PaymentCrudContainer.css'

import DataTable from 'react-data-table-component';
import XMLParser from 'react-xml-parser';
import { useState, useEffect } from 'react';
import axios from 'axios';

import PaymentForm from '../PaymentForm/PaymentForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function PaymentCrudContainer () {
    
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
    
    const data = [
        {
            abonoId: 1,
            ventaId: 1,
            numeroAutorizacionVenta: '1234567890',
            valor: 10,
            tipoPago: 'Transferencia',
            numeroAutorizacion: '46579',
        },
        {
            abonoId: 2,
            ventaId: 3,
            numeroAutorizacionVenta: '6153415340',
            valor: 10,
            tipoPago: 'Cheque',
            numeroAutorizacion: '02245A',
        },
    ];

    const [abonoId, setAbonoId] = useState(0);
    const [ventaId, setVentaId] = useState(0);
    const [buscadorVenta, setBuscadorVenta] = useState('');
    const [numeroAutorizacion, setNumeroAutorizacion] = useState(0);
    const [valor, setValor] = useState(0);
    const [tipoPago, setTipoPago] = useState(0);
    const [mensajeBusqueda, setMensajeBusqueda] = useState('');
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/AbonosMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        abonoId: item.children[0].value,
                        ventaId: item.children[1].value,
                        numeroAutorizacionVenta: item.children[2].value,
                        valor: item.children[5].value,
                        tipoPago: item.children[3].value,
                        numeroAutorizacion: item.children[4].value,
                    })
                }
                setTableData(tempData);
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    }

    const updateForm = (row) => {
        setAbonoId(row.abonoId);
        setVentaId(row.ventaId);
        setBuscadorVenta(row.numeroAutorizacionVenta);
        setValor(row.valor);
        setTipoPago(row.tipoPago);
        setNumeroAutorizacion(row.numeroAutorizacion);
        console.log(abonoId,ventaId,buscadorVenta,numeroAutorizacion,valor,tipoPago);
    };

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (abonoId > 0) {
            url = net_base_url+'Proyecto-Analisis.asmx/AbonosActualizar'
            method = 'POST';
            data = querystring.stringify({
                abo_abono: abonoId,
                abo_venta: ventaId,
                abo_numero_autorizacion: numeroAutorizacion,
                abo_valor: valor,
                abo_tipo_pago: tipoPago,
            });
        } else {
            url = net_base_url+'/Proyecto-Analisis.asmx/Abonosguardar';
            method = 'POST';
            data = querystring.stringify({
                abo_venta: ventaId,
                abo_numero_autorizacion: numeroAutorizacion,
                abo_valor: valor,
                abo_tipo_pago: tipoPago,
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
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    };

    const deleteRow = async (paymentId) => {
        try {
            console.log(employeeId)
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/CreditosEliminar',
                data: querystring.stringify({
                    abo_abono: paymentId
                }),
                validateStatus: status => true
            })

            // const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
               getData();
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    } 

    const searchVenta = async () => {
        console.log(buscadorVenta);

        const respuesta = await axios({
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            data: {}
        })

        if (respuesta.status >= 200 && respuesta.status < 300) {
            setVentaId(respuesta.data.userId)
            console.log(ventaId)
        } else {
            setMensajeBusqueda('Error: ' + respuesta.status);
        }
    }

    useEffect(() => {
        getData();
        }, []
    );

    return <>
        <div id="formSegment">
            <PaymentForm 
                onSubmit={onSubmit}
                setAbonoId={setAbonoId}
                setVentaId={setVentaId}
                setValorBuscadorVenta={setBuscadorVenta}
                setValor={setValor}
                setTipoPago={setTipoPago}
                setNumeroAutorizacion={setNumeroAutorizacion}
                searchVenta={searchVenta}
                abonoId={abonoId}
                ventaId={ventaId}
                valorBuscadorVenta={buscadorVenta}
                valor={valor}
                tipoPago={tipoPago}
                numeroAutorizacion={numeroAutorizacion}
                mensajeBusqueda={mensajeBusqueda}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default PaymentCrudContainer;

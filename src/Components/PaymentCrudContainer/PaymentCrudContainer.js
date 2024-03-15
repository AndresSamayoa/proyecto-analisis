import './PaymentCrudContainer.css'

import DataTable from 'react-data-table-component';
import { useState } from 'react';
import axios from 'axios';

import PaymentForm from '../PaymentForm/PaymentForm';

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
    const [tableData, setTableData] = useState(data);

    const updateForm = (row) => {
        setAbonoId(row.abonoId);
        setVentaId(row.ventaId);
        setBuscadorVenta(row.numeroAutorizacionVenta);
        setValor(row.valor);
        setTipoPago(row.tipoPago);
        setNumeroAutorizacion(row.numeroAutorizacion);
        console.log(abonoId,ventaId,buscadorVenta,numeroAutorizacion,valor,tipoPago);
    };

    const onSubmit = () => {
        // Consumir api
        console.log(abonoId,ventaId,buscadorVenta,numeroAutorizacion,valor,tipoPago);
    };

    const deleteRow = (paymentId) => {
        // Consumir api
        const index = tableData.findIndex(row => row.abonoId === paymentId)
        console.log(tableData, index);
        const tempDat = [...tableData].splice(index, 1);
        setTableData(tempDat);
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

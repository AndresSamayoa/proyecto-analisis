import './CreditCrudContainer.css'

import DataTable from 'react-data-table-component';
import { useState } from 'react';
import axios from 'axios';

import CreditForm from '../CreditForm/CreditForm';

function CreditCrudContainer () {
    
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.creditoId,
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
                return <button onClick={() => {deleteRow(row.creditoId)}} >Borrar</button>
            },
        },
        {
            name: 'Cliente',
            selector: row => row.nombreCliente,
        },
        {
            name: 'Credito (dias)',
            selector: row => row.credito,
        },
        {
            name: 'Plazo',
            selector: row => row.plazo,
        }
    ];
    
    const data = [
        {
            creditoId: 1,
            clienteId: 1,
            nombreCliente: 'TEST 1',
            credito: 20.00,
            plazo: 15,
        },
        {
            creditoId: 2,
            clienteId: 3,
            nombreCliente: 'TEST 2',
            credito: 50.00,
            plazo: 30,
        },
    ];

    const [creditoId, setCreditoId] = useState(0);
    const [clienteId, setClienteId] = useState(0);
    const [buscadorCliente, setBuscadorCliente] = useState('');
    const [credito, setCredito] = useState(0);
    const [plazo, setPlazo] = useState(0);
    const [mensajeBusqueda, setMensajeBusqueda] = useState('');
    const [tableData, setTableData] = useState(data);

    const updateForm = (row) => {
        setCreditoId(row.creditoId);
        setClienteId(row.clienteId);
        setBuscadorCliente(row.nombreCliente);
        setCredito(row.credito);
        setPlazo(row.plazo);
        console.log(creditoId,clienteId,buscadorCliente,credito,plazo);
    };

    const onSubmit = () => {
        // Consumir api
        console.log(
            clienteId,
            buscadorCliente,
            credito,
            plazo,
        );
    };

    const deleteRow = (creditId) => {
        // Consumir api
        const index = tableData.findIndex(row => row.creditoId === creditId)
        console.log(tableData, index);
        const tempDat = [...tableData].splice(index, 1);
        setTableData(tempDat);
    } 

    const searchCliente = async () => {
        console.log(buscadorCliente);

        const respuesta = await axios({
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            data: {}
        })

        if (respuesta.status >= 200 && respuesta.status < 300) {
            setClienteId(respuesta.data.userId)
            console.log(clienteId)
        } else {
            setMensajeBusqueda('Error: ' + respuesta.status);
        }
    }

    return <>
        <div id="formSegment">
            <CreditForm 
                onSubmit={onSubmit}
                setCreditoId={setCreditoId}
                setClienteId={setClienteId}
                setValorBuscadorCliente={setBuscadorCliente}
                setCredito={setCredito}
                setPlazo={setPlazo}
                searchCliente={searchCliente}
                creditoId={creditoId}
                clienteId={clienteId}
                valorBuscadorCliente={buscadorCliente}
                credito={credito}
                plazo={plazo}
                mensajeBusqueda={mensajeBusqueda}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default CreditCrudContainer;

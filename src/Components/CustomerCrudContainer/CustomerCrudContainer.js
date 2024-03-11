import './CustomerCrudContainer.css'

import DataTable from 'react-data-table-component';
import { useState } from 'react';

import CustomerForm from '../CustomerForm/CustomerForm';

const CustomerCrudContainer = () => {
    const [clienteId, setClienteId] = useState(0);
    const [nit, setNit] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [direccionFiscal, setDireccionFiscal] = useState('');
    const [tipoCliente, setTipoCliente] = useState('');

    const updateForm = (e) => {
        setClienteId(1);
        setNit('Cambio Nit');
        setRazonSocial('Cambio RazonSocial');
        setDireccionFiscal('Cambio DireccionFiscal');
        setTipoCliente('Cambio TipoCliente');
        console.log(clienteId,nit,razonSocial,direccionFiscal,tipoCliente)
    };

    const onSubmit = () => {
        console.log(clienteId,
            nit,
            razonSocial,
            direccionFiscal,
            tipoCliente
        );
    }

    const columns = [
        {
            name: 'Line',
            selector: row => row.id,
        },
        {
            name: 'Options',
            selector: row => {
                return <button onClick={() => {updateForm(row.id)}} >Actualizar</button>
            },
        },
        {
            name: 'Title',
            selector: row => row.title,
        },
        {
            name: 'Year',
            selector: row => row.year,
        },
    ];
    
    const data = [
          {
            id: 1,
            title: 'Beetlejuice',
            year: '1988',
        },
        {
            id: 2,
            title: 'Ghostbusters',
            year: '1984',
        },
    ];

    
    return <>
        <div id="formSegment">
           <CustomerForm 
                onSubmit={onSubmit}
                setClienteId={setClienteId}
                setNit={setNit}
                setRazonSocial={setRazonSocial}
                setDireccionFiscal={setDireccionFiscal}
                setTipoCliente={setTipoCliente}
                clienteId={clienteId} 
                nit={nit} 
                razonSocial={razonSocial} 
                direccionFiscal={direccionFiscal} 
                tipoCliente={tipoCliente}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={data}/>
        </div>
    </>
}

export default CustomerCrudContainer; 
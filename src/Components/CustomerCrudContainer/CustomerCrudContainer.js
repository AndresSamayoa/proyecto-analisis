import './CustomerCrudContainer.css'

import DataTable from 'react-data-table-component';
import { useState } from 'react';

import CustomerForm from '../CustomerForm/CustomerForm';

const CustomerCrudContainer = () => {
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.clienteId,
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
                return <button onClick={() => {deleteRow(row.clienteId)}} >Borrar</button>
            },
        },
        {
            name: 'Razon social',
            selector: row => row.razonSocial,
        },
        {
            name: 'nit',
            selector: row => row.nit,
        },
        {
            name: 'Correo electronico',
            selector: row => row.correoElectronico,
        },
        {
            name: 'Telefono',
            selector: row => row.telefono,
        },
        {
            name: 'Direccion',
            selector: row => row.direccionFiscal,
        },
        {
            name: 'Tipo de cliente',
            selector: row => row.tipoCliente,
        },
    ];
    
    const data = [
        {
            clienteId: 1,
            nit: '1234567890',
            razonSocial: 'Empresa 1',
            direccionFiscal: 'Ciudad',
            tipoCliente: 'Juridico',
            correoElectronico: 'empresa1@mail.com',
            telefono: '12345678',
        },
        {
            clienteId: 2,
            nit: '0987654321',
            razonSocial: 'Empresa 2',
            direccionFiscal: 'Ciudad',
            tipoCliente: 'Juridico',
            correoElectronico: 'empresa2@mail.com',
            telefono: '87654321',
        }
    ];

    const [clienteId, setClienteId] = useState(0);
    const [nit, setNit] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [direccionFiscal, setDireccionFiscal] = useState('');
    const [tipoCliente, setTipoCliente] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [telefono, setTelefono] = useState('');
    const [tableData, setTableData] = useState(data);

    const updateForm = (row) => {
        setClienteId(row.clienteId);
        setNit(row.nit);
        setRazonSocial(row.razonSocial);
        setDireccionFiscal(row.direccionFiscal);
        setTipoCliente(row.tipoCliente);
        setTelefono(row.telefono);
        setCorreoElectronico(row.correoElectronico);
        console.log(clienteId,nit,razonSocial,direccionFiscal,tipoCliente,telefono,correoElectronico);
    };

    const onSubmit = () => {
        // Consumir api
        console.log(clienteId,
            nit,
            razonSocial,
            direccionFiscal,
            tipoCliente
        );
    }

    const deleteRow = (customerId) => {
        // Consumir api
        const index = tableData.findIndex(row => row.clienteId == customerId)
        console.log(tableData, index);
        const tempDat = [...tableData].splice(index, 1);
        setTableData(tempDat);
    } 

    return <>
        <div id="formSegment">
           <CustomerForm 
                onSubmit={onSubmit}
                setClienteId={setClienteId}
                setNit={setNit}
                setRazonSocial={setRazonSocial}
                setDireccionFiscal={setDireccionFiscal}
                setTipoCliente={setTipoCliente}
                setCorreoElectronico={setCorreoElectronico}
                setTelefono={setTelefono}
                clienteId={clienteId} 
                nit={nit} 
                razonSocial={razonSocial} 
                direccionFiscal={direccionFiscal} 
                tipoCliente={tipoCliente}
                correoElectronico={correoElectronico}
                telefono={telefono}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default CustomerCrudContainer; 
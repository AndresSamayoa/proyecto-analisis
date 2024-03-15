import './CustomerContactCrudContainer.css'

import DataTable from 'react-data-table-component';
import { useState } from 'react';
import axios from 'axios';

import CustomerContactForm from '../CustomerContactForm/CustomerContactForm';

function CustomerContactCrudContainer () {
    
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.contactoId,
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
                return <button onClick={() => {deleteRow(row.contactoId)}} >Borrar</button>
            },
        },
        {
            name: 'Cliente',
            selector: row => row.nombreCliente,
        },
        {
            name: 'Nombres',
            selector: row => row.nombres,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Telefono 1',
            selector: row => row.telefono1,
        },
        {
            name: 'Telefono 2',
            selector: row => row.telefono2,
        },
        {
            name: 'Telefono 3',
            selector: row => row.telefono3,
        }
    ];
    
    const data = [
        {
            contactoId: 1,
            clienteId: 1,
            nombreCliente: 'TEST 1',
            nombres: 'Contacto 1',
            email: 'mail1@mail.com',
            telefono1: '12345678',
            telefono2: '12345678',
            telefono3: '12345678',
        },
        {
            contactoId: 2,
            clienteId: 3,
            nombreCliente: 'TEST 1',
            nombres: 'Contacto 2',
            email: 'mail1@mail.com',
            telefono1: '12345678',
            telefono2: '12345678',
            telefono3: '12345678',
        },
    ];

    const [contactoId, setContactoId] = useState(0);
    const [clienteId, setClienteId] = useState(0);
    const [buscadorCliente, setBuscadorCliente] = useState('');
    const [nombres, setNombres] = useState('');
    const [email, setEmail] = useState('');
    const [telefono1, setTelefono1] = useState('');
    const [telefono2, setTelefono2] = useState('');
    const [telefono3, setTelefono3] = useState('');
    const [mensajeBusqueda, setMensajeBusqueda] = useState('');
    const [tableData, setTableData] = useState(data);

    const updateForm = (row) => {
        setContactoId(row.contactoId);
        setClienteId(row.clienteId);
        setBuscadorCliente(row.nombreCliente);
        setNombres(row.nombres);
        setEmail(row.email);
        setTelefono1(row.telefono1);
        setTelefono2(row.telefono2);
        setTelefono3(row.telefono3);
        console.log(contactoId,clienteId,buscadorCliente,email,telefono1,telefono2,telefono3);
    };

    const onSubmit = () => {
        // Consumir api
        console.log(
            contactoId,
            clienteId,
            buscadorCliente,
            nombres,
            email,
            telefono1,
            telefono2,
            telefono3
        );
    };

    const deleteRow = (contactId) => {
        // Consumir api
        const index = tableData.findIndex(row => row.contactoId === contactId)
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
            <CustomerContactForm 
                onSubmit={onSubmit}
                setContactoId={setContactoId}
                setClienteId={setClienteId}
                setValorBuscadorCliente={setBuscadorCliente}
                setNombres={setNombres}
                setEmail={setEmail}
                setTelefono1={setTelefono1}
                setTelefono2={setTelefono2}
                setTelefono3={setTelefono3}
                searchCliente={searchCliente}
                contactoId={contactoId}
                clienteId={clienteId}
                valorBuscadorCliente={buscadorCliente}
                nombres={nombres}
                email={email}
                telefono1={telefono1}
                telefono2={telefono2}
                telefono3={telefono3}
                mensajeBusqueda={mensajeBusqueda}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default CustomerContactCrudContainer;

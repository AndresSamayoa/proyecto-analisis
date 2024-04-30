import './CustomerContactCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';

import CustomerContactForm from '../CustomerContactForm/CustomerContactForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

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

    const [contactoId, setContactoId] = useState(0);
    const [clienteId, setClienteId] = useState(0);
    const [buscadorCliente, setBuscadorCliente] = useState('');
    const [nombres, setNombres] = useState('');
    const [email, setEmail] = useState('');
    const [telefono1, setTelefono1] = useState('');
    const [telefono2, setTelefono2] = useState('');
    const [telefono3, setTelefono3] = useState('');
    const [mensajeBusqueda, setMensajeBusqueda] = useState('');
    const [mensajeIngreso, setMensajeIngreso] = useState('');
    const [mensajeTabla, setMensajeTabla] = useState('');
    const [tableData, setTableData] = useState([]);

    const updateForm = (row) => {
        setContactoId(row.contactoId);
        setClienteId(row.clienteId);
        setBuscadorCliente(row.clienteId);
        setNombres(row.nombres);
        setEmail(row.email);
        setTelefono1(row.telefono1);
        setTelefono2(row.telefono2);
        setTelefono3(row.telefono3);
        console.log(contactoId,clienteId,buscadorCliente,email,telefono1,telefono2,telefono3);
    };

    const clearForm = () => {
        setContactoId(0);
        setClienteId(0);
        setBuscadorCliente('');
        setNombres('');
        setEmail('');
        setTelefono1('');
        setTelefono2('');
        setTelefono3('');
        setMensajeIngreso('');
    };

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_ClientesRef.asmx/ClientesREFMostrar',
                validateStatus: status => true
            })

            if (respuesta.status >= 200 && respuesta.status < 300) {
                const data = new XMLParser().parseFromString(respuesta.data);
                const tempData = [];
                if(data.children[1].children.length < 1) {
                    setTableData([]);
                    return;
                };
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        contactoId: item.children.find(obj => obj.name === 'CRF_CLIENTE_REFERENCIA') ? item.children.find(obj => obj.name === 'CRF_CLIENTE_REFERENCIA').value : null,
                        clienteId: item.children.find(obj => obj.name === 'CRF_CLIENTE') ? item.children.find(obj => obj.name === 'CRF_CLIENTE').value : null,
                        nombreCliente: item.children.find(obj => obj.name === 'CLI_RAZON_SOCIAL') ? item.children.find(obj => obj.name === 'CLI_RAZON_SOCIAL').value : null,
                        nombres: item.children.find(obj => obj.name === 'CRF_NOMBRE_REF') ? item.children.find(obj => obj.name === 'CRF_NOMBRE_REF').value : null,
                        email: item.children.find(obj => obj.name === 'CRF_CORREO_ELECTRONICO') ? item.children.find(obj => obj.name === 'CRF_CORREO_ELECTRONICO').value : null,
                        telefono1: item.children.find(obj => obj.name === 'CRF_TELEFONO1') ? item.children.find(obj => obj.name === 'CRF_TELEFONO1').value : null,
                        telefono2: item.children.find(obj => obj.name === 'CRF_TELEFONO2') ? item.children.find(obj => obj.name === 'CRF_TELEFONO2').value : null,
                        telefono3: item.children.find(obj => obj.name === 'CRF_TELEFONO3') ? item.children.find(obj => obj.name === 'CRF_TELEFONO3').value : null,
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

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (contactoId > 0) {
            url = net_base_url+'CXC_ClientesRef.asmx/ClientesREFactualizar'
            method = 'POST';
            data = querystring.stringify({
                P_REFERENCIA_ID: contactoId,
                P_CLIENTE_ID: clienteId,
                CRF_NOMBRE_REF: nombres,
                CRF_TELEFONO1: telefono1,
                CRF_TELEFONO2: telefono2,
                CRF_TELEFONO3: telefono3,
                CRF_CORREO_ELECTRONICO: email,
            });
        } else {
            url = net_base_url+'/CXC_ClientesRef.asmx/ClientesREFguardar';
            method = 'POST';
            data = querystring.stringify({
                P_CLIENTE_ID: clienteId,
                CRF_NOMBRE_REF: nombres,
                CRF_TELEFONO1: telefono1,
                CRF_TELEFONO2: telefono2,
                CRF_TELEFONO3: telefono3,
                CRF_CORREO_ELECTRONICO: email,
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

    const deleteRow = async (customerContactId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_ClientesRef.asmx/ClientesREFEliminar',
                data: querystring.stringify({
                    P_REFERENCIA_ID: customerContactId
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
            setMensajeTabla('Error: ' + error.message);
        }
    }

    const searchCliente = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ClienteBuscar',
                data: querystring.stringify({
                    cli_cliente: buscadorCliente,
                }),
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                if (data.children[1].children[0].children[0]) {
                    setClienteId(data.children[1].children[0].children[0].children[0].value);
                    setMensajeBusqueda('Cliente encontrado');
                } else {
                    setMensajeBusqueda('Cliente no encontrado');
                }
            } else {
                setMensajeBusqueda('Cliente no encontrado');
                console.log(respuesta.data);
            }
        } catch (error) {
            setMensajeBusqueda('Cliente no encontrado');
            console.log('Error: ' + error.message)
        }
    }

    useEffect(() => {
        getData();
        }, []
    );

    return <>
        <div className="formSegment">
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
                clearForm={clearForm}
                contactoId={contactoId}
                clienteId={clienteId}
                valorBuscadorCliente={buscadorCliente}
                nombres={nombres}
                email={email}
                telefono1={telefono1}
                telefono2={telefono2}
                telefono3={telefono3}
                mensajeBusqueda={mensajeBusqueda}
                mensajeIngreso={mensajeIngreso}
            />
        </div>
        <div className="tableSegment">
            <p className="tableMessage">{mensajeTabla}</p>
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default CustomerContactCrudContainer;

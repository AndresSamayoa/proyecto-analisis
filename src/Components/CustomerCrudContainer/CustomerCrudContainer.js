import './CustomerCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';

import CustomerForm from '../CustomerForm/CustomerForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

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

    const [clienteId, setClienteId] = useState(0);
    const [nit, setNit] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [direccionFiscal, setDireccionFiscal] = useState('');
    const [tipoCliente, setTipoCliente] = useState('persona');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [telefono, setTelefono] = useState('');
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ClientesMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        clienteId: item.children[0].value,
                        razonSocial: item.children[1].value,
                        nit: item.children[6].value,
                        correoElectronico: item.children[4].value,
                        telefono: item.children[3].value,
                        direccionFiscal: item.children[2].value,
                        tipoCliente: item.children[5].value
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
        setClienteId(row.clienteId);
        setNit(row.nit);
        setRazonSocial(row.razonSocial);
        setDireccionFiscal(row.direccionFiscal);
        setTipoCliente(row.tipoCliente);
        setTelefono(row.telefono);
        setCorreoElectronico(row.correoElectronico);
        console.log(clienteId,nit,razonSocial,direccionFiscal,tipoCliente,telefono,correoElectronico);
    };

    const onSubmit = async () => {
        // Consumir api
        let url ;
        let method ;
        let data ;

        if (clienteId > 0) {
            url = net_base_url+'Proyecto-Analisis.asmx/Clientesactualizar'
            method = 'POST';
            data = querystring.stringify({
                cli_cliente: clienteId,
                cli_razon_social: razonSocial,
                cli_direccion: direccionFiscal,
                cli_telefono: telefono,
                cli_correo_electronico: correoElectronico,
                cli_tipo_cliente: tipoCliente,
                cli_nit: nit,
            });
        } else {
            url = net_base_url+'/Proyecto-Analisis.asmx/Clientesguardar';
            method = 'POST';
            data = querystring.stringify({
                CLI_RAZON_SOCIAL: razonSocial,
                CLI_DIRECCION: direccionFiscal,
                CLI_TELEFONO: telefono,
                CLI_CORREO_ELECTRONICO: correoElectronico,
                CLI_TIPO_CLIENTE: tipoCliente,
                CLI_NIT: nit
            });
        }

        console.log(clienteId,nit,razonSocial,direccionFiscal,tipoCliente);

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

    const deleteRow = async (customerId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ClientesEliminar',
                data: querystring.stringify({
                    cli_cliente: customerId
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
    };

    const clearForm = async () => {
        setClienteId(0);
        setNit('');
        setRazonSocial('');
        setDireccionFiscal('');
        setTipoCliente('persona');
        setCorreoElectronico('');
        setTelefono('');
    };

    useEffect(() => {
        getData();
      }, []);

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
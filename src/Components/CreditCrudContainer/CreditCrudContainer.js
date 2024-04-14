import './CreditCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';

import CreditForm from '../CreditForm/CreditForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

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
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/CREDITOSMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                if(data.children[1].children.length < 1) {
                    setTableData([]);
                    return;
                };
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        creditoId: item.children.find(obj => obj.name === 'CRE_CREDITO') ? item.children.find(obj => obj.name === 'CRE_CREDITO').value : null,
                        clienteId: item.children.find(obj => obj.name === 'CLI_CLIENTE') ? item.children.find(obj => obj.name === 'CLI_CLIENTE').value : null,
                        nombreCliente: item.children.find(obj => obj.name === 'CLI_RAZON_SOCIAL') ? item.children.find(obj => obj.name === 'CLI_RAZON_SOCIAL').value : null,
                        credito: item.children.find(obj => obj.name === 'CRE_CREDITO_DISPONIBLE') ? item.children.find(obj => obj.name === 'CRE_CREDITO_DISPONIBLE').value : null,
                        plazo: item.children.find(obj => obj.name === 'CRE_PLAZO') ? item.children.find(obj => obj.name === 'CRE_PLAZO').value : null,
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
        setCreditoId(row.creditoId);
        setClienteId(row.clienteId);
        setBuscadorCliente(row.nombreCliente);
        setCredito(row.credito);
        setPlazo(row.plazo);
        console.log(creditoId,clienteId,buscadorCliente,credito,plazo);
    };

    const clearForm = async () => {
        setCreditoId(0);
        setClienteId(0);
        setBuscadorCliente('');
        setCredito('');
        setPlazo('');
        setMensajeBusqueda('');
    };

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (creditoId > 0) {
            url = net_base_url+'Proyecto-Analisis.asmx/CREDITOSActualizar'
            method = 'POST';
            data = querystring.stringify({
                cre_credito: creditoId,
                cli_cliente: clienteId,
                cre_credito_disponible: credito,
                cre_plazo: plazo
            });
        } else {
            url = net_base_url+'/Proyecto-Analisis.asmx/CREDITOSGuardar';
            method = 'POST';
            data = querystring.stringify({
                CLI_CLIENTE: clienteId,
                CRE_CREDITO_DISPONIBLE: credito,
                CRE_PLAZO: plazo
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
                console.log(respuesta.data);
                getData();
                clearForm();
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    };

    const deleteRow = async (creditId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/CREDITOSEliminar',
                data: querystring.stringify({
                    cre_credito: creditId
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

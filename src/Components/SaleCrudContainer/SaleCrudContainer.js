import './SaleCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';

import SaleForm from '../SaleForm/SaleForm'

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function SaleCrudContainer () {
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.ventaId,
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
                return <button onClick={() => {deleteRow(row.ventaId)}} >Borrar</button>
            },
        },
        {
            name: 'Razon social cliente',
            selector: row => row.nombreCliente,
        },
        {
            name: 'Nombre empleado',
            selector: row => row.nombreEmpleado,
        },
        {
            name: 'Condicion de pago',
            selector: row => row.condicionPago,
        },
        {
            name: 'Numero de autorizacion',
            selector: row => row.numeroAutorizacion,
        },
        {
            name: 'Valor total',
            selector: row => row.valorTotal,
        },
        {
            name: 'Cerrado',
            selector: row => row.cerrado ? 'Si' : 'no',
        },
    ];

    const [ventaId, setVentaId] = useState(0);
    const [clienteId, setClienteId] = useState(0);
    const [buscadorCliente, setBuscadorCliente] = useState('');
    const [mensajeBuscadorCliente, setMensajeBuscadorCliente] = useState('');
    const [empleadoId, setEmpleadoId] = useState(0);
    const [buscadorEmpleado, setBuscadorEmpleado] = useState('');
    const [mensajeBuscadorEmpleado, setMensajeBuscadorEmpleado] = useState('');
    const [condicionPago, setCondicionPago] = useState('');
    const [numeroAutorizacion, setNumeroAutorizacion] = useState('');
    const [total, setTotal] = useState(0);
    const [cerrado, setCerrado] = useState(false);
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/VENTASMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        ventaId: item.children[0].value,
                        clienteId: item.children[1].value,
                        nombreCliente: item.children[2].value,
                        empleadoId: item.children[3].value,
                        nombreEmpleado: item.children[4].value,
                        condicionPago: item.children[5].value,
                        numeroAutorizacion: item.children[6].value,
                        valorTotal: item.children[7].value,
                        cerrado: item.children[8].value,
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
        setVentaId(row.ventaId)
        setClienteId(row.clienteId);
        setBuscadorCliente(row.nombreCliente);
        setEmpleadoId(row.empleadoId);
        setBuscadorEmpleado(row.nombreEmpleado);
        setCondicionPago(row.condicionPago);
        setNumeroAutorizacion(row.numeroAutorizacion);
        setTotal(row.valorTotal);
        setCerrado(row.cerrado);
    };

    const clearForm = async () => {
        setVentaId(0);
        setClienteId(0);
        setBuscadorCliente('');
        setMensajeBuscadorCliente('');
        setEmpleadoId(0);
        setBuscadorEmpleado('');
        setMensajeBuscadorEmpleado('');
        setCondicionPago('');
        setNumeroAutorizacion('');
        setTotal(0);
        setCerrado(false);
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

    const deleteRow = async (saleId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/EMPLEADOSEliminar',
                data: querystring.stringify({
                    ven_venta: saleId
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
                    setMensajeBuscadorCliente('Cliente encontrado');
                } else {
                    setMensajeBuscadorCliente('Cliente no encontrado');
                }
            } else {
                setMensajeBuscadorCliente('Cliente no encontrado');
                console.log(respuesta.data);
            }
        } catch (error) {
            setMensajeBuscadorCliente('Cliente no encontrado');
            console.log('Error: ' + error.message)
        }
    }

    const searchEmpleado = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/EmpleadoBuscar',
                data: querystring.stringify({
                    emp_empleado: buscadorEmpleado,
                }),
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                if (data.children[1].children[0].children[0]) {
                    setEmpleadoId(data.children[1].children[0].children[0].children[0].value);
                    setMensajeBuscadorEmpleado('Empleado encontrado');
                } else {
                    setMensajeBuscadorEmpleado('Empleado no encontrado');
                }
            } else {
                setMensajeBuscadorEmpleado('Empleado no encontrado');
                console.log(respuesta.data);
            }
        } catch (error) {
            setMensajeBuscadorEmpleado('Empleado no encontrado');
            console.log('Error: ' + error.message)
        }
    }

    useEffect(() => {
        getData();
        }, []
    );

    return <>
        <div>
            <SaleForm 
                onSubmit={onSubmit}
                cancelForm={clearForm}
                searchCliente={searchCliente}
                searchEmpleado={searchEmpleado}
                ventaId={ventaId}
                numeroAutorizacion={numeroAutorizacion}
                condicionPago={condicionPago}
                buscadorCliente={buscadorCliente}
                mensajeBusquedaCliente={mensajeBuscadorCliente}
                buscadorEmpleado={buscadorEmpleado}
                mensajeBusquedaEmpleado={mensajeBuscadorEmpleado}
                setVentaId={setVentaId}
                setNumeroAutorizacion={setNumeroAutorizacion}
                setCondicionPago={setCondicionPago}
                setValorBuscadorEmpleado={setBuscadorEmpleado}
                setValorBuscadorCliente={setBuscadorCliente}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
};

module.exports = SaleCrudContainer;

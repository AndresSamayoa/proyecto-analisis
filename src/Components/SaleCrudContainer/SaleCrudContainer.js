import './SaleCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';

import SaleForm from '../SaleForm/SaleForm'
import SaleDetailCrudContainer from '../SaleDetailCrudContainer/SaleDetailCrudContainer'
import PaymentCrudContainer from '../PaymentCrudContainer/PaymentCrudContainer'

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
            name: '',
            selector: row => {
                return <button disabled={row.cerrado > 0} onClick={() => {closeRow(row.ventaId)}} >Cerrar</button>
            },
        },
        {
            name: 'Cerrado',
            selector: row => row.cerrado > 0 ? 'Si' : 'No',
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
    const [mensajeIngreso, setMensajeIngreso] = useState('');
    const [mensajeTabla, setMensajeTabla] = useState('');
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Venta.asmx/VentaMostrar',
                validateStatus: status => true
            })

            if (respuesta.status >= 200 && respuesta.status < 300) {
                const data = new XMLParser().parseFromString(respuesta.data)
                const tempData = [];
                if(data.children[1].children.length < 1) {
                    setTableData([]);
                    return;
                };
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        ventaId: item.children.find(obj => obj.name === 'VEN_VENTA') ? item.children.find(obj => obj.name === 'VEN_VENTA').value : null,
                        clienteId: item.children.find(obj => obj.name === 'VEN_CLIENTE') ? item.children.find(obj => obj.name === 'VEN_CLIENTE').value : null,
                        nombreCliente: item.children.find(obj => obj.name === 'CLI_RAZON_SOCIAL') ? item.children.find(obj => obj.name === 'CLI_RAZON_SOCIAL').value : null,
                        empleadoId: item.children.find(obj => obj.name === 'VEN_EMPLEADO') ? item.children.find(obj => obj.name === 'VEN_EMPLEADO').value : null,
                        nombreEmpleado: item.children.find(obj => obj.name === 'EMP_NOMBRES') ? item.children.find(obj => obj.name === 'EMP_NOMBRES').value : null,
                        condicionPago: item.children.find(obj => obj.name === 'VEN_CONDICION_PAGO') ? item.children.find(obj => obj.name === 'VEN_CONDICION_PAGO').value : null,
                        numeroAutorizacion: item.children.find(obj => obj.name === 'VEN_NO_AUTORIZACION') ? item.children.find(obj => obj.name === 'VEN_NO_AUTORIZACION').value : null,
                        valorTotal: item.children.find(obj => obj.name === 'VEN_TOTAL') ? item.children.find(obj => obj.name === 'VEN_TOTAL').value : null,
                        cerrado: item.children.find(obj => obj.name === 'VEN_CERRADO') ? item.children.find(obj => obj.name === 'VEN_CERRADO').value : null,
                    })
                }
                setTableData(tempData);
            } else {
                setMensajeTabla('Error ' + respuesta.status + ': ' + respuesta.data);
            }
        } catch (error) {
            setMensajeTabla('Error: ' + error.message)
        }
    }

    const updateForm = (row) => {
        setVentaId(row.ventaId)
        setClienteId(row.clienteId);
        setBuscadorCliente(row.clienteId);
        setEmpleadoId(row.empleadoId);
        setBuscadorEmpleado(row.empleadoId);
        setCondicionPago(row.condicionPago);
        setNumeroAutorizacion(row.numeroAutorizacion);
        setTotal(row.valorTotal);
        setCerrado(row.cerrado);
    };

    const clearForm = () => {
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
        setMensajeIngreso('');
    };

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (ventaId > 0) {
            url = net_base_url+'CXC_Venta.asmx/Ventasactualizar'
            method = 'POST';
            data = querystring.stringify({
                p_venta: ventaId,
                Ven_p_cliente: clienteId,
                Ven_p_empleado: empleadoId,
                Ven_p_condicion_pago: condicionPago,
                Ven_p_no_autorizacion: numeroAutorizacion,
            });
        } else {
            url = net_base_url+'/CXC_Venta.asmx/Ventaguardar';
            method = 'POST';
            data = querystring.stringify({
                Ven_p_cliente: clienteId,
                Ven_p_empleado: empleadoId,
                Ven_p_condicion_pago: condicionPago,
                Ven_p_no_autorizacion: numeroAutorizacion,
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
                setMensajeIngreso('Exito en la operacion');
            } else {
                setMensajeIngreso(respuesta.data);
            }
        } catch (error) {
            setMensajeIngreso('Error: ' + error.message);
        }
    };

    const deleteRow = async (saleId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Venta.asmx/VentasEliminar',
                data: querystring.stringify({
                    Ven_p_venta: saleId
                }),
                validateStatus: status => true
            })
            console.log(respuesta)
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

    const closeRow = async (saleId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/CXC_Venta.asmx/VentaCerrar',
                data: querystring.stringify({
                    Cerrar_p_venta: saleId
                }),
                validateStatus: status => true
            })
            console.log(respuesta)
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
                url: net_base_url+'/Proyecto-Analisis.asmx/EmpleadosBuscar',
                data: querystring.stringify({
                    emp_empleado: buscadorEmpleado,
                }),
                validateStatus: status => true
            })

            console.log(respuesta)
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
        <div className='controlSegment'>
            <div>
                <SaleForm 
                    onSubmit={onSubmit}
                    cancelForm={clearForm}
                    searchCliente={searchCliente}
                    searchEmpleado={searchEmpleado}
                    ventaId={ventaId}
                    numeroAutorizacion={numeroAutorizacion}
                    condicionPago={condicionPago}
                    valorBuscadorCliente={buscadorCliente}
                    mensajeBusquedaCliente={mensajeBuscadorCliente}
                    valorBuscadorEmpleado={buscadorEmpleado}
                    mensajeBusquedaEmpleado={mensajeBuscadorEmpleado}
                    setVentaId={setVentaId}
                    setNumeroAutorizacion={setNumeroAutorizacion}
                    setCondicionPago={setCondicionPago}
                    setValorBuscadorEmpleado={setBuscadorEmpleado}
                    setValorBuscadorCliente={setBuscadorCliente}
                    mensajeIngreso={mensajeIngreso}
                />
            </div>
            <div className="tableSegment">
                <p className="tableMessage">{mensajeTabla}</p>
                <DataTable columns={columns} data={tableData}/>
            </div>
        </div>
        
        {ventaId > 0 &&
            <> 
                <div className='extraCruds'>
                    <h3>Detalles</h3>
                    <div className='controlSegment'>
                        <SaleDetailCrudContainer ventaId={ventaId}/>
                    </div>
                </div>
                <div className='extraCruds'>
                    <h3>Abonos</h3>
                    <div className='controlSegment'>
                        <PaymentCrudContainer ventaId={ventaId}/>
                    </div>
                </div>
            </>
        }
    </>
};

export default SaleCrudContainer;

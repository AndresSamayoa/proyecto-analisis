import './SaleDetailCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';

import SaleDetailForm from '../SaleDetailForm/SaleDetailForm'

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function SaleDetailCrudContainer (props) {
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.detalleVentaId,
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
                return <button onClick={() => {deleteRow(row.detalleVentaId)}} >Borrar</button>
            },
        },
        {
            name: 'Nombre producto',
            selector: row => row.nombreProducto,
        },
        {
            name: 'Cantidad',
            selector: row => row.cantidad,
        },
        {
            name: 'Descuento',
            selector: row => row.descuento,
        },
        {
            name: 'Subtotal',
            selector: row => row.valorSubtotal,
        },
    ];

    const [detalleVentaId, setDetalleVentaId] = useState(0);
    const [productoId, setProductoId] = useState(0);
    const [buscadorProducto, setBuscadorProducto] = useState('');
    const [mensajeProducto, setMensajeBuscadorProducto] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [cantidad, setCantidad] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/VENTASDetallesMostrarVenta',
                data: {
                    dev_venta: props.ventaId
                },
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        ventaId: props.ventaId,
                        detalleVentaId: item.children[0].value,
                        nombreProducto: item.children[1].value,
                        idProducto: item.children[2].value,
                        cantidad: item.children[3].value,
                        descuento: item.children[4].value,
                        valorSubtotal: item.children[5].value,
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
        setDetalleVentaId(row.detalleVentaId)
        setSubtotal(row.valorSubtotal)
        setCantidad(row.clienteId);
        setDescuento(row.nombreCliente);
        setProductoId(row.productoId);
        setBuscadorProducto(row.productoId);
        setMensajeBuscadorProducto('');
    };

    const clearForm = async () => {
        setDetalleVentaId(0)
        setSubtotal(0)
        setCantidad(0);
        setDescuento(0);
        setProductoId(0);
        setBuscadorProducto(0);
        setMensajeBuscadorProducto('');
    };

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (creditoId > 0) {
            url = net_base_url+'Proyecto-Analisis.asmx/DetalleVentaActualizar'
            method = 'POST';
            data = querystring.stringify({
                dev_detalle_venta: detalleVentaId,
                dev_producto: productoId,
                dev_subtotal: subtotal,
                dev_cantidad: cantidad,
                dev_descuento: descuento,
                dev_venta: props.ventaId,
            });
        } else {
            url = net_base_url+'/Proyecto-Analisis.asmx/DetalleVentaGuardar';
            method = 'POST';
            data = querystring.stringify({
                dev_producto: productoId,
                dev_subtotal: subtotal,
                dev_cantidad: cantidad,
                dev_descuento: descuento,
                dev_venta: props.ventaId,
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
                url: net_base_url+'/Proyecto-Analisis.asmx/DetalleVentaEliminar',
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

    const searchProducto = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ProductosBuscar',
                data: querystring.stringify({
                    pro_producto: buscadorProducto,
                }),
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                if (data.children[1].children[0].children[0]) {
                    setClienteId(data.children[1].children[0].children[0].children[0].value);
                    setMensajeBuscadorCliente('Producto encontrado');
                } else {
                    setMensajeBuscadorCliente('Producto no encontrado');
                }
            } else {
                setMensajeBuscadorCliente('Producto no encontrado');
                console.log(respuesta.data);
            }
        } catch (error) {
            setMensajeBuscadorCliente('Producto no encontrado');
            console.log('Error: ' + error.message)
        }
    }

    useEffect(() => {
        getData();
        }, []
    );

    return <>
        <div>
            <SaleDetailForm 
                onSubmit={onSubmit}
                cancelForm={clearForm}
                searchProducto={searchProducto}
                ventaId={props.ventaId}
                detalleVentaId={detalleVentaId}
                cantidad={cantidad}
                subtotal={subtotal}
                descuento={descuento}
                mensajeBusquedaProducto={mensajeProducto}
                setDetalleVentaId={setDetalleVentaId}
                setCantidad={setCantidad}
                setSubtotal={setSubtotal}
                setDescuento={setDescuento}
                setValorBuscadorProducto={setBuscadorProducto}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
};

export default  SaleDetailCrudContainer;

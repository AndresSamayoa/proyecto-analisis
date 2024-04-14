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
                url: net_base_url+'/CXC_DetalleVenta.asmx/DetalleVentaMostrar',
                data: querystring.stringify({
                    id_DetalleV: props.ventaId
                }),
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
                        ventaId: props.ventaId,
                        detalleVentaId: item.children.find(obj => obj.name === 'DEV_DETALLE_VENTA') ? item.children.find(obj => obj.name === 'DEV_DETALLE_VENTA').value : null,
                        nombreProducto: item.children.find(obj => obj.name === 'PRO_DESCRIPCION') ? item.children.find(obj => obj.name === 'PRO_DESCRIPCION').value : null,
                        idProducto: item.children.find(obj => obj.name === 'DEV_PRODUCTO') ? item.children.find(obj => obj.name === 'DEV_PRODUCTO').value : null,
                        cantidad: item.children.find(obj => obj.name === 'DEV_CANTIDAD') ? item.children.find(obj => obj.name === 'DEV_CANTIDAD').value : null,
                        descuento: item.children.find(obj => obj.name === 'DEV_DESCUENTO') ? item.children.find(obj => obj.name === 'DEV_DESCUENTO').value : null,
                        valorSubtotal: item.children.find(obj => obj.name === 'DEV_SUBTOTAL') ? item.children.find(obj => obj.name === 'DEV_SUBTOTAL').value : null,
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
        console.log(row)
        setDetalleVentaId(row.detalleVentaId)
        setSubtotal(row.valorSubtotal)
        setCantidad(row.cantidad);
        setDescuento(row.descuento);
        setProductoId(row.idProducto);
        setBuscadorProducto(row.idProducto);
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

        if (detalleVentaId > 0) {
            url = net_base_url+'/CXC_DetalleVenta.asmx/DetalleVentactualizar'
            method = 'POST';
            data = querystring.stringify({
                DetalleVenta: detalleVentaId,
                DEV_PRODUCTO: productoId,
                DEV_CANTIDAD: cantidad,
                DEV_DESCUENTO: descuento,
                DEV_VENTA: props.ventaId,
            });
        } else {
            url = net_base_url+'/CXC_DetalleVenta.asmx/DetalleVentaGuardar';
            method = 'POST';
            data = querystring.stringify({
                DEV_PRODUCTO: productoId,
                DEV_CANTIDAD: cantidad,
                DEV_DESCUENTO: descuento,
                DEV_VENTA: props.ventaId,
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
                url: net_base_url+'/CXC_DetalleVenta.asmx/DetalleVentaEliminar',
                data: querystring.stringify({
                    p_detalle_venta: saleId
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
                url: net_base_url+'/Proyecto-Analisis.asmx/ProductoBuscar',
                data: querystring.stringify({
                    p_id: buscadorProducto,
                }),
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            if (respuesta.status >= 200 && respuesta.status < 300) {
                if (data.children[1].children[0].children[0]) {
                    setProductoId(data.children[1].children[0].children[0].children[0].value);
                    setMensajeBuscadorProducto('Producto encontrado');
                } else {
                    setMensajeBuscadorProducto('Producto no encontrado');
                }
            } else {
                setMensajeBuscadorProducto('Producto no encontrado');
                console.log(respuesta.data);
            }
        } catch (error) {
            setMensajeBuscadorProducto('Producto no encontrado');
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
                valorBuscadorProducto={buscadorProducto}
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

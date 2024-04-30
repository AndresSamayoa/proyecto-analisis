import './ProductCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';
import ProductForm from '../ProductForm/ProductForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

function ProductCrudContainer () {
    
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.productoId,
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
                return <button onClick={() => {deleteRow(row.productoId)}} >Borrar</button>
            },
        },
        {
            name: 'Descripcion',
            selector: row => row.descripcion,
        },
        {
            name: 'Cantidad',
            selector: row => row.cantidad,
        },
        {
            name: 'Precio',
            selector: row => row.precio,
        }
    ];

    const [productoId, setProductoId] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState(0);
    const [cantidad, setCantidad] = useState(0);
    const [mensajeIngreso, setMensajeIngreso] = useState('');
    const [mensajeTabla, setMensajeTabla] = useState('');
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ProductosMostrar',
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
                        productoId: item.children.find(obj => obj.name === 'PRO_PRODUCTO') ? item.children.find(obj => obj.name === 'PRO_PRODUCTO').value : null,
                        descripcion: item.children.find(obj => obj.name === 'PRO_DESCRIPCION') ? item.children.find(obj => obj.name === 'PRO_DESCRIPCION').value : null,
                        precio: item.children.find(obj => obj.name === 'PRO_PRECIO') ? item.children.find(obj => obj.name === 'PRO_PRECIO').value : null,
                        cantidad: item.children.find(obj => obj.name === 'PRO_CANTIDAD') ? item.children.find(obj => obj.name === 'PRO_CANTIDAD').value : null,
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

    const updateForm = (row) => {
        setProductoId(row.productoId);
        setDescripcion(row.descripcion);
        setPrecio(row.precio);
        setCantidad(row.cantidad);
        console.log(productoId,descripcion,precio,cantidad);
    };

    const clearForm = () => {
        setProductoId(0);
        setDescripcion('');
        setPrecio('');
        setCantidad('');
        setMensajeIngreso('');
    };

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (productoId > 0) {
            url = net_base_url+'Proyecto-Analisis.asmx/ProductosActualizar'
            method = 'POST';
            data = querystring.stringify({
                pro_producto: productoId,
                pro_descripcion: descripcion,
                pro_precio: precio,
                pro_cantidad: cantidad,
	
            });
        } else {
            url = net_base_url+'/Proyecto-Analisis.asmx/Productosguardar';
            method = 'POST';
            data = querystring.stringify({
                pro_descripcion: descripcion,
                pro_precio: precio,
                pro_cantidad: cantidad,
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

    const deleteRow = async (productId) => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ProductosEliminar',
                data: querystring.stringify({
                    pro_producto: productId
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

    useEffect(() => {
            getData();
        }, []
    );

    return <>
        <div className="formSegment">
            <ProductForm 
                onSubmit={onSubmit}
                setProductoId={setProductoId}
                setDescripcion={setDescripcion}
                setPrecio={setPrecio}
                setCantidad={setCantidad}
                clearForm={clearForm}
                productoId={productoId}
                descripcion={descripcion}
                precio={precio}
                cantidad={cantidad}
                mensajeIngreso={mensajeIngreso}
            />
        </div>
        <div className="tableSegment">
            <p className="tableMessage">{mensajeTabla}</p>
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default ProductCrudContainer;

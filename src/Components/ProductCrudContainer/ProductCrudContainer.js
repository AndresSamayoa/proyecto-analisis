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
    
    const data = [
        {
            productoId: 1,
            descripcion: 'TEST 1',
            precio: 20.00,
            cantidad: 5,
        },
        {
            productoId: 2,
            descripcion: 'TEST 2',
            precio: 10.00,
            cantidad: 3,
        },
    ];

    const [productoId, setProductoId] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState(0);
    const [cantidad, setCantidad] = useState(0);
    const [tableData, setTableData] = useState([]);

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/ProductosMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        productoId: item.children[0].value,
                        descripcion: item.children[1].value,
                        precio: item.children[2].value,
                        cantidad: item.children[3].value,
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
            } else {
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
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
                console.log(respuesta.data);
            }
        } catch (error) {
            console.log('Error: ' + error.message)
        }
    }

    useEffect(() => {
            getData();
        }, []
    );

    return <>
        <div id="formSegment">
            <ProductForm 
                onSubmit={onSubmit}
                setProductoId={setProductoId}
                setDescripcion={setDescripcion}
                setPrecio={setPrecio}
                setCantidad={setCantidad}
                productoId={productoId}
                descripcion={descripcion}
                precio={precio}
                cantidad={cantidad}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default ProductCrudContainer;

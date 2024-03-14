import './ProductCrudContainer.css'

import DataTable from 'react-data-table-component';
import { useState } from 'react';
import ProductForm from '../ProductForm/ProductForm';

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
    const [tableData, setTableData] = useState(data);

    const updateForm = (row) => {
        setProductoId(row.productoId);
        setDescripcion(row.descripcion);
        setPrecio(row.precio);
        setCantidad(row.cantidad);
        console.log(productoId,descripcion,precio,cantidad);
    };

    const onSubmit = () => {
        // Consumir api
        console.log(
            productoId,
            descripcion,
            cantidad,
            precio
        );
    };

    const deleteRow = (productId) => {
        // Consumir api
        const index = tableData.findIndex(row => row.productoId == productId)
        console.log(tableData, index);
        const tempDat = [...tableData].splice(index, 1);
        setTableData(tempDat);
    } 

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

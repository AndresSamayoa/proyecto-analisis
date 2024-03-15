import './EmployeeCrudContainer.css'

import DataTable from 'react-data-table-component';
import { useState } from 'react';
import axios from 'axios'
import EmployeeForm from '../EmployeeForm/EmployeeForm';

function EmployeeCrudContainer () {
    
    const columns = [
        {
            name: 'Codigo',
            selector: row => row.empleadoId,
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
                return <button onClick={() => {deleteRow(row.empleadoId)}} >Borrar</button>
            },
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
        },
        {
            name: 'Apellido',
            selector: row => row.apellido,
        },
        {
            name: 'Correo Electronico',
            selector: row => row.correoElectronico,
        },
        {
            name: 'Telefono',
            selector: row => row.telefono,
        },
        {
            name: 'Direccion',
            selector: row => row.direccion,
        },
        {
            name: 'Rol',
            selector: row => row.rolDescripcion,
        }
    ];
    
    const data = [
        {
            empleadoId: 1,
            nombre: 'Empleado',
            apellido: 'No. 1',
            correoElectronico: 'empleado@mail.com',
            telefono: '12345678',
            direccion: 'Ciudad',
            rolDescripcion: 'Vendedor',
            rolId: 1
        },
        {
            empleadoId: 2,
            nombre: 'Empleado',
            apellido: 'No. 2',
            correoElectronico: 'Supervisor@mail.com',
            telefono: '87654321',
            direccion: 'Ciudad',
            rolDescripcion: 'Supervisor',
            rolId: 2
        },
    ];

    const [empleadoId, setEmpleadoId] = useState(0);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [rolId, setRolId] = useState(0);
    const [tableData, setTableData] = useState(data);

    const updateForm = (row) => {
        setEmpleadoId(row.empleadoId);
        setNombre(row.nombre);
        setApellido(row.apellido);
        setCorreoElectronico(row.correoElectronico);
        setTelefono(row.telefono);
        setDireccion(row.direccion);
        setRolId(row.rolId)
        console.log(empleadoId,nombre,apellido,correoElectronico,telefono,direccion);
    };

    const onSubmit = async () => {
        // Consumir api
        console.log(empleadoId,nombre,apellido,correoElectronico,telefono,direccion,rolId);
        const respuesta = await axios({
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            data: {
                empleadoId,
                nombre,
                apellido,
                correoElectronico,
                telefono,
                direccion,
                rolId
            }
        })
        console.log(respuesta);
    };

    const deleteRow = (employeeId) => {
        // Consumir api
        const index = tableData.findIndex(row => row.empleadoId == employeeId)
        console.log(tableData, index);
        const tempDat = [...tableData].splice(index, 1);
        setTableData(tempDat);
    } 

    return <>
        <div id="formSegment">
            <EmployeeForm 
                onSubmit={onSubmit}
                setEmpleadoId={setEmpleadoId}
                setNombre={setNombre}
                setApellido={setApellido}
                setCorreoElectronico={setCorreoElectronico}
                setTelefono={setTelefono}
                setDireccion={setDireccion}
                setRol={setRolId}
                empleadoId={empleadoId}
                nombre={nombre}
                apellido={apellido}
                correoElectronico={correoElectronico}
                telefono={telefono}
                direccion={direccion}
                rol={rolId}
                rols={[{id: 2, descripcion: 'Supervisor'}, {id: 1, descripcion: 'Vendedor'}]}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default EmployeeCrudContainer;

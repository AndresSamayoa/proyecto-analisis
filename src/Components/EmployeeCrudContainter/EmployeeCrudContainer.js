import './EmployeeCrudContainer.css'

import DataTable from 'react-data-table-component';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import querystring from 'querystring';
import { useState, useEffect } from 'react';
import EmployeeForm from '../EmployeeForm/EmployeeForm';

const net_base_url = process.env.REACT_APP_DOT_NET_API_BASE;

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
        // {
        //     name: 'Rol',
        //     selector: row => row.rolDescripcion,
        // }
    ];
    
    const data = [
        {
            empleadoId: 1,
            nombre: 'Empleado',
            apellido: 'No. 1',
            correoElectronico: 'empleado@mail.com',
            telefono: '12345678',
            direccion: 'Ciudad',
        },
        {
            empleadoId: 2,
            nombre: 'Empleado',
            apellido: 'No. 2',
            correoElectronico: 'Supervisor@mail.com',
            telefono: '87654321',
            direccion: 'Ciudad',
        },
    ];

    const [empleadoId, setEmpleadoId] = useState(0);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [tableData, setTableData] = useState([]);

    const clearForm = () => {
        setEmpleadoId(0);
        setNombre('');
        setApellido('');
        setCorreoElectronico('');
        setTelefono('');
        setDireccion('');
        
    };

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/EmpleadosMostrar',
                validateStatus: status => true
            })

            const data = new XMLParser().parseFromString(respuesta.data)
            // console.log(data.children[1].children[0]);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                const tempData = [];
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        empleadoId: item.children[0].value,
                        nombre: item.children[1].value,
                        apellido: item.children[2].value,
                        correoElectronico: item.children[5].value,
                        telefono: item.children[3].value,
                        direccion: item.children[4].value,
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
        setEmpleadoId(row.empleadoId);
        setNombre(row.nombre);
        setApellido(row.apellido);
        setCorreoElectronico(row.correoElectronico);
        setTelefono(row.telefono);
        setDireccion(row.direccion);
        console.log(empleadoId,nombre,apellido,correoElectronico,telefono,direccion);
    };

    const onSubmit = async () => {
        let url ;
        let method ;
        let data ;

        if (empleadoId > 0) {
            url = net_base_url+'Proyecto-Analisis.asmx/EmpleadosActualizar'
            method = 'POST';
            data = querystring.stringify({
                EMP_EMPLEADO: empleadoId,
                EMP_NOMBRE: nombre,
                EMP_APELLIDO: apellido,
                EMP_TELEFONO: telefono,
                EMP_DIRECCION: direccion,
                EMP_CORREO_ELECTRONICO: correoElectronico,
            });
        } else {
            url = net_base_url+'/Proyecto-Analisis.asmx/Empleadosguardar';
            method = 'POST';
            data = querystring.stringify({
                EMP_NOMBRE: nombre,
                EMP_APELLIDO: apellido,
                EMP_TELEFONO: telefono,
                EMP_DIRECCION: direccion,
                EMP_CORREO_ELECTRONICO: correoElectronico,
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

    const deleteRow = async (employeeId) => {
        try {
            console.log(employeeId)
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/EmpleadosEliminar',
                data: querystring.stringify({
                    EMP_EMPLEADO: employeeId
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
            <EmployeeForm 
                onSubmit={onSubmit}
                setEmpleadoId={setEmpleadoId}
                setNombre={setNombre}
                setApellido={setApellido}
                setCorreoElectronico={setCorreoElectronico}
                setTelefono={setTelefono}
                setDireccion={setDireccion}
                empleadoId={empleadoId}
                nombre={nombre}
                apellido={apellido}
                correoElectronico={correoElectronico}
                telefono={telefono}
                direccion={direccion}
            />
        </div>
        <div className="tableSegment">
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default EmployeeCrudContainer;

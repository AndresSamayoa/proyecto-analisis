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

    const [empleadoId, setEmpleadoId] = useState(0);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [mensajeIngreso, setMensajeIngreso] = useState('');
    const [mensajeTabla, setMensajeTabla] = useState('');
    const [tableData, setTableData] = useState([]);

    const clearForm = () => {
        setEmpleadoId(0);
        setNombre('');
        setApellido('');
        setCorreoElectronico('');
        setTelefono('');
        setDireccion('');
        setMensajeIngreso('');
    };

    const getData = async () => {
        try {
            const respuesta = await axios({
                method: 'POST',
                url: net_base_url+'/Proyecto-Analisis.asmx/EmpleadosMostrar',
                validateStatus: status => true
            })

            if (respuesta.status >= 200 && respuesta.status < 300) {
                const data = new XMLParser().parseFromString(respuesta.data)
                const tempData = [];if(data.children[1].children.length < 1) {
                    setTableData([]);
                    return;
                };
                for (const item of data.children[1].children[0].children) {
                    tempData.push({
                        empleadoId: item.children.find(obj => obj.name === 'EMP_EMPLEADO') ? item.children.find(obj => obj.name === 'EMP_EMPLEADO').value : null,
                        nombre: item.children.find(obj => obj.name === 'EMP_NOMBRE') ? item.children.find(obj => obj.name === 'EMP_NOMBRE').value : null,
                        apellido: item.children.find(obj => obj.name === 'EMP_APELLIDO') ? item.children.find(obj => obj.name === 'EMP_APELLIDO').value : null,
                        correoElectronico: item.children.find(obj => obj.name === 'EMP_CORREO_ELECTRONICO') ? item.children.find(obj => obj.name === 'EMP_CORREO_ELECTRONICO').value : null,
                        telefono: item.children.find(obj => obj.name === 'EMP_TELEFONO') ? item.children.find(obj => obj.name === 'EMP_TELEFONO').value : null,
                        direccion: item.children.find(obj => obj.name === 'EMP_DIRECCION') ? item.children.find(obj => obj.name === 'EMP_DIRECCION').value : null,
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
                setMensajeIngreso('Exito en la operacion');
            } else {
                setMensajeIngreso(respuesta.data);
            }
        } catch (error) {
            setMensajeIngreso('Error: ' + error.message);
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
            <EmployeeForm 
                onSubmit={onSubmit}
                setEmpleadoId={setEmpleadoId}
                setNombre={setNombre}
                setApellido={setApellido}
                setCorreoElectronico={setCorreoElectronico}
                setTelefono={setTelefono}
                setDireccion={setDireccion}
                clearForm={clearForm}
                empleadoId={empleadoId}
                nombre={nombre}
                apellido={apellido}
                correoElectronico={correoElectronico}
                telefono={telefono}
                direccion={direccion}
                mensajeIngreso={mensajeIngreso}
            />
        </div>
        <div className="tableSegment">
            <p className="tableMessage">{mensajeTabla}</p>
            <DataTable columns={columns} data={tableData}/>
        </div>
    </>
}

export default EmployeeCrudContainer;

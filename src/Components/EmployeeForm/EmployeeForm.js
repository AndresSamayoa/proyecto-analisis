import './EmployeeForm.css';

function ProductForm (props) {

    const changeNombre = (e) => {
        props.setNombre(e.target.value);
    };

    const changeApellido = (e) => {
        props.setApellido(e.target.value);
    };
    
    const changeCorreoElectronico = (e) => {
        props.setCorreoElectronico(e.target.value);
    };

    const changeTelefono = (e) => {
        props.setTelefono(e.target.value);
    };

    const changeDireccion = (e) => {
        props.setDireccion(e.target.value);
    };
    
    const changeRol = (e) => {
        props.setRol(e.target.value);
    };

    const cancelForm = () => {
        props.setNombre('');
        props.setApellido('');
        props.setCorreoElectronico('');
        props.setTelefono('');
        props.setDireccion('');
        props.setRol(0);
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
        <div className="inputContainer">
            <label>Nombres</label>
            <input type="text" id="txtNombre" value={props.nombre} onChange={changeNombre}/>
        </div>
        <div className="inputContainer">
            <label>Apellidos</label>
            <input type="text" id="txtApellido" value={props.apellido} onChange={changeApellido}/>
        </div>
        <div className="inputContainer">
            <label>Correo Electronico</label>
            <input type="text" id="txtCorreoElectronico" value={props.correoElectronico} onChange={changeCorreoElectronico}/>
        </div>
        <div className="inputContainer">
            <label>Telefono</label>
            <input type="text" id="txtTelefono" value={props.telefono} onChange={changeTelefono}/>
        </div>
        <div className="inputContainer">
            <label>Direccion</label>
            <input type="text" id="txtDireccion" value={props.direccion} onChange={changeDireccion}/>
        </div>
        <div className="inputContainer">
            <label>Rol</label>
            <select id="cbRol"  value={props.rol} onChange={changeRol}>
                {props.rols.map((item, index) => (
                    <option key={index} value={item.id}>{item.descripcion}</option>
                ))}
            </select>
        </div>
        <div className="inputContainer">
            <input type="submit" value={props.empleadoId > 0 ? "Actualizar" : "Crear"} />
            <input type="submit" value="Cancelar" onClick={cancelForm}/>
        </div>
        </form>
    </div>
}

export default ProductForm;

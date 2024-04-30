import './ProductForm.css';

function ProductForm (props) {

    const changePrecio = (e) => {
        props.setPrecio(e.target.value);
    };

    const changeCantidad = (e) => {
        props.setCantidad(e.target.value);
    };

    const changeDescripcion = (e) => {
        props.setDescripcion(e.target.value);
    };

    const cancelForm = (e) => {
        e.preventDefault();
        props.clearForm();
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
        <div className="inputContainer">
            <label>Descripcion</label>
            <input type="text" id="txtDescripcion" value={props.descripcion} onChange={changeDescripcion}/>
        </div>
        <div className="inputContainer">
            <label>Cantidad</label>
            <input type="number" id="txtCantidad" value={props.cantidad} onChange={changeCantidad}/>
        </div>
        <div className="inputContainer">
            <label>Precio</label>
            <input type="number" id="txtPrecio" value={props.precio} onChange={changePrecio}/>
        </div>
        <div className="inputContainer">
            <input type="submit" value={props.productoId > 0 ? "Actualizar" : "Crear"} />
            <input type="submit" value="Cancelar" onClick={cancelForm}/>
        </div>
        <div className="submitMessage">
            {props.mensajeIngreso}
        </div>
        </form>
    </div>
}

export default ProductForm;

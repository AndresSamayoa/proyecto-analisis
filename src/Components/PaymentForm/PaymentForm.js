import './PaymentForm.css';

function PaymentForm (props) {

    const changeValor = (e) => {
        props.setValor(e.target.value);
    };

    const changeNumeroAutorizacion = (e) => {
        props.setNumeroAutorizacion(e.target.value);
    };
    
    const changeTipoPago = (e) => {
        props.setTipoPago(e.target.value);
    };

    const cancelForm = () => {
        props.clearForm();
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.onSubmit();
    }

    return <div className="formContainer">
        <form onSubmit={submitForm} >
        <div className="inputContainer">
            <label>Numero de autorizacion</label>
            <input type="Text" id="txtNumeroAutorizacion" value={props.numeroAutorizacion} onChange={changeNumeroAutorizacion}/>
        </div>
        <div className="inputContainer">
            <label>Valor</label>
            <input type="number" id="txtValor" value={props.valor} onChange={changeValor}/>
        </div>
        <div className="inputContainer">
            <label>Tipo de pago</label>
            <select id="cbTipo"  value={props.tipoPago} onChange={changeTipoPago}>
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Cheque</option>
            </select>
        </div>
        <div className="inputContainer">
            <input type="submit" value={props.abonoId > 0 ? "Actualizar" : "Crear"} />
            <input type="submit" value="Cancelar" onClick={cancelForm}/>
        </div>
        </form>
    </div>
}

export default PaymentForm;

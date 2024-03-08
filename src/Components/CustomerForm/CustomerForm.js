import './CustomerForm.css';

import { useState } from 'react';

function CustomerForm (props) {

    const changeNit = (e) => {
        setNit(e.target.value);
    };
    
    const changeRazonSocial = (e) => {
        setRazonSocial(e.target.value);
    };

    const changeDireccionFiscal = (e) => {
        setDireccionFiscal(e.target.value);
    };
    
    const changeTipoCliente = (e) => {
        setTipoCliente(e.target.value);
    };

    const deleteClienteId = (e) => {
        setClienteId(0);
        setNit('');
        setRazonSocial('');
        setDireccionFiscal('');
        setTipoCliente('');
        setCancelUpdate();
    };

    const submitForm = (e) => {
        if (clienteId) console.log('actualizar')
        else console.log('insertar')
        console.log(nit,razonSocial,direccionFiscal,tipoCliente);
        e.preventDefault();
    }

    
    const [clienteId, setClienteId] = useState(props.clienteId || 0);
    const [nit, setNit] = useState(props.nit || '');
    const [razonSocial, setRazonSocial] = useState(props.razonSocial || '');
    const [direccionFiscal, setDireccionFiscal] = useState(props.direccionFiscal || '');
    const [tipoCliente, setTipoCliente] = useState(props.tipoCliente || '');
    const [cancelUpdate, setCancelUpdate] = useState(clienteId ? <input type='submit' value="Cancelar" onClick={deleteClienteId}/> : null);


    return <div className="formContainer">
        <form onSubmit={submitForm} >
            <div className="inputContainer">
                <label>Nit</label>
                <input type="text" id="txtNit" value={nit} onChange={changeNit} />
            </div>
            <div className="inputContainer">
                <label>Razon social</label>
                <input type="text" id="txtRazonSocial" value={razonSocial} onChange={changeRazonSocial}/>
            </div>
            <div className="inputContainer">
                <label>Direccion fiscal</label>
                <input type="text" id="txtDireccionFiscal" value={direccionFiscal} onChange={changeDireccionFiscal}/>
            </div>
            <div className="inputContainer">
                <label>Tipo de cliente</label>
                <select id="cbTipo" value={tipoCliente} onChange={changeTipoCliente}>
                    <option>Place holder</option>
                </select>
            </div>
            <div className="inputContainer">
                <input type="submit" value="Crear" />
                {cancelUpdate}
            </div>
        </form>
    </div>
}

export default CustomerForm;

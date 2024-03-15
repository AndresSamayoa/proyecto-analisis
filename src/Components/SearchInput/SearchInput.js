
function SearchInput (props) {

    const onChange = (e) => {
        props.setValue(e.target.value);
    };

    const search = (e) => {
        e.preventDefault();
        props.searchValueFunction();
    };

    return <div className="inputContainer">
        <input value={props.value} onChange={onChange} />
        <button onClick={search}>Validar</button>
        {props.messageSearch ? <p>{props.messageSearch}</p> : null}
    </div>
}

export default SearchInput;


function SearchInput (props) {

    const onChange = (e) => {
        props.setValue(e.target.value);
    };

    const search = (e) => {
        e.preventDefault();
        props.searchValue();
    };

    return <div className="inputContainer">
        <input value={props.value} onChange={onChange} />
        <button onClick={search}>Validar</button>
    </div>
}

export default SearchInput;

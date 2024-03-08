import './Customer.css'

import {CustomerForm } from "../../Components";

function Customer () {
    return <div className="customerPage">
        <div className="customerSegment">
            <CustomerForm />
        </div>
    </div>
}

export default Customer;

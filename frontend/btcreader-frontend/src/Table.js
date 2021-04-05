import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';

export const Table = () => {
    // get states from the backend api
    const [data, setData]= useState([]);
    const columns = [
        // show from latest called
        {title: 'Last Called', field: 'lastcalled', defaultSort: 'desc'},
        {title: 'API Update Time', field: 'apiupdatetime'},
        {title: 'BitCoin Price in USD', field: 'usd'}
    ]

    
    // set refresh rate to 30 seconds
    useEffect(() => {

        setInterval(() => {
            fetch(`http://${process.env.REACT_APP_FETCH_ENDPOINT}/api/v1/showtable`)
            .then(resp => resp.json())
            .then(resp=> setData(resp))
            .catch(err => alert(err))
        }
        , 30000);
    }, [data]);
  

    return(<div>
            <MaterialTable title="Exchange Table"
            data={data}
            columns={columns}
            options={{
                search: true,
                paging: true,
                exportButton: true,
                sorting: true
            }}       
            />
        </div>)
};
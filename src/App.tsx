import { ChangeEventHandler, useState } from 'react'
import './App.css'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import moment from 'moment';
import { fetchLowestPriceInAMonth, fetchLowestPriceInTheYear, fetchPricesInAMonth, fetchPricesInTheYear } from './apiController';
import { v4 as UUID } from "uuid";

function App() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [method, setMethod] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');


  const handleClick = async () => {
    console.log(method);
    switch (method) {
      case 'fetchLowestPriceInTheYear':
        setData(await fetchLowestPriceInTheYear(year,origin,destination));
        break;
      case 'fetchLowestPriceInAMonth':
        setData(await fetchLowestPriceInAMonth(year, month,origin,destination));
        break;
      case 'fetchPricesInAMonth':
        setData(await fetchPricesInAMonth(year, month,origin,destination));
        break;
      case 'fetchPricesInTheYear':
        setData(await fetchPricesInTheYear(year,origin,destination));
        break;
      default:
        break;
    }
    
  }
  const handleOriginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(event.target.value as string);
  }  
  const handleDestinationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(event.target.value as string);
  }  

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(event.target.value));
  }
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(Number(event.target.value));
  }
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setMethod(event.target.value);
    };
  


moment.locale('en');


  const numberFormat = (value: string) =>{
    const options = { style: 'currency' as const, currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 3 }
   return new Intl.NumberFormat('pt-BR', options).format(Number(value));
  }

  const columns: GridColDef[] = [

    { field: 'departureDate', headerName: 'Date' , width: 250, valueFormatter: (value) => {
      return moment(value).format('DD/MM/yyyy');
    }},
    { field: 'departureAirport', headerName:'Departure Airport', width: 250 },
    { field: 'arrivalAirport', headerName:'Arrival Airport', width: 250 },
    { field: 'bestTotalPrice', headerName:'Best Price', width: 250, valueFormatter: (value) => { return numberFormat(value) } },
    { field: 'currency', headerName:'Currency', width: 250},

  ];
  
  const paginationModel = { page: 0, pageSize: 50 };

  return (
    <>
    <h1>Flight Search</h1>
   <div style={{display: "inline-block", width:"350px"}}>
    <input type="text" value={origin} onChange={handleOriginChange} placeholder="Origin" />
    <label>Origin</label>
    <br />
   
    <input type="text" value={destination} onChange={handleDestinationChange} placeholder="Destination" />
    <label>Destination</label>
    <br />
   
    <input type="text" value={year} onChange={handleYearChange} placeholder="Year" />
    <label>Year</label>
    <br />

    <input type="text" value={month} onChange={handleMonthChange} placeholder="Month" />
    <label>Month</label>
    <br />
    
    <label id='search-method'>Searhc Method</label>

        <select name="choice" onChange={handleChange}  >
  <option key={"fetchLowestPriceInTheYear"} value={"fetchLowestPriceInTheYear"}>Lowest price in the year</option>
  <option key={"fetchLowestPriceInAMonth"} value={"fetchLowestPriceInAMonth"}>Lowest price in a month</option>
  <option key={"fetchPricesInAMonth"} value={"fetchPricesInAMonth"}>Prices in a Month</option>
  <option key={"fetchPricesInTheYear"} value={"fetchPricesInTheYear"}>Prices in the year</option>
</select>
        <br />

    <button onClick={handleClick}>Search</button>
    <br />
    </div>
    <div>
      {data?.length > 0 && <DataGrid rowHeight={25} rows={data} columns={columns} paginationModel={paginationModel} getRowId={() => UUID()} />}
    </div>
    </>
  )
}

export default App


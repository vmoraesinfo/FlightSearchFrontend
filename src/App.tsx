import { useEffect, useState } from 'react'
import './App.css'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Autocomplete, MenuItem, Select, SelectChangeEvent, TextField, Button } from '@mui/material';
import moment from 'moment';
import { fetchLowestPriceInAMonth, fetchLowestPriceInTheYear, fetchPricesInAMonth, fetchPricesInTheYear } from './apiFlightsControler';
import { v4 as UUID } from "uuid";
import { fetchAllAirports } from './apiAirportsControler';

function App() {
  const [data, setData] = useState([]);
  const [airports, setAirports] = useState<{ code: string, city: string }[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  moment.locale('en');


  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month());
  const [method, setMethod] = useState<string>('fetchLowestPriceInTheYear');
  const [origin, setOrigin] = useState({code: '', city: ''});

  const [destination, setDestination] = useState({code: '', city: ''});

  useEffect(() => {
    const fetchAirports = async () => {
      const fetchedAirports = await fetchAllAirports();
      setAirports(fetchedAirports.map((airport: any) => ({ code: airport.code, city: airport.city })));
    };
    fetchAirports();
    setYears(Array.from({length: 10}, (_, k) => String(k + 2025)));
    setMonths(Array.from({length: 12}, (_, k) => String(k + 1)));
  }, [])

  const handleClick = async () => {
    console.log(method,year,origin,destination);
    switch (method) {
      case 'fetchLowestPriceInTheYear':
        setData(await fetchLowestPriceInTheYear(year, origin.code, destination.code));
        break;
      case 'fetchLowestPriceInAMonth':
        setData(await fetchLowestPriceInAMonth(year, month, origin.code, destination.code));
        break;
      case 'fetchPricesInAMonth':
        setData(await fetchPricesInAMonth(year, month, origin.code, destination.code));
        break;
      case 'fetchPricesInTheYear':
        setData(await fetchPricesInTheYear(year, origin.code, destination.code));
        break;
      default:
        break;
    }
    
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
      setMethod(event.target.value);
    };
  
    const handleClearClick = async () => {
      setData([]);
      setYear(moment().year());
      setMonth(moment().month());
      setOrigin({ code: '', city: '' });
      setDestination({ code: '', city: '' });
    }




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

   <Autocomplete
  disablePortal
  getOptionLabel={(option) => option.city}
  getOptionKey={(option) => option.code}
  options={airports}
  sx={{ width: 300 }}
  value={origin}
  style={{height: "30px"}}
  onChange={(event, value) => setOrigin(value ? value : { code: '', city: '' })}

  renderInput={(params) => <TextField {...params} label="Origin" />}
/>
    <Autocomplete
  disablePortal
  getOptionLabel={(option) => option.city}
  getOptionKey={(option) => option.code}
  options={airports}
  value={destination}
  sx={{ width: 300 }}
  onChange={(event, value) => setDestination(value ? value : { code: '', city: '' })}
  style={{height: "30px"}}
  renderInput={(params) => <TextField {...params} label="Destination" />}
/>
   
<Autocomplete
  disablePortal
  options={years}
  getOptionKey={(option) => option}
  sx={{ width: 300 }}
  value={year.toString()}
  onChange={(event, value) => setYear(value ? Number(value) : 0)}
  style={{height: "30px"}}
  renderInput={(params) => <TextField {...params} label="Year" />}
/>
<Autocomplete
  disablePortal
  getOptionKey={(option) => option}
  options={months}
  value={month.toString()}
  sx={{ width: 300 }}
  onChange={(event, value) => setMonth(value ? Number(value) : 0)}
  style={{height: "30px"}}
  renderInput={(params) => <TextField {...params} label="Month" />}
/>

<Select
    value={method}
    label="Search Method"
    onChange={handleChange}
    sx={{ width: 300 }}
    style={{display: "block"}}
  >
    <MenuItem value={"fetchLowestPriceInTheYear"}>Lowest price in the year</MenuItem>
    <MenuItem value={"fetchLowestPriceInAMonth"}>Lowest price in a month</MenuItem>
    <MenuItem value={"fetchPricesInAMonth"}>Prices in a Month</MenuItem>
    <MenuItem value={"fetchPricesInTheYear"}>Prices in the year</MenuItem>

  </Select>
  

    <Button style={{ marginLeft: "-35px", marginBottom: "20px"}} variant="contained" onClick={handleClick}>Search</Button>
    <Button style={{ marginLeft: "20px", marginBottom: "20px"}} className='buttonStyle' variant="contained" onClick={handleClearClick}>Clear</Button>

    </div>
    <div>
      {data?.length > 0 && <DataGrid rowHeight={25} rows={data} columns={columns} paginationModel={paginationModel} getRowId={() => UUID()} />}
    </div>
    </>
  )
}

export default App


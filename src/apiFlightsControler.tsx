import _ from 'lodash';


const URL = 'http://localhost:8080/v1/flights/search';
const fetchLowestPriceInTheYear = async (year: number, origin: string, destination: string) => {
    try {
      // Make a GET request using the Fetch API
      const response = await fetch(`${URL}/year/${year}/lowest?origin=${origin}&destination=${destination}`);
      
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the JSON data from the response
      const result = await response.json();
      return result;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
const fetchPricesInTheYear = async (year: number, origin: string, destination: string) => {
    try {
      // Make a GET request using the Fetch API
      const response = await fetch(`${URL}/year/${year}?origin=${origin}&destination=${destination}`);
      
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the JSON data from the response
      const result = await response.json();
      
      return result.sort((a:any,b:any) => a.departureDate - b.departureDate);;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
const fetchLowestPriceInAMonth = async (year: number, month: number, origin: string, destination: string) => {
    try {
      // Make a GET request using the Fetch API
      const response = await fetch(`${URL}/year/${year}/month/${month}/lowest?origin=${origin}&destination=${destination}`);
      
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the JSON data from the response
      const result = await response.json();
      return result;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const fetchPricesInAMonth = async (year: number, month: number, origin: string, destination: string) => {
    try {
      // Make a GET request using the Fetch API
      const response = await fetch(`${URL}/year/${year}/month/${month}?origin=${origin}&destination=${destination}`);
      
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the JSON data from the response
      const result = await response.json();
      console.log(result);
      return result;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
  
  export {fetchLowestPriceInTheYear,fetchLowestPriceInAMonth,fetchPricesInAMonth,fetchPricesInTheYear};
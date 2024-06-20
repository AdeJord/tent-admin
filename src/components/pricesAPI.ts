import axios from 'axios';


export interface Prices {
    id: number;
    trip1: number;
    trip2: number;
    trip3: number;
    trip4: number;
    trip5: number;
    trip6: number;
  }
  
  export const fetchAllPrices = async (): Promise<Prices[]> => {
    const response = await fetch('https://adejord.co.uk/prices');
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    return response.json();
  };
  
  export const updatePrice = async (id: number, priceData: Prices) => {
    try {
      const response = await axios.patch(`/updatePrices/${id}`, priceData);
      return response.data; // Assuming the backend returns the updated row
    } catch (error) {
      console.error('Error updating price:', error);
      throw error;
    }
  };
  
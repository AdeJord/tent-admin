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
  
  export const updatePrice = async (id: number, updatedPrices: Omit<Prices, 'id'>): Promise<void> => {
    const response = await fetch(`https://adejord.co.uk/updatePrices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPrices),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update price');
    }
  };
  
import React, { useState, useEffect } from 'react';
import { fetchAllPrices, updatePrice, Prices } from './pricesAPI';
import { Input } from '../styles';
import { Modal } from 'antd';


const UpdatePrices: React.FC = () => {
  const [prices, setPrices] = useState<Prices[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllPrices();
        setPrices(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch prices');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (index: number, field: keyof Prices, value: number) => {
    const newPrices = [...prices];
    newPrices[index][field] = value;
    setPrices(newPrices);
  };


  const handleUpdate = async (index: number) => {
    try {
      const priceToUpdate = prices[index];
      const updatedPrice = await updatePrice(priceToUpdate.id, priceToUpdate); // Ensure updatePrice returns the updated row
      const updatedPrices = [...prices];
      updatedPrices[index] = updatedPrice;
      setPrices(updatedPrices);
      Modal.success({ content: 'Price updated successfully!' });
    } catch (err) {
      setError('Failed to update price');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {prices.map((price, index) => (
        <div
          style={{
            border: '1px solid black',
            padding: '10px',
            margin: '10px',
            borderRadius: '5px',
            textAlign: 'center',
          }}
          key={price.id}
        >
          <div>
            <span>Coven with Pub Meal:<br /></span>
            <Input
              type="number"
              value={price.trip1}
              onChange={(e) => handleInputChange(index, 'trip1', parseFloat(e.target.value))}
            /><br />
            <button onClick={() => handleUpdate(index)}>Update</button>
          </div>
          <br />
          <div>
            <span>Coven with Fish and Chips:<br /></span>
            <Input
              type="number"
              value={price.trip2}
              onChange={(e) => handleInputChange(index, 'trip2', parseFloat(e.target.value))}
            /><br />
            <button onClick={() => handleUpdate(index)}>Update</button>
          </div>
          <br />
          <div>
            <span>Coven with Packed Lunch:<br /></span>
            <Input
              type="number"
              value={price.trip3}
              onChange={(e) => handleInputChange(index, 'trip3', parseFloat(e.target.value))}
            /><br />
            <button onClick={() => handleUpdate(index)}>Update</button>
          </div>
          <br />
          <div>
            <span>Autherley with Fish and Chips:<br /></span>
            <Input
              type="number"
              value={price.trip4}
              onChange={(e) => handleInputChange(index, 'trip4', parseFloat(e.target.value))}
            /><br />
            <button onClick={() => handleUpdate(index)}>Update</button>
          </div>
          <br />
          <div>
            <span>Autherley with Packed Lunch:<br /></span>
            <Input
              type="number"
              value={price.trip5}
              onChange={(e) => handleInputChange(index, 'trip5', parseFloat(e.target.value))}
            />
            <br />
            <button onClick={() => handleUpdate(index)}>Update</button>
          </div>
          <br />
          <div>
            <span>Have A Go Day:<br /></span>
            <Input
              type="number"
              value={price.trip6}
              onChange={(e) => handleInputChange(index, 'trip6', parseFloat(e.target.value))}
            /><br />
            <button onClick={() => handleUpdate(index)}>Update</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpdatePrices;

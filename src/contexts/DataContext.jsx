import { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [listings, setListings] = useState([
    { id: 1, farmerId: 'farmer1', crop: 'Wheat', qty: 100, price: 25, location: 'Punjab', desc: 'Premium quality wheat', status: 'active' },
    { id: 2, farmerId: 'farmer1', crop: 'Rice', qty: 150, price: 30, location: 'Haryana', desc: 'Basmati rice', status: 'active' },
    { id: 3, farmerId: 'farmer2', crop: 'Corn', qty: 80, price: 20, location: 'UP', desc: 'Fresh corn', status: 'active' }
  ]);

  const [offers, setOffers] = useState([
    { id: 1, listingId: 1, buyerId: 'buyer1', buyerName: 'John Doe', qty: 50, priceOffered: 24, message: 'Bulk order', status: 'pending', createdAt: new Date().toISOString() }
  ]);

  const [orders, setOrders] = useState([
    { id: 1, listingId: 1, farmerId: 'farmer1', buyerId: 'buyer1', buyerName: 'John Doe', crop: 'Wheat', qty: 50, price: 25, total: 1250, status: 'Awaiting Driver', createdAt: new Date().toISOString() }
  ]);

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Ravi Kumar', vehicle: 'Truck 10T', rating: 4.5, location: 'Punjab', contact: '9876543210' },
    { id: 2, name: 'Suresh Singh', vehicle: 'Van 5T', rating: 4.8, location: 'Haryana', contact: '9876543211' }
  ]);

  return (
    <DataContext.Provider value={{ listings, setListings, offers, setOffers, orders, setOrders, drivers }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import CustomerMenu from './components/CustomerMenu';
import AdminDashboard from './components/AdminDashboard';
import TableManagement from './components/TableManagement';
import HomePage from './components/HomePage';
import { CartProvider } from './context/CartContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'customer' | 'admin' | 'tables'>('home');
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');

    if (tableParam) {
      const tableNum = parseInt(tableParam);
      if (!isNaN(tableNum)) {
        loadTableInfo(tableNum);
      }
    }
  }, []);

  const loadTableInfo = async (tableNum: number) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .eq('table_number', tableNum)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTableNumber(data.table_number);
        setTableId(data.id);
        setCurrentPage('customer');
      }
    } catch (error) {
      console.error('Error loading table:', error);
    }
  };

  const handleNavigate = (page: 'customer' | 'admin' | 'tables') => {
    if (page === 'customer' && !tableNumber) {
      setTableNumber(1);
      loadTableInfo(1);
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'customer':
        if (tableNumber && tableId) {
          return <CustomerMenu tableNumber={tableNumber} tableId={tableId} />;
        }
        return <HomePage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard />;
      case 'tables':
        return <TableManagement />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <CartProvider>
      {renderPage()}
    </CartProvider>
  );
}

export default App;

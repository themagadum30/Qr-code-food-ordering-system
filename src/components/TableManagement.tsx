import { useState, useEffect } from 'react';
import { QrCode, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RestaurantTable } from '../lib/database.types';

export default function TableManagement() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('table_number');

      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodeURL = (tableNumber: number) => {
    const baseUrl = window.location.origin;
    const orderUrl = `${baseUrl}?table=${tableNumber}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(orderUrl)}`;
  };

  const downloadQRCode = async (tableNumber: number) => {
    const qrUrl = generateQRCodeURL(tableNumber);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `table-${tableNumber}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const printQRCode = (tableNumber: number) => {
    const qrUrl = generateQRCodeURL(tableNumber);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Table ${tableNumber} QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .container {
                text-align: center;
                padding: 40px;
              }
              h1 {
                font-size: 48px;
                margin-bottom: 20px;
                color: #1e293b;
              }
              p {
                font-size: 24px;
                color: #64748b;
                margin-bottom: 30px;
              }
              img {
                border: 4px solid #1e293b;
                border-radius: 12px;
                padding: 20px;
                background: white;
              }
              @media print {
                body {
                  background: white;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Table ${tableNumber}</h1>
              <p>Scan to order from TasteBits</p>
              <img src="${qrUrl}" alt="QR Code for Table ${tableNumber}" />
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading tables...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Table Management</h1>
          <p className="text-slate-600 mt-1">Generate and manage QR codes for tables</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => {
            const qrUrl = generateQRCodeURL(table.table_number);
            const orderUrl = `${window.location.origin}?table=${table.table_number}`;

            return (
              <div key={table.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Table {table.table_number}
                    </h3>
                    <span className={`text-sm ${table.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {table.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <img
                    src={qrUrl}
                    alt={`QR Code for Table ${table.table_number}`}
                    className="w-full h-auto"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1">Order URL:</p>
                  <p className="text-xs text-slate-700 break-all bg-slate-50 p-2 rounded">
                    {orderUrl}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadQRCode(table.table_number)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => printQRCode(table.table_number)}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
                  >
                    Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

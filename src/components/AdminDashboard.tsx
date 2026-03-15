import { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, XCircle, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem, MenuItem, WaiterCall, RestaurantTable } from '../lib/database.types';

interface OrderWithDetails extends Order {
  restaurant_tables: RestaurantTable;
  items: Array<OrderItem & { menu_items: MenuItem }>;
}

interface WaiterCallWithTable extends WaiterCall {
  restaurant_tables: RestaurantTable;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCallWithTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'calls'>('orders');

  useEffect(() => {
    loadOrders();
    loadWaiterCalls();

    const ordersSubscription = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    const callsSubscription = supabase
      .channel('waiter_calls_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'waiter_calls' }, () => {
        loadWaiterCalls();
      })
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
      callsSubscription.unsubscribe();
    };
  }, []);

  const loadOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          restaurant_tables (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select(`
              *,
              menu_items (*)
            `)
            .eq('order_id', order.id);

          return {
            ...order,
            items: itemsData || [],
          } as OrderWithDetails;
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWaiterCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('waiter_calls')
        .select(`
          *,
          restaurant_tables (*)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setWaiterCalls(data as WaiterCallWithTable[] || []);
    } catch (error) {
      console.error('Error loading waiter calls:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const respondToCall = async (callId: string) => {
    try {
      const { error } = await supabase
        .from('waiter_calls')
        .update({ status: 'responded', responded_at: new Date().toISOString() })
        .eq('id', callId);

      if (error) throw error;
      loadWaiterCalls();
    } catch (error) {
      console.error('Error responding to call:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'served':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <Bell className="w-4 h-4" />;
      case 'served':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const pendingCallsCount = waiterCalls.filter(call => call.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">TasteBits Admin</h1>
          <p className="text-slate-600 mt-1">Manage orders and requests</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-6 py-3 rounded-lg font-semibold transition relative ${
              activeTab === 'calls'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Waiter Calls ({waiterCalls.length})
            {pendingCallsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {pendingCallsCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="grid gap-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-slate-500">
                No orders yet
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          Table {order.restaurant_tables.table_number}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded">
                        <div>
                          <span className="font-medium">{item.menu_items.name}</span>
                          <span className="text-slate-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold text-slate-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Mark as Served
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'served' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {waiterCalls.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-slate-500">
                No waiter calls yet
              </div>
            ) : (
              waiterCalls.map((call) => (
                <div key={call.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        call.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Table {call.restaurant_tables.table_number}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {new Date(call.created_at).toLocaleString()}
                        </p>
                        {call.status === 'responded' && call.responded_at && (
                          <p className="text-sm text-green-600 mt-1">
                            Responded at {new Date(call.responded_at).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {call.status === 'pending' && (
                      <button
                        onClick={() => respondToCall(call.id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Respond
                      </button>
                    )}
                    {call.status === 'responded' && (
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                        Responded
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

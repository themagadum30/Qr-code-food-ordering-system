import { UtensilsCrossed, LayoutDashboard, QrCode } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'customer' | 'admin' | 'tables') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-orange-600 rounded-full mb-4">
            <UtensilsCrossed className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-3">TasteBits</h1>
          <p className="text-xl text-slate-600">Smart Restaurant Ordering System</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('customer')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-orange-200 transition">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Menu</h3>
            <p className="text-slate-600 text-sm">
              Browse menu and place orders
            </p>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Dashboard</h3>
            <p className="text-slate-600 text-sm">
              Manage orders and requests
            </p>
          </button>

          <button
            onClick={() => onNavigate('tables')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-green-200 transition">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Table QR Codes</h3>
            <p className="text-slate-600 text-sm">
              Generate and print QR codes
            </p>
          </button>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h4 className="font-semibold text-slate-900 mb-3">How it works:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">1</div>
                <p>Customers scan QR code on their table</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">2</div>
                <p>Browse menu and place orders from their phone</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">3</div>
                <p>Orders appear instantly on admin dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

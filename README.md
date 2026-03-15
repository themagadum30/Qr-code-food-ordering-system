# TasteBits - QR Code Based Food Ordering System

A modern, contactless restaurant ordering system that allows customers to scan QR codes at their tables and place orders directly from their mobile phones.

## Features

### Customer Features
- **QR Code Scanning**: Each table has a unique QR code that opens the menu
- **Digital Menu**: Browse menu items with images, descriptions, and prices
- **Category Filtering**: Filter by Appetizers, Main Course, Desserts, and Beverages
- **Shopping Cart**: Add, remove, and adjust quantities of items
- **Order Placement**: Place orders with real-time updates to the kitchen
- **Call Waiter**: Request waiter assistance with a single tap

### Admin Features
- **Order Management**: View all orders in real-time with table numbers
- **Status Updates**: Update order status (Pending → Preparing → Served)
- **Waiter Call Management**: Respond to waiter calls from customers
- **Order Details**: View complete order details including items and quantities

### Table Management
- **QR Code Generation**: Generate QR codes for all tables
- **Download QR Codes**: Download QR codes as PNG images
- **Print QR Codes**: Print QR codes for table placement
- **Table Status**: View and manage table availability

## How It Works

1. **Customer Scans QR Code**: Customer scans the QR code placed on their table
2. **Browse Menu**: The digital menu opens automatically with the table number detected
3. **Place Order**: Customer adds items to cart and places the order
4. **Real-Time Updates**: Order appears instantly on the admin dashboard
5. **Kitchen Preparation**: Staff updates order status as it's prepared
6. **Order Served**: Staff marks order as served when delivered

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time Updates**: Supabase Realtime
- **Icons**: Lucide React
- **QR Code Generation**: QR Server API

## Database Schema

### Tables
- `restaurant_tables`: Store table information and QR codes
- `menu_items`: Store menu items with prices and images
- `orders`: Store customer orders with status tracking
- `order_items`: Store individual items in each order
- `waiter_calls`: Track waiter call requests

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Usage

### For Customers
- Scan the QR code on your table
- Browse the menu and add items to your cart
- Review your order and place it
- Use the phone icon to call a waiter if needed

### For Restaurant Staff
- Access the Admin Dashboard from the home page
- View incoming orders in real-time
- Update order status as you prepare and serve items
- Respond to waiter call requests

### For Restaurant Owners
- Use Table Management to generate QR codes
- Download or print QR codes for each table
- Place QR codes on tables for customers to scan

## URL Parameters

- `?table=1` - Opens the menu for Table 1 (automatically detected from QR code)

## Security

- Row Level Security (RLS) enabled on all database tables
- Public read access for menu items and tables
- Secure order placement and status updates
- Real-time subscriptions for instant updates

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Order history for customers
- Analytics dashboard for owners
- Menu item management interface
- Multi-language support
- Customer feedback and ratings

## License

MIT

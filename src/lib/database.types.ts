export interface Database {
  public: {
    Tables: {
      restaurant_tables: {
        Row: {
          id: string;
          table_number: number;
          qr_code: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          table_number: number;
          qr_code: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          table_number?: number;
          qr_code?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image_url: string;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price: number;
          category: string;
          image_url?: string;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image_url?: string;
          is_available?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          table_id: string;
          status: string;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          table_id: string;
          status?: string;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          table_id?: string;
          status?: string;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      waiter_calls: {
        Row: {
          id: string;
          table_id: string;
          status: string;
          created_at: string;
          responded_at: string | null;
        };
        Insert: {
          id?: string;
          table_id: string;
          status?: string;
          created_at?: string;
          responded_at?: string | null;
        };
        Update: {
          id?: string;
          table_id?: string;
          status?: string;
          created_at?: string;
          responded_at?: string | null;
        };
      };
    };
  };
}

export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type RestaurantTable = Database['public']['Tables']['restaurant_tables']['Row'];
export type WaiterCall = Database['public']['Tables']['waiter_calls']['Row'];

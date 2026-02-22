export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          address: string | null;
          role: 'admin' | 'client';
          referral_code: string | null;
          wallet_balance: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          address?: string | null;
          role?: 'admin' | 'client';
          referral_code?: string | null;
          wallet_balance?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          address?: string | null;
          role?: 'admin' | 'client';
          referral_code?: string | null;
          wallet_balance?: number;
          created_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          name: string;
          coupon_code: string;
          discount_type: 'percent' | 'fixed';
          discount_value: number;
          min_order_value: number | null;
          starts_at: string;
          expires_at: string;
          max_uses: number | null;
          current_uses: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          coupon_code: string;
          discount_type: 'percent' | 'fixed';
          discount_value: number;
          min_order_value?: number | null;
          starts_at: string;
          expires_at: string;
          max_uses?: number | null;
          current_uses?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          coupon_code?: string;
          discount_type?: 'percent' | 'fixed';
          discount_value?: number;
          min_order_value?: number | null;
          starts_at?: string;
          expires_at?: string;
          max_uses?: number | null;
          current_uses?: number;
          active?: boolean;
          created_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          referral_code: string;
          status: 'pending' | 'completed';
          credit_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          referral_code: string;
          status?: 'pending' | 'completed';
          credit_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_id?: string;
          referral_code?: string;
          status?: 'pending' | 'completed';
          credit_amount?: number;
          created_at?: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          client_id: string;
          type: 'referral_credit' | 'order_debit' | 'admin_adjust' | 'refund';
          amount: number;
          description: string;
          order_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          type: 'referral_credit' | 'order_debit' | 'admin_adjust' | 'refund';
          amount: number;
          description: string;
          order_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          type?: 'referral_credit' | 'order_debit' | 'admin_adjust' | 'refund';
          amount?: number;
          description?: string;
          order_id?: string | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type Promotion = Tables<'promotions'>;
export type Referral = Tables<'referrals'>;
export type WalletTransaction = Tables<'wallet_transactions'>;
export type Setting = Tables<'settings'>;

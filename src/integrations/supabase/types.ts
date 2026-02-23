export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      catalog_products: {
        Row: {
          active: boolean
          brand: string
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
          price_usd: number
          rating: number
          review_count: number
          sales_count: number
          trending: boolean
        }
        Insert: {
          active?: boolean
          brand?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name: string
          price_usd?: number
          rating?: number
          review_count?: number
          sales_count?: number
          trending?: boolean
        }
        Update: {
          active?: boolean
          brand?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          price_usd?: number
          rating?: number
          review_count?: number
          sales_count?: number
          trending?: boolean
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          reviewer_name: string
          rating: number
          comment: string
          verified_purchase: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          reviewer_name: string
          rating: number
          comment: string
          verified_purchase?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          reviewer_name?: string
          rating?: number
          comment?: string
          verified_purchase?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id: string
          status?: string
          title?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          price_brl: number | null
          price_usd: number | null
          product_image_url: string | null
          product_name: string
          product_url: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          price_brl?: number | null
          price_usd?: number | null
          product_image_url?: string | null
          product_name?: string
          product_url?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          price_brl?: number | null
          price_usd?: number | null
          product_image_url?: string | null
          product_name?: string
          product_url?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          balance_paid: boolean
          client_id: string
          created_at: string
          customer_name: string
          customer_phone: string | null
          deposit_amount: number
          deposit_paid: boolean
          estimated_weight_kg: number | null
          exchange_rate: number | null
          id: string
          items: string
          notes: string | null
          order_number: string
          price_brl: number | null
          price_usd: number | null
          product_image_url: string | null
          product_url: string | null
          spread_pct: number | null
          status: string
          total_amount: number
          total_brl: number | null
          total_usd: number | null
          trip_id: string | null
          updated_at: string
        }
        Insert: {
          balance_paid?: boolean
          client_id: string
          created_at?: string
          customer_name?: string
          customer_phone?: string | null
          deposit_amount?: number
          deposit_paid?: boolean
          estimated_weight_kg?: number | null
          exchange_rate?: number | null
          id?: string
          items?: string
          notes?: string | null
          order_number?: string
          price_brl?: number | null
          price_usd?: number | null
          product_image_url?: string | null
          product_url?: string | null
          spread_pct?: number | null
          status?: string
          total_amount?: number
          total_brl?: number | null
          total_usd?: number | null
          trip_id?: string | null
          updated_at?: string
        }
        Update: {
          balance_paid?: boolean
          client_id?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string | null
          deposit_amount?: number
          deposit_paid?: boolean
          estimated_weight_kg?: number | null
          exchange_rate?: number | null
          id?: string
          items?: string
          notes?: string | null
          order_number?: string
          price_brl?: number | null
          price_usd?: number | null
          product_image_url?: string | null
          product_url?: string | null
          spread_pct?: number | null
          status?: string
          total_amount?: number
          total_brl?: number | null
          total_usd?: number | null
          trip_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          order_id: string
          receipt_url: string | null
          type: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          receipt_url?: string | null
          type?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          receipt_url?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          referral_code: string | null
          role: string
          wallet_balance: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          phone?: string | null
          referral_code?: string | null
          role?: string
          wallet_balance?: number
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          referral_code?: string | null
          role?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          coupon_code: string
          created_at: string
          current_uses: number
          discount_type: string
          discount_value: number
          expires_at: string
          id: string
          max_uses: number | null
          min_order_value: number | null
          name: string
          product_id: string | null
          starts_at: string
        }
        Insert: {
          active?: boolean
          coupon_code: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          expires_at: string
          id?: string
          max_uses?: number | null
          min_order_value?: number | null
          name: string
          product_id?: string | null
          starts_at: string
        }
        Update: {
          active?: boolean
          coupon_code?: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          expires_at?: string
          id?: string
          max_uses?: number | null
          min_order_value?: number | null
          name?: string
          product_id?: string | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          credit_amount: number
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string
          credit_amount?: number
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string
          credit_amount?: number
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          arrival_date: string
          code: string
          created_at: string
          departure_date: string
          flight_number: string | null
          id: string
          max_weight_kg: number
          notes: string | null
          status: string
          traveler_name: string
        }
        Insert: {
          arrival_date: string
          code?: string
          created_at?: string
          departure_date: string
          flight_number?: string | null
          id?: string
          max_weight_kg?: number
          notes?: string | null
          status?: string
          traveler_name: string
        }
        Update: {
          arrival_date?: string
          code?: string
          created_at?: string
          departure_date?: string
          flight_number?: string | null
          id?: string
          max_weight_kg?: number
          notes?: string | null
          status?: string
          traveler_name?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          description: string
          id: string
          order_id: string | null
          type: string
        }
        Insert: {
          amount?: number
          client_id: string
          created_at?: string
          description?: string
          id?: string
          order_id?: string | null
          type?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          description?: string
          id?: string
          order_id?: string | null
          type?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
          slug: string
          template: string
          template_text: string
          title: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          slug: string
          template?: string
          template_text: string
          title: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          slug?: string
          template?: string
          template_text?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

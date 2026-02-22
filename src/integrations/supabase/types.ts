export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          items: string;
          total_amount: number;
          deposit_amount: number;
          status: string;
          trip_id: string | null;
          estimated_weight_kg: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      trips: {
        Row: {
          id: string;
          code: string;
          traveler_name: string;
          flight_number: string;
          departure_date: string;
          arrival_date: string;
          max_weight_kg: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["trips"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["trips"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          type: "deposit" | "balance" | "refund";
          amount: number;
          receipt_url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      whatsapp_templates: {
        Row: {
          id: string;
          slug: string;
          title: string;
          icon: string;
          template_text: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["whatsapp_templates"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["whatsapp_templates"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Trip = Database["public"]["Tables"]["trips"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type WhatsAppTemplate = Database["public"]["Tables"]["whatsapp_templates"]["Row"];

export type TripWithAllocated = Trip & {
  allocated_weight_kg: number;
  allocated_items_count: number;
};

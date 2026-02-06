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
      clinics: {
        Row: {
          address: string | null
          city: string | null
          compliance_status: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          license_number: string | null
          name: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          compliance_status?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          name: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          compliance_status?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          name?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      disposal_logs: {
        Row: {
          created_at: string
          disposal_date: string
          disposed_by: string | null
          id: string
          manifest_number: string | null
          notes: string | null
          vehicle_number: string | null
          vendor_name: string | null
          waste_record_id: string
        }
        Insert: {
          created_at?: string
          disposal_date?: string
          disposed_by?: string | null
          id?: string
          manifest_number?: string | null
          notes?: string | null
          vehicle_number?: string | null
          vendor_name?: string | null
          waste_record_id: string
        }
        Update: {
          created_at?: string
          disposal_date?: string
          disposed_by?: string | null
          id?: string
          manifest_number?: string | null
          notes?: string | null
          vehicle_number?: string | null
          vendor_name?: string | null
          waste_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disposal_logs_waste_record_id_fkey"
            columns: ["waste_record_id"]
            isOneToOne: false
            referencedRelation: "waste_records"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recycling_logs: {
        Row: {
          batch_number: string
          category_id: string | null
          created_at: string
          id: string
          input_weight_kg: number | null
          notes: string | null
          output_weight_kg: number | null
          processing_date: string | null
          recycling_rate: number | null
          status: string | null
          waste_record_id: string | null
        }
        Insert: {
          batch_number: string
          category_id?: string | null
          created_at?: string
          id?: string
          input_weight_kg?: number | null
          notes?: string | null
          output_weight_kg?: number | null
          processing_date?: string | null
          recycling_rate?: number | null
          status?: string | null
          waste_record_id?: string | null
        }
        Update: {
          batch_number?: string
          category_id?: string | null
          created_at?: string
          id?: string
          input_weight_kg?: number | null
          notes?: string | null
          output_weight_kg?: number | null
          processing_date?: string | null
          recycling_rate?: number | null
          status?: string | null
          waste_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recycling_logs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "waste_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recycling_logs_waste_record_id_fkey"
            columns: ["waste_record_id"]
            isOneToOne: false
            referencedRelation: "waste_records"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waste_categories: {
        Row: {
          color_code: string
          created_at: string
          description: string | null
          disposal_method: string | null
          id: string
          is_recyclable: boolean | null
          name: string
        }
        Insert: {
          color_code: string
          created_at?: string
          description?: string | null
          disposal_method?: string | null
          id?: string
          is_recyclable?: boolean | null
          name: string
        }
        Update: {
          color_code?: string
          created_at?: string
          description?: string | null
          disposal_method?: string | null
          id?: string
          is_recyclable?: boolean | null
          name?: string
        }
        Relationships: []
      }
      waste_records: {
        Row: {
          category_id: string
          clinic_id: string
          created_at: string
          disposal_method: string | null
          id: string
          notes: string | null
          quantity: number | null
          recorded_at: string
          recorded_by: string | null
          status: string | null
          weight_kg: number
        }
        Insert: {
          category_id: string
          clinic_id: string
          created_at?: string
          disposal_method?: string | null
          id?: string
          notes?: string | null
          quantity?: number | null
          recorded_at?: string
          recorded_by?: string | null
          status?: string | null
          weight_kg: number
        }
        Update: {
          category_id?: string
          clinic_id?: string
          created_at?: string
          disposal_method?: string | null
          id?: string
          notes?: string | null
          quantity?: number | null
          recorded_at?: string
          recorded_by?: string | null
          status?: string | null
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "waste_records_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "waste_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_records_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "clinic_staff"
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
    Enums: {
      app_role: ["admin", "moderator", "clinic_staff"],
    },
  },
} as const

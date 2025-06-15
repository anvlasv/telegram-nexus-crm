export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advertising_campaigns: {
        Row: {
          channel_id: string
          clicks_count: number | null
          content: string | null
          created_at: string
          currency: string
          engagement_rate: number | null
          id: string
          media_urls: string[] | null
          partner_id: string
          post_type: string
          price: number
          published_at: string | null
          scheduled_for: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          channel_id: string
          clicks_count?: number | null
          content?: string | null
          created_at?: string
          currency?: string
          engagement_rate?: number | null
          id?: string
          media_urls?: string[] | null
          partner_id: string
          post_type?: string
          price?: number
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          channel_id?: string
          clicks_count?: number | null
          content?: string | null
          created_at?: string
          currency?: string
          engagement_rate?: number | null
          id?: string
          media_urls?: string[] | null
          partner_id?: string
          post_type?: string
          price?: number
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advertising_campaigns_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "telegram_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertising_campaigns_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_posts: {
        Row: {
          channel_id: string
          content: string | null
          created_at: string
          forwards_count: number | null
          id: string
          post_id: number
          published_at: string
          reactions_count: number | null
          views_count: number | null
        }
        Insert: {
          channel_id: string
          content?: string | null
          created_at?: string
          forwards_count?: number | null
          id?: string
          post_id: number
          published_at: string
          reactions_count?: number | null
          views_count?: number | null
        }
        Update: {
          channel_id?: string
          content?: string | null
          created_at?: string
          forwards_count?: number | null
          id?: string
          post_id?: number
          published_at?: string
          reactions_count?: number | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_posts_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "telegram_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          commission_rate: number | null
          contact_info: Json | null
          created_at: string
          id: string
          name: string
          partnership_type: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          name: string
          partnership_type?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          name?: string
          partnership_type?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          media_urls: string[] | null
          poll_options: string[] | null
          post_type: string
          scheduled_for: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          poll_options?: string[] | null
          post_type?: string
          scheduled_for: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          poll_options?: string[] | null
          post_type?: string
          scheduled_for?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "telegram_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_channels: {
        Row: {
          avatar_url: string | null
          channel_id: number
          created_at: string
          engagement_rate: number | null
          id: string
          last_post_at: string | null
          name: string
          status: string | null
          subscriber_count: number | null
          type: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          channel_id: number
          created_at?: string
          engagement_rate?: number | null
          id?: string
          last_post_at?: string | null
          name: string
          status?: string | null
          subscriber_count?: number | null
          type?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          channel_id?: number
          created_at?: string
          engagement_rate?: number | null
          id?: string
          last_post_at?: string | null
          name?: string
          status?: string | null
          subscriber_count?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_category?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

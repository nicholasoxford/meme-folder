export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          created_at: string
          id: number
          PUBLIC_URL: string | null
          R2_KEY: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          PUBLIC_URL?: string | null
          R2_KEY?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          PUBLIC_URL?: string | null
          R2_KEY?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

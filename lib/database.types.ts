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
      users: {
        Row: {
          id: string
          email: string
          office_name: string
          monthly_floor: number
          monthly_goal: number
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          office_name?: string
          monthly_floor?: number
          monthly_goal?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          office_name?: string
          monthly_floor?: number
          monthly_goal?: number
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          agent_key: string
          mode: 'autonomous' | 'supervised' | 'paused'
          daily_quota: number
          directive: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_key: string
          mode?: 'autonomous' | 'supervised' | 'paused'
          daily_quota?: number
          directive?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_key?: string
          mode?: 'autonomous' | 'supervised' | 'paused'
          daily_quota?: number
          directive?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          title: string
          status: 'queued' | 'running' | 'needs_review' | 'completed'
          priority: 'high' | 'medium' | 'low'
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          title: string
          status?: 'queued' | 'running' | 'needs_review' | 'completed'
          priority?: 'high' | 'medium' | 'low'
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          title?: string
          status?: 'queued' | 'running' | 'needs_review' | 'completed'
          priority?: 'high' | 'medium' | 'low'
          created_at?: string
          completed_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          amount: number
          status: 'settled' | 'pending' | 'refunded'
          stripe_id: string | null
          customer_email: string
          channel: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          amount: number
          status?: 'settled' | 'pending' | 'refunded'
          stripe_id?: string | null
          customer_email: string
          channel?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          amount?: number
          status?: 'settled' | 'pending' | 'refunded'
          stripe_id?: string | null
          customer_email?: string
          channel?: string
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          user_id: string
          type: 'one_on_one' | 'boardroom'
          participants: string[]
          transcript: Json
          summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'one_on_one' | 'boardroom'
          participants: string[]
          transcript?: Json
          summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'one_on_one' | 'boardroom'
          participants?: string[]
          transcript?: Json
          summary?: string | null
          created_at?: string
        }
      }
      platforms: {
        Row: {
          id: string
          user_id: string
          name: string
          status: 'connected' | 'ready_to_connect' | 'planned'
          config: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          status?: 'connected' | 'ready_to_connect' | 'planned'
          config?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          status?: 'connected' | 'ready_to_connect' | 'planned'
          config?: Json
          created_at?: string
        }
      }
    }
  }
}

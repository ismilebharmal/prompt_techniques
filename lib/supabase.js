import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export async function getPrompts() {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || !supabaseKey || supabaseKey === 'your-anon-key') {
      console.log('Supabase not configured, returning empty array to trigger fallback')
      return []
    }

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return []
  }
}

export async function addPrompt(promptData) {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .insert([promptData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Error adding prompt:', error)
    throw error
  }
}

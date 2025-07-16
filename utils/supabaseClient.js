
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tqibpodkzinvzqtvfiqa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxaWJwb2RremludnpxdHZmaXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDU3MDcsImV4cCI6MjA2NTQ4MTcwN30.uuVUzGKqX1qdL3S3fYEiJKUNnFJoxSrBysWMiwLEEfY'

export const supabase = createClient(supabaseUrl, supabaseKey)

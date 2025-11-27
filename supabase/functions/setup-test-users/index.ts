import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create guru account
    const { data: guruData, error: guruError } = await supabaseClient.auth.admin.createUser({
      email: 'guru@mail.com',
      password: 'guru123',
      email_confirm: true,
    })

    if (guruError) {
      console.error('Error creating guru:', guruError)
      throw guruError
    }

    // Assign guru role
    if (guruData.user) {
      const { error: guruRoleError } = await supabaseClient
        .from('user_roles')
        .insert({ user_id: guruData.user.id, role: 'guru' })
      
      if (guruRoleError) {
        console.error('Error assigning guru role:', guruRoleError)
      }
    }

    // Create admin account
    const { data: adminData, error: adminError } = await supabaseClient.auth.admin.createUser({
      email: 'admin@mail.com',
      password: 'admin123',
      email_confirm: true,
    })

    if (adminError) {
      console.error('Error creating admin:', adminError)
      throw adminError
    }

    // Assign admin role
    if (adminData.user) {
      const { error: adminRoleError } = await supabaseClient
        .from('user_roles')
        .insert({ user_id: adminData.user.id, role: 'admin' })
      
      if (adminRoleError) {
        console.error('Error assigning admin role:', adminRoleError)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Test users created successfully',
        guru: guruData.user?.email,
        admin: adminData.user?.email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

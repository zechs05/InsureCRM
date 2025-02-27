import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Create admin user function
export const createAdminUser = async () => {
  const adminEmail = 'amer_moreau@hotmail.com';
  const adminPassword = 'Moreaux1984!!?';
  
  try {
    // Check if user already exists by trying to sign in
    const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    // If sign in succeeds, the user exists
    if (existingUser?.user) {
      console.log('Admin user already exists');
      
      // Update the admin user's metadata to ensure the name is correct
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: 'Niyonzima Amer Moreau',
          role: 'admin',
        }
      });
      
      if (updateError) {
        console.error('Error updating admin user metadata:', updateError);
      } else {
        console.log('Admin user metadata updated successfully');
      }
      
      // Sign out after checking/updating
      await supabase.auth.signOut();
      return;
    }
    
    // If error is not "Invalid login credentials", there might be another issue
    if (signInError && signInError.message !== 'Invalid login credentials') {
      console.error('Error checking admin user:', signInError);
      return;
    }
    
    // Create admin user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: 'Niyonzima Amer Moreau',
          role: 'admin',
        },
      },
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
    } else {
      console.log('Admin user created successfully');
      // Sign out after creation
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.error('Error in createAdminUser:', error);
  }
};

// Helper function to get a user's profile picture URL
export const getProfilePictureUrl = (userId: string, fileName: string) => {
  const { data } = supabase.storage
    .from('profile_pictures')
    .getPublicUrl(`${userId}/${fileName}`);
  
  return data.publicUrl;
};

// Try to create admin user on initialization
createAdminUser().catch(console.error);
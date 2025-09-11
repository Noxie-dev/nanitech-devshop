import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Check if Supabase is properly configured
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key-here';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      setLoading(false);
      return;
    }

    // Real Supabase mode
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await check2FAStatus(session.user);
          }
        }
      } catch (error) {
        console.error('Error initializing Supabase auth:', error);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await check2FAStatus(session.user);
        } else {
          setIs2FAEnabled(false);
          setIs2FAVerified(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const check2FAStatus = async (user) => {
    try {
      const { data, error } = await supabase
        .from('user_2fa')
        .select('is_enabled')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking 2FA status:', error);
        return;
      }

      setIs2FAEnabled(data?.is_enabled || false);
      setIs2FAVerified(data?.is_enabled || false);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      setIs2FAEnabled(false);
      setIs2FAVerified(false);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setIs2FAEnabled(false);
      setIs2FAVerified(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async () => {
    if (!isSupabaseConfigured || !user) {
      return { data: null, error: { message: 'Supabase not configured or user not authenticated' } };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('enable-2fa', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (token) => {
    if (!isSupabaseConfigured || !user) {
      return { data: null, error: { message: 'Supabase not configured or user not authenticated' } };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('verify-2fa', {
        body: { 
          user_id: user.id,
          token 
        }
      });

      if (error) throw error;
      
      if (data.success) {
        setIs2FAVerified(true);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async (token) => {
    if (!isSupabaseConfigured || !user) {
      return { data: null, error: { message: 'Supabase not configured or user not authenticated' } };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('disable-2fa', {
        body: { 
          user_id: user.id,
          token 
        }
      });

      if (error) throw error;
      
      if (data.success) {
        setIs2FAEnabled(false);
        setIs2FAVerified(false);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    is2FAEnabled,
    is2FAVerified,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    enable2FA,
    verify2FA,
    disable2FA,
    check2FAStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

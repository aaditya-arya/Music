import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDevBypass, setIsDevBypass] = useState(false);

  useEffect(() => {
    // Check initial session
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        } else {
          // Check local storage for dev bypass state
          const devState = localStorage.getItem('aes_admin_dev_mode');
          if (devState === 'true') {
            setIsDevBypass(true);
            setUser({ email: 'admin@aksharengineeringservices.com', id: 'dev-admin-id' });
          }
        }
      } catch (err) {
        console.error('[Auth Error]', err);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsDevBypass(false);
        localStorage.removeItem('aes_admin_dev_mode');
      } else if (!isDevBypass) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isDevBypass]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    setIsDevBypass(false);
    localStorage.removeItem('aes_admin_dev_mode');
    return data;
  };

  const devBypass = () => {
    const fakeAdmin = { email: 'admin@aksharengineeringservices.com', id: 'dev-admin-id' };
    setUser(fakeAdmin);
    setIsDevBypass(true);
    localStorage.setItem('aes_admin_dev_mode', 'true');
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn(e);
    }
    setUser(null);
    setIsDevBypass(false);
    localStorage.removeItem('aes_admin_dev_mode');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDevBypass, login, devBypass, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

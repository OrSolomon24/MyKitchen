import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { queryClient } from '../api/queryClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastUserIdRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      lastUserIdRef.current = data.session?.user?.id ?? null;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const nextUserId = newSession?.user?.id ?? null;
      // Recipes are per-user now: drop the previous user's cached queries
      // so they can't flash for whoever signs in next on this device.
      if (lastUserIdRef.current !== nextUserId) {
        lastUserIdRef.current = nextUserId;
        queryClient.clear();
      }
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!session, session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

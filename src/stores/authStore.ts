import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  isPremium: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
  setIsPremium: (isPremium: boolean) => void;
  signOut: () => Promise<void>;
  checkPremiumStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isPremium: false,
  initialized: false,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setIsPremium: (isPremium) => set({ isPremium }),
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isPremium: false });
  },
  
  checkPremiumStatus: async () => {
    const { user } = get();
    if (!user) {
      set({ isPremium: false });
      return;
    }
    
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();
      
      set({ isPremium: subscription?.status === 'active' });
    } catch (error) {
      console.error('Error checking premium status:', error);
      set({ isPremium: false });
    }
  },
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState();
  
  if (event === 'SIGNED_IN') {
    store.setUser(session?.user ?? null);
    store.setSession(session);
    store.checkPremiumStatus();
  } else if (event === 'SIGNED_OUT') {
    store.setUser(null);
    store.setSession(null);
    store.setIsPremium(false);
  }
});
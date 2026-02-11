import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      isGuest: false,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        isGuest: false,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    },
    []
  );

  const loginAsGuest = useCallback(async () => {
    const guestUser: User = {
      id: 'guest_' + Date.now().toString(),
      name: 'Invitado',
      email: 'guest@app.local',
      isGuest: true,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));
    setUser(guestUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    loginAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

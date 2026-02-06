export interface User {
    id: string;
    name: string;
    email: string;
    isGuest: boolean;
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
  }
  
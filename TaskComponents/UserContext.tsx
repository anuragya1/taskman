import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert, Image, StyleSheet } from 'react-native';
import { supabase } from '../android/supabase';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  User
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/types';

type AuthNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getUserImage: () => string | null;
  isloading:boolean;
  checkUser:()=>Promise<void>;
  isSignInInProgress: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignInInProgress, setIsSignInInProgress] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const navigation = useNavigation<AuthNavigationProp>();
  const checkUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      navigation.navigate('Main');
    } 
    else
    {
      navigation.navigate('Welcome')
    }
  };
  

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '97803285366-e1sg6poe6hkrvgg3r7laj3p5o3304toe.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    if (isSignInInProgress) return;
    
    setIsSignInInProgress(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
       navigation.navigate('Main')
      if (userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });
       
      } else {
        throw new Error('no ID token present!');
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // handle sign in cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // handle in progress
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // handle play services not available
      } else {
        // handle other errors
      }
    } finally {
      setIsLoading(false);
      setIsSignInInProgress(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      navigation.navigate('Welcome');
      Alert.alert('You have signed out', 'Signed out');
    } catch (error: any) {
      console.error('Sign-Out Error', error);
    }
  };

  const getUserImage = (): string | null => {
    return user?.user.photo || null;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      signIn, 
      signOut, 
      getUserImage, 
      checkUser,
      isloading,
      isSignInInProgress 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

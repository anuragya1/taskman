import React, { useState, useEffect } from 'react';
import { Alert ,Image, Button, StyleSheet, Text, View } from 'react-native';
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
import { useUser } from '../TaskComponents/UserContext';
type prop=StackNavigationProp<RootStackParamList,'Auth'>
let user:User|null;
export default function Auth () {
  const {setUser}=useUser()
  const [userInfo, setUserInfo] = useState<User | null>(null);
  var photo:string|null|undefined;
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '97803285366-e1sg6poe6hkrvgg3r7laj3p5o3304toe.apps.googleusercontent.com',
  });
  const navigation=useNavigation<prop>();
  const getToMain=(data:any)=>{

    setUser(user);
  setTimeout(()=>{
    navigation.navigate('Main');
  },1500)
  }
   
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      user=currentUser;

      if (currentUser) {
        setUserInfo(currentUser);
        navigation.navigate('Main');
        photo=userInfo?.user.photo;
        
      }
     
    };
    checkUser();
  }, []);
   
  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      if(userInfo){
        
         getToMain(userInfo.user);
       
        
      }
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
       
      } else if (error.code === statusCodes.IN_PROGRESS) {
      
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      
      } else {
  
      }
    }
  };

  const handleSignOut = async () => {
    try {
     const res= await GoogleSignin.signOut();
      setUserInfo(null);
      
      navigation.navigate('Login');
      Alert.alert('you have signed out ',"signed out");
      console.log(res);
    } catch (error: any) {
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
     
     {
       userInfo?'':<GoogleSigninButton 
       style={styles.signInButton}
       size={GoogleSigninButton.Size.Wide}
       color={GoogleSigninButton.Color.Dark}
       onPress={handleSignIn}
     />
     } 
      {userInfo && (
        <>
          <View style={styles.userInfo}>
          {userInfo.user.photo ? (
              <Image source={{ uri: userInfo.user.photo }} style={{width:223,height:222}} />
            ) : (
              <Text>No photo available</Text>
            )}
            <Text style={styles.text}>Name: {userInfo.user.name}</Text>
            <Text style={styles.text}>Email: {userInfo.user.email}</Text>
          </View>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      )}
    </View>
  );
}
export  function getuser(){
if(user!=null){
  return user;
}
else 
return "no user data";
}
export function getUserImage(){
    return  user?.user.photo ? user.user.photo : null;;
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    width: 192,
    height: 48,
  },
  userInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});

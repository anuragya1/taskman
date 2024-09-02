import React, { useEffect } from 'react';
import { Settings, StyleSheet, View,Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import SplashScreen from './TaskComponents/SplashScreen';
import WelcomePage from './TaskComponents/WelcomePage';
import Unknown from './TaskComponents/unknown';

import Home from './TaskComponents/Home';

import Wishlist from './TaskComponents/Wishlist';
import Recommendation from './TaskComponents/Recommendation';

import Profile from './TaskComponents/Profile';
import Setting from './TaskComponents/Setting';
import TempLogin from './UtilityComp/Auth';
import Auth from './UtilityComp/Auth';

import StackNavigator from './Navigation/StackNavigator';
import { UserProvider } from './TaskComponents/UserContext';
import PushNotification from 'react-native-push-notification';
import { PermissionsAndroid } from 'react-native';
// export type DrawerParamList = {
//   SplashScreen: undefined;
//   WelcomePage: undefined;
//   Unknown: undefined;
//   SignUp: undefined;
//   Home: undefined;
//   Login:undefined;
//   Wishlist:undefined;
//   Forgotpassword:undefined;
//  Profile:undefined;
//  Setting:undefined;
// Auth:undefined;
// };



//const Drawer = createDrawerNavigator<DrawerParamList>();

const App: React.FC = (): React.ReactElement => {
  const requestNotificationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "This app needs access to send notifications.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      console.log("Notification permission status:", granted);
    } catch (err) {
      console.warn(err);
    }
  };
  
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "daily-reminders", // Make sure this is unique
        channelName: "Unique Channel", // Give it a distinctive name
        channelDescription: "A channel for important notifications", // Optional description
        soundName: "default", // Optional sound
        importance: 4, // High importance
        vibrate: true, // Enable vibration
      },
      (created) => console.log(`createChannel returned '${created}'`) // Log the result
    );
  }, []);
  
  return (<>
     
 
      
      {/* <Drawer.Navigator   initialRouteName='Home' >
        <Drawer.Screen name="WelcomePage" component={WelcomePage} />
        <Drawer.Screen name="SignUp" component={SignUp} />
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Wishlist" component={Wishlist} />
        <Drawer.Screen name="Forgotpassword" component={ForgotPassword} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Setting" component={Setting} />
        <Drawer.Screen name="Auth" component={Auth} />
       
      </Drawer.Navigator> */}
        <NavigationContainer>
          <UserProvider>
             <StackNavigator/>
             </UserProvider>
          </NavigationContainer>
 
     
 
    </> 
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;




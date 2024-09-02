import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../TaskComponents/SplashScreen.tsx';



import Home from '../Taskcomponents/Home';
import Auth from '../UtilityComp/Auth.tsx';
import Wishlist from '../Taskcomponents/Wishlist';
import Recommendation from '../Taskcomponents/Recommendation';
import Settings from '../Taskcomponents/Setting';
import Profile from '../Taskcomponents/Profile';
import { RootStackParamList } from './types';
import DrawerNavigator from './DrawerNavigator';
import WelcomePage from '../TaskComponents/WelcomePage.tsx';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator:React.FC = (): React.ReactElement => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen" >
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}} />
      
      <Stack.Screen name="Welcome" component={WelcomePage} options={{headerShown:false}}/>
      
      <Stack.Screen name="Main"  component={DrawerNavigator} options={{headerShown:false}}/>
      <Stack.Screen name="Auth" component={Auth} />
   
    </Stack.Navigator>
  );
};

export default StackNavigator;

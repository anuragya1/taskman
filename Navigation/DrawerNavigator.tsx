import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from './types';
import Home from '../TaskComponents/Home';
import Wishlist from '../TaskComponents/Wishlist';
import Recommendation from '../TaskComponents/Recommendation';
import Settings from '../TaskComponents/Setting';
import Profile from '../TaskComponents/Profile';
import ShowWishlist from '../TaskComponents/ShowWishlist';
import MakeWishList from '../TaskComponents/MakeWishList';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Wishlist" component={Wishlist} />
      <Drawer.Screen name="Recommendation" component={Recommendation} />
      <Drawer.Screen name="Setting" component={Settings} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="showWishList" component={ShowWishlist} options={{headerShown:false, drawerItemStyle: { display: 'none' }}} />
      <Drawer.Screen name="MakeWishList" component={MakeWishList} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

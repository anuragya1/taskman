
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useUser } from './UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/types';
import { useNavigation } from '@react-navigation/native';
type prop=StackNavigationProp<RootStackParamList,'Login'>
const SplashScreen:React.FC= ():React.JSX.Element => {
  const {user , checkUser}=useUser();
  const navigation=useNavigation<prop>();
  useEffect(() => {
      setTimeout(()=>{
        checkUser();
      },1500)
    
  
  }, []);
  return (
    <View style={styles.container}>
  
      <Image source={require('../assets/splash_LE_auto_x2.jpg')} style={styles.splashImg} />
    </View>
  );
};

export default SplashScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashImg: {
 
    width: width,
    height: height,
    resizeMode: 'cover',
  },
});

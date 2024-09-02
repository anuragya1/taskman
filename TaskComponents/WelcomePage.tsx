import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
type prop=StackNavigationProp<RootStackParamList,'Login'>
const WelcomePage: React.FC = () => {
  const {signIn,signOut}=useUser();
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.titleText}>Welcome To</Text>
          <Text style={styles.titleText}>Our</Text>
          <Text style={styles.titleText}>Community</Text>
        </View>
        <Text style={styles.subText}>
          Our community is ready to help you join the best platform
        </Text>
        <Image
          source={require('../assets/welcome_LE_auto_x2.jpg')}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.buttonBlue}
          onPress={() => signIn()}
        >
          <Text style={styles.buttonTextWhite}>Sign-in with Google</Text>
        </TouchableOpacity>
   
      </SafeAreaView>
    </ScrollView>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop:40,
  },
  titleText: {
    fontFamily: 'sans-serif',
    fontSize: 48,
    color: 'black',
  },
  subText: {
    marginTop: 16,
    color:'black'
  },
  image: {
    height: 256,
    width: 256,
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonBlue: {
    backgroundColor: '#3AC6F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 13,
    marginBottom: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonTextWhite: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRed: {
    backgroundColor: '#FFEADE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 13,
    marginBottom: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonTextRed: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight, faUser, faLanguage, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/types';
import { useUser } from './UserContext';
import { useNavigation } from '@react-navigation/native';

type Props = DrawerScreenProps<DrawerParamList, 'Setting'>;

const Setting = ({ navigation }: Props) => {
  const {signOut}=useUser();
  const handleLogOut=async()=>{

 await signOut();
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faChevronLeft} size={20} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Your settings so that we are comfortable</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => {}}>
          <FontAwesomeIcon icon={faUser} size={20} color="#666" />
          <Text style={styles.optionText}>Profile</Text>
          <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.option} onPress={() => {}}>
          <FontAwesomeIcon icon={faLanguage} size={20} color="#666" />
          <Text style={styles.optionText}>Language</Text>
          <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.option} onPress={() => {}}>
          <FontAwesomeIcon icon={faFileAlt} size={20} color="#666" />
          <Text style={styles.optionText}>Terms and Conditions</Text>
          <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
    alignContent:'center',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: 'black',
   
  },
  logoutButton: {
    backgroundColor: '#FFF0F0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Setting;
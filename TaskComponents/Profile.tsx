import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/types';
import { ScrollView } from 'react-native-gesture-handler';
import { useUser } from './UserContext';



type Props = DrawerScreenProps<DrawerParamList, 'Profile'>;
const Profile = ({ navigation }: Props) => {
  const {getUserImage}=useUser();

  const {user}=useUser();
  const u:string|null|undefined=getUserImage();
  console.log(getUserImage())
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personality</Text>
      </View>
      
      <View style={styles.photoContainer}>
          {u? <Image source={{uri:u}} style={styles.photoPlaceholder}/>:<FontAwesomeIcon icon={faCamera} size={24}/>}
              
      </View>
         <View style={styles.inputLabel}>
         <Text style={styles.UserInfo}> your name : {user?.user.givenName}</Text>
        <Text style={styles.UserInfo}> your email : {user?.user.email}</Text>
        <Text style={styles.UserInfo}> your Family name : {user?.user.familyName?"No Family Name Present":user?.user.familyName} </Text>
        
         </View>
       
        
      </ScrollView>
    </SafeAreaView>
  );
};

const InputField = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput style={styles.input} value={value} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  UserInfo:{
   color:"black",
   margin:20,
   fontSize:15,
   fontStyle:'normal'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoText: {
    color: '#FF6347',
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;
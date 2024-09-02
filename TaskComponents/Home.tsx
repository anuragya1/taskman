import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, BackHandler, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faFileAlt, faCog, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/types';
import { useUser } from './UserContext';
import { useFocusEffect } from '@react-navigation/native';

type prop = DrawerScreenProps<DrawerParamList, 'Home'>;

const Home: React.FC<prop> = ({ navigation, route }): React.JSX.Element => {
  const { getUserImage, user } = useUser();
  const u: string | null | undefined = getUserImage();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (route.name === 'Home') {
          Alert.alert('Hold on!', 'Are you sure you want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        } else {
          navigation.goBack();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [navigation, route.name])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
            <View style={styles.avatarContainer}>
              {u ? (
                <Image source={{ uri: u }} style={styles.avatarContainer} />
              ) : (
                <FontAwesomeIcon icon={faUser} size={25} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>Welcome {user?.user.name}</Text>
          <Text style={styles.joinedText}>Joined 13.8 Billion years Ago</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuItem, styles.personalityItem]} onPress={() => { navigation.navigate('Profile') }}>
            <FontAwesomeIcon icon={faUser} size={24} color="#FF9500" />
            <View style={styles.alignMenuTxtCenter}>
              <Text style={[styles.menuText, styles.personalityText]}>Profile</Text>
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={24} color="#ccc" style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.workItem]} onPress={() => { navigation.navigate('Wishlist') }}>
            <FontAwesomeIcon icon={faFileAlt} size={24} color="#8A2BE2" />
            <View style={styles.alignMenuTxtCenter}>
              <Text style={[styles.menuText, styles.workText]}>Work Today's</Text>
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={24} color="#ccc" style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.settingItem]} onPress={() => { navigation.navigate('Setting') }}>
            <FontAwesomeIcon icon={faCog} size={24} color="#00CED1" />
            <View style={styles.alignMenuTxtCenter}>
              <Text style={[styles.menuText, styles.settingText]}>Settings</Text>
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={24} color="#ccc" style={styles.chevron} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    fontFamily: 'Roboto',
    marginTop: 8,
  },
  joinedText: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Roboto',
  },
  menuSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    marginHorizontal: 16,
  },
  personalityItem: {
    backgroundColor: '#FFE4B2',
  },
  workItem: {
    backgroundColor: '#E6E6FA',
  },
  settingItem: {
    backgroundColor: '#E0FFFF',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    color: '#333',
    fontFamily: 'Roboto',
  },
  personalityText: {
    color: '#FF9500',
  },
  workText: {
    color: '#8A2BE2',
  },
  settingText: {
    color: '#00CED1',
  },
  alignMenuTxtCenter: {
    flex: 1,
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 10,
    color: '#ccc',
  },
});

export default Home;

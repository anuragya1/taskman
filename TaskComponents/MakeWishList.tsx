import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendar, faList, faAlignLeft, faTag, faFlag } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/types';
import axios from 'axios';
import { useUser } from './UserContext';

interface WishlistItem {
  title?: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string; 
  UserId: string | undefined;
}

type Props = DrawerScreenProps<DrawerParamList, 'MakeWishList'> & {
  route: {
    params?: {
      task?: {
        category?: string;
        due_date?: string;
        priority?: string;
        title?: string;
      };
    };
  };
};

const MakeWishlist: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useUser();
  const [wishlistItem, setWishlistItem] = useState<WishlistItem>({
    title: '',
    description: '',
    category: '',
    priority: 'low',
    due_date: new Date().toISOString().split('T')[0],
    UserId: user?.user.id,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    console.log("Incoming data:", route.params?.task);
    console.log("iso time",new Date().toISOString().split('T')[0])
    if (route.params?.task) {
      const { category, due_date, priority, title } = route.params.task;
             
      setWishlistItem(prevState => ({
        ...prevState,
        category: category || '',
        due_date: due_date || new Date().toISOString().split('T')[0],
        priority: (priority?.toLowerCase() as 'low' | 'medium' | 'high') || 'low',
        title: title || '',
        UserId: user?.user.id,
      }));
    }
  }, [route.params, user]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    hideDatePicker();
    
    console.log(" under selected date ",selectedDate)
    if (selectedDate) {
      setWishlistItem(prev => ({ ...prev, due_date: selectedDate.toISOString().split('T')[0] }));
      
    }
  };

  const handleSave = async () => {
    const { title, description, category, priority, due_date, UserId } = wishlistItem;
  
    if (!title || !category || !due_date || !priority || !UserId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
     console.log("the going date is in form ",due_date)
    try { 
      console.log("the  date which is passing ",wishlistItem.due_date)
      await axios.post('https://native-backend-5khahae76-anurags-projects-dc4e4a37.vercel.app/createTask', {
        ...wishlistItem,
        description: description || '',
        creationDate: new Date().toISOString().split('T')[0],
        status: false,
      });
      const now = new Date();
      const dueDateObj = new Date(due_date);
      const daysUntilDue = Math.ceil((dueDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
      for (let i = 0; i < daysUntilDue; i++) {
        const notificationDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
  
        PushNotification.localNotificationSchedule({
          channelId: "daily-reminders",
          title: "Task Reminder",
          message: `Your task "${title}" is due on ${due_date}`,
          date: notificationDate,
          allowWhileIdle: true,
          repeatType: 'day',
          repeatTime: 1,
        });
      }
  
      Alert.alert('Success', 'Wishlist item added successfully');
      navigation.navigate('Wishlist'); 
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      Alert.alert('Error', 'Failed to add wishlist item');
    }
  };
  const getColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      default:
        return 'black';
    }
  };




  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Make a Wishlist</Text>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faList} size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#888"
            value={wishlistItem.title}
            onChangeText={(text) => setWishlistItem(prev => ({ ...prev, title: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faAlignLeft} size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#888"
            value={wishlistItem.description}
            onChangeText={(text) => setWishlistItem(prev => ({ ...prev, description: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faTag} size={24} color="blue" />
          <TextInput
            style={styles.input}
            placeholder="Category"
            placeholderTextColor="#888"
            value={wishlistItem.category}
            onChangeText={(text) => setWishlistItem(prev => ({ ...prev, category: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faFlag} size={24} color="orange" />
          <TouchableOpacity
            style={styles.prioritySelector}
            onPress={() => {
              const priorities = ['low', 'medium', 'high'] as const;
              const currentIndex = priorities.indexOf(wishlistItem.priority || 'low');
              const nextPriority = priorities[(currentIndex + 1) % priorities.length];
              setWishlistItem(prev => ({ ...prev, priority: nextPriority }));
            }}
          >
            <Text style={[styles.priorityText, { color: getColor(wishlistItem.priority || 'low') }]}>
              {wishlistItem.priority || 'low'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.inputContainer} onPress={showDatePicker}>
          <FontAwesomeIcon icon={faCalendar} size={24} color="green" />
          <Text style={styles.input}>
            {wishlistItem.due_date}  
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date(wishlistItem.due_date||'')}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleConfirm}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0e0e0',
  },
  iconButton: {
    marginHorizontal: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
    elevation: 3,
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  priorityText: {
    fontSize: 18,
  },
  prioritySelector: {
    marginLeft: 10,
    flex: 1,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MakeWishlist;

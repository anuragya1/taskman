import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Share
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft, faCalendar, faList, faAlignLeft, faTag, faFlag, faEdit, faShareSquare, faTrash, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/types';
import axios from 'axios';
import { useUser } from './UserContext';

interface Wishlistitem {
  _id?: string;
  title: string|undefined;
  description: string|undefined;
  category: string|undefined;
  priority: 'low' | 'medium' | 'high';
  due_date: string | Date | number;
  UserId: string|undefined;
  Status: boolean;
}

type Prop = DrawerScreenProps<DrawerParamList, 'showWishList'>;

const ShowWishlist: React.FC<Prop> = ({ navigation, route }) => {
  const { user } = useUser();
  const [isEditMode, setIsEditMode] = useState(false);
  const [wishlistItem, setWishlistItem] = useState<Wishlistitem>({
    title: '',
    description: '',
    category: '',
    priority: 'low',
    due_date: new Date().toISOString().split('T')[0],
    UserId: user?.user.id || '',
    Status: false,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (route.params?.task) {
      console.log(route.params.task);
      setWishlistItem(route.params.task);
    }
  }, [route.params]);

  const showDatePicker = () => {
    if (isEditMode) {
      setDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    hideDatePicker();
    if (selectedDate) {
      setWishlistItem({ ...wishlistItem, due_date: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: wishlistItem.title,
        message: `Title: ${wishlistItem.title} \n\nDescription: ${wishlistItem.description}\n\nCategory: ${wishlistItem.category}\n\nPriority: ${wishlistItem.priority}\n\nDue Date: ${wishlistItem.due_date}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Share Error', 'There was an error sharing the wishlist item.');
    }
  };

  const handleSave = async () => {
    console.log(wishlistItem);
    if (!wishlistItem.title || !wishlistItem.description || !wishlistItem.category || !wishlistItem.due_date || !wishlistItem.priority) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      const response = await axios.put('https://native-backend-5khahae76-anurags-projects-dc4e4a37.vercel.app/UpdateTask', {
        data:wishlistItem
      });
      setIsEditMode(false)
        Alert.alert('Success', 'Wishlist item updated successfully');
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      Alert.alert('Error', 'Failed to add wishlist item');
    }
  
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Wishlist Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              if (wishlistItem) {
                await axios.post(`https://native-backend-5khahae76-anurags-projects-dc4e4a37.vercel.app/DeleteTask`, {
                  data: wishlistItem 
                });
                setIsEditMode(false)
                Alert.alert('Success', 'Wishlist item deleted successfully');
                navigation.navigate('Wishlist');
              } else {
                throw new Error('Wishlist item _id is undefined');
              }
            } catch (error) {
              console.error('Error deleting wishlist item:', error);
              Alert.alert('Error', 'Failed to delete wishlist item');
            }
          }
        }
      ]
    );
  };

  const handleMarkDone = async () => {
    Alert.alert(
      "Mark Wishlist Item as Done",
      "Are you sure you want to mark this item as done?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              if (wishlistItem) {
                wishlistItem.Status=true;
                await axios.put('https://native-backend-5khahae76-anurags-projects-dc4e4a37.vercel.app/UpdateTask', {
                  data:wishlistItem
                    
                });
                Alert.alert('Success', 'Wishlist item marked as done successfully');
                setIsEditMode(false)
                navigation.navigate('Wishlist');
              } else {
                throw new Error('Wishlist item is undefined');
              }
            } catch (error) {
              console.error('Error marking wishlist item as done:', error);
              Alert.alert('Error', 'Failed to mark wishlist item as done');
            }
          }
        }
      ]
    );
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
          onPress={() => { setIsEditMode(false); navigation.navigate('Wishlist')}}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} />
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <FontAwesomeIcon icon={faEdit} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
          >
            <FontAwesomeIcon icon={faShareSquare} size={24} />
          </TouchableOpacity>
          {isEditMode && (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleMarkDone}
              >
                <FontAwesomeIcon icon={faCheckCircle} size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleDelete}
              >
                <FontAwesomeIcon icon={faTrash} size={24} color="red" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Wishlist Details</Text>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faList} size={24} color="black" />
          <Text style={styles.input}>{wishlistItem.title}</Text>
        </View>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faAlignLeft} size={24} color="black" />
          {isEditMode ? (
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={wishlistItem.description}
              onChangeText={(text) => setWishlistItem({ ...wishlistItem, description: text })}
            />
          ) : (
            <Text style={styles.input}>{wishlistItem.description}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faTag} size={24} color="blue" />
          <Text style={styles.input}>{wishlistItem.category}</Text>
        </View>

        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faFlag} size={24} color="orange" />
          {isEditMode ? (
            <TouchableOpacity
              style={styles.prioritySelector}
              onPress={() => {
                const priorities = ['low', 'medium', 'high'] as const;
                const currentIndex = priorities.indexOf(wishlistItem.priority);
                const nextPriority = priorities[(currentIndex + 1) % priorities.length];
                setWishlistItem({ ...wishlistItem, priority: nextPriority });
              }}
            >
              <Text style={[styles.priorityText, { color: getColor(wishlistItem.priority) }]}>
                {wishlistItem.priority}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.priorityText, { color: getColor(wishlistItem.priority) }]}>
              {wishlistItem.priority}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.inputContainer} onPress={showDatePicker}>
          <FontAwesomeIcon icon={faCalendar} size={24} color="green" />
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={typeof wishlistItem.due_date === 'string'
                ? wishlistItem.due_date
                : wishlistItem.due_date instanceof Date
                  ? wishlistItem.due_date.toLocaleDateString()
                  : wishlistItem.due_date.toString().split('T')[0]}
              editable={false}
            />
          ) : (
            <Text style={styles.input}>{typeof wishlistItem.due_date === 'string'
              ? wishlistItem.due_date
              : wishlistItem.due_date instanceof Date
                ? wishlistItem.due_date.toLocaleDateString()
                : wishlistItem.due_date.toString().split('T')[0]}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date(wishlistItem.due_date)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleConfirm}
        />
      )}

      {isEditMode && (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0e0e0',
  },
  headerButtons: {
    flexDirection: 'row',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  prioritySelector: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ShowWishlist;
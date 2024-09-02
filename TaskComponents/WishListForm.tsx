import React, { useState, useRef } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faList, faAlignLeft, faTag, faFlag, faCalendar } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Priority = 'low' | 'medium' | 'high';

const WishlistForm = () => {
  const [wishlistItem, setWishlistItem] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'low' as Priority,
    due_date: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  // Add type annotations for the event and selectedDate
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || wishlistItem.due_date;
    setShowDatePicker(Platform.OS === 'ios');
    setWishlistItem({ ...wishlistItem, due_date: currentDate });
  };

  const getColor = (priority: Priority) => {
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
    <Animated.View
      style={{
        opacity: animation,
        maxHeight: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1000],
        }),
        overflow: 'hidden',
      }}
    >
      <Text style={styles.title}>Make a wish list</Text>
      <Text style={styles.subtitle}>Make your job easier with our reminders</Text>

      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faList} size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={wishlistItem.title}
          onChangeText={(text) => setWishlistItem({ ...wishlistItem, title: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faAlignLeft} size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={wishlistItem.description}
          onChangeText={(text) => setWishlistItem({ ...wishlistItem, description: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faTag} size={24} color="blue" />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={wishlistItem.category}
          onChangeText={(text) => setWishlistItem({ ...wishlistItem, category: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faFlag} size={24} color="orange" />
        <TouchableOpacity
          style={styles.prioritySelector}
          onPress={() => {
            const priorities: Priority[] = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(wishlistItem.priority);
            const nextPriority = priorities[(currentIndex + 1) % priorities.length];
            setWishlistItem({ ...wishlistItem, priority: nextPriority });
          }}
        >
          <Text style={[styles.priorityText, { color: getColor(wishlistItem.priority) }]}>
            {wishlistItem.priority}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
        <FontAwesomeIcon icon={faCalendar} size={24} color="green" />
        <Text style={styles.input}>
          {wishlistItem.due_date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={wishlistItem.due_date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
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
});

export default WishlistForm;

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Platform, ActivityIndicator
} from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendar, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useUser } from './UserContext';
import { useIsFocused } from '@react-navigation/native';

type Prop = DrawerScreenProps<DrawerParamList, 'Wishlist'>;

interface Wishlistitem {
  _id: string;
  title: string | undefined;
  description: string | undefined;
  category: string | undefined;
  priority: 'low' | 'medium' | 'high';
  due_date: string | Date | number;
  UserId: string | undefined;
  Status: boolean;
}

const Wishlist: React.FC<Prop> = ({ navigation }) => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Wishlistitem[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Wishlistitem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'notCompleted' | 'priority'>('all');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://native-backend-5khahae76-anurags-projects-dc4e4a37.vercel.app/getTask/${user?.user.id}`);
      if (response) {
        setTasks(response.data);
        setFilteredTasks(response.data);
      }
    } catch (err) {
      console.log("an error ", err);
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  useEffect(() => {
    filterTasks();
  }, [filterType, tasks]);

  const filterTasks = () => {
    let filtered = [...tasks];
    switch (filterType) {
      case 'completed':
        filtered = filtered.filter(task => task.Status);
        break;
      case 'notCompleted':
        filtered = filtered.filter(task => !task.Status);
        break;
      case 'priority':
        filtered.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
    }
    setFilteredTasks(filtered);
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

  const getToTask = (task: Wishlistitem) => {
   let formattedDate:string=task.due_date.toString();
   formattedDate=formattedDate.split('T')[0]
   console.log(formattedDate," formated date")
    const formattedTask = {
      ...task,
      due_date: formattedDate
    };
    navigation.navigate('showWishList', { task: formattedTask });
  };

  const renderItem = ({ item }: { item: Wishlistitem }) => (
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => getToTask(item)}
    >
      <View style={[styles.taskBox, { backgroundColor: getColor(item.priority) }]} />
      <Text style={styles.taskText}>{item.title}</Text>
      <FontAwesomeIcon icon={faChevronRight} size={20} color="#CCC" />
    </TouchableOpacity>
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (event: any, selectedDate?: Date) => {
    hideDatePicker();
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Work Today's</Text>
      <Text style={styles.subtitle}>Make your job easier with our reminders</Text>

      <TouchableOpacity style={styles.dateContainer} onPress={()=>{}}>
        <Text style={styles.dateText}>
          Today {date.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
        </Text>
        <FontAwesomeIcon icon={faCalendar} size={20} color="#4CAF50" />
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilterButton]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterButtonText, filterType === 'all' && styles.activeFilterButtonText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'completed' && styles.activeFilterButton]}
          onPress={() => setFilterType('completed')}
        >
          <Text style={[styles.filterButtonText, filterType === 'completed' && styles.activeFilterButtonText]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'notCompleted' && styles.activeFilterButton]}
          onPress={() => setFilterType('notCompleted')}
        >
          <Text style={[styles.filterButtonText, filterType === 'notCompleted' && styles.activeFilterButtonText]}>Not Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'priority' && styles.activeFilterButton]}
          onPress={() => setFilterType('priority')}
        >
          <Text style={[styles.filterButtonText, filterType === 'priority' && styles.activeFilterButtonText]}>Priority</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Dont know what to do !! let us decide . check out our recommendations</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recommendation')}>
            <Text style={styles.buttonText}>Recommendations</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          style={styles.taskList}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MakeWishList', {
        task: {
          title: '',
          description: '',
          category: '',
          priority: 'low',
          due_date: date.toISOString().split('T')[0],
          UserId: user?.user.id || '',
        }
      })}>
        <Text style={styles.buttonText}>Make a wish list</Text>
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleConfirm}
        />
      )}
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: '#fff',
  },
  filterButtonText: {
    color: '#007BFF',
    fontSize: 12,
  },
  activeFilterButton: {
    backgroundColor: '#007BFF',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  taskList: {
    flex: 1,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  taskBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
});

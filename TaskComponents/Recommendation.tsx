import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { faTag, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/types';
import recomData from '../assets/realistic_user_tasks.json';

interface Wishlistitem {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string | Date | number;
  UserId: string;
}

type Prop = DrawerScreenProps<DrawerParamList, 'Recommendation'>;

const Recommendation: React.FC<Prop> = ({ navigation }) => {
  const [recommendations, setRecommendations] = useState<Wishlistitem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const { user } = useUser();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = () => {
    if (isLoading) return; 
    setIsLoading(true);
    const newRecommendations: Wishlistitem[] = [];
    const newIndices: number[] = [];

    while (newRecommendations.length < 5 && usedIndices.size < recomData.length) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * recomData.length);
      } while (usedIndices.has(randomIndex));

      const task = recomData[randomIndex];
      newRecommendations.push({
        _id: task.id.toString(),
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high',
        due_date: task.due_date,
        UserId: task.user_id.toString()
      });
      newIndices.push(randomIndex);
    }

    
    setTimeout(() => {
      setRecommendations(prev => [...prev, ...newRecommendations]);
      setUsedIndices(prev => new Set([...prev, ...newIndices]));
      setIsLoading(false);
    }, 1000);
  };

  const handleRecommendationPress = (item: Wishlistitem) => {
    const formattedTask = {
      ...item,
      due_date: item.due_date
        ? (typeof item.due_date === 'string'
            ? item.due_date
            : item.due_date instanceof Date
              ? item.due_date.toISOString().split('T')[0]
              : new Date(item.due_date).toISOString().split('T')[0])
        : ''
    };

    navigation.navigate('MakeWishList', { task: formattedTask });
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

  const renderRecommendationItem = ({ item }: { item: Wishlistitem }) => (
    <TouchableOpacity style={styles.recommendationItem} onPress={() => handleRecommendationPress(item)}>
      <View style={styles.taskIconContainer}>
        <FontAwesomeIcon icon={faTag} size={24} color="#007BFF" />
      </View>
      <View style={styles.taskInfoContainer}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.priorityText}>Priority: {item.priority}</Text>
        <Text style={styles.categoryText}>Category: {item.category}</Text>
        <Text style={styles.statusText}>Due-Date: {typeof item.due_date === 'string'
          ? item.due_date
          : item.due_date instanceof Date
            ? item.due_date.toLocaleDateString()
            : item.due_date.toString()}</Text>
      </View>
      <FontAwesomeIcon icon={faChevronRight} size={20} color="#CCC" />
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    fetchRecommendations();
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommended Tasks</Text>
      <FlatList
        data={recommendations}
        renderItem={renderRecommendationItem}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'black',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskIconContainer: {
    marginRight: 12,
  },
  taskInfoContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  priorityText: {
    fontSize: 12,
    color: '#666',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default Recommendation;
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronRight, AlertCircle } from 'lucide-react-native';
import PlantCard from '@/components/PlantCard';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Plant {
  _id: string;
  commonName: string;
  scientificName: string;
  currentStatus: string;
  images: string[];
  currentStageIndex?: number;
  totalStages?: number;
  createdAt: string;
}

export default function HomeScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      loadPlants();
    }, [])
  );

  const loadPlants = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');

      if (user) setUserData(JSON.parse(user));

      const response = await axios.get(`${API_BASE_URL}/plants/user/my-plants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlants(response.data);
    } catch (error) {
      console.error('Failed to load plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlants();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView
        className="flex-1 bg-gray-50"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header Section */}
        <View className="bg-white px-6 py-8 border-b border-gray-200">
          <Text className="text-gray-600 text-sm">Welcome back</Text>
          <Text className="text-3xl font-bold text-gray-900">{userData?.fullName?.split(' ')[0]}!</Text>
          <Text className="text-gray-600 mt-2">Track your plant research progress</Text>
        </View>

        {/* Stats */}
        <View className="px-6 py-6 gap-3">
          <View className="bg-green-50 border border-green-200 rounded-lg p-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center">
                <Text className="text-white text-xl font-bold">{plants.length}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Total Submissions</Text>
                <Text className="text-gray-900 font-semibold">Your plant samples</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Plants Section */}
        <View className="px-6 pb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">Your Plants</Text>
            {plants.length > 0 && (
              <TouchableOpacity>
                <ChevronRight size={20} color="#16a34a" />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#16a34a" />
            </View>
          ) : plants.length > 0 ? (
            <View className="gap-4">
              {plants.map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-lg p-8 items-center">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                <AlertCircle size={32} color="#999" />
              </View>
              <Text className="text-gray-600 text-center mb-4">No plants submitted yet</Text>
              <Text className="text-gray-500 text-sm text-center">Submit your first plant sample to start tracking</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

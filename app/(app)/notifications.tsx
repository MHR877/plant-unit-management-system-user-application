import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  plantId: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
  <SafeAreaView className='flex-1'>
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-6 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Notifications</Text>

        {loading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#16a34a" />
          </View>
        ) : notifications.length > 0 ? (
          <View className="gap-3 mb-8">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={() => markAsRead(notification._id)}
              />
            ))}
          </View>
        ) : (
          <View className="bg-white rounded-lg p-8 items-center">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Bell size={32} color="#999" />
            </View>
            <Text className="text-gray-600 text-center">No notifications yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
    
  );
}

function NotificationItem({ notification, onRead }: any) {
  return (
    <TouchableOpacity
      className={`rounded-lg p-4 border-l-4 ${
        notification.isRead ? 'bg-white border-gray-300' : 'bg-blue-50 border-blue-500'
      }`}
      onPress={onRead}
    >
      <Text className="font-bold text-gray-900">{notification.title}</Text>
      <Text className="text-gray-600 text-sm mt-1">{notification.message}</Text>
      <Text className="text-gray-500 text-xs mt-2">
        {new Date(notification.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
}

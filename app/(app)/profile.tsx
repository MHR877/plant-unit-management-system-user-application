import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LogOut, User, Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="px-6 py-8">
          {/* Profile Header */}
          <View className="bg-white rounded-lg p-6 mb-6 items-center">
            <View className="w-20 h-20 bg-green-600 rounded-full items-center justify-center mb-4">
              <User size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">{userData?.fullName}</Text>
            <View className="flex-row items-center gap-2 mt-3">
              <Mail size={16} color="#666" />
              <Text className="text-gray-600">{userData?.email}</Text>
            </View>
          </View>

          {/* Account Info */}
          <View className="bg-white rounded-lg p-6 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Account Information</Text>
            <InfoRow label="Full Name" value={userData?.fullName} />
            <InfoRow label="Email" value={userData?.email} />
            <InfoRow label="Role" value={userData?.role || 'User'} />
            <InfoRow
              label="Status"
              value={userData?.isVerified ? 'Verified' : 'Pending Verification'}
            />
          </View>

          {/* About */}
          <View className="bg-white rounded-lg p-6 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">About PlantLab</Text>
            <Text className="text-gray-600 text-sm leading-6">
              PlantLab is a plant research tracking system that helps researchers submit plant samples and track them through 12 laboratory analysis stages.
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-600 rounded-lg py-4 flex-row items-center justify-center gap-2 mb-8"
            onPress={handleLogout}
          >
            <LogOut size={20} color="white" />
            <Text className="text-white font-bold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
      <Text className="text-gray-600">{label}</Text>
      <Text className="font-semibold text-gray-900">{value}</Text>
    </View>
  );
}

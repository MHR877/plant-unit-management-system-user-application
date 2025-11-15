import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Leaf } from 'lucide-react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    console.log(email, password , API_BASE_URL);
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/user`, {
        email,
        password,
      });

      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      
      router.replace('/(app)/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-16 pb-8 justify-center">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-16 h-16 bg-green-600 rounded-full items-center justify-center mb-4">
            <Leaf size={32} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-900">PlantLab</Text>
          <Text className="text-gray-600 mt-2 text-center">Track your plant research journey</Text>
        </View>

        {/* Login Form */}
        <View className="gap-4 mb-6">
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50"
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-2">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50"
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="bg-green-600 rounded-lg py-4 items-center mb-4"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-gray-600">Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-green-600 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

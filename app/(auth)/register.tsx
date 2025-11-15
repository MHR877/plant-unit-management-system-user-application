import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import { Leaf } from 'lucide-react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        fullName,
        email,
        password,
      });

      Alert.alert('Success', 'Registration successful! Please wait for admin verification.', [
        { text: 'OK', onPress: () => router.push('/(auth)/login') },
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-12 pb-8">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-green-600 rounded-full items-center justify-center mb-4">
            <Leaf size={32} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
          <Text className="text-gray-600 mt-2 text-center">Join our plant research community</Text>
        </View>

        {/* Registration Form */}
        <View className="gap-4 mb-6">
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50"
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

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

          <View>
            <Text className="text-gray-700 font-semibold mb-2">Confirm Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50"
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="bg-green-600 rounded-lg py-4 items-center mb-4"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-gray-600">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-green-600 font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

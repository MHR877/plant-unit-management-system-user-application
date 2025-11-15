import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, Upload } from 'lucide-react-native';
import ImagePreview from '@/components/ImagePreview';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_IMAGE = process.env.EXPO_PUBLIC_API_IMAGE

export default function SubmitScreen() {
  const [commonName, setCommonName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [collectionPlace, setCollectionPlace] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [observations, setObservations] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!commonName || !scientificName || !collectionPlace || !collectionDate || images.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and add at least one image');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();

      formData.append('commonName', commonName);
      formData.append('scientificName', scientificName);
      formData.append('collectionPlace', collectionPlace);
      formData.append('collectionDate', collectionDate);
      formData.append('observations', observations);

      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `plant_${index}.jpg`,
        } as any);
      });

      await axios.post(`${API_BASE_URL}/plants`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Plant submitted successfully! Admin will review it soon.', [
        {
          text: 'OK',
          onPress: () => {
            setCommonName('');
            setScientificName('');
            setCollectionPlace('');
            setCollectionDate('');
            setObservations('');
            setImages([]);
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="px-6 py-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-gray-900 mb-6">Submit Plant Sample</Text>

          {/* Form Fields */}
          <View className="gap-5 mb-8">
            <InputField
              label="Common Name *"
              placeholder="e.g., Rose"
              value={commonName}
              onChangeText={setCommonName}
              editable={!loading}
            />

            <InputField
              label="Scientific Name *"
              placeholder="e.g., Rosa spp"
              value={scientificName}
              onChangeText={setScientificName}
              editable={!loading}
            />

            <InputField
              label="Collection Place *"
              placeholder="e.g., Garden, Forest"
              value={collectionPlace}
              onChangeText={setCollectionPlace}
              editable={!loading}
            />

            <InputField
              label="Collection Date *"
              placeholder="YYYY-MM-DD"
              value={collectionDate}
              onChangeText={setCollectionDate}
              editable={!loading}
            />

            <InputField
              label="Observations"
              placeholder="Add any observations..."
              value={observations}
              onChangeText={setObservations}
              multiline
              editable={!loading}
            />
          </View>

          {/* Image Section */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">Add Images *</Text>

            {/* Image Preview */}
            {images.length > 0 && (
              <View className="mb-4">
                <ImagePreview images={images} onRemove={removeImage} />
              </View>
            )}

            {/* Image Picker Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                className="bg-white border-2 border-green-600 rounded-lg py-4 flex-row items-center justify-center gap-2"
                onPress={pickImage}
                disabled={loading}
              >
                <Upload size={20} color="#16a34a" />
                <Text className="text-green-600 font-semibold">Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-green-600 rounded-lg py-4 flex-row items-center justify-center gap-2"
                onPress={takePhoto}
                disabled={loading}
              >
                <Camera size={20} color="white" />
                <Text className="text-white font-semibold">Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-green-600 rounded-lg py-4 items-center mb-8"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Submit Plant</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  editable = true,
}: any) {
  return (
    <View>
      <Text className="text-gray-700 font-semibold mb-2">{label}</Text>
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50 ${multiline ? 'min-h-[100px]' : ''
          }`}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        editable={editable}
      />
    </View>
  );
}

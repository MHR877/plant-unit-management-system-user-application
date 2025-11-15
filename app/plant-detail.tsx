import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Calendar, MapPin, Leaf } from 'lucide-react-native';
import StagesTimeline from '@/components/StagesTimeline';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Stage {
  _id: string;
  name: string;
  code: string;
  orderIndex: number;
  description: string;
}

interface ProgressData {
  currentStageIndex: number;
  totalStages: number;
  percentComplete: number;
}

interface Plant {
  _id: string;
  commonName: string;
  scientificName: string;
  collectionPlace: string;
  collectionDate: string;
  images: string[];
  currentStatus: string;
  observations: string;
  qrCode: string;
  adminNotes?: string;
}

export default function PlantDetailScreen() {
  const { plantId } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [allStages, setAllStages] = useState<Stage[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'qr'>('info');

  useEffect(() => {
    loadPlantDetails();
  }, []);

  const loadPlantDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const stagesResponse = await axios.get(`${API_BASE_URL}/stages/${plantId}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("[v0] Stages response:", stagesResponse.data);

      setPlant(stagesResponse.data.plant);
      setAllStages(stagesResponse.data.allStages || []);
      setProgress(stagesResponse.data.progress);
    } catch (error) {
      console.error('Failed to load plant details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!plant) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Plant not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#16a34a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 ml-4">Plant Details</Text>
      </View>

      <View className="bg-white flex-row border-b border-gray-200 px-6">
        <TouchableOpacity
          onPress={() => setActiveTab('info')}
          className={`flex-1 py-4 px-4 border-b-2 ${
            activeTab === 'info' ? 'border-green-600' : 'border-transparent'
          }`}
        >
          <Text
            className={`font-semibold text-center ${
              activeTab === 'info' ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            Information & Stages
          </Text>
        </TouchableOpacity>

        {(plant.currentStatus === 'approved' || plant.currentStatus === 'in_progress') && plant.qrCode && (
          <TouchableOpacity
            onPress={() => setActiveTab('qr')}
            className={`flex-1 py-4 px-4 border-b-2 ${
              activeTab === 'qr' ? 'border-green-600' : 'border-transparent'
            }`}
          >
            <Text
              className={`font-semibold text-center ${
                activeTab === 'qr' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              QR Code
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Content */}
      <View className="px-6 py-6">
        {/* Information Tab */}
        {activeTab === 'info' && (
          <>
            {/* Image Gallery */}
            {plant.images && plant.images.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                className="mb-6 gap-2"
              >
                {plant.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: `${API_BASE_URL.replace('/api', '')}${image}` }}
                    className="w-32 h-32 rounded-lg bg-gray-200"
                  />
                ))}
              </ScrollView>
            )}

            {/* Plant Info Card */}
            <View className="bg-white rounded-lg p-6 mb-6">
              <View className="flex-row items-center gap-2 mb-2">
                <Leaf size={20} color="#16a34a" />
                <Text className="text-2xl font-bold text-gray-900">{plant.commonName}</Text>
              </View>
              <Text className="text-gray-600 italic mb-4">{plant.scientificName}</Text>

              <InfoRow label="Collection Place" value={plant.collectionPlace} icon={<MapPin size={16} />} />
              <InfoRow label="Collection Date" value={new Date(plant.collectionDate).toLocaleDateString()} icon={<Calendar size={16} />} />
              <InfoRow label="Status" value={plant.currentStatus.replace('_', ' ').toUpperCase()} />

              {plant.adminNotes && (
                <View className="mt-4 pt-4 border-t border-gray-200">
                  <Text className="text-gray-600 text-sm font-semibold mb-2">Admin Notes</Text>
                  <Text className="text-gray-600 text-sm">{plant.adminNotes}</Text>
                </View>
              )}

              {plant.observations && (
                <View className="mt-4 pt-4 border-t border-gray-200">
                  <Text className="text-gray-600 text-sm font-semibold mb-2">Observations</Text>
                  <Text className="text-gray-600 text-sm">{plant.observations}</Text>
                </View>
              )}
            </View>

            {/* Stages Section */}
            {allStages.length > 0 && progress && (
              <View className="bg-white rounded-lg p-6">
                <View className="mb-4">
                  <Text className="text-lg font-bold text-gray-900">Lab Processing Stages</Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {progress.percentComplete === 0 ? 'Waiting to start' : `${progress.percentComplete}% Complete`}
                  </Text>
                </View>
                
                {/* Progress Bar */}
                {progress.percentComplete > 0 && (
                  <View className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                    <View 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                      style={{ width: `${progress.percentComplete}%` }}
                    />
                  </View>
                )}

                <StagesTimeline 
                  stages={allStages} 
                  currentStageIndex={progress.currentStageIndex}
                />
              </View>
            )}
          </>
        )}

        {/* QR Code Tab */}
        {activeTab === 'qr' && (plant.currentStatus === 'approved' || plant.currentStatus === 'in_progress') && plant.qrCode && (
          <QRCodeDisplay plantId={plant.qrCode} commonName={plant.commonName} />
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
    
  );
}

function InfoRow({ label, value, icon }: any) {
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray-100">
      {icon && <View className="w-5">{icon}</View>}
      <View className="flex-1">
        <Text className="text-gray-600 text-sm">{label}</Text>
        <Text className="text-gray-900 font-semibold">{value}</Text>
      </View>
    </View>
  );
}

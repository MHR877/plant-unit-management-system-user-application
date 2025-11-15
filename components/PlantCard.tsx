import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Calendar, MapPin } from 'lucide-react-native';

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

const API_IMAGE = process.env.EXPO_PUBLIC_API_IMAGE

export default function PlantCard({ plant }: { plant: Plant }) {
  const router = useRouter();
  const imageUrl = plant.images?.[0];
  const progressPercentage = plant.totalStages 
    ? Math.round(((plant.currentStageIndex || -1) + 1) / plant.totalStages * 100)
    : 0;

  const statusColor = {
    pending: 'bg-yellow-50 border-yellow-200',
    approved: 'bg-blue-50 border-blue-200',
    rejected: 'bg-red-50 border-red-200',
    'in_progress': 'bg-green-50 border-green-200',
    done: 'bg-purple-50 border-purple-200',
  }[plant.currentStatus] || 'bg-gray-50 border-gray-200';

  const statusTextColor = {
    pending: 'text-yellow-700',
    approved: 'text-blue-700',
    rejected: 'text-red-700',
    'in_progress': 'text-green-700',
    done: 'text-purple-700',
  }[plant.currentStatus] || 'text-gray-700';

  const handlePress = () => {
    router.push({
      pathname: '/plant-detail',
      params: { plantId: plant._id },
    });
  };

  return (
    <TouchableOpacity
      className={`rounded-lg border p-4 overflow-hidden ${statusColor}`}
      onPress={handlePress}
    >
      <View className="flex-row gap-4">
        {/* Image */}
        {imageUrl && (
          <Image
            source={{ uri: `${API_IMAGE}${imageUrl}`  }}
            className="w-24 h-24 rounded-lg bg-gray-200"
          />
        )}

        {/* Info */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{plant.commonName}</Text>
          <Text className="text-sm text-gray-600">{plant.scientificName}</Text>

          {/* Status */}
          <View className="flex-row items-center gap-2 mt-2 mb-3">
            <View className={`px-3 py-1 rounded-full ${statusColor}`}>
              <Text className={`text-xs font-semibold ${statusTextColor}`}>
                {plant.currentStatus.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Progress */}
          {plant.currentStatus === 'in_progress' && (
            <View className="mb-2">
              <View className="h-2 bg-gray-300 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
              <Text className="text-xs text-gray-600 mt-1">{progressPercentage}% Progress</Text>
            </View>
          )}

          {/* Date */}
          <View className="flex-row items-center gap-1">
            <Calendar size={12} color="#666" />
            <Text className="text-xs text-gray-600">
              {new Date(plant.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <View className="justify-center">
          <ChevronRight size={20} color="#999" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

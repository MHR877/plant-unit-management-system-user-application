import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

export default function ImagePreview({ 
  images, 
  onRemove 
}: { 
  images: any[]; 
  onRemove: (index: number) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
      {images.map((image, index) => (
        <View key={index} className="relative">
          <Image
            source={{ uri: image.uri }}
            className="w-24 h-24 rounded-lg bg-gray-200"
          />
          <TouchableOpacity
            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full items-center justify-center"
            onPress={() => onRemove(index)}
          >
            <X size={16} color="white" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

import { View, Text, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Download } from 'lucide-react-native';

interface QRCodeDisplayProps {
  plantId: string;
  commonName: string;
}

export default function QRCodeDisplay({ plantId, commonName }: QRCodeDisplayProps) {
  const qrRef = useRef<any>(null);
  const qrValue = `plant:${plantId}`;

  const saveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to save QR codes to your gallery');
        return;
      }

      if (!qrRef.current) return;

      qrRef.current.toDataURL(async (data: string) => {
        try {
          const filename = `Plant_QR_${plantId}_${Date.now()}.png`;
          const fileUri = FileSystem.cacheDirectory + filename;
          
          // Write base64 image to file system
          await FileSystem.writeAsStringAsync(fileUri, data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Create asset in media library
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync('Plant Lab', asset, false);

          Alert.alert('Success', 'QR Code saved to gallery');
        } catch (error) {
          console.log('[v0] Error in QR save callback:', error);
          Alert.alert('Error', 'Failed to save QR code');
        }
      });
    } catch (error) {
      console.log('[v0] Error saving QR:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  return (
    <View className="bg-white rounded-lg p-6 items-center">
      <Text className="text-lg font-bold text-gray-900 mb-6">Plant QR Code</Text>

      <View className="bg-white p-4 rounded-lg border border-gray-200">
        <QRCode
          ref={qrRef}
          value={qrValue}
          size={250}
          level="H"
          includeMargin={true}
        />
      </View>

      <Text className="text-gray-600 text-sm mt-4 text-center">
        {commonName} • ID: {plantId}
      </Text>

      <TouchableOpacity
        onPress={saveToGallery}
        className="mt-6 bg-green-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
      >
        <Download size={18} color="white" />
        <Text className="text-white font-semibold">Save to Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

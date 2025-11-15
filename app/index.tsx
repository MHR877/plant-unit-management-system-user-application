import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(false);

  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsSignedIn(!!token);
      } catch (e) {
        setIsSignedIn(false);
      }
    };

    check();
  }, []);

  if (isSignedIn === null) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)" />;
}

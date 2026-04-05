import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import authService from '@/services/auth.services';

interface PreferencesData {
  location: {
    coordinates: [number, number];
    address: string;
  };
  preferredDistance: number;
  preferredAgeRange: {
    min: number;
    max: number;
  };
  preferredGender: 'Male' | 'Female' | 'Other' | 'All';
  showLocationOnProfile: boolean;
}

export default function SignUpStep3() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const step1Data = params.step1Data ? JSON.parse(params.step1Data as string) : null;
  const step2Data = params.step2Data ? JSON.parse(params.step2Data as string) : null;
  
  const [preferences, setPreferences] = useState<PreferencesData>({
    location: {
      coordinates: [0, 0],
      address: '',
    },
    preferredDistance: 10,
    preferredAgeRange: {
      min: 18,
      max: 30,
    },
    preferredGender: 'All',
    showLocationOnProfile: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to find people near you');
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = reverseGeocode[0] 
        ? `${reverseGeocode[0].city || reverseGeocode[0].region || ''}, ${reverseGeocode[0].country || ''}`
        : 'Unknown location';

      setPreferences({
        ...preferences,
        location: {
          coordinates: [location.coords.longitude, location.coords.latitude],
          address: address.trim() || 'Current location',
        },
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your location. Please try again or enter manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const updateAgeRange = (type: 'min' | 'max', value: number) => {
    setPreferences({
      ...preferences,
      preferredAgeRange: {
        ...preferences.preferredAgeRange,
        [type]: value,
      },
    });
  };

  const handleCreateAccount = async () => {
    // Validations before sending data to backend
    if (!preferences.location.coordinates || preferences.location.coordinates[0] === 0) {
      Alert.alert('Error', 'Please enable location to find connections near you');
      return;
    }

    if (preferences.preferredAgeRange.min >= preferences.preferredAgeRange.max) {
      Alert.alert('Error', 'Minimum age must be less than maximum age');
      return;
    }

    if (preferences.preferredAgeRange.min < 18) {
      Alert.alert('Error', 'Minimum age cannot be less than 18');
      return;
    }

    setIsLoading(true);

    try {
      // Combine all data into a single object to send to the backend
      const completeUserData = {
        // Information for account creation
        name: step1Data?.name,
        lastName: step1Data?.lastName,
        email: step1Data?.email,
        password: step1Data?.password,
        
        // Information for profile
        gender: step2Data?.gender,
        birthDate: step2Data?.birthDate,
        bio: step2Data?.bio,
        interests: step2Data?.interests,
        profileImage: step2Data?.profileImage,
        subImages: step2Data?.subImages,
        
        // Information for preferences
        location: {
          type: 'Point',
          coordinates: preferences.location.coordinates,
        },
        preferredDistance: preferences.preferredDistance,
        preferredAgeRange: {
          min: preferences.preferredAgeRange.min,
          max: preferences.preferredAgeRange.max,
        },
        preferredGender: preferences.preferredGender,
        showLocationOnProfile: preferences.showLocationOnProfile,
      };

      console.log('Creating account with complete data:', completeUserData);
      
      // Call the signup service with all the collected data
      const response = await authService.signUp(completeUserData);

      console.log('Sign up response:', response);
      
      if (response.isNewUser) {
        // New user - account created successfully
        Alert.alert(
          '✅ Account Created',
          `Your account has been created successfully!\n\n` +
          `A verification email has been sent to:\n${step1Data?.email}\n\n` +
          `Please check your inbox (and spam folder) and click the verification link.`,
          [
            {
              text: 'Continue',
              onPress: () => router.push({
                pathname: '/verifyEmail',
                params: { email: step1Data?.email }
              })
            }
          ]
        );
      } else {
        // Existing user - successful login
        console.log('Existing user, redirecting...');
        router.push('/login');
      }
      
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDistance = (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km} km`;
  };

  return (
    <View className="flex-1 bg-purple-700">
      {/* Progress Bar */}
      <View style={{ paddingTop: insets.top }} className="bg-purple-700">
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-xs font-medium">STEP 3 OF 3</Text>
            <Text className="text-white/70 text-xs">100%</Text>
          </View>
          
          <View className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <View className="h-full bg-white rounded-full" style={{ width: '100%' }} />
          </View>
          
          <View className="flex-row justify-between mt-3">
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
                <Feather name="check" size={16} color="white" />
              </View>
              <Text className="text-white/60 text-xs mt-1">Personal</Text>
            </View>
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
                <Feather name="check" size={16} color="white" />
              </View>
              <Text className="text-white/60 text-xs mt-1">Profile</Text>
            </View>
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                <Text className="text-purple-700 font-bold text-sm">3</Text>
              </View>
              <Text className="text-white/80 text-xs mt-1">Preferences</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="items-center justify-center px-6 py-4">
          <View className="bg-white w-full max-w-sm rounded-2xl p-6 relative">
            <TouchableOpacity onPress={handleBack} className="absolute left-4 top-4 z-10">
              <Feather name="arrow-left" size={24} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-gray-900 text-2xl font-bold text-center mt-6">
              Discovery Preferences
            </Text>
            <Text className="text-gray-500 mt-2 text-sm text-center">
              Help us find your perfect matches
            </Text>

            <View className="w-full mt-8 gap-5">
              {/* Location Section */}
              <View className="gap-2">
                <Text className="text-gray-700 text-sm font-semibold ml-1">Your Location</Text>
                <TouchableOpacity
                  onPress={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex-row items-center justify-between bg-gray-100 p-3 rounded-xl"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Feather name="map-pin" size={20} color="#6A11CB" />
                    <Text className="text-gray-700 flex-1" numberOfLines={1}>
                      {preferences.location.address || 'Tap to get your location'}
                    </Text>
                  </View>
                  {isGettingLocation ? (
                    <ActivityIndicator size="small" color="#6A11CB" />
                  ) : (
                    <Feather name="refresh-cw" size={18} color="#6B7280" />
                  )}
                </TouchableOpacity>

                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-gray-600 text-sm">Show my city on profile</Text>
                  <Switch
                    value={preferences.showLocationOnProfile}
                    onValueChange={(value) => setPreferences({ ...preferences, showLocationOnProfile: value })}
                    trackColor={{ false: '#D1D5DB', true: '#6A11CB' }}
                    thumbColor={preferences.showLocationOnProfile ? '#FFFFFF' : '#F3F4F6'}
                  />
                </View>
              </View>

              {/* Preferred Distance */}
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 text-sm font-semibold ml-1">Preferred Distance</Text>
                  <Text className="text-purple-600 font-bold">{formatDistance(preferences.preferredDistance)}</Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={100}
                  step={1}
                  value={preferences.preferredDistance}
                  onValueChange={(value) => setPreferences({ ...preferences, preferredDistance: value })}
                  minimumTrackTintColor="#6A11CB"
                  maximumTrackTintColor="#D1D5DB"
                  thumbTintColor="#6A11CB"
                />
                <View className="flex-row justify-between px-2">
                  <Text className="text-gray-400 text-xs">1 km</Text>
                  <Text className="text-gray-400 text-xs">50 km</Text>
                  <Text className="text-gray-400 text-xs">100 km</Text>
                </View>
              </View>

              {/* Age Range */}
              <View className="gap-3">
                <Text className="text-gray-700 text-sm font-semibold ml-1">Age Range</Text>
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs ml-1 mb-1">Minimum</Text>
                    <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
                      <TouchableOpacity
                        onPress={() => updateAgeRange('min', Math.max(18, preferences.preferredAgeRange.min - 1))}
                        className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
                      >
                        <Feather name="minus" size={18} color="#4B5563" />
                      </TouchableOpacity>
                      <Text className="flex-1 text-center text-gray-900 font-bold text-lg">
                        {preferences.preferredAgeRange.min}
                      </Text>
                      <TouchableOpacity
                        onPress={() => updateAgeRange('min', Math.min(preferences.preferredAgeRange.max - 1, preferences.preferredAgeRange.min + 1))}
                        className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
                      >
                        <Feather name="plus" size={18} color="#4B5563" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs ml-1 mb-1">Maximum</Text>
                    <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
                      <TouchableOpacity
                        onPress={() => updateAgeRange('max', Math.max(preferences.preferredAgeRange.min + 1, preferences.preferredAgeRange.max - 1))}
                        className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
                      >
                        <Feather name="minus" size={18} color="#4B5563" />
                      </TouchableOpacity>
                      <Text className="flex-1 text-center text-gray-900 font-bold text-lg">
                        {preferences.preferredAgeRange.max}
                      </Text>
                      <TouchableOpacity
                        onPress={() => updateAgeRange('max', Math.min(100, preferences.preferredAgeRange.max + 1))}
                        className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
                      >
                        <Feather name="plus" size={18} color="#4B5563" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text className="text-gray-400 text-xs text-center">
                  Showing people between {preferences.preferredAgeRange.min} and {preferences.preferredAgeRange.max} years old
                </Text>
              </View>

              {/* Preferred Gender */}
              <View className="gap-2">
                <Text className="text-gray-700 text-sm font-semibold ml-1">I'm interested in</Text>
                <View className="flex-row flex-wrap gap-2">
                  {(['All', 'Male', 'Female', 'Other'] as const).map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      onPress={() => setPreferences({ ...preferences, preferredGender: gender })}
                      className={`px-4 py-2 rounded-full ${
                        preferences.preferredGender === gender ? 'bg-purple-600' : 'bg-gray-100'
                      }`}
                    >
                      <Text className={`font-medium ${preferences.preferredGender === gender ? 'text-white' : 'text-gray-700'}`}>
                        {gender === 'All' ? 'Everyone' : gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Summary Card */}
              <View className="mt-4 p-4 bg-purple-50 rounded-xl">
                <Text className="text-purple-800 font-semibold text-center mb-2">Your Discovery Settings</Text>
                <Text className="text-purple-700 text-sm text-center">
                  🔍 Looking for {preferences.preferredGender === 'All' ? 'everyone' : preferences.preferredGender.toLowerCase()} 
                  {' • '}
                  📍 Within {formatDistance(preferences.preferredDistance)}
                  {' • '}
                  🎂 Ages {preferences.preferredAgeRange.min}-{preferences.preferredAgeRange.max}
                </Text>
              </View>

              {/* Create Account Button */}
              <LinearGradient
                colors={['#6A11CB', '#2575FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-xl shadow-md mt-4"
              >
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={handleCreateAccount}
                  disabled={isLoading}
                  className="w-full py-3"
                >
                  {isLoading ? (
                    <View className="flex-row items-center justify-center gap-2">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-semibold text-center">
                        Creating Account...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-semibold text-center text-lg">
                      Create Account ✨
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
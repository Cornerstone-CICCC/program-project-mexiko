import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

interface Step2Data {
  gender: 'Male' | 'Female' | 'Other' | '';
  birthDate: string;
  interests: string[];
  bio: string;
  profileImage: string | null;
  subImages: string[];
}

const INTERESTS_OPTIONS = [
  'Music', 'Sports', 'Art', 'Technology', 'Travel', 'Food',
  'Photography', 'Reading', 'Gaming', 'Fitness', 'Fashion',
  'Movies', 'Dancing', 'Cooking', 'Yoga', 'Nature', 'Business',
  'Science', 'Writing', 'Podcasts'
];

export default function SignUpStep2() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const step1Data = params.signupData ? JSON.parse(params.signupData as string) : null;
  
  const [formData, setFormData] = useState<Step2Data>({
    gender: '',
    birthDate: '',
    interests: [],
    bio: '',
    profileImage: null,
    subImages: [],
  });
  
  const [selectedInterest, setSelectedInterest] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddInterest = () => {
    if (selectedInterest && !formData.interests.includes(selectedInterest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, selectedInterest]
      });
      setSelectedInterest('');
    } else if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, customInterest.trim()]
      });
      setCustomInterest('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profileImage: result.assets[0].uri });
    }
  };

  const pickSubImage = async () => {
    if (formData.subImages.length >= 5) {
      Alert.alert('Limit reached', 'You can add up to 5 additional photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        subImages: [...formData.subImages, result.assets[0].uri]
      });
    }
  };

  const removeSubImage = (index: number) => {
    const newSubImages = [...formData.subImages];
    newSubImages.splice(index, 1);
    setFormData({ ...formData, subImages: newSubImages });
  };

  const validateAndNext = () => {
    console.log('========== VALIDATION START ==========');
    console.log('1. Form Data received:', {
      gender: formData.gender,
      birthDate: formData.birthDate,
      bioLength: formData.bio.length,
      interestsCount: formData.interests.length,
      hasProfileImage: !!formData.profileImage,
      subImagesCount: formData.subImages.length
    });
    console.log('2. Step1 Data:', step1Data);
    
    // Validations with detailed logging
    if (!formData.gender) {
      console.log('❌ Validation failed: Gender not selected');
      Alert.alert('Error', 'Please select your gender');
      return;
    }
    console.log('✅ Gender validation passed');

    if (!formData.birthDate) {
      console.log('❌ Validation failed: Birth date empty');
      Alert.alert('Error', 'Please enter your birth date');
      return;
    }
    console.log('✅ Birth date exists');

    // Validate format date  DD/MM/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(formData.birthDate)) {
      console.log(`❌ Validation failed: Invalid date format. Received: ${formData.birthDate}`);
      Alert.alert('Error', 'Please use format DD/MM/YYYY');
      return;
    }
    console.log('✅ Date format is valid');

    // Validate minimum age (18 years)
    const [day, month, year] = formData.birthDate.split('/');
    console.log(`3. Parsed date - Day: ${day}, Month: ${month}, Year: ${year}`);
    
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    console.log(`4. Age calculation - BirthDate: ${birthDate}, Today: ${today}`);
    console.log(`5. Calculated age: ${age}, MonthDiff: ${monthDiff}, DayDiff: ${dayDiff}`);
    
    let finalAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      finalAge = age - 1;
      console.log(`6. Adjusting age (birthday not yet this year): ${finalAge}`);
    }
    
    if (finalAge < 18) {
      console.log(`❌ Validation failed: User is ${finalAge} years old (min 18 required)`);
      Alert.alert('Error', 'You must be at least 18 years old');
      return;
    }
    console.log(`✅ Age validation passed: User is ${finalAge} years old`);

    if (!formData.bio.trim()) {
      console.log('❌ Validation failed: Bio is empty');
      Alert.alert('Error', 'Please tell us something about yourself');
      return;
    }
    console.log(`✅ Bio exists: ${formData.bio.length} characters`);

    if (formData.bio.length < 20) {
      console.log(`❌ Validation failed: Bio too short (${formData.bio.length}/20)`);
      Alert.alert('Error', 'Bio must be at least 20 characters');
      return;
    }
    console.log(`✅ Bio length validation passed`);

    if (formData.interests.length === 0) {
      console.log('❌ Validation failed: No interests selected');
      Alert.alert('Error', 'Please add at least one interest');
      return;
    }
    console.log(`✅ Interests validation passed: ${formData.interests.length} interests selected`);
    console.log(`   Interests: ${formData.interests.join(', ')}`);

    // Preparing data for navigation
    console.log('========== PREPARING NAVIGATION ==========');
    
    let step1DataString: string, step2DataString: string;
    try {
      step1DataString = JSON.stringify(step1Data);
      step2DataString = JSON.stringify(formData);
      console.log('7. Data stringified successfully');
      console.log(`8. Step1 data size: ${step1DataString.length} characters`);
      console.log(`9. Step2 data size: ${step2DataString.length} characters`);
      
      // Verify total size of data being passed
      const totalSize = step1DataString.length + step2DataString.length;
      const maxUrlSize = 8000; // The parameters are passed in the URL, so we need to ensure we don't exceed typical URL length limits
      
      if (totalSize > maxUrlSize) {
        console.warn(`⚠️ Data size (${totalSize}) exceeds recommended limit (${maxUrlSize})`);
        console.warn('This may cause navigation issues');
        
        // Show alert to user about potential issues with large data
        Alert.alert(
          'Warning',
          'Your images or data are very large. This might cause issues. Consider using smaller images.',
          [
            { text: 'Continue Anyway', onPress: () => performNavigation(step1DataString, step2DataString) },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }
      
      performNavigation(step1DataString, step2DataString);
      
    } catch (error) {
      console.error('❌ Error stringifying data:', error);
      Alert.alert('Error', 'Failed to process data. Please try again.');
      return;
    }
  };

  // Navigation function
  const performNavigation = (step1DataString: string, step2DataString: string) => {
    console.log('10. Executing navigation to /signupStep3');
    console.log('11. Params being sent:', {
      step1DataLength: step1DataString.length,
      step2DataLength: step2DataString.length,
      step1DataPreview: step1DataString.substring(0, 100),
      step2DataPreview: step2DataString.substring(0, 100)
    });
    
    try {
      router.push({
        pathname: '/signupStep3',
        params: {
          step1Data: step1DataString,
          step2Data: step2DataString
        }
      });
      console.log('✅ Navigation pushed successfully');
    } catch (error) {
      console.error('❌ Navigation error:', error);
      Alert.alert('Navigation Error', 'Could not navigate to next step. Check console for details.');
    }
    
    console.log('========== VALIDATION END ==========');
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-purple-700"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1">
        {/* Progress Bar */}
        <View style={{ paddingTop: insets.top }} className="bg-purple-700">
          <View className="px-4 pt-2 pb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-xs font-medium">STEP 2 OF 3</Text>
              <Text className="text-white/70 text-xs">66%</Text>
            </View>
            
            <View className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <View 
                className="h-full bg-white rounded-full"
                style={{ width: '66%' }}
              />
            </View>
            
            <View className="flex-row justify-between mt-3">
              <View className="items-center">
                <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
                  <Feather name="check" size={16} color="white" />
                </View>
                <Text className="text-white/60 text-xs mt-1">Personal</Text>
              </View>
              <View className="items-center">
                <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                  <Text className="text-purple-700 font-bold text-sm">2</Text>
                </View>
                <Text className="text-white/80 text-xs mt-1">Profile</Text>
              </View>
              <View className="items-center">
                <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
                  <Text className="text-white font-bold text-sm">3</Text>
                </View>
                <Text className="text-white/60 text-xs mt-1">Security</Text>
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

              <TouchableOpacity 
                onPress={handleBack}
                className="absolute left-4 top-4 z-10"
              >
                <Feather name="arrow-left" size={24} color="#4B5563" />
              </TouchableOpacity>

              <Text className="text-gray-900 text-2xl font-bold text-center mt-6">
                Profile Details
              </Text>

              <Text className="text-gray-500 mt-2 text-sm text-center">
                Tell us more about yourself
              </Text>

              <View className="w-full mt-8 gap-4">

                {/* Profile Image */}
                <View className="gap-2">
                  <Text className="text-gray-700 text-sm ml-1">Profile Photo</Text>
                  <TouchableOpacity 
                    onPress={pickProfileImage}
                    className="items-center justify-center"
                  >
                    {formData.profileImage ? (
                      <View className="relative">
                        <Image 
                          source={{ uri: formData.profileImage }}
                          className="w-24 h-24 rounded-full"
                        />
                        <View className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2">
                          <Feather name="camera" size={16} color="white" />
                        </View>
                      </View>
                    ) : (
                      <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                        <Feather name="camera" size={32} color="#9CA3AF" />
                        <Text className="text-xs text-gray-400 mt-1">Add photo</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Gender Selection */}
                <View className="gap-2">
                  <Text className="text-gray-700 text-sm ml-1">Gender *</Text>
                  <View className="flex-row gap-3">
                    {(['Male', 'Female', 'Other'] as const).map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setFormData({ ...formData, gender: option })}
                        className={`flex-1 py-3 rounded-xl border-2 ${
                          formData.gender === option
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <Text className={`text-center font-medium ${
                          formData.gender === option ? 'text-purple-600' : 'text-gray-600'
                        }`}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Birth Date */}
                <View className="gap-1">
                  <Text className="text-gray-700 text-sm ml-1">Birth Date *</Text>
                  <View className="relative">
                    <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                      <Feather name="calendar" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      value={formData.birthDate}
                      onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={10}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900"
                    />
                  </View>
                  <Text className="text-gray-400 text-xs ml-1">You must be at least 18 years old</Text>
                </View>

                {/* Bio */}
                <View className="gap-1">
                  <Text className="text-gray-700 text-sm ml-1">Bio *</Text>
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <Feather name="edit-2" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      value={formData.bio}
                      onChangeText={(text) => setFormData({ ...formData, bio: text })}
                      placeholder="Tell us about yourself, your interests, what you're looking for..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      maxLength={500}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900 min-h-[100px]"
                    />
                  </View>
                  <Text className="text-gray-400 text-xs text-right">
                    {formData.bio.length}/500 characters
                  </Text>
                </View>

                {/* Interests */}
                <View className="gap-2">
                  <Text className="text-gray-700 text-sm ml-1">Interests *</Text>
                  
                  {/* Selected Interests Tags */}
                  {formData.interests.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      {formData.interests.map((interest) => (
                        <View key={interest} className="flex-row items-center bg-purple-100 rounded-full px-3 py-1">
                          <Text className="text-purple-700 text-sm">{interest}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveInterest(interest)}
                            className="ml-2"
                          >
                            <Feather name="x" size={14} color="#7C3AED" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Add Interest */}
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      {showCustomInput ? (
                        <TextInput
                          value={customInterest}
                          onChangeText={setCustomInterest}
                          placeholder="Enter your interest"
                          placeholderTextColor="#9CA3AF"
                          autoFocus
                          className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-900"
                          onSubmitEditing={handleAddInterest}
                        />
                      ) : (
                        <View className="flex-row gap-2">
                          <View className="flex-1">
                            <TextInput
                              value={selectedInterest}
                              onChangeText={setSelectedInterest}
                              placeholder="Type or select from list"
                              placeholderTextColor="#9CA3AF"
                              className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-900"
                            />
                          </View>
                          <TouchableOpacity
                            onPress={() => setShowCustomInput(true)}
                            className="bg-gray-100 px-3 rounded-xl justify-center"
                          >
                            <Feather name="plus" size={20} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={handleAddInterest}
                      className="bg-purple-600 px-4 rounded-xl justify-center"
                    >
                      <Feather name="plus" size={20} color="white" />
                    </TouchableOpacity>
                  </View>

                  {/* Quick Interest Suggestions */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="mt-2"
                  >
                    <View className="flex-row gap-2">
                      {INTERESTS_OPTIONS.slice(0, 8).map((interest) => (
                        <TouchableOpacity
                          key={interest}
                          onPress={() => {
                            if (!formData.interests.includes(interest)) {
                              setFormData({
                                ...formData,
                                interests: [...formData.interests, interest]
                              });
                            }
                          }}
                          className="bg-gray-100 px-3 py-1.5 rounded-full"
                        >
                          <Text className="text-gray-600 text-sm">{interest}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Additional Photos */}
                <View className="gap-2">
                  <Text className="text-gray-700 text-sm ml-1">Additional Photos (Optional)</Text>
                  <Text className="text-gray-400 text-xs ml-1 mb-2">Add up to 5 photos to your profile</Text>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-3">
                      {formData.subImages.map((image, index) => (
                        <View key={index} className="relative">
                          <Image 
                            source={{ uri: image }}
                            className="w-20 h-20 rounded-xl"
                          />
                          <TouchableOpacity
                            onPress={() => removeSubImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                          >
                            <Feather name="x" size={12} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {formData.subImages.length < 5 && (
                        <TouchableOpacity
                          onPress={pickSubImage}
                          className="w-20 h-20 bg-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300"
                        >
                          <Feather name="plus" size={24} color="#9CA3AF" />
                          <Text className="text-xs text-gray-400 mt-1">Add</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </ScrollView>
                </View>

                {/* Navigation Buttons */}
                <View className="flex-row gap-3 mt-6">
                  <TouchableOpacity 
                    onPress={handleBack}
                    className="flex-1 py-3 rounded-xl bg-gray-200"
                  >
                    <Text className="text-gray-700 font-semibold text-center">Back</Text>
                  </TouchableOpacity>
                  
                  <LinearGradient
                    colors={['#6A11CB', '#2575FC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-1 rounded-xl shadow-md"
                  >
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={validateAndNext}
                      disabled={isLoading}
                      className="w-full py-3"
                    >
                      <Text className="text-white font-semibold text-center text-lg">
                        Next →
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
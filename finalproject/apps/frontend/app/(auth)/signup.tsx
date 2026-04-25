import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    // Validations before navigating to the next step
    if (!name || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms of Service and Privacy Policy');
      return;
    }

    // Save data to pass to the next step
    router.push({
      pathname: '/signupStep2',
      params: { 
        signupData: JSON.stringify({
          name,
          lastName,
          email,
          password,
        })
      }
    });
  };

  return (
    <View className="flex-1 bg-purple-700">
      <View style={{ paddingTop: insets.top }} className="bg-purple-700">
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-xs font-medium">STEP 1 OF 3</Text>
            <Text className="text-white/70 text-xs">33%</Text>
          </View>
          
          <View className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <View 
              className="h-full bg-white rounded-full"
              style={{ width: '33%' }}
            />
          </View>
          
          {/* Indicators step */}
          <View className="flex-row justify-between mt-3">
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                <Text className="text-purple-700 font-bold text-sm">1</Text>
              </View>
              <Text className="text-white/80 text-xs mt-1">Personal</Text>
            </View>
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <Text className="text-white/60 text-xs mt-1">Profile</Text>
            </View>
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <Text className="text-white/60 text-xs mt-1">Prefences</Text>
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
              onPress={() => router.push('/')}
              className="absolute left-4 top-4 z-10"
            >
              <Feather name="arrow-left" size={24} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-gray-900 text-2xl font-bold text-center mt-6">
              Create Your Account
            </Text>

            <Text className="text-gray-500 mt-2 text-sm text-center">
              Find meaningful connections, intentionally.
            </Text>

            <View className="w-full mt-8 gap-4">

              <View className="gap-1">
                <Text className="text-gray-700 text-sm ml-1">Name</Text>

                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Feather name="user" size={20} color="#9CA3AF" />
                  </View>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor="#9CA3AF"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900"
                  />
                </View>
              </View>

              <View className="gap-1">
                <Text className="text-gray-700 text-sm ml-1">Last Name</Text>

                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Feather name="user" size={20} color="#9CA3AF" />
                  </View>

                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Your last name"
                    placeholderTextColor="#9CA3AF"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900"
                  />
                </View>
              </View>

              <View className="gap-1">
                <Text className="text-gray-700 text-sm ml-1">Email</Text>

                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Feather name="mail" size={20} color="#9CA3AF" />
                  </View>

                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900"
                  />
                </View>
              </View>

              <View className="gap-1">
                <Text className="text-gray-700 text-sm ml-1">Password</Text>

                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Feather name="lock" size={20} color="#9CA3AF" />
                  </View>

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="********"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-100 text-gray-900"
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Feather 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="gap-1">
                <Text className="text-gray-700 text-sm ml-1">Confirm Password</Text>

                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Feather name="lock" size={20} color="#9CA3AF" />
                  </View>

                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="********"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirm}
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-100 text-gray-900"
                  />

                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Feather 
                      name={showConfirm ? "eye-off" : "eye"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Conditions */}
              <TouchableOpacity 
                onPress={() => setTermsAccepted(!termsAccepted)}
                className="flex-row items-start gap-3 mt-2"
              >
                <View className={`w-5 h-5 border-2 rounded mt-0.5 ${
                  termsAccepted 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {termsAccepted && (
                    <Feather name="check" size={16} color="white" style={{ alignSelf: 'center' }} />
                  )}
                </View>
                <Text className="text-gray-600 text-sm flex-1">
                  I agree to the <Text className="text-purple-600 font-semibold">Terms of Service</Text> and{' '}
                  <Text className="text-purple-600 font-semibold">Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              <LinearGradient
                colors={['#6A11CB', '#2575FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-xl shadow-md mt-4"
              >
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={handleNext}
                  disabled={isLoading}
                  className="w-full py-3"
                >
                  {isLoading ? (
                    <View className="flex-row items-center justify-center gap-2">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-semibold text-center">
                                        Loading...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-semibold text-center text-lg">
                      Next →
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-sm">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-purple-600 font-semibold">
                  Log In
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}
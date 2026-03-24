import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'; // Añade ActivityIndicator
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import authService from '@/services/auth.services'; 
import Toast from 'react-native-toast-message';


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);



const handleLogin = async () => {
    
  if (!email || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  setIsLoading(true);

  try {
    console.log('Attempting login with:', email);
    
    const response = await authService.login({
      email,
      password,
    });

    console.log('Login successful:', response);
    
    
    Toast.show({
      type: 'success',
      text1: 'Welcome back! 👋',
      text2: 'Login successful',
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
    });
    
    router.replace('/(mbti-check)');

  } catch (error: any) {
    console.log('Error in login:', error.message);
    
    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: error.message,
      position: 'top',
      visibilityTime: 3000,
    });
    
  } finally {
    setIsLoading(false);
  }
};

  return (
    <ScrollView className="flex-1 bg-purple-700">
      <View className="flex-1 items-center justify-center px-6 py-10">
        
        <View className="bg-white w-full max-w-sm rounded-2xl p-6 relative">

          <TouchableOpacity 
            onPress={() => router.push('/')} 
            className="absolute left-4 top-4 z-10"
          >
            <Feather name="arrow-left" size={24} color="#4B5563" />
          </TouchableOpacity>

          <Text className="text-gray-900 text-2xl font-bold text-center mt-6">
            Welcome Back
          </Text>

          <Text className="text-gray-500 mt-2 text-sm text-center">
            Continue your intentional connection journey.
          </Text>

          <View className="w-full mt-8 gap-4">

            {/* Email */}
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

            {/* Password */}
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

                {/* Toggle Password */}
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

            <View className="flex-row items-center justify-between mt-1">
              <TouchableOpacity 
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center gap-2"
              >
                <View className={`w-4 h-4 border rounded ${
                  rememberMe 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {rememberMe && (
                    <Feather name="check" size={12} color="white" style={{ alignSelf: 'center' }} />
                  )}
                </View>
                <Text className="text-gray-600 text-sm">Remember me</Text>
              </TouchableOpacity>

              <Link href="/forgotPassword" asChild>
                <TouchableOpacity>
                  <Text className="text-purple-600 text-sm font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <LinearGradient
                colors={['#6A11CB', '#2575FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-xl shadow-md mt-4"
                >
                <TouchableOpacity 
                    className="w-full py-3"
                    activeOpacity={0.8}
                    onPress={handleLogin} 
                    disabled={isLoading}
                >
                  {isLoading ? ( 
                    <View className="flex-row items-center justify-center gap-2">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-semibold text-center">
                        Logging in...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-semibold text-center">
                      Log In
                    </Text>
                  )}
                </TouchableOpacity>
            </LinearGradient>

          </View>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600 text-sm">
              Don't have an account?{' '}
            </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text className="text-purple-600 font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
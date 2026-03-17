import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, ActivityIndicator } from 'react-native';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('YOUR_API_URL/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        router.push({
          pathname: '/resetConfirmation',
          params: { email: email }
        });
      } else {
        throw new Error('Failed to send reset link');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to send reset link. Please check your email and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-purple-700">
      <View className="flex-1 items-center justify-center px-6 py-10">
        
        <View className="bg-white w-full max-w-sm rounded-2xl p-6">

          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="absolute left-4 top-4 z-10"
          >
            <Feather name="arrow-left" size={24} color="#4B5563" />
          </TouchableOpacity>

          <Text className="text-gray-900 text-2xl font-bold text-center mt-6">
            Forgot Password?
          </Text>

          <Text className="text-gray-500 mt-2 text-sm text-center">
            No worries! Enter your email and we'll send you a link to reset your password.
          </Text>

          <View className="items-center justify-center mt-6 mb-2">
            <Image 
              source={require('../../assets/images/email.svg')} 
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>
          

          <View className="w-full mt-8 gap-4">

            {/* Email */}
            <View className="gap-1">
              <Text className="text-gray-700 text-sm ml-1">Email Address</Text>

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

            <LinearGradient
                colors={['#6A11CB', '#2575FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-xl shadow-md mt-2"
                >
                <TouchableOpacity
                    onPress={handleSendResetLink} 
                    className="w-full py-3 flex-row items-center justify-center gap-2"
                    activeOpacity={0.8}
                >
                    <Feather name="send" size={18} color="white" />
                    <Text className="text-white font-semibold text-center">
                    Send Reset Link
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
          </View>

          <Text className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
            If you don't see the email in your inbox, check your spam folder.{'\n'}
            The link will expire in 1 hour.
          </Text>

          <View className="mt-6 items-center">
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-purple-600 font-medium text-sm">
                  {'<'} Back to Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
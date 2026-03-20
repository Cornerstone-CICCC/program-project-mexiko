// frontend/app/(auth)/verifyEmail.tsx
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { auth } from '@/config/firebase'; // Importa auth
import { sendEmailVerification } from '@/config/firebase';

export default function VerifyEmail() {
  const params = useLocalSearchParams();
  const [userEmail] = useState(params.email || 'your.email@example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  // Función para verificar si el email ya fue verificado
  const checkEmailVerified = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // Recargar datos del usuario
        return user.emailVerified;
      }
      return false;
    } catch (error) {
      console.error('Error checking verification:', error);
      return false;
    }
  };

  const handleVerificationComplete = async () => {
    setCheckingVerification(true);
    try {
      const isVerified = await checkEmailVerified();
      
      if (isVerified) {
        Alert.alert(
          'Success!',
          'Your email has been verified successfully.',
          [
            {
              text: 'Continue',
              onPress: () => router.push('/login')
            }
          ]
        );
      } else {
        Alert.alert(
          'Not Verified Yet',
          'Please check your email and click the verification link before continuing.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Could not verify email status. Please try again.');
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        Alert.alert('Success', 'Verification email resent successfully!');
      } else {
        throw new Error('No user found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar automáticamente cada 5 segundos si el email fue verificado
  useEffect(() => {
    const interval = setInterval(async () => {
      const isVerified = await checkEmailVerified();
      if (isVerified) {
        clearInterval(interval);
        Alert.alert(
          'Email Verified!',
          'Your email has been verified. You can now continue.',
          [
            {
              text: 'Continue',
              onPress: () => router.push('/login')
            }
          ]
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView className="flex-1 bg-purple-700">
      <View className="flex-1 items-center justify-center px-6 py-10">
        
        <View className="bg-white w-full max-w-sm rounded-2xl p-6">

          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute left-4 top-4 z-10"
          >
            <Feather name="arrow-left" size={24} color="#4B5563" />
          </TouchableOpacity>

          <View className="items-center justify-center mt-6 mb-2">
            <Image 
                source={require('../../assets/images/verifyEmail.svg')} 
                className="w-32 h-32"
                resizeMode="contain"
            />
           </View>

          <Text className="text-gray-900 text-2xl font-bold text-center">
            Verify Your Email
          </Text>

          <Text className="text-gray-500 mt-2 text-sm text-center leading-relaxed">
            We've sent a verification link to your email address. Please verify your email to continue.
          </Text>

          <View className="mt-6 items-center">
            <Text className="text-gray-600 text-sm">Verification sent to</Text>
            <Text className="text-gray-900 font-semibold text-sm mt-1">
              {userEmail}
            </Text>
          </View>

          <View className="mt-6 gap-2">
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full bg-purple-100 items-center justify-center">
                <Text className="text-purple-600 text-xs font-bold">1</Text>
              </View>
              <Text className="text-gray-700 text-sm">Check your email inbox</Text>
            </View>
            
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full bg-purple-100 items-center justify-center">
                <Text className="text-purple-600 text-xs font-bold">2</Text>
              </View>
              <Text className="text-gray-700 text-sm">Click the verification link</Text>
            </View>
            
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full bg-purple-100 items-center justify-center">
                <Text className="text-purple-600 text-xs font-bold">3</Text>
              </View>
              <Text className="text-gray-700 text-sm">Return here and click verify</Text>
            </View>
          </View>

          <Text className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
            Can't find the email? Check your spam folder or{' '}
            <Text 
              className="text-purple-600 font-medium underline"
              onPress={handleResendEmail}
            >
              resend it
            </Text>.
          </Text>

          <View className="mt-6 gap-3">

            {/* Botón I've Verified My Email */}
            <LinearGradient
                colors={['#6A11CB', '#2575FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-xl shadow-md"
                >
                <TouchableOpacity 
                    className="w-full py-3"
                    activeOpacity={0.8}
                    onPress={handleVerificationComplete}
                    disabled={checkingVerification}
                >
                  <Text className="text-white font-semibold text-center">
                    {checkingVerification ? 'Checking...' : "I've Verified My Email"}
                  </Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Botón Resend Verification Email */}
            <TouchableOpacity 
              className={`w-full py-3 border border-purple-600 rounded-xl ${
                isLoading ? 'opacity-50' : ''
              }`}
              activeOpacity={0.8}
              onPress={handleResendEmail}
              disabled={isLoading}
            >
              <Text className="text-purple-600 font-semibold text-center">
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6 items-center">
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-purple-600 font-medium text-sm">
                  Back to Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
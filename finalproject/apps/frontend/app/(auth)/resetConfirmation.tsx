import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ResetConfirmation() {
  const params = useLocalSearchParams();
  const userEmail = params.email || 'your.email@example.com';

  const handleResendEmail = () => {
    console.log('Resending email to:', userEmail);
  };

  const handleTryAgain = () => {
    router.push('/forgotPassword');
  };

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

          <View className="items-center justify-center mb-4 mt-8">
            <View className="w-28 h-28 bg-green-100 rounded-full items-center justify-center">
              <Feather name="check-circle" size={64} color="#10B981" />
            </View>
          </View>

          <Text className="text-gray-900 text-2xl font-bold text-center">
            Check Your Email
          </Text>

          <Text className="text-gray-500 mt-2 text-sm text-center leading-relaxed">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </Text>

          <View className="mt-6 items-center">
            <Text className="text-gray-600 text-sm">Email sent to</Text>
            <Text className="text-gray-900 font-semibold text-sm mt-1">
              {userEmail}
            </Text>
          </View>

          <Text className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
            Didn't receive the email? Check your spam folder or{' '}
            <Text 
              className="text-purple-600 font-medium underline"
              onPress={handleTryAgain}
            >
              try again
            </Text>.
          </Text>

          <View className="mt-6 gap-3">

            <Link href="/login" asChild>
              <TouchableOpacity 
                className="w-full py-3 bg-purple-600 rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-center">
                  Back to Login
                </Text>
                <Feather name="arrow-right" size={16} color="white" />
              </TouchableOpacity>
            </Link>

            <TouchableOpacity 
              className="w-full py-3 border border-purple-600 rounded-xl"
              activeOpacity={0.8}
              onPress={handleResendEmail}
            >
              <Text className="text-purple-600 font-semibold text-center">
                Resend Email
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray-400 text-xs mt-6 text-center">
            The reset link will expire in 1 hour
          </Text>

        </View>
      </View>
    </ScrollView>
  );
}
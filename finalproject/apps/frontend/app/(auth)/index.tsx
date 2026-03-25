import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  return (
    <View className="flex-1 bg-purple-700">
      {/* Contenedor principal con padding consistente */}
      <View className="flex-1 items-center px-6 py-12">
        {/* Contenedor central que agrupa todo el contenido principal */}
        <View className="flex-1 w-full max-w-sm justify-center">
          {/* Logo y eslogan */}
          <View className="items-center gap-3 mb-8">
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />

            <Text className="text-white text-3xl font-bold tracking-tight">
              MindMatch
            </Text>

            <Text className="text-white/80 text-sm tracking-wider">
              Connect Beyond the Surface
            </Text>
          </View>

          {/* Imagen central */}
          <View className="items-center justify-center mb-6">
            <Image
              source={require("../../assets/images/discover.png")}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>

          {/* Textos principales */}
          <View className="gap-4">
            <Text className="text-white text-3xl font-bold text-center leading-tight">
              Discover Your{"\n"}Personality Connection
            </Text>

            <Text className="text-white/70 text-base text-center leading-relaxed">
              Find meaningful relationships based on MBTI compatibility. Because
              understanding each other starts with understanding yourself.
            </Text>
          </View>

          {/* Botones */}
          <View className="w-full items-center gap-3 mt-10">
            <Link href="/signup" asChild>
              <TouchableOpacity className="w-full py-4 bg-white rounded-2xl shadow-lg active:bg-gray-100">
                <Text className="text-purple-700 font-bold text-center text-lg">
                  Get Started
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/login" asChild>
              <TouchableOpacity className="w-full py-4 border-2 border-white/30 rounded-2xl active:bg-white/10">
                <Text className="text-white font-bold text-center text-lg">
                  Log In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Enlaces inferiores */}
        <View className="w-full max-w-sm flex-row justify-between pt-4">
          <TouchableOpacity className="active:opacity-70">
            <Link href="/(dashboard)/" asChild>
              <Text className="text-white/60 text-sm font-medium">
                Demo: MBTI Test
              </Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity className="active:opacity-70">
            <Text className="text-white/60 text-sm font-medium">
              Tech Stack
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="active:opacity-70">
            <Text className="text-white/60 text-sm font-medium">Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

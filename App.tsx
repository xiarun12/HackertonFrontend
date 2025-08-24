import React from 'react';

// react-native-gesture-handler는 항상 최상단에 import 되어야 합니다.
import 'react-native-gesture-handler';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackCardStyleInterpolator } from "@react-navigation/stack";

// --- 스크린 컴포넌트 ---
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RegisterCompleteScreen from "./screens/RegisterCompleteScreen";
import HomeScreen from "./screens/HomeScreen";
import SymptomScreen from "./screens/SymptomScreen";
import BodySelectScreen from "./screens/BodySelectScreen";
import FootSelectScreen from "./screens/FootSelectScreen";
import TrunkSelectScreen from "./screens/TrunkSelectScreen";
import HeadSelectScreen from "./screens/HeadSelectScreen";
import HandSelectScreen from "./screens/HandSelectScreen";
import SymptomChatScreen from "./screens/SymptomChatScreen";
import LoadingScreen from "./screens/LoadingScreen";
import HospitalFinderScreen from "./screens/HospitalFinderScreen";
import EmergencyReportScreen from "./screens/EmergencyReportScreen";
import HospitalDetailScreen from "./screens/HospitalDetailScreen";

// --- 타입 정의 ---

/**
 * 병원 데이터 구조 정의
 */
export interface Hospital {
  id: string;
  name: string;
  hours: string;
  rating: string;
  reviews: number;
  department: string;
  image: string | null;
  latitude: number;
  longitude: number;
  address: string;
  y?: number;         // 좌표 (선택적)
  x?: number;         // 좌표 (선택적)
  distance?: number;  // 거리 (선택적)
}

/**
 * 내비게이션 스택의 스크린과 파라미터 타입 정의
 * undefined: 파라미터가 필요 없는 스크린
 * { key: type }: 파라미터가 필요한 스크린
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  RegisterComplete: undefined;
  Home: undefined;
  Symptom: undefined;
  BodySelect: undefined;
  FootSelect: { bodyPart: string };
  TrunkSelect: { bodyPart: string };
  HeadSelect: { bodyPart: string };
  HandSelect: { bodyPart: string };
  SymptomChat: undefined;
  Loading: {
    symptom: string;
    latitude: number;
    longitude: number;
  };
  HospitalFinder: { recommendedHospitals: Hospital[] };
  HospitalDetail: { hospital: Hospital };
  EmergencyReport: undefined;
};

// --- 내비게이션 설정 ---

const Stack = createStackNavigator<RootStackParamList>();

// 화면 전환 애니메이션 (Fade)
const forFade: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

// 페이드 애니메이션 옵션 객체 (재사용을 위해)
const fadeAnimationOptions = {
  cardStyleInterpolator: forFade,
  transitionSpec: {
    open: { animation: 'timing' as const, config: { duration: 500 } },
    close: { animation: 'timing' as const, config: { duration: 500 } },
  },
};

// --- 메인 앱 컴포넌트 ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* --- 인증 및 기본 플로우 --- */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterComplete" component={RegisterCompleteScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* --- 증상 선택 플로우 (페이드 애니메이션 적용) --- */}
        <Stack.Screen name="Symptom" component={SymptomScreen} options={fadeAnimationOptions} />
        <Stack.Screen name="BodySelect" component={BodySelectScreen} options={fadeAnimationOptions} />
        <Stack.Screen name="FootSelect" component={FootSelectScreen} options={fadeAnimationOptions} />
        <Stack.Screen name="TrunkSelect" component={TrunkSelectScreen} options={fadeAnimationOptions} />
        <Stack.Screen name="HeadSelect" component={HeadSelectScreen} options={fadeAnimationOptions} />
        <Stack.Screen name="HandSelect" component={HandSelectScreen} options={fadeAnimationOptions} />
        <Stack.Screen name="SymptomChat" component={SymptomChatScreen} options={fadeAnimationOptions} />
        
        {/* --- 결과 및 기타 플로우 --- */}
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="HospitalFinder" component={HospitalFinderScreen} />
        <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
        <Stack.Screen name="EmergencyReport" component={EmergencyReportScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
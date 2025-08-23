import * as React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

// 모든 스크린 컴포넌트를 import 합니다.
// 'Hospital' 관련 스크린
import HospitalFinderScreen from "./HospitalFinderScreen";
import EmergencyReportScreen from "./EmergencyReportScreen";
import HospitalDetailScreen from "./HospitalDetailScreen";

// 'Symptom' 관련 스크린
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

// 2. 모든 스크린을 위한 RootStackParamList를 정의합니다.
// 모든 스크린에 대한 타입을 포함하도록 합쳤습니다.
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
  Loading: undefined;
  HospitalFinder: undefined; // Hospital 스크린 추가
  EmergencyReport: undefined; // Emergency 스크린 추가
  HospitalDetailScreen: undefined; // HospitalDetail 스크린 추가
};

const Stack = createStackNavigator<RootStackParamList>();

// 스크린 전환 시 페이드 효과를 위한 옵션
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" // 초기 화면을 Splash 스크린으로 설정
        screenOptions={{
          headerShown: false, // 기본 헤더 숨기기
        }}
      >
        {/* 모든 스크린을 여기에 등록합니다. */}
        
        {/* 'Symptom' 관련 스크린 등록 */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterComplete" component={RegisterCompleteScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Symptom" component={SymptomScreen} />
        <Stack.Screen name="BodySelect" component={BodySelectScreen} options={{ cardStyleInterpolator: forFade }} />
        <Stack.Screen name="FootSelect" component={FootSelectScreen} options={{ cardStyleInterpolator: forFade }} />
        <Stack.Screen name="TrunkSelect" component={TrunkSelectScreen} options={{ cardStyleInterpolator: forFade }} />
        <Stack.Screen name="HeadSelect" component={HeadSelectScreen} options={{ cardStyleInterpolator: forFade }} />
        <Stack.Screen name="HandSelect" component={HandSelectScreen} options={{ cardStyleInterpolator: forFade }} />
        <Stack.Screen name="SymptomChat" component={SymptomChatScreen} options={{ cardStyleInterpolator: forFade }} />
        <Stack.Screen name="Loading" component={LoadingScreen} />

        {/* 'Hospital' 관련 스크린 등록 */}
        <Stack.Screen name="HospitalFinder" component={HospitalFinderScreen} />
        <Stack.Screen name="EmergencyReport" component={EmergencyReportScreen} options={{ title: "긴급 신고" }} />
        <Stack.Screen name="HospitalDetailScreen" component={HospitalDetailScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
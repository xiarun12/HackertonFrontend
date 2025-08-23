import * as React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

// 모든 스크린 컴포넌트를 import 합니다.
// 'Hospital' 관련 스크린
import HospitalFinderScreen from "./screens/HospitalFinderScreen";
import EmergencyReportScreen from "./screens/EmergencyReportScreen";
import HospitalDetailScreen from "./screens/HospitalDetailScreen";

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


// 1. Hospital 데이터 타입을 정의하고 export하여 다른 파일에서도 사용할 수 있게 합니다.
export interface Hospital {
  id: string;
  name: string;
  hours: string;
  rating: string;
  reviews: number;
  department: string;
  image: string | null;
  y: number; // latitude
  x: number; // longitude
  address: string;
  distance: number;
}


// 2. 내비게이션 스택의 모든 스크린과 파라미터 타입을 정의합니다.
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
  HospitalFinder: undefined; 
  EmergencyReport: undefined; 
  // HospitalDetailScreen이 hospital 객체를 파라미터로 받는다고 명시합니다.
  HospitalDetailScreen: { hospital: Hospital };
};

// 3. createStackNavigator에 RootStackParamList를 제네릭으로 전달하여 타입을 적용합니다.
const Stack = createStackNavigator<RootStackParamList>();

// 스크린 전환 시 페이드 효과를 위한 옵션
const forFade = ({ current }: { current: { progress: any } }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

// 4. App 컴포넌트의 타입을 React.FC (Functional Component)로 명시합니다.
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
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
        <Stack.Screen name="EmergencyReport" component={EmergencyReportScreen} />
        <Stack.Screen name="HospitalDetailScreen" component={HospitalDetailScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
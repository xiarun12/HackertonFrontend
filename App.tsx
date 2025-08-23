import React from "react"; 
import 'react-native-gesture-handler'; 
import { NavigationContainer } from "@react-navigation/native"; 
import { createStackNavigator } from "@react-navigation/stack"; 

import SplashScreen from "./screens/SplashScreen"; 
import LoginScreen from "./screens/LoginScreen"; 
import RegisterScreen from "./screens/RegisterScreen"; 
import RegisterCompleteScreen from "./screens/RegisterCompleteScreen"; 
import HomeScreen from "./screens/HomeScreen"; 
import SymptomScreen from "./screens/SymptomScreen"; 

import BodySelectScreen from "./screens/BodySelectScreen"; 
import FootSelectScreen from "./screens/FootSelectScreen"; 
import SymptomChatScreen from "./screens/SymptomChatScreen"; 
import LoadingScreen from "./screens/LoadingScreen"; 

// 1. 새로운 스크린 컴포넌트를 임포트합니다.
import TrunkSelectScreen from "./screens/TrunkSelectScreen"; 
import HeadSelectScreen from "./screens/HeadSelectScreen"; 
import HandSelectScreen from "./screens/HandSelectScreen"; 

// 2. RootStackParamList에 새로운 스크린을 추가합니다.
export type RootStackParamList = { 
  Splash: undefined; 
  Login: undefined; 
  Register: undefined; 
  RegisterComplete: undefined; 
  Home: undefined; 
  Symptom: undefined; 
  BodySelect: undefined; 
  FootSelect: { bodyPart: string }; 
  
  // TrunkSelect, HeadSelect, HandSelect 스크린 추가
  TrunkSelect: { bodyPart: string }; 
  HeadSelect: { bodyPart: string };
  HandSelect: { bodyPart: string };

  SymptomChat: undefined; 
  Loading: undefined; 
}; 

const Stack = createStackNavigator<RootStackParamList>(); 

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export default function App() { 
  return ( 
    <NavigationContainer> 
      <Stack.Navigator 
        initialRouteName="Splash" 
        screenOptions={{ 
          headerShown: false,
        }}
      > 
        <Stack.Screen name="Splash" component={SplashScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Register" component={RegisterScreen} /> 
        <Stack.Screen name="RegisterComplete" component={RegisterCompleteScreen} /> 
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Symptom" component={SymptomScreen} />
        <Stack.Screen 
          name="BodySelect" 
          component={BodySelectScreen} 
          options={{
            cardStyleInterpolator: forFade,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: { duration: 500 },
              },
              close: {
                animation: 'timing',
                config: { duration: 500 },
              },
            },
          }}
        /> 
        <Stack.Screen 
          name="FootSelect" 
          component={FootSelectScreen}
          options={{
            cardStyleInterpolator: forFade,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: { duration: 500 },
              },
              close: {
                animation: 'timing',
                config: { duration: 500 },
              },
            },
          }}
        /> 

        {/* 3. Stack.Navigator에 새로운 스크린을 추가합니다. */}
        <Stack.Screen 
          name="TrunkSelect" 
          component={TrunkSelectScreen}
          options={{
            cardStyleInterpolator: forFade,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: { duration: 500 },
              },
              close: {
                animation: 'timing',
                config: { duration: 500 },
              },
            },
          }}
        />
        <Stack.Screen 
          name="HeadSelect" 
          component={HeadSelectScreen}
          options={{
            cardStyleInterpolator: forFade,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: { duration: 500 },
              },
              close: {
                animation: 'timing',
                config: { duration: 500 },
              },
            },
          }}
        />
        <Stack.Screen 
          name="HandSelect" 
          component={HandSelectScreen}
          options={{
            cardStyleInterpolator: forFade,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: { duration: 500 },
              },
              close: {
                animation: 'timing',
                config: { duration: 500 },
              },
            },
          }}
        />

        <Stack.Screen 
          name="SymptomChat" 
          component={SymptomChatScreen} 
          options={{
            cardStyleInterpolator: forFade,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: { duration: 500 },
              },
              close: {
                animation: 'timing',
                config: { duration: 500 },
              },
            },
          }}
        /> 
        <Stack.Screen name="Loading" component={LoadingScreen} /> 
      </Stack.Navigator> 
    </NavigationContainer> 
  ); 
}
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 1. HospitalDetailScreen을 import 목록에 추가합니다.
import HospitalFinderScreen from "./HospitalFinderScreen";
import EmergencyReportScreen from "./EmergencyReportScreen";
import HospitalDetailScreen from "./HospitalDetailScreen"; // <<< 이 줄을 추가하세요!

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HospitalFinder"
        screenOptions={{
          headerShown: false // 각 화면의 커스텀 헤더를 사용하기 위해 기본 헤더 숨김
        }}
      >
        <Stack.Screen
          name="HospitalFinder"
          component={HospitalFinderScreen}
        />
        <Stack.Screen
          name="EmergencyReport"
          component={EmergencyReportScreen}
          options={{ title: "긴급 신고" }} 
        />
        
        {/* 2. HospitalDetailScreen을 스택 내비게이터에 등록합니다. */}
        <Stack.Screen
          name="HospitalDetailScreen" // navigate 호출 시 사용한 이름과 정확히 일치해야 합니다.
          component={HospitalDetailScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type NavProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const handleStartPress = () => {
    navigation.navigate("BodySelect");
  };

  return (
    <View style={styles.container}>
      {/* 상단 제목 부분 */}
      <Text style={styles.title}>
        증상을 입력하면 AI가{"\n"}
        맞춤 병원을{"\n"}
        찾아드립니다.
      </Text>
      
      {/* '시작하기' 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleStartPress}
      >
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>

      {/* 하단 탭바 부분 */}
      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>🔍</Text>
          <Text style={styles.tabText}>이전 기록 찾기</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={[styles.tabIcon, styles.activeTab]}>🏠</Text>
          <Text style={[styles.tabText, styles.activeTab]}>홈</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>📍</Text>
          <Text style={styles.tabText}>지도</Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { 
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center", 
    marginBottom: 50,
    lineHeight: 35,
  },
  button: {
    backgroundColor: "#0066E4",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: "center",
    width: "33.333%", 
    paddingTop: 10,
    paddingBottom: 5,
  },
  tabIcon: {
    fontSize: 24,
    color: "gray",
  },
  tabText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    textAlign: "center",
  },
  activeTab: {
    color: "#0066E4",
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://43.203.141.216:8080/api";

type Props = {
  navigation: StackNavigationProp<any, any>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  // --- ⬇️ 1. 로딩 상태를 위한 useState 추가 ⬇️ ---
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !pw) {
      Alert.alert("알림", "아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    
    // --- ⬇️ 2. API 요청 시작 시 로딩 상태를 true로 설정 ⬇️ ---
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        userId: id,
        password: pw,
      });

      if (response.status === 200) {
        const { accessToken } = response.data;

        await AsyncStorage.setItem('accessToken', accessToken);
        console.log('Access token saved successfully.');
        
        // Alert.alert 대신 바로 화면 이동 (선택 사항)
        navigation.replace("Home");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
          Alert.alert("로그인 실패", `서버 오류: ${error.response.status}`);
        }
      } else {
        Alert.alert("로그인 실패", "네트워크 오류가 발생했습니다.");
      }
    } finally {
      // --- ⬇️ 3. 요청 완료 시 (성공/실패 모두) 로딩 상태를 false로 설정 ⬇️ ---
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>안녕하세요{"\n"}아프지아냥입니다.</Text>
        <Text style={styles.subtitle}>서비스 이용을 위해 로그인 해주세요.</Text>
      </View>

      <TextInput
        placeholder="아이디"
        value={id}
        onChangeText={setId}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="비밀번호"
        value={pw}
        secureTextEntry
        onChangeText={setPw}
        style={styles.input}
      />

      {/* --- ⬇️ 4. 로딩 상태에 따라 버튼 내용 변경 및 비활성화 ⬇️ --- */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>로그인</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.link}>
        계정이 없으신가요?{" "}
        <Text
          style={styles.boldLink}
          onPress={() => navigation.navigate("Register")}
        >
          회원가입
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    backgroundColor: '#fff', // 배경색 추가
  },
  topSection: {
    marginBottom: 80,
    marginTop: 130,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: { 
    backgroundColor: "#0066E4", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center",
    height: 52, // 버튼 높이 고정
    justifyContent: 'center', // 로딩 인디케이터 중앙 정렬
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 20, color: "gray" },
  boldLink: {
    fontWeight: "bold",
    color: '#333',
  },
});
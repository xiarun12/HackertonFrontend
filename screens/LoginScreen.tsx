import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";

// Updated API URL as per the user's request.
const API_URL = "http://43.203.141.216:8080/api";

type Props = {
  navigation: StackNavigationProp<any, any>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async () => {
    // 1. Validation
    if (!id || !pw) {
      Alert.alert("알림", "아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 2. API Request
    try {
      // The full URL is constructed by combining API_URL and the endpoint '/login'
      const response = await axios.post(`${API_URL}/login`, {
        userId: id,
        password: pw,
      });

      // Request successful (200 OK)
      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        console.log("Login Successful!");
        console.log("accessToken:", accessToken);
        console.log("refreshToken:", refreshToken);

        // TODO: Add logic to save tokens securely (e.g., AsyncStorage)
        
        // Navigate to the 'Home' screen on success
        navigation.replace("Home");
      }
    } catch (error: any) {
      // Handle Axios errors
      if (axios.isAxiosError(error) && error.response) {
        // 401 Unauthorized for incorrect credentials
        if (error.response.status === 401) {
          Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
          // Other server errors
          Alert.alert("로그인 실패", `서버 오류: ${error.response.status}`);
        }
      } else {
        // Network connection errors
        Alert.alert("로그인 실패", "네트워크 오류가 발생했습니다.");
      }
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
      />
      <TextInput
        placeholder="비밀번호"
        value={pw}
        secureTextEntry
        onChangeText={setPw}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
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
  },
  button: { backgroundColor: "#0066E4", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 20, color: "gray" },
  boldLink: {
    fontWeight: "bold",
  },
});

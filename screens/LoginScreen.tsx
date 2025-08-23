import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = { navigation: StackNavigationProp<any, any>; };

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

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

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Home")}>
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

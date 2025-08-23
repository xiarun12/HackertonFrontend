import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = { navigation: StackNavigationProp<any, any>; };

const RegisterCompleteScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.check}>✔</Text>
        <Text style={styles.title}>회원가입이 완료되었습니다.</Text>
        <Text style={styles.subtitle}>아프지아냥을 이용해 주셔서 감사합니다.</Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterCompleteScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentWrapper: {
    alignItems: 'center',
    marginTop: 250,
  },
  check: { 
    fontSize: 60, 
    color: "#0066E4", 
    marginBottom: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 14, 
    color: "gray", 
    marginBottom: 30 
  },
  button: {
    backgroundColor: "#0066E4",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    position: 'absolute', 
    bottom: 50, 
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

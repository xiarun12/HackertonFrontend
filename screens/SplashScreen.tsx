import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
  navigation: StackNavigationProp<any, any>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>아프지아냥</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0066E4",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 150, height: 150, marginBottom: 20, resizeMode: "contain" },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold" },
});

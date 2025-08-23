import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type NavProp = StackNavigationProp<RootStackParamList, "Loading">;

const LoadingScreen = () => {
    const navigation = useNavigation<NavProp>();

    useEffect(() => {
        // 3초 뒤 Home 화면으로 이동
        const timer = setTimeout(() => {
            navigation.replace("Home"); 
        }, 3000);

        return () => clearTimeout(timer); 
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>병원을 찾고 있어요. 잠시만 기다려 주세요.</Text>
            <ActivityIndicator size="large" color="#666" style={{ marginVertical: 20 }} />
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    text: { 
        fontSize: 16, 
        color: "#333", 
        marginBottom: 10,
        fontWeight: "bold"
    },
    loadingText: { fontSize: 14, color: "#666" },
});

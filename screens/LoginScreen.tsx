import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = { navigation: StackNavigationProp<any, any>; };

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    // --- 초기값을 빈 문자열로 수정 ---
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!id || !pw) {
            Alert.alert("알림", "아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch('http://43.203.141.216:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: id,
                    password: pw,
                }),
            });

            if (response.status === 401) {
                throw new Error("아이디 또는 비밀번호를 확인해주세요.");
            }
            
            if (!response.ok) {
                throw new Error("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }

            const data = await response.json();
            const { accessToken } = data;

            if (accessToken) {
                await AsyncStorage.setItem('accessToken', accessToken);
                
                Alert.alert("로그인 성공", `${id}님 환영합니다.`);
                
                navigation.replace("Home");

            } else {
                throw new Error("로그인 토큰을 받지 못했습니다.");
            }

        } catch (error) {
            Alert.alert("로그인 실패", error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
        } finally {
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
        backgroundColor: '#fff',
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
        height: 52,
        justifyContent: 'center',
    },
    buttonText: { 
        color: "#fff", 
        fontSize: 16, 
        fontWeight: "bold" 
    },
    link: { 
        textAlign: "center", 
        marginTop: 20, 
        color: "gray" 
    },
    boldLink: {
        fontWeight: "bold",
        color: '#333',
    },
});
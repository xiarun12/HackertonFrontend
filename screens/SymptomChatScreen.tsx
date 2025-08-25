import React, { useState, useEffect, useRef } from "react";
import {
    View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView,
    ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

// Geolocation 관련 import는 모두 제거합니다.

// --- 타입 정의 ---
interface Hospital {
    id: number | string;
    name: string;
    // ... 이하 다른 타입 정의는 프로젝트에 맞게 유지
}

interface ChatMessage {
    type: 'bot' | 'user';
    content: string;
}

type RootStackParamList = {
    SymptomChat: undefined;
    Loading: {
        symptom: string;
        latitude: Double;
        longitude: Double;
    };
    HospitalFinder: { recommendedHospitals: Hospital[] };
};

type NavProp = StackNavigationProp<RootStackParamList, "SymptomChat">;

// --- 컴포넌트 ---
const SymptomChatScreen = () => {
    const navigation = useNavigation<NavProp>();
    const [message, setMessage] = useState<string>("");
    const [chatLog, setChatLog] = useState<ChatMessage[]>([
        {
            type: "bot",
            content: "안녕하세요, 아프지아냥 챗봇입니다.\n증상이나 궁금한 점을 말씀해 주시면, \n관련 정보를 안내하고 가까운 병원을 추천해 드리겠습니다.",
        },
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatAreaRef = useRef<ScrollView>(null);

    useEffect(() => {
        chatAreaRef.current?.scrollToEnd({ animated: true });
    }, [chatLog]);

    // 메시지 전송 핸들러
    const handleSendMessage = () => {
        if (message.trim().length === 0 || isLoading) return;

        setIsLoading(true);
        const userMessage: ChatMessage = { type: "user", content: message };
        setChatLog(prevChat => [...prevChat, userMessage]);
        setMessage("");

        // --- 📍 범계역 위치 정보 고정 ---
        const BUMGYE_STATION_LATITUDE = 37.3854;
        const BUMGYE_STATION_LONGITUDE = 126.9743;

        // LoadingScreen으로 증상과 고정된 좌표 전달
        navigation.navigate("Loading", {
            symptom: userMessage.content,
            latitude: BUMGYE_STATION_LATITUDE,
            longitude: BUMGYE_STATION_LONGITUDE,
        });
        
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Text style={styles.backButtonText}>{"<"}</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>증상 선택하기</Text>
                <View style={styles.headerSpacer} />
            </View>
            <View style={styles.statusBar}>
                <View style={styles.statusLine} /><View style={styles.statusLine} /><View style={[styles.statusLine, styles.statusLineActive]} />
            </View>
            <View style={styles.stepContainer}>
                <View style={styles.stepTitleWrapper}>
                    <View style={styles.stepCircle}><Text style={styles.stepNumber}>3</Text></View>
                    <Text style={styles.stepText}>증상을{"\n"}말씀해 주세요</Text>
                </View>
            </View>
            
            <ScrollView ref={chatAreaRef} style={styles.chatArea} contentContainerStyle={{ paddingBottom: 10 }}>
                {chatLog.map((chat, index) => (
                    chat.type === 'bot' ? (
                        <View key={index} style={styles.chatContainer}>
                            <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
                            <View>
                                <Text style={styles.botName}>아프지아냥</Text>
                                <View style={styles.chatBubble}><Text style={styles.botMessageBold}>{chat.content}</Text></View>
                            </View>
                        </View>
                    ) : (
                        <View key={index} style={styles.userChatContainer}>
                            <View style={styles.userChatBubble}><Text style={styles.userMessage}>{chat.content}</Text></View>
                        </View>
                    )
                ))}
                {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} size="small" />}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.inputIcon}><Text>📄</Text></TouchableOpacity>
                <TextInput
                    placeholder="아프지아냥에게 무엇이든 물어보세요"
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    editable={!isLoading}
                />
                <TouchableOpacity style={styles.inputIcon}><Text>🎤</Text></TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.sendButtonText}>▲</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};
// ... 기존 스타일 코드 ...
export default SymptomChatScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingHorizontal: 40,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 44,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  statusLine: {
    flex: 1,
    height: 4,
    backgroundColor: "#eee",
    marginHorizontal: 3,
    borderRadius: 2,
  },
  statusLineActive: {
    backgroundColor: "#0066E4",
  },
  stepContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  stepTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0066E4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chatArea: {
    flex: 1,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  userChatContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginBottom: 20,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  chatBubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 8,
    maxWidth: '80%',
  },
  userChatBubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 8,
    maxWidth: '80%',
  },
  botName: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },
  botMessageBold: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  userMessage: {
    fontSize: 12, 
    color: "#333",
    fontWeight: "bold", 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  inputIcon: {
    padding: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#0066E4",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  // 오류 해결을 위해 추가된 부분
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
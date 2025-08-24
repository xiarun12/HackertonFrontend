import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
// 1. AsyncStorage를 import 합니다.
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- 타입 정의 (기존과 동일) ---
interface Hospital {
    id: number | string;
    name: string;
    hours: string;
    rating: string;
    reviews: number;
    department: string;
    image: string | null;
    latitude: number;
    longitude: number;
    address: string;
    y?: number;
    x?: number;
}

type RootStackParamList = {
    SymptomChat: undefined;
    Loading: {
        symptom: string;
        latitude: number;
        longitude: number;
    };
    HospitalFinder: { recommendedHospitals: Hospital[] };
    HospitalDetailScreen: { hospital: Hospital };
};

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;
type LoadingScreenRouteProp = RouteProp<RootStackParamList, 'Loading'>;


// --- 컴포넌트 ---
const LoadingScreen = () => {
    const navigation = useNavigation<LoadingScreenNavigationProp>();
    const route = useRoute<LoadingScreenRouteProp>();
    
    const { symptom, latitude, longitude } = route.params || {};

    useEffect(() => {
        if (!symptom || !latitude || !longitude) {
            Alert.alert(
                "오류", "병원 추천에 필요한 정보가 전달되지 않았습니다.",
                [{ text: "확인", onPress: () => navigation.goBack() }]
            );
            return;
        }

        const fetchHospitals = async () => {
            try {
                // --- 🔐 AsyncStorage에서 토큰 가져오기 ---
                // 2. 'accessToken' 키를 사용해 저장된 토큰을 불러옵니다.
                const userToken = await AsyncStorage.getItem('accessToken');
                
                // 3. 토큰이 없는 경우 (로그인되지 않은 상태) 처리
                if (!userToken) {
                    // 여기서 로그인 화면으로 보내거나, 에러 처리를 할 수 있습니다.
                    throw new Error("로그인이 필요합니다. 인증 토큰을 찾을 수 없습니다.");
                }
                // --- 여기까지 ---

                const response = await fetch('http://43.203.141.216:8080/api/hospitals/recommend', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        // 4. 불러온 userToken을 Authorization 헤더에 담아 전송
                        'Authorization': `Bearer ${userToken}` 
                    },
                    body: JSON.stringify({
                        symptom,
                        latitude,
                        longitude,
                    }),
                });

                if (!response.ok) {
                    const errorResult = await response.json().catch(() => ({ message: "서버 응답 오류" }));
                    throw new Error(errorResult.message || `서버 오류 (코드: ${response.status})`);
                }

                const result = await response.json();

                if (result.data) {
                    const hospitalsData: Hospital[] = result.data.map((hospital: Hospital) => ({
                        ...hospital,
                        id: hospital.id.toString(),
                        y: hospital.latitude,
                        x: hospital.longitude,
                    }));
                    
                    navigation.replace('HospitalFinder', { recommendedHospitals: hospitalsData });
                } else {
                     navigation.replace('HospitalFinder', { recommendedHospitals: [] });
                }

            } catch (error) {
                console.error("API Error:", error);
                Alert.alert(
                    "오류 발생",
                    error instanceof Error ? error.message : "병원 정보를 가져오는 데 실패했습니다.",
                    [{ text: "확인", onPress: () => navigation.goBack() }]
                );
            }
        };

        fetchHospitals();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0066E4" />
            <Text style={styles.loadingText}>
                AI가 증상을 분석하여{'\n'}가까운 병원을 찾고 있어요...
            </Text>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        lineHeight: 28,
    },
});
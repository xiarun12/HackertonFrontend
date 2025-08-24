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
        // 3초 뒤 HospitalFinderScreen 화면으로 이동
        const timer = setTimeout(() => {
            // 여기를 수정했습니다!
            navigation.replace("HospitalFinder"); 
        }, 3000);

        // 화면이 언마운트될 때 타이머를 정리합니다.
        return () => clearTimeout(timer); 
    }, [navigation]);

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
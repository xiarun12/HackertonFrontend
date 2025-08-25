import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, Linking, ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. 병원 이미지를 import 합니다. (경로가 다르면 수정해주세요)
import HospitalImageFile from '../picture/병원.jpg';

const API_BASE_URL = "http://43.203.141.216:8080";

const HospitalDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    
    const { hospital, userLocation } = route.params || {};
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hospital?.id && userLocation?.latitude) {
            fetchHospitalDetails();
        } else {
            Alert.alert("오류", "병원 또는 위치 정보가 올바르지 않습니다.");
            setLoading(false);
        }
    }, [hospital, userLocation]);

    const fetchHospitalDetails = async () => {
        setLoading(true);
        try {
            const userToken = await AsyncStorage.getItem('accessToken');
            if (!userToken) {
                throw new Error("로그인이 필요합니다. 인증 토큰을 찾을 수 없습니다.");
            }

            const { latitude, longitude } = userLocation;
            const url = `${API_BASE_URL}/api/hospitals/${hospital.id}?latitude=${latitude}&longitude=${longitude}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `서버 오류 (${response.status})` }));
                throw new Error(errorData.message || '서버 응답 오류');
            }

            const result = await response.json();
            setDetailData(result);

        } catch (error) {
            Alert.alert("오류", error.message || "병원 상세 정보를 불러오는 데 실패했습니다.");
            setDetailData(null);
        } finally {
            setLoading(false);
        }
    };
    
    const handleCall = () => {
        if (detailData?.phone) {
            Linking.openURL(`tel:${detailData.phone}`).catch(() => {
                Alert.alert("전화 연결 오류", "전화 앱을 열 수 없습니다.");
            });
        } else {
            Alert.alert("알림", "등록된 전화번호가 없습니다.");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066E4" />
                <Text style={styles.loadingText}>상세 정보를 불러오는 중...</Text>
            </SafeAreaView>
        );
    }

    if (!detailData) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>정보를 불러오는 데 실패했습니다.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonSimple}>
                    <Text style={styles.backButtonTextSimple}>뒤로 가기</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const {
        name, address, specialties, holidays, businessHours,
        distanceInKm, phone,
    } = detailData;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    {/* 2. Image source를 import한 파일로 고정합니다. */}
                    <Image source={HospitalImageFile} style={styles.hospitalImage} />
                    
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton}>
                        <Ionicons name="share-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.likeButton}>
                        <Ionicons name="heart-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.hospitalName}>{name}</Text>
                    
                    <Text style={styles.departmentText}>
                      {Array.isArray(specialties) && specialties.length > 0
                        ? specialties.join(', ')
                        : '진료 과목 정보 없음'}
                    </Text>
                    
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#888" />
                        <Text style={styles.locationText}>{distanceInKm ? `${distanceInKm.toFixed(1)}km · ` : ''}{address}</Text>
                    </View>
                    <View style={styles.hoursContainer}>
                        <Ionicons name="time-outline" size={16} color="#888" />
                        <View>
                            <Text style={styles.hoursText}>{businessHours}</Text>
                            <Text style={styles.emergencyHoursText}>휴무일: {holidays || '정보 없음'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.dynamicContent}>
                     <TouchableOpacity style={styles.registerButton} onPress={() => Alert.alert('접수', '바로 접수 페이지로 이동합니다.')}>
                        <Ionicons name="timer-outline" size={24} color="#fff" />
                        <Text style={styles.registerText}>바로 접수하기</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.doubleButton} onPress={handleCall}>
                            <Ionicons name="call-outline" size={24} color="#555" />
                            <Text style={styles.doubleButtonTitle}>전화 문의</Text>
                            <Text style={styles.doubleButtonDesc}>{phone || '번호 없음'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.doubleButton}>
                            <Ionicons name="location-outline" size={24} color="#555" />
                            <Text style={styles.doubleButtonTitle}>위치 안내 및 주차 정보</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HospitalDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
    backButtonSimple: { marginTop: 15, padding: 10 },
    backButtonTextSimple: { color: '#007BFF', fontSize: 16 },
    imageContainer: { width: '100%', height: 250, position: 'relative', backgroundColor: '#e0e0e0' },
    hospitalImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    backButton: { position: 'absolute', top: 40, left: 16, backgroundColor: 'rgba(0,0,0,0.4)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    shareButton: { position: 'absolute', top: 40, right: 66, backgroundColor: 'rgba(0,0,0,0.4)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    likeButton: { position: 'absolute', top: 40, right: 16, backgroundColor: 'rgba(0,0,0,0.4)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    infoSection: { padding: 20, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    hospitalName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    departmentText: { fontSize: 16, color: '#555', fontWeight: '600', marginBottom: 16 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    locationText: { fontSize: 15, color: '#555', marginLeft: 6, flex: 1 },
    hoursContainer: { flexDirection: 'row', alignItems: 'center' },
    hoursText: { fontSize: 15, color: '#333', marginLeft: 6 },
    emergencyHoursText: { fontSize: 13, color: '#888', marginLeft: 6, marginTop: 4 },
    dynamicContent: { padding: 20 },
    registerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007BFF', borderRadius: 10, paddingVertical: 16, marginBottom: 16 },
    registerText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    doubleButton: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 16, marginHorizontal: 6, alignItems: 'flex-start', minHeight: 100 },
    doubleButtonTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 8 },
    doubleButtonDesc: { fontSize: 13, color: '#888', marginTop: 4 },
});
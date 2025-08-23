import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, Linking, ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';

const HospitalDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { hospital } = route.params || {};
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hospital) {
            fetchHospitalDetails();
        } else {
            setLoading(false);
        }
    }, [hospital]);

    const fetchHospitalDetails = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockApiData = {
                currentPatients: 2,
                waitingPatients: 3,
                waitingTime: '15분',
                registrationInfo: '접수 및 서류 안내',
                preRegistration: '문진표 사전 작성/제출',
                preRegistrationDesc: '대기 시간 절약\n현장 작성 불필요',
                insuranceClaim: '보험 · 영수증 간편 청구',
                insuranceClaimDesc: '실손보험 기준 자동 반영\n안전하고 정확한 청구 서비스',
                phone: '02-1234-5678',
                locationInfo: '위치 안내 및 주차 정보',
                openingHours: {
                    daily: '오늘 8:30 ~ 17:30',
                    emergency: '응급센터 00:00 ~ 24:00'
                }
            };
            setDetailData(mockApiData);
        } catch (error) {
            Alert.alert("오류", "병원 상세 정보를 불러오는 데 실패했습니다.");
            setDetailData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCall = () => {
        if (detailData?.phone) {
            Linking.openURL(`tel:${detailData.phone}`).catch(() => {
                Alert.alert("전화 연결 오류", "전화 연결을 할 수 없습니다.");
            });
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>상세 정보를 불러오는 중...</Text>
            </SafeAreaView>
        );
    }

    if (!hospital || !detailData) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>정보를 불러오는 데 실패했습니다.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 15, padding: 10 }}>
                    <Text style={{ color: '#007BFF' }}>뒤로 가기</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 헤더 및 이미지 섹션 */}
                <View style={styles.imageContainer}>
                    {hospital.image ? (
                        <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
                    ) : (
                        // 아이콘이 제거된 단순한 회색 View
                        <View style={[styles.hospitalImage, { backgroundColor: '#cccccc' }]} />
                    )}
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

                {/* 병원 기본 정보 */}
                <View style={styles.infoSection}>
                    <View style={styles.infoTitleContainer}>
                        <MaterialIcons name="local-hospital" size={20} color="#007BFF" />
                        <Text style={styles.infoTitle}>접수</Text>
                    </View>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <View style={styles.reviewContainer}>
                        <Ionicons name="star" size={18} color="#FFD700" />
                        <Text style={styles.ratingText}>{hospital.rating}</Text>
                        <Text style={styles.reviewText}>리뷰 {hospital.reviews} - {hospital.department}</Text>
                    </View>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#888" />
                        <Text style={styles.locationText}>{hospital.distance.toFixed(1)}km · {hospital.address}</Text>
                    </View>
                    <View style={styles.hoursContainer}>
                        <Ionicons name="time-outline" size={16} color="#888" />
                        <View>
                            <Text style={styles.hoursText}>
                                <Text style={{ fontWeight: 'bold' }}>진료 중</Text> · {detailData.openingHours.daily}
                            </Text>
                            <Text style={styles.emergencyHoursText}>응급센터 {detailData.openingHours.emergency}</Text>
                        </View>
                    </View>
                </View>

                {/* API 기반 정보 및 버튼 섹션 (기존과 동일) */}
                <View style={styles.dynamicContent}>
                    <View style={styles.waitingInfoBox}>
                         <Text style={styles.waitingText}>
                            현재 진료: <Text style={{fontWeight: 'bold'}}>{detailData.currentPatients}명</Text> / 대기: <Text style={{fontWeight: 'bold'}}>{detailData.waitingPatients}명</Text>
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.registerButton} onPress={() => Alert.alert('접수', '바로 접수 페이지로 이동합니다.')}>
                        <Ionicons name="timer-outline" size={24} color="#fff" />
                        <Text style={styles.registerText}>바로 접수하기</Text>
                        <Text style={styles.waitingTimeText}>대기 {detailData.waitingPatients}명 · {detailData.waitingTime}</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonGrid}>
                        <TouchableOpacity style={styles.gridButton}>
                            <MaterialIcons name="list-alt" size={24} color="#555" />
                            <Text style={styles.gridButtonText}>내 접수 이력 바로 가기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gridButton}>
                            <Ionicons name="person-add-outline" size={24} color="#555" />
                            <Text style={styles.gridButtonText}>가족 추가 · 대리 예약</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.doubleButton}>
                            <MaterialIcons name="description" size={24} color="#555" />
                            <Text style={styles.doubleButtonTitle}>문진표 사전 작성/제출</Text>
                            <Text style={styles.doubleButtonDesc}>{detailData.preRegistrationDesc}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.doubleButton}>
                            <MaterialIcons name="medical-services-outline" size={24} color="#555" />
                            <Text style={styles.doubleButtonTitle}>보험 · 영수증 간편 청구</Text>
                            <Text style={styles.doubleButtonDesc}>{detailData.insuranceClaimDesc}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.doubleButton} onPress={handleCall}>
                            <Ionicons name="call-outline" size={24} color="#555" />
                            <Text style={styles.doubleButtonTitle}>전화 문의</Text>
                            <Text style={styles.doubleButtonDesc}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.doubleButton}>
                            <Ionicons name="location-outline" size={24} color="#555" />
                            <Text style={styles.doubleButtonTitle}>위치 안내 및 주차 정보</Text>
                            <Text style={styles.doubleButtonDesc}></Text>
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
    imageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
        backgroundColor: '#e0e0e0',
    },
    hospitalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButton: {
        position: 'absolute',
        top: 40,
        right: 66,
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeButton: {
        position: 'absolute',
        top: 40,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoSection: {
        padding: 16,
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoTitleContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e7f3ff', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8, },
    infoTitle: { fontSize: 14, color: '#007BFF', fontWeight: 'bold', marginLeft: 4, },
    hospitalName: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, },
    reviewContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, },
    ratingText: { fontSize: 16, fontWeight: 'bold', marginLeft: 4, },
    reviewText: { fontSize: 14, color: '#888', marginLeft: 8, },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, },
    locationText: { fontSize: 14, color: '#555', marginLeft: 4, },
    hoursContainer: { flexDirection: 'row', alignItems: 'center', },
    hoursText: { fontSize: 14, color: '#333', marginLeft: 4, },
    emergencyHoursText: { fontSize: 12, color: '#888', marginLeft: 4, marginTop: 2, },
    dynamicContent: { padding: 16, },
    waitingInfoBox: { backgroundColor: '#f0f9ff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cceeff', marginBottom: 16, },
    waitingText: { fontSize: 16, color: '#0055aa', fontWeight: 'bold', },
    registerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007BFF', borderRadius: 10, paddingVertical: 16, marginBottom: 16, },
    registerText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8, },
    waitingTimeText: { color: '#fff', fontSize: 14, marginLeft: 10, },
    buttonGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, },
    gridButton: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4, },
    gridButtonText: { fontSize: 14, color: '#555', marginTop: 4, },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 16, },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, },
    doubleButton: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 16, marginHorizontal: 4, alignItems: 'flex-start', },
    doubleButtonTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8, },
    doubleButtonDesc: { fontSize: 12, color: '#888', marginTop: 4, lineHeight: 18, },
});
import React, { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image,
    PermissionsAndroid, Platform, ActivityIndicator, Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

// --- 1. 병원 이미지를 import 합니다. (경로가 다르면 수정해주세요) ---
import HospitalImageFile from '../picture/병원.jpg';


// --- 거리 계산 함수 ---
const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
        return 0;
    }
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// --- HospitalItem 컴포넌트 ---
const HospitalItem = memo(({ hospital, onPress }) => (
    <TouchableOpacity style={styles.hospitalItemContainer} onPress={() => onPress(hospital)}>
        {/* 2. Image source를 import한 파일로 고정합니다. */}
        <Image source={HospitalImageFile} style={styles.hospitalImage} />
        <View style={styles.hospitalDetails}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.hospitalDistance}>
                {typeof hospital.distance === 'number' ? `${hospital.distance.toFixed(1)}km · ` : ''}
                {hospital.address}
            </Text>
            <Text style={styles.hospitalHours}>
                {hospital.businessHours} ({hospital.operatingStatus})
            </Text>
            <View>
                <Text style={styles.recommendationReason}>{hospital.reasonForRecommendation}</Text>
            </View>
        </View>
    </TouchableOpacity>
));


// --- 메인 스크린 컴포넌트 ---
const HospitalFinderScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { recommendedHospitals } = route.params || {};

    const [hospitals, setHospitals] = useState(recommendedHospitals || []);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const mapViewRef = useRef(null);
    const defaultLocation = { latitude: 37.3854, longitude: 126.9743 };

    const requestLocationPermission = async (showAlert = true) => {
        let granted;
        if (Platform.OS === 'android') {
            granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        } else {
            granted = (await Geolocation.requestAuthorization("whenInUse")) === 'granted';
        }

        if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
            getCurrentLocation();
        } else {
            if (showAlert) Alert.alert("권한 거부", "거리 계산을 위해 기본 위치를 사용합니다.");
            setLocation(defaultLocation);
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            ({ coords }) => {
                setLocation({ latitude: coords.latitude, longitude: coords.longitude });
                setLoading(false);
            },
            (error) => {
                console.log(error);
                setLocation(defaultLocation);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };
    
    useFocusEffect(
        useCallback(() => {
            requestLocationPermission(false); 
        }, [])
    );
    
    const hospitalsWithDistance = useMemo(() => {
        if (!location || !hospitals) return [];
        return hospitals.map(hospital => ({
            ...hospital,
            distance: getDistance(location.latitude, location.longitude, hospital.y, hospital.x)
        })).sort((a, b) => a.distance - b.distance);
    }, [hospitals, location]);

    const handleHospitalPress = (hospital) => {
        if (mapViewRef.current && hospital.y && hospital.x) {
            mapViewRef.current.animateToRegion({
                latitude: hospital.y,
                longitude: hospital.x,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
        navigation.navigate('HospitalDetailScreen', { 
            hospital: hospital,
            userLocation: location 
        });
    };

    if (loading && !location) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>위치 정보를 가져오는 중...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>병원 찾기</Text>
                <TouchableOpacity
                    style={[styles.headerButton, styles.emergencyButton]}
                    // 3. 응급실 버튼 클릭 시 EmergencyReportScreen으로 이동하도록 수정
                    onPress={() => navigation.navigate('EmergencyReport')}
                >
                    <Ionicons name="alert-circle-outline" size={20} color="#fff" />
                    <Text style={styles.emergencyText}>응급실</Text>
                </TouchableOpacity>
            </View>
            {location && (
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapViewRef}
                        style={StyleSheet.absoluteFill}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                    >
                        {hospitalsWithDistance.map(hospital => 
                            (hospital.y && hospital.x) && (
                                <Marker
                                    key={hospital.id.toString()}
                                    coordinate={{ latitude: hospital.y, longitude: hospital.x }}
                                    title={hospital.name}
                                />
                            )
                        )}
                    </MapView>
                </View>
            )}
            <View style={styles.filterContainer}>
                {['내 주변', '진료과', '접수', '대기 중', '야간 진료'].map((filter) => (
                    <TouchableOpacity key={filter} style={styles.filterButton}>
                        <Text style={styles.filterText}>{filter}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {hospitalsWithDistance && hospitalsWithDistance.length > 0 ? (
                <FlatList
                    data={hospitalsWithDistance}
                    renderItem={({ item }) => <HospitalItem hospital={item} onPress={handleHospitalPress} />}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContentContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>추천 병원 정보가 없습니다.</Text>
                    <Text style={styles.emptySubText}>증상을 다시 입력하시거나, 관리자에게 문의해주세요.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default HospitalFinderScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerButton: { minWidth: 40, justifyContent: 'center', alignItems: 'center' },
    emergencyButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e74c3c', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, minWidth: 80 },
    emergencyText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
    mapContainer: { width: '100%', height: 280 },
    filterContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f9f9f9' },
    filterButton: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
    filterText: { color: '#555' },
    listContentContainer: { paddingBottom: 20 },
    hospitalItemContainer: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    hospitalImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16, backgroundColor: '#f0f0f0' },
    hospitalDetails: { flex: 1, justifyContent: 'center' },
    hospitalName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    hospitalDistance: { fontSize: 14, color: '#888', marginBottom: 2 },
    hospitalHours: { fontSize: 14, color: '#333', marginBottom: 4 },
    recommendationReason: { fontSize: 13, color: '#0066E4', fontWeight: 'bold', marginTop: 4 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 8, },
    emptySubText: { fontSize: 14, color: '#888', textAlign: 'center', },
});
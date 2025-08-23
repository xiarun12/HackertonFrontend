import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image,
    PermissionsAndroid, Platform, ActivityIndicator, Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

// --- 유틸리티 함수: 두 지점 간의 거리 계산 (Haversine formula) ---
const getDistance = (lat1, lon1, lat2, lon2) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344; // km 단위
    return dist;
}

// --- HospitalItem 컴포넌트 (수정된 버전) ---
const HospitalItem = memo(({ hospital, onPress }) => (
    <TouchableOpacity style={styles.hospitalItemContainer} onPress={() => onPress(hospital)}>
        {hospital.image ? (
            <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
        ) : (
            // 이미지가 없는 경우, require 대신 View로 회색 박스를 표시
            <View style={styles.hospitalImage} />
        )}
        <View style={styles.hospitalDetails}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.hospitalDistance}>{hospital.distance.toFixed(1)}km · {hospital.address}</Text>
            <Text style={styles.hospitalHours}>{hospital.hours}</Text>
            <View style={styles.reviewContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.hospitalRating}>{hospital.rating}</Text>
                <Text style={styles.hospitalReviews}>리뷰 {hospital.reviews} - {hospital.department}</Text>
            </View>
        </View>
    </TouchableOpacity>
));


// --- 메인 스크린 컴포넌트 ---
const HospitalFinderScreen = () => {
    const navigation = useNavigation();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const mapViewRef = useRef(null); // MapView 제어를 위한 ref

    // 서울 시청 기본 좌표
    const defaultLocation = { latitude: 37.5665, longitude: 126.9780 };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        let granted;
        if (Platform.OS === 'android') {
            granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "위치 정보 권한",
                    message: "주변 병원 정보를 확인하려면 위치 정보 권한이 필요합니다.",
                    buttonNeutral: "나중에",
                    buttonNegative: "거부",
                    buttonPositive: "허용"
                }
            );
        } else {
            const status = await Geolocation.requestAuthorization("whenInUse");
            granted = status === 'granted';
        }

        if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
            getCurrentLocation();
        } else {
            Alert.alert("권한 거부", "위치 정보 권한이 거부되어 기본 위치로 지도를 표시합니다.");
            setLocation(defaultLocation);
            fetchHospitals(defaultLocation); // 기본 위치로 병원 정보 로드
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            ({ coords }) => {
                const currentLocation = { latitude: coords.latitude, longitude: coords.longitude };
                setLocation(currentLocation);
                fetchHospitals(currentLocation); // 현재 위치로 병원 정보 로드
            },
            (error) => {
                console.log(error);
                Alert.alert("위치 오류", "현재 위치를 가져올 수 없습니다. 기본 위치로 설정합니다.");
                setLocation(defaultLocation);
                fetchHospitals(defaultLocation);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const fetchHospitals = async (currentLocation) => {
        setLoading(true);
        try {
            // API 호출을 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));
            const hospitalData = [
                { id: '1', name: '안양샘병원', hours: '진료 중 · 매주 일요일 휴진', rating: '5.0', reviews: 301, department: '정형외과', image: 'https://placehold.co/600x400', y: 37.579, x: 126.975, address: '안양 한안구 안양동' },
                { id: '2', name: '시대병원', hours: '진료 중 · 매주 일요일 휴진', rating: '4.9', reviews: 193, department: '정형외과', image: null, y: 37.565, x: 126.985, address: '안양 한안구 호계동' },
                { id: '3', name: '안양일심정병원', hours: '진료 중 · 매주 일요일 휴진', rating: '4.7', reviews: 107, department: '정형외과', image: 'https://placehold.co/600x400', y: 37.558, x: 126.978, address: '안양 한안구 안양동' },
            ];
            setHospitals(hospitalData);
        } catch (error) {
            Alert.alert("오류", "병원 데이터를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 사용자 위치나 병원 목록이 바뀔 때만 거리를 다시 계산 (성능 최적화)
    const hospitalsWithDistance = useMemo(() => {
        if (!location) return [];
        return hospitals.map(hospital => ({
            ...hospital,
            distance: getDistance(location.latitude, location.longitude, hospital.y, hospital.x)
        })).sort((a, b) => a.distance - b.distance); // 가까운 순으로 정렬
    }, [hospitals, location]);


    // 리스트에서 병원 선택 시 지도 이동 및 상세 페이지 이동
    const handleHospitalPress = (hospital) => {
        if (mapViewRef.current) {
            mapViewRef.current.animateToRegion({
                latitude: hospital.y,
                longitude: hospital.x,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000); // 1초 동안 부드럽게 이동
        }
        navigation.navigate('HospitalDetailScreen', { hospital });
    };

    if (!location) {
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
                    onPress={() => navigation.navigate('EmergencyReport')}
                >
                    <Ionicons name="alert-circle-outline" size={20} color="#fff" />
                    <Text style={styles.emergencyText}>응급실</Text>
                </TouchableOpacity>
            </View>
            
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
                    {hospitalsWithDistance.map(hospital => (
                        <Marker
                            key={hospital.id}
                            coordinate={{ latitude: hospital.y, longitude: hospital.x }}
                            title={hospital.name}
                            description={hospital.department}
                        />
                    ))}
                </MapView>
            </View>
            
            <View style={styles.filterContainer}>
                {['내 주변', '진료과', '접수', '대기 중', '야간 진료'].map((filter) => (
                    <TouchableOpacity key={filter} style={styles.filterButton}>
                        <Text style={styles.filterText}>{filter}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={hospitalsWithDistance}
                    renderItem={({ item }) => <HospitalItem hospital={item} onPress={handleHospitalPress} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContentContainer}
                />
            )}
        </SafeAreaView>
    );
};

export default HospitalFinderScreen;

// --- 스타일 (동일) ---
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
    reviewContainer: { flexDirection: 'row', alignItems: 'center' },
    hospitalRating: { fontSize: 14, color: '#555', marginLeft: 4 },
    hospitalReviews: { fontSize: 14, color: '#888', marginLeft: 4 },
});
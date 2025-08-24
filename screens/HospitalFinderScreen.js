import React, { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image,
    PermissionsAndroid, Platform, ActivityIndicator, Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

// --- 유틸리티 함수: 거리 계산 ---
const getDistance = (lat1, lon1, lat2, lon2) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) { dist = 1; }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;
    return dist;
}

// --- HospitalItem 컴포넌트 ---
const HospitalItem = memo(({ hospital, onPress }) => (
    <TouchableOpacity style={styles.hospitalItemContainer} onPress={() => onPress(hospital)}>
        {hospital.image ? (
            <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
        ) : (
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
    const route = useRoute();
    
    const { recommendedHospitals } = route.params || {};

    const [hospitals, setHospitals] = useState(recommendedHospitals || []);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const mapViewRef = useRef(null);
    const defaultLocation = { latitude: 37.5665, longitude: 126.9780 };

    const refreshData = async () => {
        console.log("데이터를 새로고침합니다...");
        requestLocationPermission();

        try {
            const updatedHospitals = hospitals.map(h => ({
                ...h,
                reviews: (h.reviews || 0) + Math.floor(Math.random() * 2), 
            }));
            setHospitals(updatedHospitals);
        } catch (error) {
            console.error("데이터 새로고침 중 오류 발생:", error);
        }
    };
    
    useFocusEffect(
        useCallback(() => {
            if (!location) {
                requestLocationPermission();
            }

            const intervalId = setInterval(refreshData, 15000);

            return () => {
                console.log("화면 벗어남. 새로고침 중단.");
                clearInterval(intervalId);
            };
        }, [location])
    );

    const requestLocationPermission = async () => {
        let granted;
        if (Platform.OS === 'android') {
            granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        } else {
            granted = (await Geolocation.requestAuthorization("whenInUse")) === 'granted';
        }

        if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
            getCurrentLocation();
        } else {
            if (location == null) Alert.alert("권한 거부", "위치 정보 권한이 거부되어 기본 위치로 지도를 표시합니다.");
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
                if (location == null) Alert.alert("위치 오류", "현재 위치를 가져올 수 없습니다. 기본 위치로 설정합니다.");
                setLocation(defaultLocation);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };
    
    const hospitalsWithDistance = useMemo(() => {
        if (!location || !hospitals) return [];
        return hospitals.map(hospital => ({
            ...hospital,
            distance: getDistance(location.latitude, location.longitude, hospital.y, hospital.x)
        })).sort((a, b) => a.distance - b.distance);
    }, [hospitals, location]);

    const handleHospitalPress = (hospital) => {
        if (mapViewRef.current) {
            mapViewRef.current.animateToRegion({
                latitude: hospital.y,
                longitude: hospital.x,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
        navigation.navigate('HospitalDetailScreen', { hospital });
    };

    if (loading) {
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
                     onPress={() => { /* 응급실 로직 */ }}
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
                    region={{
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
            
            {hospitalsWithDistance && hospitalsWithDistance.length > 0 ? (
                <FlatList
                    data={hospitalsWithDistance}
                    renderItem={({ item }) => <HospitalItem hospital={item} onPress={handleHospitalPress} />}
                    keyExtractor={item => item.id}
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
    reviewContainer: { flexDirection: 'row', alignItems: 'center' },
    hospitalRating: { fontSize: 14, color: '#555', marginLeft: 4 },
    hospitalReviews: { fontSize: 14, color: '#888', marginLeft: 4 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 8, },
    emptySubText: { fontSize: 14, color: '#888', textAlign: 'center', },
});
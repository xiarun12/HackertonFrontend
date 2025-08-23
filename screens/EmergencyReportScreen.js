import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// 가상의 로딩바 컴포넌트
const ProgressBar = ({ progress }) => {
    return (
        <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, { width: progress }]} />
        </View>
    );
};

const EmergencyReportScreen = () => {
    const navigation = useNavigation();
    const [pageIndex, setPageIndex] = useState(0);
    // 애니메이션 값을 useRef로 관리하여 불필요한 리렌더링 방지
    // (카드 너비 90% * 프로그레스바 너비 80%)
    const progress = useRef(new Animated.Value(Dimensions.get('window').width * 0.9 * 0.8)).current;

    useEffect(() => {
        let timer;
        // 페이지 2 (신고 접수 중)
        if (pageIndex === 1) {
            timer = setTimeout(() => {
                setPageIndex(2);
            }, 3000); // 3초 후 다음 페이지로 이동
        }

        // 페이지 3 (곧 119 연결)
        if (pageIndex === 2) {
            Animated.timing(progress, {
                toValue: 0,
                duration: 5000,
                useNativeDriver: false, // width 애니메이션은 네이티브 드라이버 미지원
            }).start(() => {
                setPageIndex(3);
                // 실제 앱에서는 여기에 119 자동 전화 연결 로직을 구현합니다.
            });
        }
        
        // 컴포넌트가 언마운트될 때 타이머 정리
        return () => clearTimeout(timer);
    }, [pageIndex, progress]);

    const handleConfirm = () => {
        navigation.goBack();
    };

    const renderPage = () => {
        switch (pageIndex) {
            case 0:
                return (
                    <View style={styles.card}>
                        <Ionicons name="alert-circle" size={60} color="#e74c3c" />
                        <Text style={styles.cardTitle}>현재 위급한 상황입니까?</Text>
                        <Text style={styles.cardDescription}>
                            동의 후 신고 시 119로 자동 접수됩니다.
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.cardButton, styles.cancelButton]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={[styles.buttonText, { color: '#000' }]}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.cardButton, styles.confirmButton]}
                                onPress={() => setPageIndex(1)}
                            >
                                <Text style={styles.buttonText}>동의 후 신고</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 1:
                return (
                    <View style={styles.card}>
                        <Ionicons name="sync-circle" size={60} color="#e74c3c" />
                        <Text style={styles.cardTitle}>신고 접수 중...</Text>
                        <Text style={styles.cardDescription}>
                            119 연결까지 잠시만 기다려주세요.
                        </Text>
                    </View>
                );
            case 2:
                const progressInterpolate = progress.interpolate({
                    inputRange: [0, Dimensions.get('window').width * 0.9 * 0.8],
                    outputRange: ['0%', '100%']
                });
                return (
                    <View style={styles.card}>
                        <Ionicons name="call" size={60} color="#e74c3c" />
                        <Text style={styles.cardTitle}>곧 119로 연결됩니다.</Text>
                        <Text style={styles.cardDescription}>
                            통화가 종료되면 앱으로 돌아옵니다.
                        </Text>
                        <ProgressBar progress={progressInterpolate} />
                    </View>
                );
            case 3:
                return (
                    <View style={styles.card}>
                        <Ionicons name="checkmark-circle" size={60} color="#2ecc71" />
                        <Text style={styles.cardTitle}>신고가 완료되었습니다.</Text>
                        <TouchableOpacity style={styles.finalButton} onPress={handleConfirm}>
                            <Text style={styles.finalButtonText}>가까운 응급실 보기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.finalButton} onPress={handleConfirm}>
                            <Text style={styles.finalButtonText}>지도 보기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.finalButton, { backgroundColor: '#e74c3c' }]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.buttonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {pageIndex === 0 && ( // 첫 페이지에서만 뒤로가기 버튼 표시
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.content}>
                {renderPage()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    header: {
        padding: 16,
        height: 60, // 레이아웃 변경 방지를 위한 고정 높이
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    cardButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#eee',
    },
    confirmButton: {
        backgroundColor: '#e74c3c',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    progressBarContainer: {
        height: 5,
        width: '80%',
        backgroundColor: '#eee',
        borderRadius: 5,
        marginTop: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#e74c3c',
        borderRadius: 5,
    },
    finalButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#eee',
        marginTop: 10,
    },
    finalButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EmergencyReportScreen;
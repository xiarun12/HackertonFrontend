// src/api/apiClient.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. axios 인스턴스 생성 (전용 배달원 만들기)
const apiClient = axios.create({
  baseURL: 'http://43.203.141.216:8080/api', // 서버 주소 미리 알려주기
});

// 2. 요청 인터셉터 설정 (배달 가기 전 항상 할 일 정해주기)
apiClient.interceptors.request.use(
  async (config) => {
    // 지갑(AsyncStorage)에서 신분증(토큰)을 꺼낸다.
    const token = await AsyncStorage.getItem('accessToken');
    
    // 신분증이 있으면 목에 건다 (헤더에 추가).
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 잘 만들어진 배달원을 다른 곳에서도 쓸 수 있게 내보내기
export default apiClient;
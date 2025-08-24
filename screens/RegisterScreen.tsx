import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";

// 베이스 API URL을 상수로 분리하여 관리합니다.
// 이렇게 하면 서버 주소가 변경될 때 여기만 수정하면 됩니다.
const BASE_API_URL = "http://43.203.141.216:8080/api";

type Props = {
  navigation: StackNavigationProp<any, any>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [isPwVisible, setIsPwVisible] = useState(false);
  const [isPwConfirmVisible, setIsPwConfirmVisible] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    thirdParty: false,
  });

  // API 연동을 위한 상태 추가
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  const handleAllAgree = () => {
    const newAllState = !agreements.all;
    setAgreements({
      all: newAllState,
      terms: newAllState,
      privacy: newAllState,
      thirdParty: newAllState,
    });
  };

  const handleAgree = (key: keyof typeof agreements) => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };
    const allAgreed = newAgreements.terms && newAgreements.privacy && newAgreements.thirdParty;
    setAgreements({ ...newAgreements, all: allAgreed });
  };

  // 아이디 중복 확인 핸들러 (GET 요청 - URL 수정)
  const handleIdCheck = async () => {
    if (!id) {
      setIdCheckMessage("아이디를 입력해주세요.");
      setIsIdAvailable(false);
      return;
    }

    try {
      // '/user/{userid}' 엔드포인트로 GET 요청을 보냅니다.
      await axios.get(`${BASE_API_URL}/user/${id}`);

      // 요청이 성공하면 (200 OK) 아이디가 이미 있는 것이므로 실패 처리합니다.
      setIdCheckMessage("이미 사용 중인 아이디입니다.");
      setIsIdAvailable(false);

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // 404 오류가 발생하면 아이디가 없는 것이므로 성공 처리합니다.
        if (error.response.status === 404) {
          setIdCheckMessage("사용 가능한 아이디입니다.");
          setIsIdAvailable(true);
        } else {
          // 404 이외의 다른 서버 오류
          setIdCheckMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
          setIsIdAvailable(false);
        }
      } else {
        // 네트워크 오류 등 기타 오류
        setIdCheckMessage("네트워크 오류가 발생했습니다.");
        setIsIdAvailable(false);
      }
    }
  };

  // 회원가입 최종 제출 핸들러 (POST 요청)
  const handleRegister = async () => {
    // 1. 유효성 검사
    if (!name || !id || !pw || !pwConfirm) {
      Alert.alert("알림", "모든 필드를 입력해주세요.");
      return;
    }

    if (pw !== pwConfirm) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isIdAvailable) {
      Alert.alert("알림", "아이디 중복 확인을 해주세요.");
      return;
    }

    if (!agreements.terms || !agreements.privacy || !agreements.thirdParty) {
      Alert.alert("알림", "필수 약관에 모두 동의해야 합니다.");
      return;
    }

    // 2. API 요청 (회원가입은 '/register' 엔드포인트로 POST 요청)
    try {
      const response = await axios.post(`${BASE_API_URL}/register`, {
        userId: id,
        password: pw,
        password2: pwConfirm,
        nickname: name,
      });

      // 요청 성공 (200 OK)
      if (response.status === 200) {
        Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.");
        navigation.replace("RegisterComplete");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          Alert.alert("회원가입 실패", "이미 사용 중인 아이디입니다.");
        } else {
          Alert.alert("회원가입 실패", `서버 오류: ${error.response.status}`);
        }
      } else {
        Alert.alert("회원가입 실패", "네트워크 오류가 발생했습니다.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입을 위해{"\n"}정보를 입력해주세요.</Text>

      <TextInput placeholder="이름" style={styles.input} value={name} onChangeText={setName} />

      <View style={styles.inputWithButton}>
        <TextInput placeholder="아이디" style={styles.inputFlex} value={id} onChangeText={setId} />
        <TouchableOpacity style={styles.idCheckButton} onPress={handleIdCheck}>
          <Text style={styles.idCheckButtonText}>중복 확인</Text>
        </TouchableOpacity>
      </View>
      {idCheckMessage ? (
        <Text style={[styles.messageText, isIdAvailable ? styles.successText : styles.errorText]}>
          {idCheckMessage}
        </Text>
      ) : null}

      <View style={styles.inputWithIcon}>
        <TextInput
          placeholder="비밀번호"
          style={styles.inputFlex}
          value={pw}
          secureTextEntry={!isPwVisible}
          onChangeText={setPw}
        />
        <TouchableOpacity
          onPressIn={() => setIsPwVisible(true)}
          onPressOut={() => setIsPwVisible(false)}
        >
          <Text style={styles.icon}>{isPwVisible ? '👁️' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWithIcon}>
        <TextInput
          placeholder="비밀번호 확인"
          style={styles.inputFlex}
          value={pwConfirm}
          secureTextEntry={!isPwConfirmVisible}
          onChangeText={setPwConfirm}
        />
        <TouchableOpacity
          onPressIn={() => setIsPwConfirmVisible(true)}
          onPressOut={() => setIsPwConfirmVisible(false)}
        >
          <Text style={styles.icon}>{isPwConfirmVisible ? '👁️' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.agreementSection}>
        <TouchableOpacity style={styles.checkboxContainer} onPress={handleAllAgree}>
          <View style={[styles.checkbox, agreements.all && styles.checkboxActive]}>
            {agreements.all && <Text style={styles.checkIcon}>✔</Text>}
          </View>
          <Text style={[styles.agreementText, styles.boldText]}>모든 약관에 동의합니다.</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.requiredText}>* 필수 항목</Text>

        <TouchableOpacity style={styles.checkboxContainer} onPress={() => handleAgree("terms")}>
          <View style={[styles.checkbox, agreements.terms && styles.checkboxActive]}>
            {agreements.terms && <Text style={styles.checkIcon}>✔</Text>}
          </View>
          <Text style={[styles.agreementText, styles.boldText]}>이용약관에 동의합니다. *</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => handleAgree("privacy")}>
          <View style={[styles.checkbox, agreements.privacy && styles.checkboxActive]}>
            {agreements.privacy && <Text style={styles.checkIcon}>✔</Text>}
          </View>
          <Text style={[styles.agreementText, styles.boldText]}>개인 정보 수집 및 이용에 동의합니다. *</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => handleAgree("thirdParty")}>
          <View style={[styles.checkbox, agreements.thirdParty && styles.checkboxActive]}>
            {agreements.thirdParty && <Text style={styles.checkIcon}>✔</Text>}
          </View>
          <Text style={[styles.agreementText, styles.boldText]}>개인정보의 제3자 제공에 동의합니다. *</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>이 약관에 동의하지 않을 수 있지만, 그럴 경우 아프지아냥 계정에 로그인할 수 없으며 새로운 계정을 생성할 수도 없습니다.</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={handleRegister}>
          <Text style={styles.continueButtonText}>계속</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  inputWithButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 5,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  inputFlex: {
    flex: 1,
    padding: 12,
  },
  idCheckButton: {
    backgroundColor: "#0066E4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginRight: 0,
    marginLeft: 10,
    justifyContent: "center",
  },
  idCheckButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  icon: {
    fontSize: 20,
    color: "gray",
    marginHorizontal: 10,
  },
  agreementSection: {
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: "#0066E4",
    borderColor: "#0066E4",
  },
  checkIcon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  agreementText: {
    fontSize: 12,
    color: "gray",
  },
  boldText: {
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  requiredText: {
    color: "gray",
    marginBottom: 10,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 10,
    color: "gray",
    marginTop: 20,
    lineHeight: 1.8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: 80,
    marginRight: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#0066E4",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: 80,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
  },
  successText: {
    color: "green",
  },
  errorText: {
    color: "red",
  },
});

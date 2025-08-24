import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = { navigation: StackNavigationProp<any, any>; };

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    // --- 초기값을 빈 문자열로 수정 ---
    const [name, setName] = useState(""); // 닉네임
    const [id, setId] = useState(""); // 아이디
    const [pw, setPw] = useState(""); // 비밀번호
    const [pwConfirm, setPwConfirm] = useState(""); // 비밀번호 확인

    const [isCheckingId, setIsCheckingId] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const [isPwVisible, setIsPwVisible] = useState(false);
    const [isPwConfirmVisible, setIsPwConfirmVisible] = useState(false);
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        thirdParty: false,
    });

    useEffect(() => {
        if (pwConfirm && pw !== pwConfirm) {
            setPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setPasswordError("");
        }
    }, [pw, pwConfirm]);

    const handleIdChange = (text: string) => {
        setId(text);
        setIsIdAvailable(null);
    };

    const handleIdCheck = async () => {
        if (!id) {
            Alert.alert("알림", "아이디를 입력해주세요.");
            return;
        }
        setIsCheckingId(true);
        try {
            const response = await fetch(`http://43.203.141.216:8080/user/${id}`);
            if (response.status === 404) {
                setIsIdAvailable(true);
                Alert.alert("성공", "사용 가능한 아이디입니다.");
            } else if (response.ok) {
                setIsIdAvailable(false);
                Alert.alert("실패", "이미 사용 중인 아이디입니다.");
            } else {
                throw new Error("서버 응답 오류");
            }
        } catch (error) {
            Alert.alert("오류", "아이디 중복 확인 중 오류가 발생했습니다.");
        } finally {
            setIsCheckingId(false);
        }
    };

    const handleRegister = async () => {
        if (!name || !id || !pw || !pwConfirm) {
            return Alert.alert("알림", "모든 정보를 입력해주세요.");
        }
        if (isIdAvailable !== true) {
            return Alert.alert("알림", "아이디 중복 확인을 완료해주세요.");
        }
        if (passwordError) {
            return Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
        }
        if (!agreements.terms || !agreements.privacy || !agreements.thirdParty) {
            return Alert.alert("알림", "필수 약관에 모두 동의해주세요.");
        }

        setIsSubmitting(true);
        try {
            const registerResponse = await fetch('http://43.203.141.216:8080/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: id,
                    password: pw,
                    password2: pwConfirm,
                    nickname: name,
                }),
            });

            if (registerResponse.status === 409) {
                throw new Error("이미 가입된 아이디입니다.");
            }
            if (!registerResponse.ok) {
                throw new Error("회원가입에 실패했습니다.");
            }
            
            const loginResponse = await fetch('http://43.203.141.216:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: id,
                    password: pw,
                }),
            });

            if (!loginResponse.ok) {
                throw new Error("회원가입 후 자동 로그인에 실패했습니다.");
            }

            const loginData = await loginResponse.json();
            const { accessToken } = loginData;

            if (!accessToken) {
                throw new Error("로그인 토큰을 받지 못했습니다.");
            }

            await AsyncStorage.setItem('accessToken', accessToken);

            Alert.alert("성공", "회원가입 및 로그인이 완료되었습니다.");
            navigation.replace("RegisterComplete");

        } catch (error) {
            Alert.alert("오류", error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAllAgree = () => {
        const newAllState = !agreements.all;
        setAgreements({ all: newAllState, terms: newAllState, privacy: newAllState, thirdParty: newAllState });
    };

    const handleAgree = (key: keyof typeof agreements) => {
        const newAgreements = { ...agreements, [key]: !agreements[key] };
        const allAgreed = newAgreements.terms && newAgreements.privacy && newAgreements.thirdParty;
        setAgreements({ ...newAgreements, all: allAgreed });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>회원가입을 위해{"\n"}정보를 입력해주세요.</Text>

            <TextInput placeholder="닉네임" style={styles.input} value={name} onChangeText={setName} />
            
            <View style={styles.inputWithButton}>
                <TextInput placeholder="아이디" style={styles.inputFlex} value={id} onChangeText={handleIdChange} autoCapitalize="none" />
                <TouchableOpacity style={styles.idCheckButton} onPress={handleIdCheck} disabled={isCheckingId}>
                    {isCheckingId ? <ActivityIndicator color="#fff" /> : <Text style={styles.idCheckButtonText}>중복 확인</Text>}
                </TouchableOpacity>
            </View>
            {isIdAvailable === true && <Text style={styles.successText}>사용 가능한 아이디입니다.</Text>}
            {isIdAvailable === false && <Text style={styles.errorText}>이미 사용 중인 아이디입니다.</Text>}

            <View style={styles.inputWithIcon}>
                <TextInput placeholder="비밀번호" style={styles.inputFlex} value={pw} secureTextEntry={!isPwVisible} onChangeText={setPw} />
                <TouchableOpacity onPressIn={() => setIsPwVisible(true)} onPressOut={() => setIsPwVisible(false)}>
                    <Text style={styles.icon}>👁</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.inputWithIcon}>
                <TextInput placeholder="비밀번호 확인" style={styles.inputFlex} value={pwConfirm} secureTextEntry={!isPwConfirmVisible} onChangeText={setPwConfirm} />
                <TouchableOpacity onPressIn={() => setIsPwConfirmVisible(true)} onPressOut={() => setIsPwConfirmVisible(false)}>
                    <Text style={styles.icon}>👁</Text>
                </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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
                <TouchableOpacity style={styles.continueButton} onPress={handleRegister} disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.continueButtonText}>계속</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingHorizontal: 40, backgroundColor: "#fff", paddingTop: 80, paddingBottom: 40, },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 40, },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    inputWithButton: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 5, },
    inputWithIcon: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 5, },
    inputFlex: { flex: 1, padding: 12, fontSize: 16 },
    idCheckButton: { backgroundColor: "#0066E4", borderRadius: 8, paddingVertical: 14, paddingHorizontal: 15, marginRight: 0, marginLeft: 10, justifyContent: "center", height: 50 },
    idCheckButtonText: { color: "#fff", fontWeight: "bold", },
    icon: { fontSize: 24, color: "gray", paddingHorizontal: 10, },
    agreementSection: { marginTop: 20, },
    checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10, },
    checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "gray", borderRadius: 4, justifyContent: "center", alignItems: "center", marginRight: 10, },
    checkboxActive: { backgroundColor: "#0066E4", borderColor: "#0066E4", },
    checkIcon: { color: "#fff", fontSize: 14, fontWeight: "bold", },
    agreementText: { fontSize: 12, color: "gray", },
    boldText: { fontWeight: "bold", },
    divider: { height: 1, backgroundColor: "#eee", marginVertical: 10, },
    requiredText: { color: "gray", marginBottom: 10, fontWeight: "bold", fontSize: 12 },
    infoText: { fontSize: 10, color: "gray", marginTop: 20, lineHeight: 18, },
    buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 30, marginBottom: 20, },
    backButton: { backgroundColor: "#eee", paddingVertical: 15, paddingHorizontal: 15, borderRadius: 8, width: 80, marginRight: 10, alignItems: "center", },
    backButtonText: { color: "#000", fontWeight: "bold", },
    continueButton: { backgroundColor: "#0066E4", paddingVertical: 15, paddingHorizontal: 15, borderRadius: 8, width: 80, alignItems: "center", },
    continueButtonText: { color: "#fff", fontWeight: "bold", },
    errorText: { color: 'red', fontSize: 12, marginTop: -2, marginBottom: 10, marginLeft: 5 },
    successText: { color: 'green', fontSize: 12, marginTop: -2, marginBottom: 10, marginLeft: 5 },
});
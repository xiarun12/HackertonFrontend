import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = { navigation: StackNavigationProp<any, any>; };

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입을 위해{"\n"}정보를 입력해주세요.</Text>

      <TextInput placeholder="이름" style={styles.input} value={name} onChangeText={setName} />
      
      <View style={styles.inputWithButton}>
        <TextInput placeholder="아이디" style={styles.inputFlex} value={id} onChangeText={setId} />
        <TouchableOpacity style={styles.idCheckButton}>
          <Text style={styles.idCheckButtonText}>중복 확인</Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.icon}>{isPwVisible ? '👁' : '👁‍'}</Text>
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
          <Text style={styles.icon}>{isPwConfirmVisible ? '👁' : '👁‍'}</Text>
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
        <TouchableOpacity style={styles.continueButton} onPress={() => navigation.replace("RegisterComplete")}>
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
    marginBottom: 15,
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
    lineHeight: 18,
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
});

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type NavProp = StackNavigationProp<RootStackParamList, "FootSelect">;

const FootSelectScreen = () => {
    const navigation = useNavigation<NavProp>();

    return (
        <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>증상 선택하기</Text>
            <View style={styles.headerSpacer} />
        </View>

        {/* 상태바 */}
        <View style={styles.statusBar}>
            <View style={styles.statusLine} />
            <View style={[styles.statusLine, styles.statusLineActive]} />
            <View style={styles.statusLine} />
        </View>

        {/* 단계 안내 */}
        <View style={styles.stepContainer}>
            <View style={styles.stepTitleWrapper}>
            <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>구체적인 부위를{"\n"}알려주세요</Text>
            </View>
            <View style={styles.subTextWrapper}>
            <Text style={styles.subText}>
                아픈 부위를 눌러보세요{"\n"}터치하면 확대해서 자세히 볼 수 있어요
            </Text>
            </View>
        </View>

        {/* 발 그림 터치 → SymptomChat 이동 */}
        <TouchableOpacity onPress={() => navigation.navigate("SymptomChat")}>
            <Image
            source={require("../assets/foot.png")}
            style={styles.footImage}
            resizeMode="contain"
            />
        </TouchableOpacity>
        </View>
    );
};

export default FootSelectScreen;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#fff", 
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 24,
        color: "#333",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    headerSpacer: {
        width: 44,
    },
    statusBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    statusLine: {
        flex: 1,
        height: 4,
        backgroundColor: "#eee",
        marginHorizontal: 3,
        borderRadius: 2,
    },
    statusLineActive: {
        backgroundColor: "#0066E4",
    },
    stepContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    stepTitleWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    stepCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#0066E4",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    stepNumber: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    stepText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    subTextWrapper: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    subText: {
        fontSize: 12,
        color: "#999",
        lineHeight: 18,
    },
    footImage: { 
        width: "100%", 
        height: 400, 
        alignSelf: "center",
        marginTop: 20,
    },
});

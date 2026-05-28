import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constants/api";

function AdminLogin() {
    const router = useRouter();
    let [data, setdata] = useState({ email: "", password: "" })

    useEffect(() => {
        const checkLoggedInAdmin = async () => {
            try {
                const storedAdmin = await AsyncStorage.getItem("adminUser");
                if (storedAdmin) {
                    router.replace("/Dashboard");
                }
            } catch (e) {
                console.log(e);
            }
        };
        checkLoggedInAdmin();
    }, [router]);

    let inputvalue = (name, value) => {
        setdata({ ...data, [name]: value })
    }

    let submitbtn = () => {
        axios.post(`${API_BASE_URL}/signin`, data)
        .then(async (res) => {
            if (res.data.status) {
                if (res.data.user.role === "admin") {
                    try {
                        await AsyncStorage.setItem('adminUser', JSON.stringify(res.data.user));
                        router.replace("/Dashboard");
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    alert("Access Denied: You are not an admin.");
                }
            }
            else { alert(res.data.message) }
        }).catch((err) => console.log(err));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Login</Text>
            <Text style={styles.subtitle}>Sign in to access admin panel</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Admin Email</Text>
                <TextInput style={styles.input} placeholder="Enter Admin Email" value={data.email} onChangeText={text => inputvalue('email', text)} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="Enter Password" value={data.password || ''} onChangeText={text => inputvalue('password', text)} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={submitbtn}>
                <Text style={styles.loginText}>Login to Admin Panel</Text>
            </TouchableOpacity>

            <View style={styles.linkRow}>
                <Link href={"/AdminSignup"} asChild><TouchableOpacity><Text style={styles.link}>Create Admin Account</Text></TouchableOpacity></Link>
            </View>
            <View style={{...styles.linkRow, marginTop: 10}}>
                <TouchableOpacity onPress={() => router.replace("/Login")}><Text style={styles.link}>Go to User Login</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
    title: { fontSize: 28, fontWeight: "bold", color: "#e74c3c", marginBottom: 5 },
    subtitle: { fontSize: 16, color: "#7f8c8d", marginBottom: 30 },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 14, color: "#34495e", marginBottom: 5, fontWeight: "600" },
    input: { borderWidth: 1, borderColor: "#dcdde1", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f8f9fa" },
    loginBtn: { backgroundColor: "#e74c3c", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    loginText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    linkRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
    link: { color: "#3498db", fontWeight: "600" }
});

export default AdminLogin;
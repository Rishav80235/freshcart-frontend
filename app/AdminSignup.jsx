import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constants/api";

function AdminSignup() {
    const router = useRouter();
    let [data, setdata] = useState({ email: "", password: "" });
    const [adminExists, setAdminExists] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/check-admin`)
            .then(res => {
                if (res.data.status && res.data.exists) {
                    setAdminExists(true);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const checkAdminStatus = () => {
        axios.get(`${API_BASE_URL}/check-admin`)
            .then(res => {
                if (res.data.status && res.data.exists) {
                    setAdminExists(true);
                    alert("Admin account already exists. Registration is disabled.");
                } else {
                    alert("No admin found. You can register a new admin.");
                }
            })
            .catch(err => {
                console.log(err);
                alert("Error checking admin status");
            });
    }

    let inputvalue = (name, value) => {
        setdata({ ...data, [name]: value })
    }

    let submitbtn = () => {
        const signupData = { ...data, role: "admin" };
        axios.post(`${API_BASE_URL}/signup`, signupData)
        .then(async (res) => {
            if (res.data.status) {
                try {
                    // Save as admin user
                    await AsyncStorage.setItem('adminUser', JSON.stringify(res.data.user || signupData));
                    router.replace("/Dashboard");
                  } catch (e) {
                    console.log(e);
                  }
            }
            else { alert(res.data.message) }
        }).catch((err) => console.log(err));
    }

    if (adminExists) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Admin Registration</Text>
                <Text style={{...styles.subtitle, color: 'red'}}>An Admin account already exists. New admin registration is disabled.</Text>
                
                <TouchableOpacity style={{...styles.loginBtn, backgroundColor: "#f39c12", marginTop: 15, marginBottom: 20}} onPress={checkAdminStatus}>
                    <Text style={styles.loginText}>Re-check Admin Status</Text>
                </TouchableOpacity>

                <View style={styles.linkRow}>
                    <Link href={"/AdminLogin"} asChild><TouchableOpacity><Text style={styles.link}>Go to Admin Login</Text></TouchableOpacity></Link>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Registration</Text>
            <Text style={styles.subtitle}>Register a new admin account</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Admin Email</Text>
                <TextInput style={styles.input} placeholder="Enter Admin Email" value={data.email} onChangeText={text => inputvalue('email', text)} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="Enter Password" value={data.password || ''} onChangeText={text => inputvalue('password', text)} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={submitbtn}>
                <Text style={styles.loginText}>Register Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{...styles.loginBtn, backgroundColor: "#f39c12", marginTop: 15}} onPress={checkAdminStatus}>
                <Text style={styles.loginText}>Check Admin Status</Text>
            </TouchableOpacity>

            <View style={styles.linkRow}>
                <Link href={"/AdminLogin"} asChild><TouchableOpacity><Text style={styles.link}>Already an Admin? Login</Text></TouchableOpacity></Link>
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
    input: { borderWidth: 1, borderColor: "#dcdde1", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f8f9fa", outlineStyle: 'none' },
    loginBtn: { backgroundColor: "#e74c3c", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    loginText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    linkRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
    link: { color: "#3498db", fontWeight: "600" }
});

export default AdminSignup;
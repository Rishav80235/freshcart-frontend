import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AdminProfile = () => {
    const router = useRouter();
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const storedAdmin = await AsyncStorage.getItem("adminUser");
                if (storedAdmin) {
                    setAdminData(JSON.parse(storedAdmin));
                }
            } catch (error) {
                console.log("Error fetching admin data:", error);
            }
        };
        fetchAdminData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("adminUser");
            router.replace("/AdminLogin");
        } catch (error) {
            console.log("Error logging out:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Admin Profile</Text>

            <View style={styles.profileCard}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                        {adminData?.email ? adminData.email.charAt(0).toUpperCase() : 'A'}
                    </Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Logged in as:</Text>
                    <Text style={styles.value}>{adminData?.email || 'Unknown Admin'}</Text>
                </View>

                {adminData?.name && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{adminData.name}</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout from Admin Panel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
    },
    profileCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#e74c3c',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 16,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    value: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: 'bold',
    },
    logoutBtn: {
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdminProfile;
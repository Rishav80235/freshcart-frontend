//===================================
//     DashboardLayout
//===================================
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, Slot, usePathname, useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardLayout = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const adminUser = await AsyncStorage.getItem("adminUser");
        if (!adminUser) {
          router.replace("/");
        } else {
          setIsChecking(false);
        }
      } catch (e) {
        console.log(e);
        router.replace("/");
      }
    };
    checkAdmin();
  }, [router]);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#10ac84" />
      </View>
    );
  }

  const menuItems = [
    { name: "Admin Profile", href: "/AdminProfile" },
    { name: "Dashboard", href: "/Dashboard" },
    { name: "Products", href: "/Products" },
    { name: "Category", href: "/Category" },
    { name: "Orders", href: "/AllOrders" },
    { name: "Users", href: "/Users" },
    { name: "Vendors", href: "/Vendors" },
    { name: "Reviews", href: "/Reviews" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>FreshCart</Text>
        </View>
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <Link href={item.href} asChild key={item.name}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item.name}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#f8f9fa",
    borderRightWidth: 1,
    borderRightColor: "#dee2e6",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  activeMenuItem: {
    backgroundColor: "#e9ecef",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#343a40",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
});

export default DashboardLayout;

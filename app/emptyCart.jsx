import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EmptyCart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(insets), [insets]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBg}>
          <Feather name="shopping-cart" size={56} color="#cbd5e1" />
        </View>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Looks like you haven't added anything yet. Start shopping to fill your cart.
        </Text>
        <TouchableOpacity
          style={styles.startShoppingBtn}
          onPress={() => router.push("/(tab)/Index")}
        >
          <Text style={styles.startShoppingText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8fafc",
      paddingTop: Platform.OS === "android" ? insets.top : 0,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    iconBg: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: "#f1f5f9",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: "#0f172a",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: "#64748b",
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 28,
    },
    startShoppingBtn: {
      backgroundColor: "#0aad0a",
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 10,
    },
    startShoppingText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "700",
    },
  });

export default EmptyCart;

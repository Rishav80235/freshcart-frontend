//===================================
//     Cart
//===================================
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CartContext } from "../../context/CartContext";
import EmptyCart from "../emptyCart";
import { API_BASE_URL } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(insets), [insets]);

  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, total } =
    useContext(CartContext);
  const [zipCode, setZipCode] = useState("");
  const [loadingZip, setLoadingZip] = useState(true);

  useEffect(() => {
    const loadDefaultZip = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const email = storedUser ? JSON.parse(storedUser)?.email : null;
        if (!email) {
          setZipCode("");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/get-addresses/${email}`);
        const addresses = res.data?.addresses || [];
        const defaultAddress =
          addresses.find((a) => a.isDefault) || addresses[0];
        setZipCode(
          defaultAddress?.zipCode ? String(defaultAddress.zipCode) : "",
        );
      } catch (_e) {
        setZipCode("");
      } finally {
        setLoadingZip(false);
      }
    };
    loadDefaultZip();
  }, []);

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={styles.locationWrapper}>
            <Ionicons name="location-outline" size={14} color="#64748b" />
            {loadingZip ? (
              <ActivityIndicator size="small" color="#0aad0a" style={{ marginLeft: 6 }} />
            ) : (
              <Text style={styles.headerSubtitle}>
                {zipCode ? `Delivery to ${zipCode}` : "Select delivery location"}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.itemCountBadge}>
          <Text style={styles.itemCountText}>{cart.length}</Text>
        </View>
      </View>

      <View style={styles.bannerContainer}>
        <Feather name="truck" size={18} color="#27ae60" />
        <Text style={styles.bannerText}>
          Yay! You have unlocked <Text style={styles.bannerBold}>FREE Delivery</Text>
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cart
          .filter((item) => item)
          .map((item) => (
            <View key={item._id} style={styles.cartCard}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() =>
                  router.push({
                    pathname: "/ProductDetail",
                    params: { item: JSON.stringify(item) },
                  })
                }
              >
                <Image
                  source={{ uri: item.image || item.thumbnail }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.productInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeFromCart(item)}
                    style={styles.deleteBtn}
                  >
                    <Feather name="trash-2" size={16} color="#e74c3c" />
                  </TouchableOpacity>
                </View>

                {item.weight ? (
                  <Text style={styles.productWeight}>{item.weight} g</Text>
                ) : null}

                <View style={styles.actionRow}>
                  <Text style={styles.priceText}>
                    ₹{((item.salePrice || 0) * (item.quantity || 1)).toFixed(2)}
                  </Text>

                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => decreaseQuantity(item)}
                    >
                      <Feather name="minus" size={14} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity || 1}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => increaseQuantity(item)}
                    >
                      <Feather name="plus" size={14} color="#1e293b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.subtotalLabel}>Total Amount</Text>
          <Text style={styles.totalPriceText}>₹{total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push("/components/Checkout")}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
    },
    headerTextWrap: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
    locationWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: 4,
    },
    headerSubtitle: {
      fontSize: 13,
      color: "#64748b",
      fontWeight: "500",
    },
    itemCountBadge: {
      backgroundColor: "#0aad0a",
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    itemCountText: { color: "#fff", fontWeight: "700", fontSize: 14 },

    bannerContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "#ecfdf5",
      marginHorizontal: 16,
      marginTop: 12,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#bbf7d0",
    },
    bannerText: { color: "#15803d", fontSize: 14, flex: 1 },
    bannerBold: { fontWeight: "700" },

    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },

    cartCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#f1f5f9",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    imageContainer: {
      width: 76,
      height: 76,
      backgroundColor: "#f8fafc",
      borderRadius: 10,
      padding: 6,
      marginRight: 12,
    },
    productImage: { width: "100%", height: "100%" },
    productInfo: { flex: 1, justifyContent: "space-between" },
    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    productTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      color: "#0f172a",
      lineHeight: 20,
    },
    deleteBtn: { padding: 4 },
    productWeight: { fontSize: 12, color: "#94a3b8", marginTop: 4 },

    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      marginTop: 10,
    },
    priceText: { fontSize: 17, fontWeight: "700", color: "#0aad0a" },

    qtyContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f1f5f9",
      borderRadius: 8,
      padding: 4,
      gap: 4,
    },
    qtyBtn: {
      width: 28,
      height: 28,
      backgroundColor: "#fff",
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
    },
    qtyValue: {
      fontSize: 14,
      fontWeight: "700",
      color: "#0f172a",
      minWidth: 24,
      textAlign: "center",
    },

    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: Math.max(insets.bottom, 12),
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#f1f5f9",
    },
    priceContainer: { flex: 1 },
    subtotalLabel: {
      fontSize: 12,
      color: "#64748b",
      fontWeight: "600",
      marginBottom: 2,
    },
    totalPriceText: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
    checkoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#0aad0a",
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
    checkoutBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  });

export default Cart;

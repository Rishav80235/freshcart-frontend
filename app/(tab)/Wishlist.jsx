//===================================
//     Wishlist
//===================================
import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";

export default function Wishlist() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(insets), [insets]);

  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    addToCart(item);
    router.push("/Cart");
  };

  const openProduct = (item) => {
    router.push({
      pathname: "/ProductDetail",
      params: { item: JSON.stringify(item) },
    });
  };

  const renderWishlistCard = (item) => {
    const itemId = item._id || item.id;

    return (
      <View key={itemId} style={styles.card}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => openProduct(item)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: item.image || item.thumbnail }}
            style={styles.productImg}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <TouchableOpacity style={styles.titleWrap} onPress={() => openProduct(item)}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.title || "Unnamed Product"}
              </Text>
              <Text style={styles.productUnit}>{item.unit || "1 Pc"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => removeFromWishlist(item)}
              style={styles.deleteIcon}
            >
              <Feather name="trash-2" size={17} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.priceText}>
              ₹{(item.salePrice || item.price || 0).toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={() => handleAddToCart(item)}
            >
              <Feather name="shopping-bag" size={14} color="#fff" />
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>My Wishlist</Text>
          <Text style={styles.subtitle}>
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </Text>
        </View>
        <View style={styles.heartBadge}>
          <Feather name="heart" size={18} color="#fff" />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {wishlist.length > 0 ? (
          <View style={styles.listContainer}>{wishlist.map(renderWishlistCard)}</View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Feather name="heart" size={48} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>Wishlist is empty</Text>
            <Text style={styles.emptyText}>
              Save your favorite items here to buy them later.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push("/Index")}
            >
              <Text style={styles.exploreBtnText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (insets) =>
  StyleSheet.create({
    safeArea: {
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
    pageTitle: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
    subtitle: {
      fontSize: 13,
      color: "#64748b",
      marginTop: 4,
      fontWeight: "500",
    },
    heartBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#0aad0a",
      alignItems: "center",
      justifyContent: "center",
    },

    container: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 24 },
    listContainer: { gap: 0 },

    card: {
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
      width: 84,
      height: 84,
      backgroundColor: "#f8fafc",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      padding: 6,
      marginRight: 12,
    },
    productImg: { width: "100%", height: "100%" },

    cardContent: { flex: 1, justifyContent: "space-between" },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8,
    },
    titleWrap: { flex: 1 },
    productName: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      color: "#0f172a",
      marginBottom: 4,
      lineHeight: 20,
    },
    productUnit: { fontSize: 12, color: "#64748b" },
    deleteIcon: { padding: 4 },

    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
      gap: 12,
    },
    priceText: { fontSize: 17, fontWeight: "700", color: "#0aad0a" },

    addToCartBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#0aad0a",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    addBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },

    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 60,
      paddingHorizontal: 30,
    },
    emptyIconBg: {
      backgroundColor: "#f1f5f9",
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: "#64748b",
      textAlign: "center",
      marginBottom: 28,
      lineHeight: 22,
    },
    exploreBtn: {
      backgroundColor: "#0aad0a",
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 10,
    },
    exploreBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  });

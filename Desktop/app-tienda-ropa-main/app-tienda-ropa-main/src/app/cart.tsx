import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FREE_SHIPPING_FROM, formatPrice } from '../constants/store';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, totals } = useCart();
  const [order, setOrder] = useState<{ number: number; total: number } | null>(null);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const handleCheckout = () => {
    setOrder({
      number: Math.floor(100000 + Math.random() * 900000),
      total: totals.total,
    });
  };

  const finishOrder = () => {
    clearCart();
    setOrder(null);
    router.replace('/');
  };

  const missingForFree = FREE_SHIPPING_FROM - totals.subtotal;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Carrito</Text>
        {cart.length > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearBtn}>Vaciar</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.replace('/')}>
            <Text style={styles.checkoutText}>Ir a la tienda</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list}>
            <View style={styles.content}>
              {cart.map(({ product, quantity }) => (
                <View key={product.id} style={styles.itemCard}>
                  <Image source={{ uri: product.images[0] }} style={styles.itemImg} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {product.title}
                    </Text>
                    <Text style={styles.itemSubText}>{product.category}</Text>
                    <Text style={styles.itemPrice}>{formatPrice(product.price)} c/u</Text>

                    <View style={styles.qtyContainer}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(product.id, -1)}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(product.id, 1)}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerInner}>
              {totals.shipping > 0 && (
                <Text style={styles.freeShipHint}>
                  🚚 Te faltan {formatPrice(missingForFree)} para envío gratis
                </Text>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>{formatPrice(totals.subtotal)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>IVA (21%)</Text>
                <Text style={styles.value}>{formatPrice(totals.tax)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Envío</Text>
                <Text style={styles.value}>
                  {totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}
                </Text>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(totals.total)}</Text>
              </View>

              <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Finalizar compra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Cartel de compra exitosa */}
      <Modal visible={order !== null} transparent animationType="fade" onRequestClose={finishOrder}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>¡Compra realizada con éxito!</Text>
            <Text style={styles.modalText}>Tu pedido #{order?.number} fue confirmado.</Text>
            <Text style={styles.modalTotal}>Total: {formatPrice(order?.total ?? 0)}</Text>
            <Text style={styles.modalNote}>(Compra simulada, no se cobró nada)</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={finishOrder}>
              <Text style={styles.checkoutText}>Seguir comprando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { fontSize: 15, color: COLORS.text, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  clearBtn: { fontSize: 14, color: COLORS.danger, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 24 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, color: COLORS.textSoft, marginBottom: 8 },
  list: { padding: 16 },
  content: { width: '100%', maxWidth: 700, alignSelf: 'center' },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImg: { width: 72, height: 72, borderRadius: 8, marginRight: 12, backgroundColor: '#E5E7EB' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  itemSubText: { fontSize: 11, color: COLORS.textSoft, textTransform: 'uppercase' },
  itemPrice: { fontSize: 13, color: COLORS.textSoft, marginVertical: 2 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  qtyBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  qtyText: { marginHorizontal: 14, fontWeight: 'bold', color: COLORS.text },
  removeText: { fontSize: 18, color: COLORS.danger, padding: 8 },
  footer: { backgroundColor: COLORS.card, borderTopWidth: 1, borderColor: COLORS.border },
  footerInner: { width: '100%', maxWidth: 700, alignSelf: 'center', padding: 20 },
  freeShipHint: { color: COLORS.success, fontWeight: '600', marginBottom: 10, fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: COLORS.textSoft },
  value: { fontWeight: '600', color: COLORS.text },
  totalRow: { marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderColor: COLORS.border },
  totalLabel: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  totalValue: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  checkoutText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkMark: { color: COLORS.white, fontSize: 40, fontWeight: 'bold' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  modalText: { fontSize: 14, color: COLORS.textSoft, marginTop: 8, textAlign: 'center' },
  modalTotal: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 10 },
  modalNote: { fontSize: 12, color: COLORS.textSoft, marginTop: 6, marginBottom: 4 },
});
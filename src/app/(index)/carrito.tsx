import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Product } from '../../screens/HomeScreen';

export default function CarritoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // acá llega la lista completa de productos con cantidad > 0 que mandó el Home
  const items: Product[] = params.data ? JSON.parse(params.data as string) : [];

  const total = items.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tu Carrito</Text>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>Todavía no agregaste productos</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemSubtitle}>
                {item.cantidad} x ${item.price}
              </Text>
            </View>
            <Text style={styles.itemSubtotal}>${item.price * item.cantidad}</Text>
          </View>
        ))
      )}

      {items.length > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
      )}

      {/* a propósito deshabilitado: confirmar compra es una feature extra que todavía no hicimos */}
      <TouchableOpacity style={styles.confirmButton} disabled>
        <Text style={styles.confirmButtonText}>Confirmar Compra (próximamente)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Seguir Comprando</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 30,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF4',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
  },
  confirmButton: {
    backgroundColor: '#C7C7CC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  backButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

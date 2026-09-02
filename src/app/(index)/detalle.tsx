import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Product } from '../../screens/HomeScreen';

export default function DetalleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // el producto llega como texto en el param "data", hay que parsearlo de vuelta a objeto
  const product: Product | null = params.data ? JSON.parse(params.data as string) : null;
  // este contador es local, no está conectado al del Home todavía
  const [cantidad, setCantidad] = useState<number>(product?.cantidad ?? 0);

  const cambiarCantidad = (delta: number) => {
    setCantidad((prev) => Math.max(0, prev + delta));
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontró el producto</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].replace(/[\[\]"]/g, '')
      : 'https://via.placeholder.com/150';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.badgeRow}>
        <Text style={styles.genderBadge}>{product.gender}</Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.subcategoryBadge}>{product.subcategory}</Text>
      </View>

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.counterRow}>
        <TouchableOpacity style={styles.btnSmall} onPress={() => cambiarCantidad(-1)}>
          <Text style={styles.btnLabel}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyText}>{cantidad}</Text>

        <TouchableOpacity style={styles.btnSmall} onPress={() => cambiarCantidad(1)}>
          <Text style={styles.btnLabel}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
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
  image: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  genderBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#8E8E93',
    marginHorizontal: 6,
  },
  subcategoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#3A3A3C',
    lineHeight: 22,
    marginBottom: 20,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 20,
  },
  btnSmall: {
    backgroundColor: '#EFEFF4',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    minWidth: 20,
    textAlign: 'center',
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

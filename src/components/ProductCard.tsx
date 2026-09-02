import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Product } from '../screens/HomeScreen';

interface ProductCardProps {
  product: Product;
  onPress: (id: number) => void;
  onCambiarCantidad: (id: number, delta: number) => void;
}

// Componente reutilizable: recibe el producto y los handlers por props.
// El contador de cantidad usa el mismo patrón que flat-list-shop.tsx de Clase 2.
export default function ProductCard({ product, onPress, onCambiarCantidad }: ProductCardProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].replace(/[\[\]"]/g, '')
      : 'https://via.placeholder.com/150';

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(product.id)}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <View style={styles.badgeRow}>
            <Text style={styles.genderBadge}>{product.gender}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.subcategoryBadge} numberOfLines={1}>
              {product.subcategory}
            </Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {product.title}
          </Text>
          <Text style={styles.cardPrice}>${product.price}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.counterRow}>
        <TouchableOpacity
          style={styles.btnSmall}
          onPress={() => onCambiarCantidad(product.id, -1)}
        >
          <Text style={styles.btnLabel}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyText}>{product.cantidad}</Text>

        <TouchableOpacity
          style={styles.btnSmall}
          onPress={() => onCambiarCantidad(product.id, 1)}
        >
          <Text style={styles.btnLabel}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#F2F2F7',
  },
  cardContent: {
    padding: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  genderBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  dotSeparator: {
    fontSize: 10,
    color: '#8E8E93',
    marginHorizontal: 4,
  },
  subcategoryBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
  btnSmall: {
    backgroundColor: '#EFEFF4',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  qtyText: {
    fontWeight: '700',
    color: '#1C1C1E',
    minWidth: 16,
    textAlign: 'center',
  },
});

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FREE_SHIPPING_FROM, formatPrice } from '../../constants/store';
import { useCart } from '../../context/CartContext';
import { fetchProductById } from '../../services/products';
import { Product } from '../../types';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProductById(productId)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, [productId]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const inCart = product ? cart.find((i) => i.product.id === product.id)?.quantity ?? 0 : 0;
  const maxReached = product ? inCart >= product.stock : false;

  const handleAdd = () => {
    if (!product || maxReached) return;
    addToCart(product);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <Text style={styles.cartLink}>🛒 Carrito ({cartCount})</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 60 }} />
      ) : !product ? (
        <View style={styles.center}>
          <Text style={styles.notFound}>No encontramos este producto.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/')}>
            <Text style={styles.primaryBtnText}>Volver a la tienda</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.content}>
              <Image
                source={{ uri: product.images[imgIndex] ?? product.images[0] }}
                style={styles.mainImage}
                resizeMode="cover"
              />

              {product.images.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbs}>
                  {product.images.map((uri, i) => (
                    <TouchableOpacity key={i} onPress={() => setImgIndex(i)}>
                      <Image
                        source={{ uri }}
                        style={[styles.thumb, i === imgIndex && styles.thumbActive]}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <View style={styles.info}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>{formatPrice(product.price)}</Text>
                <Text style={styles.installments}>
                  6 cuotas sin interés de {formatPrice(product.price / 6)}
                </Text>

                <View style={styles.shippingBox}>
                  <Text style={styles.shippingText}>
                    🚚 Envío gratis en compras desde {formatPrice(FREE_SHIPPING_FROM)}
                  </Text>
                  <Text style={styles.shippingText}>✅ {product.stock} unidades disponibles</Text>
                </View>

                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{product.description}</Text>

                {inCart > 0 && (
                  <Text style={styles.inCartText}>Ya tenés {inCart} en tu carrito</Text>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerInner}>
              <View>
                <Text style={styles.footerLabel}>Precio</Text>
                <Text style={styles.footerPrice}>{formatPrice(product.price)}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  added && { backgroundColor: COLORS.success },
                  maxReached && { backgroundColor: COLORS.textSoft },
                ]}
                onPress={handleAdd}
                disabled={maxReached}
              >
                <Text style={styles.primaryBtnText}>
                  {maxReached ? 'Stock máximo alcanzado' : added ? '✓ Agregado' : 'Agregar al carrito'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { fontSize: 15, color: COLORS.text, fontWeight: 'bold' },
  cartLink: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  notFound: { fontSize: 16, color: COLORS.textSoft },
  scroll: { paddingBottom: 24 },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center' },
  mainImage: { width: '100%', aspectRatio: 1, backgroundColor: '#E5E7EB' },
  thumbs: { paddingHorizontal: 16, paddingTop: 12 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: { borderColor: COLORS.primary },
  info: { padding: 16, gap: 6 },
  category: { fontSize: 12, color: COLORS.textSoft, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  price: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  installments: { fontSize: 14, color: COLORS.success, fontWeight: '600' },
  shippingBox: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    gap: 6,
    marginVertical: 12,
  },
  shippingText: { fontSize: 13, color: COLORS.text },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 4 },
  description: { fontSize: 14, color: COLORS.textSoft, lineHeight: 21 },
  inCartText: { marginTop: 10, color: COLORS.accent, fontWeight: '600' },
  footer: { backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border },
  footerInner: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  footerLabel: { fontSize: 12, color: COLORS.textSoft },
  footerPrice: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
});
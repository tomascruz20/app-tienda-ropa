import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { Gender, Product, Subcategory } from '../types';

const SUBCATEGORIES: Subcategory[] = [
  'Camperas/Buzos/Sweaters',
  'Camisas',
  'Remeras',
  'Pantalones',
  'Bermudas',
  'Jeans',
];

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart, cart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtros
  const [selectedGender, setSelectedGender] = useState<Gender>('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [openAccordion, setOpenAccordion] = useState<'Hombre' | 'Mujer' | null>(null);

  useEffect(() => {
    // Obtenemos todos los productos directamente sin filtros estrictos en el fetch
    fetch('https://api.escuelajs.co/api/v1/products')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setLoading(false);
          return;
        }

        // Mapeamos los datos asignando imágenes válidas y estructura fija
        const mapped: Product[] = data.slice(0, 50).map((item: any, index: number) => {
          let imageUrl = 'https://picsum.photos/300/300';
          
          if (item.images && item.images.length > 0) {
            const cleanUrl = item.images[0].replace(/[\[\]"]/g, '');
            if (cleanUrl.startsWith('http')) {
              imageUrl = cleanUrl;
            }
          }

          return {
            id: item.id,
            title: item.title || 'Prenda de vestir',
            price: (item.price || 15) * 1000,
            description: item.description || '',
            gender: index % 2 === 0 ? 'Hombre' : 'Mujer',
            subcategory: SUBCATEGORIES[index % SUBCATEGORIES.length],
            images: [imageUrl],
            stock: 10,
            hasInstallments: true,
          };
        });

        setProducts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filtrado de productos
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === 'Todos' || p.gender === selectedGender;
    const matchesSub = !selectedSubcategory || p.subcategory === selectedSubcategory;
    return matchesSearch && matchesGender && matchesSub;
  });

  const selectCategoryFilter = (gender: Gender, sub: Subcategory | null) => {
    setSelectedGender(gender);
    setSelectedSubcategory(sub);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TIENDA DE ROPA</Text>
        <TouchableOpacity style={styles.cartBadgeBtn} onPress={() => router.push('/cart')}>
          <Text style={styles.cartText}>🛒 ({totalCartCount})</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ropa..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Acordeón Plegable de Categorías */}
      <View style={styles.accordionContainer}>
        <TouchableOpacity
          style={[styles.filterChip, selectedGender === 'Todos' && styles.activeChip]}
          onPress={() => selectCategoryFilter('Todos', null)}
        >
          <Text style={selectedGender === 'Todos' ? styles.activeText : styles.chipText}>Todos</Text>
        </TouchableOpacity>

        {/* Sección Hombre */}
        <TouchableOpacity
          style={[styles.accordionHeader, selectedGender === 'Hombre' && styles.activeChip]}
          onPress={() => setOpenAccordion(openAccordion === 'Hombre' ? null : 'Hombre')}
        >
          <Text style={selectedGender === 'Hombre' ? styles.activeText : styles.chipText}>
            Hombre {openAccordion === 'Hombre' ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* Sección Mujer */}
        <TouchableOpacity
          style={[styles.accordionHeader, selectedGender === 'Mujer' && styles.activeChip]}
          onPress={() => setOpenAccordion(openAccordion === 'Mujer' ? null : 'Mujer')}
        >
          <Text style={selectedGender === 'Mujer' ? styles.activeText : styles.chipText}>
            Mujer {openAccordion === 'Mujer' ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subcategorías desplegadas del Acordeón */}
      {openAccordion && (
        <View style={styles.subList}>
          <TouchableOpacity
            style={styles.subChip}
            onPress={() => selectCategoryFilter(openAccordion, null)}
          >
            <Text style={styles.subChipText}>Ver todo {openAccordion}</Text>
          </TouchableOpacity>
          {SUBCATEGORIES.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={[
                styles.subChip,
                selectedGender === openAccordion && selectedSubcategory === sub && styles.activeSubChip,
              ]}
              onPress={() => selectCategoryFilter(openAccordion, sub)}
            >
              <Text style={styles.subChipText}>{sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Catálogo de Productos */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image source={{ uri: item.images[0] }} style={styles.image} />
              <View style={styles.cardInfo}>
                <Text style={styles.categoryBadge}>{item.gender} • {item.subcategory}</Text>
                <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toLocaleString()}</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                  <Text style={styles.addBtnText}>Agregar al Carrito</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  cartBadgeBtn: { backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  cartText: { color: '#FFF', fontWeight: 'bold' },
  searchContainer: { padding: 12 },
  searchInput: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, fontSize: 14 },
  accordionContainer: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, marginBottom: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: '#F1F5F9' },
  accordionHeader: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: '#F1F5F9' },
  activeChip: { backgroundColor: '#000' },
  chipText: { color: '#333', fontWeight: '600' },
  activeText: { color: '#FFF', fontWeight: '600' },
  subList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 12, marginBottom: 12 },
  subChip: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  activeSubChip: { backgroundColor: '#2563EB' },
  subChipText: { fontSize: 12 },
  list: { padding: 12 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 12, padding: 8, overflow: 'hidden' },
  image: { width: 90, height: 90, borderRadius: 6 },
  cardInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  categoryBadge: { fontSize: 10, color: '#64748B', textTransform: 'uppercase' },
  productTitle: { fontSize: 14, fontWeight: 'bold' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#16A34A' },
  addBtn: { backgroundColor: '#000', paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});
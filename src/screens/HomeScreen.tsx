import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// ojo: el SafeAreaView de react-native no hace nada en Android, por eso lo traemos de esta lib
import { SafeAreaView } from 'react-native-safe-area-context';

import ProductCard from '../components/ProductCard';

export type Subcategory =
  | 'Camperas/Buzos/Sweaters'
  | 'Camisas'
  | 'Remeras'
  | 'Pantalones'
  | 'Bermudas'
  | 'Jeans';

export type Gender = 'Todos' | 'Hombre' | 'Mujer';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  gender: 'Hombre' | 'Mujer';
  subcategory: Subcategory;
  images: string[];
  cantidad: number;
}

const SUBCATEGORIES: string[] = [
  'Todas',
  'Camperas/Buzos/Sweaters',
  'Camisas',
  'Remeras',
  'Pantalones',
  'Bermudas',
  'Jeans',
];

// catálogo fijo que armamos nosotros, esto es lo que pide la consigna como "datos estáticos"
const MOCK_CLOTHING: Product[] = [
  {
    id: 101,
    title: 'Campera Bomber Minimal',
    price: 85,
    description: 'Campera ligera ideal para media estación.',
    gender: 'Hombre',
    subcategory: 'Camperas/Buzos/Sweaters',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    cantidad: 0,
  },
  {
    id: 102,
    title: 'Buzo Oversize Hoodie',
    price: 60,
    description: 'Buzo con capucha algodón frizado premium.',
    gender: 'Mujer',
    subcategory: 'Camperas/Buzos/Sweaters',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'],
    cantidad: 0,
  },
  {
    id: 103,
    title: 'Camisa Lino Slim Fit',
    price: 50,
    description: 'Camisa manga larga 100% lino.',
    gender: 'Hombre',
    subcategory: 'Camisas',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
    cantidad: 0,
  },
  {
    id: 104,
    title: 'Remera Básica Organic Cotton',
    price: 25,
    description: 'Remera de cuello redondo corte recto.',
    gender: 'Hombre',
    subcategory: 'Remeras',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
    cantidad: 0,
  },
  {
    id: 105,
    title: 'Remera Crop Top Essential',
    price: 22,
    description: 'Remera de algodón para uso diario.',
    gender: 'Mujer',
    subcategory: 'Remeras',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'],
    cantidad: 0,
  },
  {
    id: 106,
    title: 'Jean Wide Leg Tiro Alto',
    price: 70,
    description: 'Pantalón denim con calce moderno.',
    gender: 'Mujer',
    subcategory: 'Jeans',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'],
    cantidad: 0,
  },
  {
    id: 107,
    title: 'Jean Slim Dark Blue',
    price: 68,
    description: 'Jean entallado elastizado.',
    gender: 'Hombre',
    subcategory: 'Jeans',
    images: ['https://images.unsplash.com/photo-1542272604-780c36856f61?w=500'],
    cantidad: 0,
  },
  {
    id: 108,
    title: 'Bermuda Chino Gabardina',
    price: 40,
    description: 'Bermuda formal con bolsillos laterales.',
    gender: 'Hombre',
    subcategory: 'Bermudas',
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'],
    cantidad: 0,
  },
  {
    id: 109,
    title: 'Pantalón Jogger Urban',
    price: 45,
    description: 'Pantalón cómodo de frisa liviana.',
    gender: 'Hombre',
    subcategory: 'Pantalones',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500'],
    cantidad: 0,
  },
  {
    id: 110,
    title: 'Sweater Tejido Cream',
    price: 65,
    description: 'Sweater escote en V suave al tacto.',
    gender: 'Mujer',
    subcategory: 'Camperas/Buzos/Sweaters',
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'],
    cantidad: 0,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<Gender>('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todas');

  useEffect(() => {
    fetchClothingProducts();
  }, []);

  const fetchClothingProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      const data = await response.json();

      const apiClothes = data
        .filter((item: any) => item.category?.name?.toLowerCase().includes('clothes'))
        .map((item: any, index: number): Product => {
          const isMen = index % 2 === 0;
          const subcatList: Subcategory[] = [
            'Remeras',
            'Camisas',
            'Camperas/Buzos/Sweaters',
            'Pantalones',
            'Jeans',
          ];

          return {
            id: item.id,
            title: item.title,
            price: item.price,
            description: item.description,
            gender: isMen ? 'Hombre' : 'Mujer',
            subcategory: subcatList[index % subcatList.length],
            images: item.images,
            cantidad: 0,
          };
        });

      // sumamos lo nuestro + lo de la api, así siempre hay algo para mostrar
      setProducts([...MOCK_CLOTHING, ...apiClothes]);
    } catch (error) {
      // si la api falla nos quedamos solo con lo fijo, no rompe la pantalla
      console.log('Error al conectar con la API, usando catálogo local estandarizado:', error);
      setProducts(MOCK_CLOTHING);
    } finally {
      setLoading(false);
    }
  };

  // filtra por texto buscado + género + categoría al mismo tiempo
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesGender =
        selectedGender === 'Todos' || product.gender === selectedGender;

      const matchesSubcategory =
        selectedSubcategory === 'Todas' ||
        product.subcategory === selectedSubcategory;

      return matchesSearch && matchesGender && matchesSubcategory;
    });
  }, [searchQuery, selectedGender, selectedSubcategory, products]);

  // manda el producto entero como string por los params de la ruta
  const handleProductPress = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    router.push({
      pathname: '/detalle',
      params: { data: JSON.stringify(product) },
    });
  };

  // suma o resta 1, nunca deja bajar de 0
  const cambiarCantidad = (id: number, delta: number) => {
    const nuevosProductos = products.map((p) => {
      if (p.id === id) {
        const nuevaCant = p.cantidad + delta;
        return { ...p, cantidad: nuevaCant < 0 ? 0 : nuevaCant };
      }
      return p;
    });
    setProducts(nuevosProductos);
  };

  const itemsEnCarrito = useMemo(
    () => products.filter((p) => p.cantidad > 0),
    [products]
  );

  const totalItemsEnCarrito = useMemo(
    () => itemsEnCarrito.reduce((acc, p) => acc + p.cantidad, 0),
    [itemsEnCarrito]
  );

  // mismo mecanismo que el detalle, pero mandando el array de productos con cantidad > 0
  const handleVerCarrito = () => {
    router.push({
      pathname: '/carrito',
      params: { data: JSON.stringify(itemsEnCarrito) },
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      onCambiarCantidad={cambiarCantidad}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandTitle}>URBAN STORE</Text>
            <Text style={styles.subtitle}>Tienda de Ropa</Text>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={handleVerCarrito}>
            <Text style={styles.cartButtonText}>🛒 {totalItemsEnCarrito}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar camperas, remeras, jeans..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.genderSelectorContainer}>
        {(['Todos', 'Hombre', 'Mujer'] as Gender[]).map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              styles.genderTab,
              selectedGender === gender && styles.genderTabActive,
            ]}
            onPress={() => setSelectedGender(gender)}
          >
            <Text
              style={[
                styles.genderTabText,
                selectedGender === gender && styles.genderTabTextActive,
              ]}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={SUBCATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedSubcategory === item && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedSubcategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedSubcategory === item && styles.categoryTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1C1C1E" />
          <Text style={styles.loadingText}>Cargando prendas...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron prendas</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchInput: {
    backgroundColor: '#EFEFF4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1C1C1E',
  },
  genderSelectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  genderTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFEFF4',
    alignItems: 'center',
  },
  genderTabActive: {
    backgroundColor: '#1C1C1E',
  },
  genderTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  genderTabTextActive: {
    color: '#FFFFFF',
  },
  categoryContainer: {
    paddingLeft: 20,
    marginBottom: 15,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EFEFF4',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#3A3A3C',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
});

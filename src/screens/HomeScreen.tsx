import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Subcategorías permitidas exactamente según el enunciado
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
}

// Subcategorías para el filtro
const SUBCATEGORIES: string[] = [
  'Todas',
  'Camperas/Buzos/Sweaters',
  'Camisas',
  'Remeras',
  'Pantalones',
  'Bermudas',
  'Jeans',
];

// Productos locales estandarizados exclusivamente con tu catálogo de ropa
const MOCK_CLOTHING: Product[] = [
  {
    id: 101,
    title: 'Campera Bomber Minimal',
    price: 85,
    description: 'Campera ligera ideal para media estación.',
    gender: 'Hombre',
    subcategory: 'Camperas/Buzos/Sweaters',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
  },
  {
    id: 102,
    title: 'Buzo Oversize Hoodie',
    price: 60,
    description: 'Buzo con capucha algodón frizado premium.',
    gender: 'Mujer',
    subcategory: 'Camperas/Buzos/Sweaters',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'],
  },
  {
    id: 103,
    title: 'Camisa Lino Slim Fit',
    price: 50,
    description: 'Camisa manga larga 100% lino.',
    gender: 'Hombre',
    subcategory: 'Camisas',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
  },
  {
    id: 104,
    title: 'Remera Básica Organic Cotton',
    price: 25,
    description: 'Remera de cuello redondo corte recto.',
    gender: 'Hombre',
    subcategory: 'Remeras',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
  },
  {
    id: 105,
    title: 'Remera Crop Top Essential',
    price: 22,
    description: 'Remera de algodón para uso diario.',
    gender: 'Mujer',
    subcategory: 'Remeras',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'],
  },
  {
    id: 106,
    title: 'Jean Wide Leg Tiro Alto',
    price: 70,
    description: 'Pantalón denim con calce moderno.',
    gender: 'Mujer',
    subcategory: 'Jeans',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'],
  },
  {
    id: 107,
    title: 'Jean Slim Dark Blue',
    price: 68,
    description: 'Jean entallado elastizado.',
    gender: 'Hombre',
    subcategory: 'Jeans',
    images: ['https://images.unsplash.com/photo-1542272604-780c36856f61?w=500'],
  },
  {
    id: 108,
    title: 'Bermuda Chino Gabardina',
    price: 40,
    description: 'Bermuda formal con bolsillos laterales.',
    gender: 'Hombre',
    subcategory: 'Bermudas',
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'],
  },
  {
    id: 109,
    title: 'Pantalón Jogger Urban',
    price: 45,
    description: 'Pantalón cómodo de frisa liviana.',
    gender: 'Hombre',
    subcategory: 'Pantalones',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500'],
  },
  {
    id: 110,
    title: 'Sweater Tejido Cream',
    price: 65,
    description: 'Sweater escote en V suave al tacto.',
    gender: 'Mujer',
    subcategory: 'Camperas/Buzos/Sweaters',
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'],
  },
];

export default function HomeScreen({ navigation }: any) {
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

      // Filtramos la API para asegurar que solo traiga ítems de la categoría "Clothes"
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
          };
        });

      // Combinamos la API filtrada con la lista estandarizada local
      setProducts([...MOCK_CLOTHING, ...apiClothes]);
    } catch (error) {
      console.log('Error al conectar con la API, usando catálogo local estandarizado:', error);
      setProducts(MOCK_CLOTHING);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado simultáneo por Búsqueda + Género + Subcategoría
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

  const handleProductPress = (id: number) => {
    if (navigation) {
      navigation.navigate('Detail', { productId: id });
    } else {
      console.log(`Navegar al producto con ID: ${id}`);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const imageUrl =
      item.images && item.images.length > 0
        ? item.images[0].replace(/[\[\]"]/g, '')
        : 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => handleProductPress(item.id)}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <View style={styles.badgeRow}>
            <Text style={styles.genderBadge}>{item.gender}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.subcategoryBadge} numberOfLines={1}>
              {item.subcategory}
            </Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardPrice}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>URBAN STORE</Text>
        <Text style={styles.subtitle}>Tienda de Ropa</Text>
      </View>

      {/* Buscador de productos */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar camperas, remeras, jeans..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro por Género (Hombre / Mujer / Todos) */}
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

      {/* Filtro horizontal por Subcategoría */}
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

      {/* Grilla de productos */}
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
import { Stack } from 'expo-router';

// esto es lo que nos faltaba para que router.push a detalle/carrito funcione
// sin este Stack, el tab "Home" no tiene dónde apilar otras pantallas arriba
export default function IndexStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

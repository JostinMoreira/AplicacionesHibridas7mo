import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import LoginScreen from './src/screens/loginScreen';
import SolicitudScreen from './src/screens/solicitudScreen';
import PerfilScreen from './src/screens/perfilScreen';
import InicioScreen from './src/screens/inicioScreen';
import ConfigScreen from './src/screens/configScreen';
import NotificacionesPushScreen from './src/screens/NotificacionesPush';
import MenuInferior from './src/components/menuInferior';

export default function App() {
  
  
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [pantallaActual, setPantallaActual] = useState('inicio');
  
  if (!usuarioAutenticado){
    return(
      <LoginScreen onLogin={() => setUsuarioAutenticado(true)}/>
    )
  }

  let pantalla;
  if (pantallaActual === 'solicitudes'){
    pantalla = <SolicitudScreen/>
  } else if (pantallaActual === 'perfil'){
    pantalla = <PerfilScreen onSalir={() => setUsuarioAutenticado(false)}/>
  } else if (pantallaActual === 'config'){
    pantalla = <ConfigScreen/>
  } else if (pantallaActual === 'notificaciones'){
    pantalla = <NotificacionesPushScreen/>
  } else{
    pantalla = <InicioScreen/>
  }

  return(
    <View style={{ flex: 1 }}>
    <MenuInferior
    cambiarPantalla={setPantallaActual}
    pantallaActual={pantallaActual}
    />
    {pantalla}
    </View>
  )
}

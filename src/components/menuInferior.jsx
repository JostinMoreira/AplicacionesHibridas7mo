import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function MenuInferior({ pantallaActual, cambiarPantalla }) {
    return (
        <View style={styles.menu}>
            <Pressable
                style={[styles.boton, pantallaActual === 'inicio' && styles.botonActivo]}
                onPress={() => cambiarPantalla('inicio')}
            >
                <Text style={[styles.texto, pantallaActual === 'inicio' && styles.textoActivo]}>Inicio</Text>
            </Pressable>

            <Pressable
                style={[styles.boton, pantallaActual === 'solicitudes' && styles.botonActivo]}
                onPress={() => cambiarPantalla('solicitudes')}
            >
                <Text style={[styles.texto, pantallaActual === 'solicitudes' && styles.textoActivo]}>Inventario</Text>
            </Pressable>

            <Pressable
                style={[styles.boton, pantallaActual === 'perfil' && styles.botonActivo]}
                onPress={() => cambiarPantalla('perfil')}
            >
                <Text style={[styles.texto, pantallaActual === 'perfil' && styles.textoActivo]}>Perfil</Text>
            </Pressable>

            <Pressable
                style={[styles.boton, pantallaActual === 'config' && styles.botonActivo]}
                onPress={() => cambiarPantalla('config')}
            >
                <Text style={[styles.texto, pantallaActual === 'config' && styles.textoActivo]}>Config</Text>
            </Pressable>

            <Pressable
                style={[styles.boton, pantallaActual === 'notificaciones' && styles.botonActivo]}
                onPress={() => cambiarPantalla('notificaciones')}
            >
                <Text style={[styles.texto, pantallaActual === 'notificaciones' && styles.textoActivo]}>Notificaciones</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 12,
        gap: 4,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    boton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    botonActivo: {
        backgroundColor: '#eff6ff',
    },
    texto: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    textoActivo: {
        color: '#2563eb',
        fontWeight: 'bold',
    },
});

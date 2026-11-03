import { useState } from 'react';
import { Alert, Platform, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

const CANAL_INVENTARIO = 'inventario';

export default function SolicitudScreen() {
    const [titulo, setTitulo] = useState('');
    const [lista, setLista] = useState([
        { id: '1', titulo: 'Cemento x 20' },
        { id: '2', titulo: 'Tornillos x 10' },
    ]);

    const agregar = async () => {
        if (!titulo.trim()) {
            return;
        }

        const nombreProducto = titulo.trim();
        setLista((actual) => [...actual, { id: Date.now().toString(), titulo: nombreProducto }]);
        setTitulo('');

        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync(CANAL_INVENTARIO, {
                    name: 'Avisos de inventario',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                });
            }

            let permisos = await Notifications.getPermissionsAsync();
            if (permisos.status !== 'granted') {
                permisos = await Notifications.requestPermissionsAsync();
            }

            if (permisos.status !== 'granted') {
                Alert.alert(
                    'Producto agregado',
                    'Se agregó al inventario, pero las notificaciones están desactivadas.'
                );
                return;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Producto agregado correctamente',
                    body: `${nombreProducto} se agregó al inventario.`,
                    sound: true,
                    data: { tipo: 'inventario-agregado', producto: nombreProducto },
                },
                trigger: Platform.OS === 'android'
                    ? { channelId: CANAL_INVENTARIO }
                    : null,
            });
        } catch (error) {
            Alert.alert(
                'Producto agregado',
                'Se agregó al inventario, pero no se pudo mostrar la notificación.'
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Inventario</Text>
            <Text style={styles.subtitulo}>Registra entradas y salidas</Text>

            <TextInput
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ej: 5x Cemento"
            />

            <Pressable style={styles.boton} onPress={agregar}>
                <Text style={styles.textBoton}>Agregar</Text>
            </Pressable>

            <View style={styles.lista}>
                {lista.map((item) => (
                    <View key={item.id} style={styles.item}>
                        <Text style={styles.itemTitulo}>{item.titulo}</Text>
                        <Text style={styles.itemEstado}>En stock</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#ffffff',
        fontSize: 16,
        marginBottom: 12,
    },
    boton: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    textBoton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lista: {
        marginTop: 20,
        gap: 10,
    },
    item: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 12,
    },
    itemTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    itemEstado: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
});

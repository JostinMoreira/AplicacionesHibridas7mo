import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PerfilScreen({ onSalir }) {
    const [foto, setFoto] = useState(null);

    const seleccionarImagen = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería de fotos.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setFoto(resultado.assets[0].uri);
        }
    };

    const tomarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita permiso para usar la cámara.');
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setFoto(resultado.assets[0].uri);
        }
    };

    const mostrarOpcionesFoto = () => {
        Alert.alert(
            'Foto de perfil',
            'Selecciona una opción:',
            [
                { text: 'Tomar foto', onPress: tomarFoto },
                { text: 'Elegir de la galería', onPress: seleccionarImagen },
                { text: 'Cancelar', style: 'cancel' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Mi Perfil</Text>
            <Text style={styles.subtitulo}>Encargado de bodega</Text>

            <View style={styles.avatarContainer}>
                {foto ? (
                    <Image source={{ uri: foto }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarTexto}>📷</Text>
                    </View>
                )}
                <View style={styles.botonesFotoContainer}>
                    <Pressable style={styles.botonFoto} onPress={tomarFoto}>
                        <Text style={styles.textBotonFoto}>📷 Tomar Foto</Text>
                    </Pressable>
                    <Pressable style={[styles.botonFoto, styles.botonGaleria]} onPress={seleccionarImagen}>
                        <Text style={styles.textBotonFoto}>🖼️ Galería</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.tarjeta}>
                <Text style={styles.dato}>Bodeguero ULEAM</Text>
                <Text style={styles.correo}>bodega@uleam.edu.ec</Text>
                <Text style={styles.carrera}>Encargado de Bodega</Text>
            </View>

            <Pressable style={styles.boton} onPress={onSalir}>
                <Text style={styles.textBoton}>Cerrar Sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarTexto: {
        fontSize: 36,
    },
    botonesFotoContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },
    botonFoto: {
        backgroundColor: '#0284c7',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    botonGaleria: {
        backgroundColor: '#475569',
    },
    textBotonFoto: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
    tarjeta: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        width: '100%',
        maxWidth: 320,
        marginBottom: 20,
    },
    dato: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    correo: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    carrera: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    boton: {
        backgroundColor: '#dc2626',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
    },
    textBoton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

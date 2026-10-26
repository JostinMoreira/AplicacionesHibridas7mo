import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ onLogin }) {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');

    // Credenciales de prueba
    const correoCorrecto = 'bodega@uleam.edu.ec';
    const claveCorrecta = '123456';

    const iniciarSesion = () => {
        if (!correo.trim() || !clave.trim()) {
            alert('Datos incompletos', 'Por favor ingresa correo y contraseña.');
            return;
        }

        if (correo === correoCorrecto && clave === claveCorrecta) {
            onLogin();
        } else {
            alert('Credenciales incorrectas', 'El correo o la contraseña son incorrectos.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>📦</Text>
                <Text style={styles.titulo}>Control de Bodega</Text>
                <Text style={styles.subtitulo}>Ingresa con tu cuenta de bodeguero</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={correo}
                    onChangeText={setCorreo}
                    placeholder="Correo Electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    value={clave}
                    onChangeText={setClave}
                    placeholder="Contraseña"
                    secureTextEntry
                />

                <Pressable style={styles.boton} onPress={iniciarSesion}>
                    <Text style={styles.textBoton}>Iniciar Sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8fafc',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        fontSize: 48,
        marginBottom: 10,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 6,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        maxWidth: 320,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        fontSize: 16,
    },
    boton: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    textBoton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
import { View, Text, StyleSheet } from 'react-native';

export default function ConfigScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Configuración</Text>
            <Text style={styles.subtitulo}>Ajustes de la bodega</Text>

            <View style={styles.tarjeta}>
                <Text style={styles.dato}>Nombre bodega</Text>
                <Text style={styles.valor}>Bodega ULEAM</Text>
            </View>

            <View style={styles.tarjeta}>
                <Text style={styles.dato}>Alerta stock bajo</Text>
                <Text style={styles.valor}>Activada</Text>
            </View>
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
    tarjeta: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 16,
        width: '100%',
        maxWidth: 320,
        marginBottom: 12,
    },
    dato: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    valor: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
});

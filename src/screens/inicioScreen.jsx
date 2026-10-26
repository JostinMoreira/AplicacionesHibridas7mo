import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import SensorMovimiento from '../components/SensorMovimiento';
import SensorGPS from '../components/SensorGPS';

export default function InicioScreen() {
    const [sensorActivo, setSensorActivo] = useState('acelerometro'); // 'acelerometro' | 'gps'

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Inicio</Text>
            <Text style={styles.subtitulo}>Resumen de bodega</Text>

            <View style={styles.explicacion}>
                <Text style={styles.explicacionTitulo}>Práctica de sensores</Text>
                <Text style={styles.explicacionTexto}>
                    El acelerómetro muestra el movimiento del teléfono en los ejes X, Y y Z. El GPS captura las coordenadas con tu permiso. En esta app, el GPS puede registrar la ubicación de la bodega y el acelerómetro detectar movimientos del dispositivo.
                </Text>
            </View>

            <View style={styles.fila}>
                <View style={styles.tarjeta}>
                    <Text style={styles.numero}>120</Text>
                    <Text style={styles.texto}>Total productos</Text>
                </View>
                <View style={styles.tarjeta}>
                    <Text style={styles.numero}>8</Text>
                    <Text style={styles.texto}>Stock bajo</Text>
                </View>
            </View>

            {/* Selector de Sensor para Práctica */}
            <View style={styles.pestanasContainer}>
                <Pressable
                    style={[
                        styles.pestana,
                        sensorActivo === 'acelerometro' && styles.pestanaActiva,
                    ]}
                    onPress={() => setSensorActivo('acelerometro')}
                >
                    <Text
                        style={[
                            styles.pestanaTexto,
                            sensorActivo === 'acelerometro' && styles.pestanaTextoActiva,
                        ]}
                    >
                        📲 Acelerómetro
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.pestana,
                        sensorActivo === 'gps' && styles.pestanaActiva,
                    ]}
                    onPress={() => setSensorActivo('gps')}
                >
                    <Text
                        style={[
                            styles.pestanaTexto,
                            sensorActivo === 'gps' && styles.pestanaTextoActiva,
                        ]}
                    >
                        📍 GPS / Ubicación
                    </Text>
                </Pressable>
            </View>

            {/* Vista dinámica del Sensor */}
            {sensorActivo === 'acelerometro' ? <SensorMovimiento /> : <SensorGPS />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 20,
        paddingBottom: 40,
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
    explicacion: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        width: '100%',
        maxWidth: 340,
        marginBottom: 16,
    },
    explicacionTitulo: {
        color: '#1e3a8a',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },
    explicacionTexto: {
        color: '#334155',
        fontSize: 12,
        lineHeight: 18,
    },
    fila: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    tarjeta: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        minWidth: 130,
    },
    numero: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    texto: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    pestanasContainer: {
        flexDirection: 'row',
        backgroundColor: '#e2e8f0',
        borderRadius: 10,
        padding: 4,
        width: '100%',
        maxWidth: 340,
        marginBottom: 6,
    },
    pestana: {
        flex: 1,
        paddingVertical: 9,
        alignItems: 'center',
        borderRadius: 8,
    },
    pestanaActiva: {
        backgroundColor: '#ffffff',
        boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
    },
    pestanaTexto: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
    },
    pestanaTextoActiva: {
        color: '#0284c7',
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function SensorGPS() {
    const [ubicacion, setUbicacion] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const obtenerUbicacion = async () => {
        setCargando(true);
        setErrorMsg(null);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado. Actívalo en los ajustes para usar el GPS.');
                return;
            }

            const posicion = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setUbicacion(posicion.coords);
        } catch (error) {
            setErrorMsg('No se pudo obtener la ubicación. Verifica que el GPS esté activo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.icono}>📍</Text>
                <View style={styles.headerTexto}>
                    <Text style={styles.titulo}>Sensor GPS / Ubicación</Text>
                    <Text style={styles.subtitulo}>Geolocalización en tiempo real</Text>
                </View>
            </View>

            {ubicacion ? (
                <View style={styles.coordenadasContainer}>
                    <View style={styles.filaDato}>
                        <Text style={styles.label}>Latitud:</Text>
                        <Text style={styles.valor}>{ubicacion.latitude.toFixed(5)}°</Text>
                    </View>
                    <View style={styles.filaDato}>
                        <Text style={styles.label}>Longitud:</Text>
                        <Text style={styles.valor}>{ubicacion.longitude.toFixed(5)}°</Text>
                    </View>
                    {ubicacion.altitude !== null && (
                        <View style={styles.filaDato}>
                            <Text style={styles.label}>Altitud:</Text>
                            <Text style={styles.valor}>{ubicacion.altitude.toFixed(1)} m</Text>
                        </View>
                    )}
                    {ubicacion.speed !== null && (
                        <View style={styles.filaDato}>
                            <Text style={styles.label}>Velocidad:</Text>
                            <Text style={styles.valor}>{(ubicacion.speed * 3.6).toFixed(1)} km/h</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderTexto}>
                        Presiona el botón para capturar las coordenadas de tu bodega o posición actual.
                    </Text>
                </View>
            )}

            {errorMsg && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTexto}>⚠️ {errorMsg}</Text>
                </View>
            )}

            <Pressable
                style={[styles.boton, cargando && styles.botonDeshabilitado]}
                onPress={obtenerUbicacion}
                disabled={cargando}
            >
                {cargando ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                    <Text style={styles.botonTexto}>
                        {ubicacion ? '🔄 Actualizar Ubicación' : '📡 Obtener Coordenadas GPS'}
                    </Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        maxWidth: 340,
        marginTop: 16,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    headerTexto: {
        flex: 1,
    },
    icono: {
        fontSize: 24,
        marginRight: 10,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    subtitulo: {
        fontSize: 12,
        color: '#64748b',
    },
    coordenadasContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        gap: 6,
    },
    filaDato: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    valor: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    placeholderContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
        alignItems: 'center',
    },
    placeholderTexto: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 18,
    },
    errorContainer: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
    },
    errorTexto: {
        color: '#b91c1c',
        fontSize: 12,
        textAlign: 'center',
    },
    boton: {
        backgroundColor: '#0284c7',
        paddingVertical: 11,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonDeshabilitado: {
        backgroundColor: '#94a3b8',
    },
    botonTexto: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});

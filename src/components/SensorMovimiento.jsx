import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function SensorMovimiento() {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [disponible, setDisponible] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let subscription = null;

        // Si es web y estamos en navegador común sin sensores de orientación
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const manejarMovimientoWeb = (event) => {
                if (!isMounted) return;
                const acc = event.accelerationIncludingGravity || event.acceleration;
                if (acc && acc.x !== null) {
                    setData({
                        x: (acc.x || 0) / 9.8,
                        y: (acc.y || 0) / 9.8,
                        z: (acc.z || 0) / 9.8,
                    });
                }
            };

            if ('DeviceMotionEvent' in window) {
                window.addEventListener('devicemotion', manejarMovimientoWeb);
                subscription = {
                    remove: () => window.removeEventListener('devicemotion', manejarMovimientoWeb),
                };
            } else {
                setDisponible(false);
            }
        } else {
            // Entorno nativo (Android / iOS con Expo Go o Dev Client)
            Accelerometer.isAvailableAsync()
                .then((isAvailable) => {
                    if (!isMounted) return;
                    setDisponible(isAvailable);
                    if (isAvailable) {
                        try {
                            if (Platform.OS !== 'web') {
                                Accelerometer.setUpdateInterval(300);
                            }
                            subscription = Accelerometer.addListener((accelerometerData) => {
                                if (isMounted) {
                                    setData(accelerometerData);
                                }
                            });
                        } catch (err) {
                            console.warn('Error al iniciar listener de acelerómetro:', err);
                            if (isMounted) setDisponible(false);
                        }
                    }
                })
                .catch(() => {
                    if (isMounted) setDisponible(false);
                });
        }

        return () => {
            isMounted = false;
            if (subscription && typeof subscription.remove === 'function') {
                subscription.remove();
            }
        };
    }, []);

    // Calcular la intensidad del movimiento general
    const magnitud = Math.sqrt(x * x + y * y + z * z);
    const enMovimiento = Math.abs(magnitud - 1) > 0.25;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.icono}>📡</Text>
                <View>
                    <Text style={styles.titulo}>Sensor de Movimiento</Text>
                    <Text style={styles.subtitulo}>Acelerómetro ({Platform.OS})</Text>
                </View>
            </View>

            {disponible === null ? (
                <View style={styles.avisoBox}>
                    <Text style={styles.aviso}>Comprobando disponibilidad del acelerómetro…</Text>
                </View>
            ) : !disponible ? (
                <View style={styles.avisoBox}>
                    <Text style={styles.aviso}>
                        El acelerómetro no está disponible en este navegador o dispositivo.
                    </Text>
                    <Text style={styles.avisoDetalle}>
                        Para probar sensores de movimiento en tiempo real, abre la app en un teléfono físico con Expo Go.
                    </Text>
                </View>
            ) : (
                <View style={styles.cuerpo}>
                    <View style={styles.filaEjes}>
                        <View style={styles.eje}>
                            <Text style={styles.ejeLetra}>X</Text>
                            <Text style={styles.ejeValor}>{x.toFixed(2)}</Text>
                        </View>
                        <View style={styles.eje}>
                            <Text style={styles.ejeLetra}>Y</Text>
                            <Text style={styles.ejeValor}>{y.toFixed(2)}</Text>
                        </View>
                        <View style={styles.eje}>
                            <Text style={styles.ejeLetra}>Z</Text>
                            <Text style={styles.ejeValor}>{z.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={[styles.badge, enMovimiento ? styles.badgeMovimiento : styles.badgeReposo]}>
                        <Text style={[styles.badgeTexto, enMovimiento ? styles.badgeTextoMovimiento : styles.badgeTextoReposo]}>
                            {enMovimiento ? '⚠️ Dispositivo en movimiento' : '🟢 Dispositivo en reposo'}
                        </Text>
                    </View>
                </View>
            )}
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
        marginBottom: 12,
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
    cuerpo: {
        gap: 12,
    },
    filaEjes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 10,
    },
    eje: {
        alignItems: 'center',
        flex: 1,
    },
    ejeLetra: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    ejeValor: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0f172a',
        marginTop: 2,
    },
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    badgeReposo: {
        backgroundColor: '#ecfdf5',
    },
    badgeMovimiento: {
        backgroundColor: '#fef3c7',
    },
    badgeTexto: {
        fontSize: 12,
        fontWeight: '600',
    },
    badgeTextoReposo: {
        color: '#047857',
    },
    badgeTextoMovimiento: {
        color: '#b45309',
    },
    avisoBox: {
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    aviso: {
        fontSize: 13,
        color: '#b91c1c',
        textAlign: 'center',
        fontWeight: '600',
    },
    avisoDetalle: {
        fontSize: 12,
        color: '#7f1d1d',
        textAlign: 'center',
        marginTop: 4,
    },
});

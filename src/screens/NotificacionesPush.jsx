import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const CANAL_NOTIFICACIONES = 'default';

async function prepararCanalAndroid() {
    if (Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync(CANAL_NOTIFICACIONES, {
        name: 'Notificaciones de práctica',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563eb',
    });
}

export default function NotificacionesPushScreen() {
    const [notificacion, setNotificacion] = useState(null);
    const [enviandoPush, setEnviandoPush] = useState(false);
    const [estadoEnvioPush, setEstadoEnvioPush] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        prepararCanalAndroid().catch((e) => setError(e.message));

        const listenerRecibida = Notifications.addNotificationReceivedListener((aviso) => {
            setNotificacion(aviso.request.content);
        });
        const listenerRespuesta = Notifications.addNotificationResponseReceivedListener((respuesta) => {
            setNotificacion(respuesta.notification.request.content);
        });

        return () => {
            listenerRecibida.remove();
            listenerRespuesta.remove();
        };
    }, []);

    const obtenerTokenPush = async () => {
        await prepararCanalAndroid();
        const permisosActuales = await Notifications.getPermissionsAsync();
        const permisosFinales = permisosActuales.status === 'granted'
            ? permisosActuales
            : await Notifications.requestPermissionsAsync();

        if (permisosFinales.status !== 'granted') {
            throw new Error('No se concedieron permisos para mostrar notificaciones.');
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId
            ?? Constants.easConfig?.projectId;
        if (!projectId) {
            throw new Error('Falta configurar el projectId de EAS.');
        }

        const resultado = await Notifications.getExpoPushTokenAsync({ projectId });
        return resultado.data;
    };

    const enviarNotificacionPushDePrueba = async () => {
        setEnviandoPush(true);
        setError('');
        setEstadoEnvioPush('');

        try {
            const token = await obtenerTokenPush();
            const respuesta = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: token,
                    title: 'Prueba push remota',
                    body: 'La notificación llegó desde Expo al emulador Android.',
                    sound: 'default',
                    channelId: CANAL_NOTIFICACIONES,
                    data: { tipo: 'practica-push-remota' },
                }),
            });
            const resultado = await respuesta.json();
            const ticket = Array.isArray(resultado.data) ? resultado.data[0] : resultado.data;

            if (!respuesta.ok || ticket?.status !== 'ok') {
                throw new Error(ticket?.message || resultado.errors?.[0]?.message || 'Expo no aceptó el envío de prueba.');
            }

            setEstadoEnvioPush('Expo aceptó el envío. Consultando su comprobante de entrega…');
            if (ticket.id) {
                await new Promise((resolve) => setTimeout(resolve, 12000));
                const respuestaComprobante = await fetch('https://exp.host/--/api/v2/push/getReceipts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: [ticket.id] }),
                });
                const comprobante = await respuestaComprobante.json();
                const recibo = comprobante.data?.[ticket.id];

                if (recibo?.status === 'error') {
                    throw new Error(recibo.message || recibo.details?.error || 'FCM rechazó la notificación.');
                }

                if (recibo?.status === 'ok') {
                    setEstadoEnvioPush('FCM aceptó la notificación. Revisa el aviso y el último evento recibido.');
                } else {
                    setEstadoEnvioPush('Expo aceptó el envío; todavía no hay comprobante disponible.');
                }
            }
        } catch (e) {
            setError(e.message || 'No se pudo enviar la notificación push de prueba.');
        } finally {
            setEnviandoPush(false);
        }
    };

    const enviarNotificacionLocal = async () => {
        setError('');
        try {
            await prepararCanalAndroid();
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Notificación local de prueba',
                    body: 'La aplicación programó este aviso en el dispositivo.',
                    sound: true,
                    data: { tipo: 'practica-local' },
                },
                trigger: null,
            });
        } catch (e) {
            setError(e.message || 'No se pudo mostrar la notificación local.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.contenedor}>
            <Text style={styles.titulo}>Notificaciones push</Text>
            <Text style={styles.subtitulo}>
                Práctica individual: avisos remotos y locales.
            </Text>

            <View style={styles.tarjeta}>
                <Text style={styles.etiqueta}>Prueba push remota</Text>
                <Text style={styles.ayuda}>
                    Envía una notificación de prueba a este dispositivo.
                </Text>
                <Pressable
                    accessibilityRole="button"
                    disabled={enviandoPush}
                    style={[styles.boton, enviandoPush && styles.botonDeshabilitado]}
                    onPress={enviarNotificacionPushDePrueba}
                >
                    {enviandoPush
                        ? <ActivityIndicator color="#ffffff" />
                        : <Text style={styles.textoBoton}>Enviar push remota de prueba</Text>}
                </Pressable>
                {estadoEnvioPush ? <Text style={styles.ayuda}>{estadoEnvioPush}</Text> : null}
            </View>

            <View style={styles.tarjeta}>
                <Text style={styles.etiqueta}>Prueba local</Text>
                <Text style={styles.ayuda}>
                    Este aviso lo programa la app y no necesita Firebase ni servidor remoto.
                </Text>
                <Pressable accessibilityRole="button" style={styles.botonSecundario} onPress={enviarNotificacionLocal}>
                    <Text style={styles.textoBotonSecundario}>Mostrar notificación local</Text>
                </Pressable>
            </View>

            <View style={styles.tarjeta}>
                <Text style={styles.etiqueta}>Último aviso recibido</Text>
                <Text style={styles.valor}>{notificacion?.title || 'Ninguno todavía'}</Text>
                {notificacion?.body ? <Text style={styles.ayuda}>{notificacion.body}</Text> : null}
            </View>

            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

            <Text style={styles.nota}>
                Push remoto Android requiere una development build y credenciales FCM V1. Los emuladores Android con Google Play Services también pueden recibir notificaciones push.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flexGrow: 1,
        backgroundColor: '#f8fafc',
        padding: 20,
        paddingBottom: 36,
    },
    titulo: {
        color: '#1e293b',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 8,
    },
    subtitulo: {
        color: '#64748b',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 6,
        marginBottom: 18,
    },
    tarjeta: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
    },
    etiqueta: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
    },
    valor: {
        color: '#0f172a',
        fontSize: 15,
    },
    ayuda: {
        color: '#64748b',
        fontSize: 13,
        lineHeight: 19,
        marginTop: 6,
    },
    boton: {
        alignItems: 'center',
        backgroundColor: '#2563eb',
        borderRadius: 9,
        justifyContent: 'center',
        minHeight: 46,
        paddingHorizontal: 14,
        marginVertical: 16,
    },
    botonDeshabilitado: {
        opacity: 0.7,
    },
    textoBoton: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    botonSecundario: {
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        borderWidth: 1,
        borderRadius: 9,
        justifyContent: 'center',
        minHeight: 44,
        paddingHorizontal: 12,
        marginTop: 14,
    },
    textoBotonSecundario: {
        color: '#1d4ed8',
        fontSize: 14,
        fontWeight: '700',
    },
    error: {
        color: '#b91c1c',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 12,
    },
    nota: {
        color: '#475569',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 2,
    },
});

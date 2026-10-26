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
import * as Device from 'expo-device';
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

function ocultarToken(token) {
    if (!token) return '';
    if (token.length < 18) return `${token.slice(0, 4)}••••`;
    return `${token.slice(0, 12)}••••••••${token.slice(-6)}`;
}

export default function NotificacionesPushScreen() {
    const [token, setToken] = useState('');
    const [estadoPermiso, setEstadoPermiso] = useState('Sin consultar');
    const [notificacion, setNotificacion] = useState(null);
    const [cargando, setCargando] = useState(false);
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

    const solicitarPermisosYToken = async () => {
        setCargando(true);
        setError('');

        try {
            await prepararCanalAndroid();
            const permisosActuales = await Notifications.getPermissionsAsync();
            setEstadoPermiso(permisosActuales.status);

            let permisosFinales = permisosActuales;
            if (permisosActuales.status !== 'granted') {
                permisosFinales = await Notifications.requestPermissionsAsync();
                setEstadoPermiso(permisosFinales.status);
            }

            if (permisosFinales.status !== 'granted') {
                setToken('');
                setError('No se concedieron permisos. Puedes activarlos en los ajustes del dispositivo.');
                return;
            }

            if (!Device.isDevice) {
                setToken('');
                setError('Para obtener un token push usa un dispositivo físico Android. La notificación local sí puede probarse en Expo Go.');
                return;
            }

            const projectId = Constants.expoConfig?.extra?.eas?.projectId
                ?? Constants.easConfig?.projectId;
            if (!projectId) {
                setToken('');
                setError('Falta el projectId de EAS. Configura tu proyecto con eas init y añade el ID real en extra.eas.projectId.');
                return;
            }

            const resultado = await Notifications.getExpoPushTokenAsync({ projectId });
            setToken(resultado.data);
        } catch (e) {
            setError(e.message || 'No se pudo obtener el token. Revisa conexión, permisos y configuración de Expo.');
        } finally {
            setCargando(false);
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
                Práctica individual: permisos, token Expo y notificación local.
            </Text>

            <View style={styles.tarjeta}>
                <Text style={styles.etiqueta}>Permiso</Text>
                <Text style={styles.valor}>{estadoPermiso}</Text>
                <Text style={styles.ayuda}>
                    Primero se crea el canal Android y luego se consulta o solicita el permiso.
                </Text>

                <Pressable
                    accessibilityRole="button"
                    disabled={cargando}
                    style={[styles.boton, cargando && styles.botonDeshabilitado]}
                    onPress={solicitarPermisosYToken}
                >
                    {cargando
                        ? <ActivityIndicator color="#ffffff" />
                        : <Text style={styles.textoBoton}>Solicitar permisos y obtener token</Text>}
                </Pressable>

                <Text style={styles.etiqueta}>ExpoPushToken</Text>
                <Text selectable style={styles.token}>
                    {token ? ocultarToken(token) : 'Aún no obtenido'}
                </Text>
                <Text style={styles.ayuda}>
                    El token completo se mantiene en memoria para la práctica. No lo compartas públicamente.
                </Text>
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
                Push remota Android requiere una development build y credenciales FCM V1. Expo Go permite probar la notificación local, pero no la recepción push remota.
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
    token: {
        color: '#1d4ed8',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
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

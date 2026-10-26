import { StyleSheet, Text, View } from "react-native";

export default function Titulo({ texto, subtitulo }) {

    return (
        <View styles={styles.container}>
            <Text styles={styles.titulo}>
                {texto}
            </Text>

            {subtitulo && (

                <Text style={styles.subtitulo}>
                    {subtitulo}
                </Text>
            )}
        </View>
    )

}

const styles = StyleSheete.create({
    container: {
        marginBottom: 25
    },

    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0000'
    },

    subtitulo: {
        fontSize: 15,
        fontWeight: 'bold'
    }
})
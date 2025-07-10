import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLoginMutation } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();

    const onSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa ambos campos.');
            return;
        }

        try {
            const response: any = await login({ email, password });
            if (response?.data) {
                dispatch(setUser(response.data));
            } else {
                Alert.alert('Error', 'Credenciales incorrectas o problema con el servidor.');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
        }
    };

    return (
        <View style={styles.container}>

            {/* Contenido */}
            <View style={styles.content}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    placeholderTextColor="#555"
                />
                <TextInput
                    placeholder="Contraseña"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholderTextColor="#555"
                />

                <TouchableOpacity onPress={onSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                    </Text>
                </TouchableOpacity>

                {isError && (
                    <Text style={styles.errorText}>
                        {(() => {
                            if ("data" in (error as any)) {
                                const message = (error as any)?.data?.error?.message;
                                if (message === 'INVALID_PASSWORD') return 'Contraseña incorrecta.';
                                if (message === 'EMAIL_NOT_FOUND') return 'Email no registrado.';
                                return 'Error al iniciar sesión.';
                            } else {
                                return 'Error desconocido.';
                            }
                        })()}
                    </Text>
                )}

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>¿No tienes cuenta? Registrate aquí</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        position: 'absolute',
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        color: '#000',
    },
    button: {
        backgroundColor: '#0078D7',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#2E2E2E',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert
} from 'react-native';
import { useSignupMutation } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';


type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [triggerSignup, { isLoading, isError, error }] = useSignupMutation();
    const dispatch = useDispatch();

    const onSubmit = async () => {
        try {
            const response = await triggerSignup({
                email,
                password,
                returnSecureToken: true,
            }).unwrap();

            dispatch(setUser({
                email: response.email,
                idToken: response.idToken,
                localId: response.localId,
                fullName,
            }));
        } catch (err: any) {
            let errorMessage = 'Error desconocido';
            if ("data" in err) {
                errorMessage = err.data?.error?.message || errorMessage;
            }
            Alert.alert('Error en registro', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />


            <TextInput
                placeholder="Nombre completo"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#999"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={styles.buttonText}>{isLoading ? 'Cargando...' : 'Crear cuenta'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>¿Ya tienes cuenta? Iniciar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,

    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 26,
        color: '#0D0D0D',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#0D0D0D',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        color: '#0D0D0D',
        marginBottom: 15,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#0078D7',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#1e90ff',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});

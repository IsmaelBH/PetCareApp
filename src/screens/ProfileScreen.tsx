import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { PROFILE_IMAGE_KEY } from '../constants/storageKeys';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function ProfileScreen() {
    const { email, fullName, uid } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        const loadImage = async () => {
            const savedUri = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
            if (savedUri) setImageUri(savedUri);
        };
        loadImage();
    }, []);

    useEffect(() => {
        if (!uid) return;

        const db = getDatabase();

        // Compras
        const dbPurchasesRef = ref(db, `purchases/${uid}`);
        const unsubscribePurchases = onValue(dbPurchasesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed = Object.values(data);
                setPurchases(parsed.reverse());
            } else {
                setPurchases([]);
            }
        });

        // Turnos
        const dbAppointmentsRef = ref(db, `appointmentsPorUsuario/${uid}`);
        const unsubscribeAppointments = onValue(dbAppointmentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed = Object.values(data);
                setAppointments(parsed.reverse());
            } else {
                setAppointments([]);
            }
        });

        return () => {
            unsubscribePurchases();
            unsubscribeAppointments();
        };
    }, [uid]);

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Acceso denegado', 'Por favor habilita la cámara desde ajustes.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const sourceUri = result.assets[0].uri;
            const fileName = sourceUri.split('/').pop() || `profile_${Date.now()}.jpg`;
            const newPath = FileSystem.documentDirectory + fileName;

            try {
                await FileSystem.copyAsync({ from: sourceUri, to: newPath });
                await AsyncStorage.setItem(PROFILE_IMAGE_KEY, newPath);
                setImageUri(newPath);
            } catch (error) {
                Alert.alert('Error', 'No se pudo guardar la imagen');
            }
        }
    };

    const renderPurchaseCard = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.dateText}>📅 {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.totalText}>💰 Total: ${item.total}</Text>
            {item.items.map((prod: any, idx: number) => (
                <Text key={idx} style={styles.productText}>
                    • {prod.name} x{prod.quantity}
                </Text>
            ))}
        </View>
    );

    const renderAppointmentCard = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.dateText}>📆 Día: {item.date}</Text>
            <Text style={styles.productText}>🕒 Hora: {item.time}</Text>
            <Text style={styles.productText}>🩺 Tipo: {item.type}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={imageUri ? { uri: imageUri } : require('../../assets/logo.png')}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={styles.cameraIcon} onPress={openCamera}>
                        <MaterialIcons name="photo-camera" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {fullName && (
                    <>
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.info}>{fullName}</Text>
                    </>
                )}
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.info}>{email}</Text>

                {appointments.length > 0 && (
                    <>
                        <Text style={[styles.label, { marginTop: 30 }]}>Historial de turnos:</Text>
                        <FlatList
                            data={appointments}
                            keyExtractor={(_, index) => `appt-${index}`}
                            renderItem={renderAppointmentCard}
                            scrollEnabled={false}
                        />
                    </>
                )}

                {purchases.length > 0 && (
                    <>
                        <Text style={[styles.label, { marginTop: 30 }]}>Historial de compras:</Text>
                        <FlatList
                            data={purchases}
                            keyExtractor={(_, index) => `purchase-${index}`}
                            renderItem={renderPurchaseCard}
                            scrollEnabled={false}
                        />
                    </>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.logoutContainer} onPress={() => dispatch(logout())}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 20,
    },
    profileImageContainer: {
        position: 'relative',
        alignItems: 'center',
        marginTop: 60,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 110,
        backgroundColor: '#555',
        borderRadius: 20,
        padding: 6,
    },
    label: {
        color: '#444',
        fontSize: 16,
        marginTop: 20,
    },
    info: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    logoutContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    logoutText: {
        color: '#1e90ff',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginTop: 12,
        elevation: 3,
    },
    dateText: {
        color: '#000',
        fontSize: 14,
        marginBottom: 4,
    },
    totalText: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    productText: {
        color: '#444',
        fontSize: 14,
    },
});

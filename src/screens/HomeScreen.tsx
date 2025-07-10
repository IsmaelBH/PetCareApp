import { useNavigation } from '@react-navigation/native';

import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Appointment')}>
                    <Image source={require('../../assets/icons/shows.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Store')}>
                    <Image source={require('../../assets/icons/store.png')} style={styles.icon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={require('../../assets/icons/profile.png')} style={styles.icon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                    <Image source={require('../../assets/icons/cart.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',

    },
    video: {
        ...StyleSheet.absoluteFillObject,
        transform: [{ rotate: '180deg' }],
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    logo: {
        width: 220,
        height: 220,
        marginBottom: 20,
        zIndex: 2,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
        bottom: 60,
        paddingHorizontal: 10,
        zIndex: 2,
    },
    icon: {
        width: 28,
        height: 28,
        marginHorizontal: 10,
    },
});


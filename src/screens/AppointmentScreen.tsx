import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    Platform,
    Pressable,
    Image,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { rtdb } from '../firebase/firebase';
import { ref, set, get } from 'firebase/database';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import logo from '../../assets/logo.png';

const AppointmentScreen = () => {
    const uid = useSelector((state: RootState) => state.auth.uid);
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedType, setSelectedType] = useState('vacunas');
    const [unavailableSlots, setUnavailableSlots] = useState<any>({});

    const timeSlots = [
        '09:30', '10:00', '10:30', '11:00', '11:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    ];
    const appointmentTypes = ['vacunas', 'control', 'cirugías', 'baño', 'otros'];

    const getCurrentWeekDays = () => {
        const days: string[] = [];
        const today = new Date();
        let count = 0;
        let date = new Date();

        while (count < 5) {
            const day = date.getDay(); // 0 (Sun) to 6 (Sat)
            if (day >= 1 && day <= 5) {
                days.push(date.toISOString().split('T')[0]);
                count++;
            }
            date.setDate(date.getDate() + 1);
        }

        return days;
    };


    const isDateAvailable = (date: string) => {
        return getCurrentWeekDays().includes(date);
    };

    const fetchUnavailableSlots = async () => {
        const snapshot = await get(ref(rtdb, 'appointments'));
        if (snapshot.exists()) {
            setUnavailableSlots(snapshot.val());
        }
    };

    const handleDayPress = (day: any) => {
        if (isDateAvailable(day.dateString)) {
            setSelectedDate(day.dateString);
            setModalVisible(true);
        }
    };

    const confirmAppointment = async () => {
        if (!selectedTime || !selectedDate || !uid) return;

        const slotRef = ref(rtdb, `appointments/${selectedDate}/${selectedTime}`);
        const snapshot = await get(slotRef);

        if (snapshot.exists()) {
            Alert.alert('Horario ocupado', 'Ese turno ya está reservado.');
            return;
        }

        await set(slotRef, {
            userId: uid,
            tipo: selectedType,
            hora: selectedTime,
            fecha: selectedDate,
        });

        setModalVisible(false);
        setSelectedTime('');
        setSelectedType('vacunas');
        Alert.alert('Turno reservado', `Día: ${selectedDate}\nHora: ${selectedTime}\nMotivo: ${selectedType}`);
    };

    useEffect(() => {
        fetchUnavailableSlots();
    }, []);

    const markedDates = {
        [selectedDate]: {
            selected: true,
            selectedColor: '#1e90ff',
            selectedTextColor: '#fff',
        },
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />

            <View style={styles.card}>
                <Calendar
                    onDayPress={handleDayPress}
                    markedDates={markedDates}
                    hideExtraDays={false}
                    theme={{
                        backgroundColor: '#111',
                        calendarBackground: '#111',
                        todayTextColor: '#1e90ff',
                        dayTextColor: '#fff',
                        textDisabledColor: '#444',
                        arrowColor: '#1e90ff',
                        selectedDayBackgroundColor: '#1e90ff',
                        selectedDayTextColor: '#fff',
                        monthTextColor: '#fff',
                    }}
                    dayComponent={({ date }) => {
                        const dateStr = date?.dateString;
                        const isAvailable = isDateAvailable(dateStr);
                        const isSelected = selectedDate === dateStr;

                        return (
                            <Pressable
                                onPress={() => isAvailable && handleDayPress({ dateString: dateStr })}
                                style={[
                                    styles.dayContainer,
                                    isSelected && styles.selectedDay,
                                ]}
                            >
                                <Text style={[
                                    styles.dayText,
                                    !isAvailable && styles.disabledText,
                                    isSelected && styles.selectedDayText,
                                ]}>
                                    {date.day}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </View>

            {/* MODAL */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Tipo de consulta</Text>
                                <Picker
                                    selectedValue={selectedType}
                                    onValueChange={(item) => setSelectedType(item)}
                                >
                                    {appointmentTypes.map((type) => (
                                        <Picker.Item label={type} value={type} key={type} />
                                    ))}
                                </Picker>

                                <Text style={styles.modalTitle}>Horario</Text>
                                <Picker
                                    selectedValue={selectedTime}
                                    onValueChange={(item) => setSelectedTime(item)}
                                >
                                    <Picker.Item label="Seleccionar hora" value="" />
                                    {timeSlots.filter(slot => !unavailableSlots?.[selectedDate]?.[slot])
                                        .map((slot) => (
                                            <Picker.Item key={slot} label={slot} value={slot} />
                                        ))}
                                </Picker>

                                <TouchableOpacity style={styles.confirmButton} onPress={confirmAppointment}>
                                    <Text style={styles.confirmText}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 40 : 60,

    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 40,
    },
    card: {
        width: '90%',
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
    },
    dayContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    dayText: {
        color: '#fff',
    },
    selectedDay: {
        backgroundColor: '#1e90ff',
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledText: {
        color: '#666',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '85%',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
    confirmButton: {
        backgroundColor: '#1e90ff',
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
    },
});

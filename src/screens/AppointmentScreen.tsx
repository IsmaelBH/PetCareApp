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
    ScrollView,
    Image,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { rtdb } from '../firebase/firebase';
import { ref, set, get, push } from 'firebase/database';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import logo from '../../assets/logo.png';

const AppointmentScreen = () => {
    const userId = useSelector((state: RootState) => state.auth.uid);
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedType, setSelectedType] = useState('vacunas');
    const [unavailableSlots, setUnavailableSlots] = useState<any>({});

    const timeSlots = [
        '09:30', '10:00', '10:30', '11:00', '11:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    ];
    const appointmentTypes = ['Control', 'Baño', 'Vacunas', 'Cirugías', 'Otros'];

    const getValidWeekDays = () => {
        const result: string[] = [];
        const today = new Date();
        let added = 0;
        let date = new Date(today);

        while (added < 5) {
            const day = date.getDay();
            if (day >= 1 && day <= 5) {
                result.push(date.toISOString().split('T')[0]);
                added++;
            }
            date.setDate(date.getDate() + 1);
        }
        return result;
    };

    const isDateAvailable = (date: string) => {
        return getValidWeekDays().includes(date);
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
        if (!selectedTime || !selectedDate) return;

        const slotRef = ref(rtdb, `appointments/${selectedDate}/${selectedTime}`);
        const snapshot = await get(slotRef);

        if (snapshot.exists()) {
            Alert.alert('Horario ocupado', 'Ese turno ya está reservado.');
            return;
        }

        await set(slotRef, {
            userId,
            tipo: selectedType,
            hora: selectedTime,
        });

        // 👉 Guardar en historial del usuario
        const userApptRef = ref(rtdb, `appointmentsPorUsuario/${userId}`);
        const newAppt = {
            date: selectedDate,
            time: selectedTime,
            type: selectedType,
        };
        await push(userApptRef, newAppt);

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
                        backgroundColor: '#fff',
                        calendarBackground: '#fff',
                        todayTextColor: '#1e90ff',
                        dayTextColor: '#000',
                        textDisabledColor: '#ccc',
                        arrowColor: '#1e90ff',
                        selectedDayBackgroundColor: '#1e90ff',
                        selectedDayTextColor: '#fff',
                        monthTextColor: '#000',
                    }}
                    dayComponent={({ date }) => {
                        if (!date || !date.dateString) return null;

                        const dateStr = date.dateString;
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
                                <Text
                                    style={[
                                        styles.dayText,
                                        !isAvailable && styles.disabledText,
                                        isSelected && styles.selectedDayText,
                                    ]}
                                >
                                    {date.day}
                                </Text>
                            </Pressable>
                        );
                    }}

                />
            </View>

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
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 40 : 60,
        backgroundColor: '#f2f2f2',
    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
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
        color: '#000',
    },
    selectedDay: {
        backgroundColor: '#1e90ff',
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledText: {
        color: '#ccc',
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


# 🐾 PetCare App - Turnos Veterinarios y Tienda

**Proyecto personal - React Native con Expo SDK 53**  
Autor: Ismael Barbé

---

## 📱 Descripción

PetCareApp es una aplicación móvil desarrollada para una veterinaria. Permite a los usuarios:

- Registrarse e iniciar sesión 🔐  
- Ver y editar su perfil, incluyendo una foto desde la cámara 📸  
- Acceder a una tienda con productos de la veterinaria 🛍️  
- Agendar turnos para atención veterinaria con motivo y horario 📅  
- Visualizar historial de compras y reservas en el perfil 👤  
- Cerrar sesión 🔓  

Incluye almacenamiento en Firebase Realtime Database, Firestore y uso de Redux Toolkit. La app está optimizada para Android con diseño limpio y moderno.

---

## 🗂️ Estructura de Carpetas

```
PetCareApp/
│
├── assets/                # Imágenes, logo
│
├── src/
│   ├── api/               # Servicios de autenticación
│   ├── firebase/          # Config de Firebase
│   ├── navigation/        # Stack navigators
│   ├── redux/
│   │   ├── slices/        # authSlice, cartSlice
│   │   └── store.ts       # Configuración Redux Toolkit
│   ├── screens/           # Pantallas (Login, Registro, Perfil, Store, Cart, Turnos)
│   └── types/             # Tipos TypeScript
│
├── App.tsx
├── app.json
├── eas.json
└── README.md
```

---

## 🔧 Tecnologías y Dependencias

### 📦 Core

```bash
npm install
```

### 📱 Navegación

```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
npx expo install @react-navigation/native @react-navigation/native-stack
```

### ⚙️ Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

### 🔥 Firebase

```bash
npm install firebase
```

### 📸 Cámara

```bash
npx expo install expo-camera expo-image-picker
```

### 📅 Calendario y formularios

```bash
npm install react-native-calendars @react-native-picker/picker
```

---

## 🚀 Cómo correr la app

1. Cloná el repositorio:

```bash
git clone https://github.com/IsmaelBH/PetCareApp.git
cd PetCareApp
```

2. Instalá las dependencias:

```bash
npm install
```

3. Iniciá Expo:

```bash
npx expo start
```

> Usá **Expo Go** en tu celular Android para escanear el QR y testear la app.

---

## 🛠️ Build para Android

```bash
eas build --platform android --profile production
```

> Necesitás tener configurado el `eas.json` y estar logueado con `npx expo login`.

---

## ✅ Estado del Proyecto

✅ Login y registro con Firebase funcionando  
✅ Tienda integrada con productos  
✅ Formulario de turnos por tipo y horario  
✅ Historial de compras y reservas  
✅ Diseño visual adaptado a veterinaria  
📦 Firebase, Redux y navegación funcionando correctamente

---

## 📌 Posibles mejoras futuras

- 📬 Notificaciones por email al agendar turno  
- 💳 Pago de servicios y productos  
- 🐶 Registro de múltiples mascotas por usuario

---

## 🧑‍💻 Contacto

📧 ismaelbarbe@gmail.com  
🌐 [GitHub - IsmaelBH](https://github.com/IsmaelBH)

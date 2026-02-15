import { theme } from '@/constants/theme';
import { firebaseConfig } from '@/firebase-config';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import React from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
require('@/assets/images/icon.png');

export default function LoginScreen() {
  //Constantes de alertas
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeAlert = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setAlertVisible(false));
  };
  //Constantes Firebase
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  ///Crear Cuenta
  const handleCreateAccount = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showAlert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }

    if (password.length < 8) {
      showAlert(
        'Contraseña inválida',
        'La contraseña debe tener al menos 8 caracteres',
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      router.replace('/(auth)/login');
      showAlert('Éxito', 'Cuenta creada correctamente');

      console.log(userCredential.user);
    } catch (error: any) {
      showAlert('Error', error.message);
    }
  };

  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Bee- Smart</Text>
            <Text style={styles.subtitle}>Suite de manejo</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.index}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombres y Apellidos"
              placeholderTextColor={theme.colors.mediumGray}
              autoCapitalize="none"
              onChangeText={(Text) => setName(Text)}
            />
            <Text style={styles.index}>Correo Electronico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo@gmail.com"
              placeholderTextColor={theme.colors.mediumGray}
              autoCapitalize="none"
              onChangeText={(Text) => setEmail(Text)}
            />
            <Text style={styles.index}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Insgresa tu Constraseña"
              placeholderTextColor={theme.colors.mediumGray}
              autoCapitalize="none"
              onChangeText={(Text) => setPassword(Text)}
              secureTextEntry={true}
            />
            <Text style={styles.index}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor={theme.colors.mediumGray}
              autoCapitalize="none"
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateAccount}
            >
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.replace('/(auth)/login');
              }}
            >
              <Text style={styles.subtitle}>Regresar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.term}>@2026 Bee-Smart</Text>
        </ScrollView>

        <Modal transparent visible={alertVisible} animationType="fade">
          <View style={styles.modalBackground}>
            <Animated.View
              style={[styles.alertBox, { transform: [{ scale: scaleAnim }] }]}
            >
              <Text style={styles.alertTitle}>{alertTitle}</Text>
              <Text style={styles.alertMessage}>{alertMessage}</Text>

              <TouchableOpacity style={styles.alertButton} onPress={closeAlert}>
                <Text style={styles.alertButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 200,
    justifyContent: 'center',
  },
  card: {
    width: 320,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.mediumGray,
    borderWidth: 2,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: 4,
  },
  passwordInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 70,
    marginBottom: -20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  Space: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.darkGray,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: theme.spacing.xs,
  },
  index: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.black,
    textAlign: 'left',
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  term: {
    fontSize: theme.typography.term.fontSize,
    color: theme.colors.darkGray,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.black,
    backgroundColor: theme.colors.lightGray,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  buttonRegister: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  registerButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.mediumGray,
    marginVertical: theme.spacing.md,
  },
  guestButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.xs,
    alignItems: 'center',
  },
  guestButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  footerText: {
    color: theme.colors.darkGray,
    fontSize: theme.typography.body.fontSize,
  },
  footerLink: {
    color: theme.colors.black,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 10,
    marginTop: 3,
    marginBottom: 3,
    textAlign: 'center',
    marginLeft: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  alertBox: {
    width: 280,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },

  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.black,
  },

  alertMessage: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.darkGray,
  },

  alertButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },

  alertButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
});

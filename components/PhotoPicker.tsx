import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, X } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface PhotoPickerProps {
  photoUri?: string;
  onPhotoSelected: (uri: string) => void;
  onPhotoRemoved: () => void;
  label?: string;
}

export default function PhotoPicker({
  photoUri,
  onPhotoSelected,
  onPhotoRemoved,
  label = 'Foto',
}: PhotoPickerProps) {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso necesario',
        'Se requiere acceso a la cámara para capturar fotos'
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la foto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickPhoto = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onPhotoRemoved}
            disabled={loading}
          >
            <X size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sin foto</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={handleTakePhoto}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} size="small" />
          ) : (
            <>
              <Camera size={20} color={theme.colors.white} />
              <Text style={styles.buttonText}>Capturar</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.uploadButton]}
          onPress={handlePickPhoto}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} size="small" />
          ) : (
            <>
              <Upload size={20} color={theme.colors.primary} />
              <Text style={[styles.buttonText, styles.uploadButtonText]}>
                Seleccionar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.lightGray,
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.mediumGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.darkGray,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    gap: theme.spacing.sm,
  },
  cameraButton: {
    backgroundColor: theme.colors.primary,
  },
  uploadButton: {
    backgroundColor: theme.colors.lightGray,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
  },
  uploadButtonText: {
    color: theme.colors.primary,
  },
});

import Header from '@/components/Header';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Image } from 'react-native';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.infoValue}>Apiary DashBorad</Text>
        <Text style={styles.subtitle}>
          Buenos dias {user?.name}. Tu colonias estan activas
        </Text>
        <View style={styles.imgtext}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.infoValue}>Alertas Prioitarias</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={require('@/assets/images/Apiary1.jpg')}
            style={styles.imgCard}
          />
          <Text style={styles.title}>INSPECCICIONES</Text>
          <Text style={styles.subtitle}>
            2 Colmenas necesitan una inspeccion hoy.
          </Text>
          <View style={styles.content}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.texButton}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imgtext}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.infoValue}>Acciones Rapidas</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.cardAcrions}>
            <View style={styles.iconContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
              />
            </View>
            <Text
              style={styles.textAction}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Nueva Inspeccion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardAcrions}>
            <View style={styles.iconContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
              />
            </View>
            <Text
              style={styles.textAction}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Añadir Nueva Colmena
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardAcrions}>
            <View style={styles.iconContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
              />
            </View>
            <Text
              style={styles.textAction}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Mover Colmena
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.imgtext}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.infoValue}>Tus Colmenas</Text>
          <TouchableOpacity>
            <Text style={styles.moreButton}>Ver mas</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.infoCard}>
          <View style={styles.imgtext}>
            <Image
              source={require('@/assets/images/Bee1.jpg')}
              style={styles.imgInfo}
            />
            <View>
              <Text style={styles.infoLabel}>Medow shine</Text>
              <Text style={styles.infoValue}>
                Ultima inspección hace- 2 días
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard}>
          <View style={styles.imgtext}>
            <Image
              source={require('@/assets/images/Bee1.jpg')}
              style={styles.imgInfo}
            />
            <View>
              <Text style={styles.infoLabel}>Medow shine</Text>
              <Text style={styles.infoValue}>
                Ultima inspección hace- 2 días
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {!user?.isGuest && (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Correo:</Text>
            <Text style={styles.subtitle}>{user?.email}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    padding: theme.spacing.md,
  },
  contentActions: {
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  cardAcrions: {
    width: 120,
    minHeight: 140,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  textAction: {
    fontSize: 17,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 18,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  moreButton: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    alignContent: 'center',
    marginTop: theme.spacing.xs,
    marginLeft: 120,
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.primary,
  },
  imgCard: {
    overflow: 'hidden',
    elevation: 6,
    borderEndEndRadius: theme.borderRadius,
    borderEndStartRadius: theme.borderRadius,
    width: '100%',
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 180,
  },
  imgInfo: {
    marginTop: theme.spacing.sm,
    marginBottom: -10,
    overflow: 'hidden',
    width: 80,
    height: 50,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.xll,
    marginLeft: theme.spacing.xll,
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  texButton: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.white,
    fontWeight: '600',
  },
  imgtext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRightWidth: 4,
    borderRightColor: theme.colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },

  infoValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.black,
  },
  navigationHint: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  navigationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
});

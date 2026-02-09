import Header from '@/components/Header';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type HiveCardProps = {
  image: ImageSourcePropType;
  title: string;
  lastCheck: string;
};
const HiveCard = ({ image, title, lastCheck }: HiveCardProps) => {
  return (
    <View style={styles.hiveCard}>
      <Image source={image} style={styles.hiveImage} />

      <View style={styles.hiveContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hiveTitle}>{title}</Text>
          <Text style={styles.hiveSubtitle}>
            📌 Última inspección hace - {lastCheck}
          </Text>
        </View>

        <TouchableOpacity style={styles.hiveButton}>
          <Text style={styles.hiveButtonText}>Inspeccionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default function Page1Screen() {
  const [active, setActive] = useState('todas');
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Colmenas</Text>
        <View style={styles.containerGrid}>
          <View style={styles.cardInfo}>
            <View style={styles.textInfo}>
              <Text style={styles.InfoText}>Colmenas Totales</Text>
            </View>
            <Text style={styles.InfoNumber}>12</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.textInfo}>
              <Text style={styles.InfoText}>Colmenas Saludables</Text>
            </View>
            <Text style={styles.InfoNumber}>10</Text>
          </View>
        </View>
        <View style={styles.containerGrid}>
          <View style={styles.cardInfo}>
            <View style={styles.textInfo}>
              <Text style={styles.InfoText}>Colmenas Saludables</Text>
            </View>
            <Text style={styles.InfoNumber}>10</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.textInfo}>
              <Text style={styles.InfoText}>Colmenas Saludables</Text>
            </View>
            <Text style={styles.InfoNumber}>10</Text>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} style={styles.icon} />
          <TextInput
            placeholder="Buscar Colmena"
            placeholderTextColor="#C7C7C7"
            style={styles.input}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[
              styles.cardActions,
              active === 'todas' ? styles.active : styles.inactive,
            ]}
            onPress={() => setActive('todas')}
          >
            <Text
              style={[
                styles.textAction,
                active === 'todas' && styles.textActive,
              ]}
            >
              Todas las Colmenas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cardActions,
              active === 'tratamiento' ? styles.active : styles.inactive,
            ]}
            onPress={() => setActive('tratamiento')}
          >
            <Text
              style={[
                styles.textAction,
                active === 'tratamiento' && styles.textActive,
              ]}
            >
              Necesitan Tratamiento
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cardActions,
              active === 'cosecha' ? styles.active : styles.inactive,
            ]}
            onPress={() => setActive('cosecha')}
          >
            <Text
              style={[
                styles.textAction,
                active === 'cosecha' && styles.textActive,
              ]}
            >
              Listas para Cosechar
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={{ marginTop: theme.spacing.md }}>
          <HiveCard
            image={require('@/assets/images/Bee1.jpg')}
            title="Medow Shine"
            lastCheck="2 horas"
          />

          <HiveCard
            image={require('@/assets/images/Bee1.jpg')}
            title="Flower Path"
            lastCheck="2 horas"
          />

          <HiveCard
            image={require('@/assets/images/Bee1.jpg')}
            title="Sinful bees"
            lastCheck="2 horas"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  cardActions: {
    width: 120,
    minHeight: 55,
    borderRadius: theme.borderRadius,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: theme.colors.primary,
  },
  textAction: {
    fontSize: 17,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 18,
  },
  inactive: {
    backgroundColor: '#E0E0E0', // gris elegante
  },

  textActive: {
    color: '#fff',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E6DADA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  icon: {
    marginRight: 10,
    color: '#C7C7C7',
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  InfoText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    paddingLeft: 20,
  },
  InfoNumber: {
    fontSize: theme.typography.title.fontSize,
    color: theme.colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  content: {
    padding: theme.spacing.md,
  },
  containerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flexBasis: '48%',
    maxWidth: '48%',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: theme.borderRadius,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  textInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -20,
    width: '100%',
  },

  card: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    lineHeight: 24,
  },
  contentBox: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  contentTitle: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  contentText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    lineHeight: 24,
  },
  hiveCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
  },

  hiveImage: {
    width: '100%',
    height: 140,
  },

  hiveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },

  hiveTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
  },

  hiveSubtitle: {
    fontSize: 13,
    color: theme.colors.darkGray,
    marginTop: 4,
  },

  hiveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },

  hiveButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
});

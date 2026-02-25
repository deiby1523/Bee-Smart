import { theme } from '@/constants/theme';
import { Beaker, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ApiarioStatsCardProps {
  totalColmenas: number;
  colmenasActivas: number;
  showDetails?: boolean;
}

export default function ApiarioStatsCard({
  totalColmenas,
  colmenasActivas,
  showDetails = true,
}: ApiarioStatsCardProps) {
  const saludPercentage =
    totalColmenas > 0 ? Math.round((colmenasActivas / totalColmenas) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Beaker size={18} color="#E67E22" />
        <Text style={styles.statValue}>{totalColmenas}</Text>
        <Text style={styles.statLabel}>Colmenas</Text>
      </View>

      {showDetails && (
        <>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <TrendingUp size={18} color="#27AE60" />
            <Text style={styles.statValue}>{colmenasActivas}</Text>
            <Text style={styles.statLabel}>Activas</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.stat}>
            <View
              style={[
                styles.healthBadge,
                {
                  backgroundColor:
                    saludPercentage >= 80
                      ? theme.colors.success
                      : saludPercentage >= 50
                        ? theme.colors.secondary
                        : theme.colors.error,
                },
              ]}
            >
              <Text style={styles.healthText}>{saludPercentage}%</Text>
            </View>
            <Text style={styles.statLabel}>Salud</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginTop: 4,
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },

  divider: {
    width: 1,
    backgroundColor: '#E2E2E2',
    marginHorizontal: 6,
  },

  healthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  healthText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
});

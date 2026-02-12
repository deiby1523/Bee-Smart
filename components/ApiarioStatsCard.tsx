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
  const saludPercentage = totalColmenas > 0
    ? Math.round((colmenasActivas / totalColmenas) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Beaker size={16} color={theme.colors.primary} />
        <Text style={styles.statLabel}>Colmenas</Text>
        <Text style={styles.statValue}>{totalColmenas}</Text>
      </View>

      {showDetails && (
        <>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <TrendingUp size={16} color={theme.colors.success} />
            <Text style={styles.statLabel}>Activas</Text>
            <Text style={styles.statValue}>{colmenasActivas}</Text>
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
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.darkGray,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.black,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.mediumGray,
  },
  healthBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  healthText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.white,
  },
});

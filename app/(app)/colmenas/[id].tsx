import ColmenaDetail from '@/components/ColmenaDetail';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

// simple wrapper
export default function ColmenaDetailScreen() {
  const { id } = useLocalSearchParams();
  const idNum = typeof id === 'string' ? parseInt(id) : Array.isArray(id) ? parseInt(id[0]) : 0;
  return <ColmenaDetail colmenaId={idNum} />;
}

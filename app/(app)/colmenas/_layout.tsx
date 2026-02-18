import React from 'react';
import { Stack } from 'expo-router';

export default function ColmenasLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* dynamic colmena detail */}
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
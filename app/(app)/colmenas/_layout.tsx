import { Stack } from 'expo-router';
import React from 'react';

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
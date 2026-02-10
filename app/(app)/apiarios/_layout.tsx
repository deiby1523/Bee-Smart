import { Stack } from 'expo-router';
import React from 'react';

export default function ApiariosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
      <Stack.Screen 
        name="edit/[id]" 
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

import { Stack } from 'expo-router';
import React from 'react';

export default function ApiariosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="apiarios_page" />
      <Stack.Screen name="apiarios_new_page" />
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

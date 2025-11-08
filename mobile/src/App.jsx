import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import MatchScreen from './screens/MatchScreen'
import ChatScreen from './screens/ChatScreen'
import { colors } from './theme/colors'

const Stack = createNativeStackNavigator()

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.gold,
          contentStyle: { backgroundColor: colors.background }
        }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Professor Do Campo'}} />
        <Stack.Screen name="Match" component={MatchScreen} options={{title: 'Partida'}}/>
        <Stack.Screen name="Chat" component={ChatScreen} options={{title: 'Chat'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

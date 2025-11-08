import React from 'react'
import { ScrollView, Text } from 'react-native'
import Header from '../components/Header'
import Card from '../components/Card'

export default function HomeScreen(){
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text style={{color:'#FFD700', fontSize:20, fontWeight:'700'}}>Professor Do Campo</Text>
      <Text style={{color:'#7CFC00', marginTop:6}}>Análises diárias — Futurista e práticas</Text>
      <Text style={{color:'white', marginTop:12}}>Partidas recentes e relatórios automáticos</Text>
    </ScrollView>
  )
}

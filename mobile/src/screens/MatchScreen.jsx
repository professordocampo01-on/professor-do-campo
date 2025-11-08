import React from 'react'
import { View, Text } from 'react-native'

export default function MatchScreen(){
  return (
    <View style={{flex:1, padding:16}}>
      <Text style={{color:'#FFD700', fontSize:18}}>Detalhes da Partida</Text>
      <Text style={{color:'white', marginTop:8}}>Aqui iremos mostrar heatmaps, timeline e estatísticas.</Text>
    </View>
  )
}

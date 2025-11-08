import React, { useEffect, useState } from 'react';
import { ScrollView, Text, ActivityIndicator, View } from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import { api } from '../api';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const [status, setStatus] = useState('Carregando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const res = await api.get('/');
        if (res.data.message) {
          setStatus('✅ API online');
        } else {
          setStatus('⚠️ API respondeu, mas sem mensagem esperada');
        }
      } catch (error) {
        setStatus('❌ Erro ao conectar com o backend');
      } finally {
        setLoading(false);
      }
    };

    checkAPI();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: colors.gold, fontSize: 20, fontWeight: '700' }}>
        Professor Do Campo
      </Text>
      <Text style={{ color: colors.neon, marginTop: 6 }}>
        Análises diárias — Futurista e práticas
      </Text>
      <Text style={{ color: 'white', marginTop: 12 }}>
        Partidas recentes e relatórios automáticos
      </Text>

      <View style={{ marginTop: 24, alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.gold} />
        ) : (
          <Text style={{ color: colors.text, fontSize: 18 }}>{status}</Text>
        )}
      </View>
    </ScrollView>
  );
}

// mobile/src/screens/HomeScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const [status, setStatus] = useState('Carregando...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  const checkAPI = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/');
      if (res.data.message) {
        setStatus('✅ API online');
      } else {
        setStatus('⚠️ API respondeu, mas sem mensagem esperada');
      }
    } catch (err) {
      setError(true);
      setStatus('❌ Erro ao conectar com o backend');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = '';
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
      <Text style={{ color: colors.gold, fontSize: 22, fontWeight: '700' }}>
        Professor Do Campo
      </Text>

      <Text style={{ color: colors.neon, marginTop: 6 }}>
        Análises diárias — Futurista e práticas
      </Text>

      <Text style={{ color: 'white', marginTop: 12, textAlign: 'center' }}>
        Partidas recentes e relatórios automáticos
      </Text>

      <View style={{ marginTop: 40, alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.gold} />
        ) : (
          <>
            <Text
              style={{
                color: error ? 'red' : colors.text,
                fontSize: 18,
                marginBottom: 20,
              }}
            >
              {status}
            </Text>

            {error && (
              <TouchableOpacity
                onPress={checkAPI}
                style={{
                  backgroundColor: colors.gold,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'black', fontWeight: '700' }}>
                  🔄 Tentar novamente
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* ✅ Botão de Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: 'red',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          marginTop: 50,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>🚪 Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

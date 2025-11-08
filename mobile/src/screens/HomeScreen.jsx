// mobile/src/screens/HomeScreen.jsx
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, ActivityIndicator, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [status, setStatus] = useState('Carregando...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 Verifica o token e busca dados do usuário
  const checkUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/api/auth/me').catch(() => null);

      if (res?.data) {
        setUser(res.data);
      } else {
        console.log('Token inválido, redirecionando para login...');
        await AsyncStorage.removeItem('token');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } catch (err) {
      console.error('Erro ao verificar usuário:', err);
    }
  };

  // 🔄 Verifica se o backend está online
  const checkAPI = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/');
      if (res.data.message) {
        setStatus('✅ API online');
      } else {
        setStatus('⚠️ API respondeu sem mensagem esperada');
      }
    } catch {
      setError(true);
      setStatus('❌ Erro ao conectar com o backend');
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  useEffect(() => {
    checkUser();
    checkAPI();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
      <Text style={{ color: colors.gold, fontSize: 24, fontWeight: 'bold' }}>
        Professor do Campo
      </Text>

      <Text style={{ color: colors.neon, marginTop: 6 }}>
        Bem-vindo {user ? user.username : '👋'}
      </Text>

      <Text style={{ color: 'white', marginTop: 12, textAlign: 'center' }}>
        Sistema de análises de partidas e relatórios automáticos
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

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 40,
          backgroundColor: 'red',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

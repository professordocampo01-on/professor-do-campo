// mobile/src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const token = res.data?.access_token;

      if (token) {
        // ✅ Salva token JWT localmente
        await AsyncStorage.setItem('token', token);

        // ✅ Seta header padrão no axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log('Token salvo com sucesso:', token);

        // ✅ Redireciona para Home e limpa histórico
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        setError('Falha ao autenticar: token não recebido.');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Email ou senha inválidos.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: colors.gold, fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>
        Login - Professor do Campo
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: '#111',
          color: 'white',
          marginTop: 20,
          padding: 12,
          borderRadius: 8,
        }}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: '#111',
          color: 'white',
          marginTop: 10,
          padding: 12,
          borderRadius: 8,
        }}
      />

      {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: colors.gold,
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center',
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text style={{ fontWeight: '700', color: 'black' }}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 16 }}>
        <Text style={{ color: colors.neon, textAlign: 'center' }}>Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

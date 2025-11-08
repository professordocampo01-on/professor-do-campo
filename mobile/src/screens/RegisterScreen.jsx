// mobile/src/screens/RegisterScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { api } from '../api';
import { colors } from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const res = await api.post('/api/auth/signup', {
        username: name,
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        // após registrar, voltar para login
        setTimeout(() => navigation.navigate('Login'), 1200);
      } else {
        setError('Falha ao criar conta.');
      }
    } catch (err) {
      // tenta extrair mensagem do backend (se houver)
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Erro ao registrar. Verifique os dados.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: colors.gold, fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>
        Criar Conta
      </Text>

      <TextInput
        placeholder="Nome de usuário"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: '#111',
          color: 'white',
          marginTop: 20,
          padding: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          backgroundColor: '#111',
          color: 'white',
          marginTop: 10,
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
      {success ? <Text style={{ color: 'lime', marginTop: 10 }}>Conta criada com sucesso! Redirecionando...</Text> : null}

      <TouchableOpacity
        onPress={handleRegister}
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
          <Text style={{ fontWeight: '700', color: 'black' }}>Criar Conta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16 }}>
        <Text style={{ color: colors.neon, textAlign: 'center' }}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

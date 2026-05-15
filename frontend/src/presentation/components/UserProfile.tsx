'use client';

import React from 'react';
import { useUser } from '../hooks/use-user';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <div>Carregando usuário...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div>
        <div className="text-xl font-medium text-black">Perfil do Usuário</div>
        <p className="text-slate-500">ID: {user.id}</p>
        <p className="text-slate-500">Nome: {user.name}</p>
        <p className="text-slate-500">E-mail: {user.email}</p>
      </div>
    </div>
  );
}

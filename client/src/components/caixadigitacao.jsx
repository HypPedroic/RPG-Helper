import React, { useState } from 'react';

function CaixaDigitacao() {
  // 1. Criar o estado para armazenar o valor do input
  const [texto, setTexto] = useState('');

  // 2. Função para atualizar o estado quando o usuário digitar
  const handleChange = (event) => {
    setTexto(event.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Digite algo:</h3>
      {/* 3. Input controlado: value e onChange */}
      <input
        type="text"
        value={texto}
        onChange={handleChange}
        placeholder="Digite aqui..."
        style={{ padding: '10px', fontSize: '16px', width: '250px' }}
      />
      <p>Texto digitado: {texto}</p>
    </div>
  );
}

export default CaixaDigitacao;

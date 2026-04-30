export function parseWhatsAppMessage(message: string, now = new Date()) {
  const text = String(message || '').trim().replace(/\s+/g, ' ');
  const match = text.match(/^([+-])\s*(\d+(?:[.,]\d{1,2})?)\s+(.+)$/);

  if (!match) {
    throw new Error('Mensagem invalida. Use exemplos como +2000 salario ou -50 mercado.');
  }

  const [, signal, rawValue, rawDescription] = match;
  const valor = Number(rawValue.replace(',', '.'));
  const descricao = rawDescription.trim();

  if (!Number.isFinite(valor) || valor <= 0 || !descricao) {
    throw new Error('Mensagem invalida. Informe valor e descricao.');
  }

  return {
    tipo: signal === '+' ? 'RECEITA' : 'DESPESA',
    valor,
    descricao,
    categoriaNome: descricao.split(' ')[0].toLowerCase(),
    data: now,
    origem: 'WHATSAPP',
    status: signal === '+' ? 'PAGO' : 'PENDENTE'
  };
}

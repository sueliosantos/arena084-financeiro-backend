import prismaClient from '../../prisma';
import { monthRange, toMonthDate } from '../../utils/date';
import { recorrenteValidoNoMes } from '../../utils/recorrencia';

class ResumoService {
  async anual(ano: number | string, mesLimite?: number | string) {
    const year = Number(ano);
    if (!Number.isInteger(year) || year < 1900 || year > 2200) throw new Error('Ano invalido');
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1;
    const limiteSolicitado = mesLimite ? Number(mesLimite) : 12;
    const limiteAno = year === anoAtual ? mesAtual : year < anoAtual ? 12 : 0;
    const limite = Math.max(0, Math.min(limiteSolicitado, limiteAno));

    const meses = await Promise.all(
      Array.from({ length: limite }, async (_, index) => {
        const mes = index + 1;
        const { inicio, fim } = monthRange(mes, year);
        const [lancamentos, recorrentes] = await Promise.all([
          prismaClient.lancamento.findMany({ where: { data: { gte: inicio, lt: fim } } }),
          prismaClient.recorrente.findMany({
            where: {
              ativo: true,
              dataInicio: { lt: fim },
              OR: [{ dataFim: null }, { dataFim: { gte: inicio } }]
            }
          })
        ]);

        const materializados = new Set(
          lancamentos
            .filter((item) => item.recorrenteId)
            .map((item) => `${item.recorrenteId}-${new Date(item.data).toISOString().slice(0, 10)}`)
        );
        const simulados = recorrentes
          .filter((item) => recorrenteValidoNoMes(item, year, mes))
          .filter((item) => {
            const dia = new Date(item.dataInicio).getUTCDate();
            const data = toMonthDate(year, mes, dia).toISOString().slice(0, 10);
            return !materializados.has(`${item.id}-${data}`);
          });
        const todos = [...lancamentos, ...simulados];
        const confirmados = todos.filter((item: any) => item.status === 'PAGO');
        const receitas = confirmados.filter((item) => item.tipo === 'RECEITA').reduce((sum, item) => sum + Number(item.valor), 0);
        const despesas = confirmados.filter((item) => item.tipo === 'DESPESA').reduce((sum, item) => sum + Number(item.valor), 0);
        const pendente = todos.filter((item: any) => item.status !== 'PAGO' && item.tipo === 'DESPESA').reduce((sum, item) => sum + Number(item.valor), 0);
        const cadastrado = todos.reduce((sum, item) => sum + Number(item.valor), 0);
        const itens = todos.map((item: any) => ({
          id: item.id,
          descricao: item.descricao,
          tipo: item.tipo,
          status: item.status,
          origem: item.origem,
          valor: Number(item.valor),
          observacao: item.observacao || null,
          categoria: item.categoria?.nome || null
        }));

        return { mes, receitas, despesas, pendente, cadastrado, saldo: receitas - despesas, itens };
      })
    );

    return { ano: year, mesLimite: limite, meses };
  }
}

export { ResumoService };

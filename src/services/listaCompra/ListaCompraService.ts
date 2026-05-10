import prismaClient from '../../prisma';

type ItemCompraData = {
  descricao?: string;
  comprado?: boolean;
  preco?: number | string | null;
};

class ListaCompraService {
  async listar() {
    return prismaClient.itemCompra.findMany({
      orderBy: [{ comprado: 'asc' }, { criadoEm: 'asc' }]
    });
  }

  async criar({ descricao, preco }: ItemCompraData) {
    const descricaoLimpa = descricao?.trim();
    if (!descricaoLimpa) throw new Error('Descricao obrigatoria');

    return prismaClient.itemCompra.create({
      data: {
        descricao: descricaoLimpa,
        preco: this.normalizarPreco(preco)
      }
    });
  }

  async atualizar({ id, descricao, comprado, preco }: ItemCompraData & { id: number }) {
    if (!id) throw new Error('Item invalido');

    const data: any = {};
    if (descricao !== undefined) {
      const descricaoLimpa = descricao.trim();
      if (!descricaoLimpa) throw new Error('Descricao obrigatoria');
      data.descricao = descricaoLimpa;
    }
    if (comprado !== undefined) data.comprado = Boolean(comprado);
    if (preco !== undefined) data.preco = this.normalizarPreco(preco);

    return prismaClient.itemCompra.update({ where: { id }, data });
  }

  async remover(id: number) {
    if (!id) throw new Error('Item invalido');
    await prismaClient.itemCompra.delete({ where: { id } });
    return { deleted: true };
  }

  async realizar() {
    const resultado = await prismaClient.itemCompra.deleteMany();
    return { deleted: resultado.count };
  }

  private normalizarPreco(preco: ItemCompraData['preco']) {
    if (preco === null || preco === undefined || preco === '') return null;
    const valor = Number(preco);
    if (!Number.isFinite(valor) || valor < 0) throw new Error('Preco invalido');
    return valor;
  }
}

export { ListaCompraService };

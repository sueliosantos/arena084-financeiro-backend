import prismaClient from '../../prisma';

class CategoriaService {
  async listar() {
    return prismaClient.categoria.findMany({ orderBy: [{ tipo: 'asc' }, { nome: 'asc' }] });
  }

  async criar({ nome, tipo }: { nome: string; tipo: any }) {
    const nomeLimpo = nome?.trim();
    if (!nomeLimpo) throw new Error('Nome obrigatorio');
    if (!tipo) throw new Error('Tipo obrigatorio');

    return prismaClient.categoria.create({
      data: { nome: nomeLimpo, tipo }
    });
  }

  async atualizar({ id, nome, tipo }: { id: number; nome?: string; tipo?: any }) {
    if (!id) throw new Error('Categoria invalida');

    const data: any = {};
    if (nome !== undefined) data.nome = nome.trim();
    if (tipo !== undefined) data.tipo = tipo;

    return prismaClient.categoria.update({ where: { id }, data });
  }

  async remover(id: number) {
    if (!id) throw new Error('Categoria invalida');
    await prismaClient.categoria.delete({ where: { id } });
    return { deleted: true };
  }
}

export { CategoriaService };

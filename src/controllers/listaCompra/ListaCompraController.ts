import { Request, Response } from 'express';
import { ListaCompraService } from '../../services/listaCompra/ListaCompraService';

class ListaCompraController {
  async listar(_req: Request, res: Response) {
    try {
      const service = new ListaCompraService();
      return res.json(await service.listar());
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao listar lista de compras' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const service = new ListaCompraService();
      return res.status(201).json(await service.criar(req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao criar item da lista' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const service = new ListaCompraService();
      return res.json(await service.atualizar({ id: Number(req.params.id), ...req.body }));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao atualizar item da lista' });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const service = new ListaCompraService();
      return res.json(await service.remover(Number(req.params.id)));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao remover item da lista' });
    }
  }

  async realizar(_req: Request, res: Response) {
    try {
      const service = new ListaCompraService();
      return res.json(await service.realizar());
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao finalizar lista de compras' });
    }
  }
}

export { ListaCompraController };

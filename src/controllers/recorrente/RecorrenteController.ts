import { Request, Response } from 'express';
import { RecorrenteService } from '../../services/recorrente/RecorrenteService';

class RecorrenteController {
  async listar(req: Request, res: Response) {
    try {
      const service = new RecorrenteService();
      return res.json(await service.listar());
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao listar recorrentes' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const service = new RecorrenteService();
      return res.status(201).json(await service.criar(req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao criar recorrente' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const service = new RecorrenteService();
      return res.json(await service.atualizar(Number(req.params.id), req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao atualizar recorrente' });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const service = new RecorrenteService();
      return res.json(await service.remover(Number(req.params.id)));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao remover recorrente' });
    }
  }
}

export { RecorrenteController };

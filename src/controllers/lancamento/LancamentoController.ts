import { Request, Response } from 'express';
import { LancamentoService } from '../../services/lancamento/LancamentoService';

class LancamentoController {
  async listar(req: Request, res: Response) {
    try {
      const service = new LancamentoService();
      return res.json(
        await service.listarPorMes(req.query.mes as string, req.query.ano as string, {
          tipo: req.query.tipo as string,
          status: req.query.status as string
        })
      );
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao listar lançamentos' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const service = new LancamentoService();
      return res.status(201).json(await service.criar(req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao criar lançamento' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const service = new LancamentoService();
      return res.json(await service.atualizar(Number(req.params.id), req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao atualizar lançamento' });
    }
  }

  async materializarRecorrente(req: Request, res: Response) {
    try {
      const service = new LancamentoService();
      return res.status(201).json(await service.materializarRecorrente(req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao atualizar recorrente do mês' });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const service = new LancamentoService();
      return res.json(await service.remover(Number(req.params.id)));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao remover lançamento' });
    }
  }
}

export { LancamentoController };

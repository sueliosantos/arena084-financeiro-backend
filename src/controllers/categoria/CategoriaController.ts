import { Request, Response } from 'express';
import { CategoriaService } from '../../services/categoria/CategoriaService';

class CategoriaController {
  async listar(req: Request, res: Response) {
    try {
      const service = new CategoriaService();
      return res.json(await service.listar());
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao listar categorias' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const service = new CategoriaService();
      return res.status(201).json(await service.criar(req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao criar categoria' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const service = new CategoriaService();
      return res.json(await service.atualizar({ id: Number(req.params.id), ...req.body }));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao atualizar categoria' });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const service = new CategoriaService();
      return res.json(await service.remover(Number(req.params.id)));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao remover categoria' });
    }
  }
}

export { CategoriaController };

import { Request, Response } from 'express';
import { ResumoService } from '../../services/resumo/ResumoService';

class ResumoController {
  async anual(req: Request, res: Response) {
    try {
      const service = new ResumoService();
      return res.json(await service.anual(req.query.ano as string, req.query.mes as string));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao gerar resumo' });
    }
  }
}

export { ResumoController };

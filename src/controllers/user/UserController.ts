import { Request, Response } from 'express';
import { UserService } from '../../services/user/UserService';

class UserController {
  async criar(req: Request, res: Response) {
    try {
      const service = new UserService();
      return res.status(201).json(await service.criar(req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao criar usuario' });
    }
  }

  async detalhe(req: Request, res: Response) {
    try {
      const service = new UserService();
      return res.json(await service.detalhe(Number(req.user_id)));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao buscar usuario' });
    }
  }
}

export { UserController };

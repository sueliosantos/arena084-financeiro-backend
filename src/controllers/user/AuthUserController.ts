import { Request, Response } from 'express';
import { UserService } from '../../services/user/UserService';

class AuthUserController {
  async handle(req: Request, res: Response) {
    try {
      const service = new UserService();
      return res.json(await service.autenticar(req.body));
    } catch (error: any) {
      return res.status(400).json({ error: error?.message || 'Erro ao autenticar usuario' });
    }
  }
}

export { AuthUserController };

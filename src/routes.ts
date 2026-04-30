import { Router } from 'express';
import { CategoriaController } from './controllers/categoria/CategoriaController';
import { LancamentoController } from './controllers/lancamento/LancamentoController';
import { RecorrenteController } from './controllers/recorrente/RecorrenteController';
import { ResumoController } from './controllers/resumo/ResumoController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { UserController } from './controllers/user/UserController';
import { isAuthenticated } from './middlewares/isAuthenticated';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));

router.post('/users', new UserController().criar);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new UserController().detalhe);

router.get('/categorias', isAuthenticated, new CategoriaController().listar);
router.post('/categorias', isAuthenticated, new CategoriaController().criar);
router.put('/categorias/:id', isAuthenticated, new CategoriaController().atualizar);
router.delete('/categorias/:id', isAuthenticated, new CategoriaController().remover);

router.get('/lancamentos', isAuthenticated, new LancamentoController().listar);
router.post('/lancamentos', isAuthenticated, new LancamentoController().criar);
router.post('/lancamentos/recorrente-mensal', isAuthenticated, new LancamentoController().materializarRecorrente);
router.put('/lancamentos/:id', isAuthenticated, new LancamentoController().atualizar);
router.delete('/lancamentos/:id', isAuthenticated, new LancamentoController().remover);

router.get('/recorrentes', isAuthenticated, new RecorrenteController().listar);
router.post('/recorrentes', isAuthenticated, new RecorrenteController().criar);
router.put('/recorrentes/:id', isAuthenticated, new RecorrenteController().atualizar);
router.delete('/recorrentes/:id', isAuthenticated, new RecorrenteController().remover);

router.get('/resumo', isAuthenticated, new ResumoController().anual);

export { router };

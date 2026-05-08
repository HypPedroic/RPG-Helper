import * as mesaController from '../controllers/mesaController.js';
import { Router } from 'express';
import ensureAuthenticated from '../middleware/ensureAutheticated.js';
import { ensureTable } from '../middleware/ensureTable.js';
import { apenasMestre } from '../middleware/ensureHierarquia.js';

const mesaRouter = Router();

mesaRouter.post('/mesas', ensureAuthenticated, mesaController.criarMesa);
mesaRouter.get('/mesas', mesaController.obterMesas);
mesaRouter.get('/mesas/:mesaId', ensureAuthenticated, ensureTable, mesaController.obterMesaPorId);
mesaRouter.delete('/mesas/:mesaId', ensureAuthenticated, ensureTable, apenasMestre, mesaController.excluirMesa);
mesaRouter.put('/mesas/:mesaId', ensureAuthenticated, ensureTable, apenasMestre, mesaController.atualizarMesa);
mesaRouter.patch('/mesas/:mesaId/invite-code', ensureAuthenticated, ensureTable, apenasMestre, mesaController.renovarCodigoConvite);
mesaRouter.patch('/mesas/:mesaId/master', ensureAuthenticated, ensureTable, apenasMestre, mesaController.transferirMestre);
mesaRouter.get('/users/me/mesas', ensureAuthenticated, mesaController.obterMesasPorIdParticipante);

export default mesaRouter;
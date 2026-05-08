import * as participanteController from '../controllers/participanteController.js';
import { Router } from 'express';
import ensureAuthenticated from "../middleware/ensureAutheticated.js";
import { ensureTable } from '../middleware/ensureTable.js';
import { apenasMestre, podeGerenciarconteudo, naoPodeSair } from '../middleware/ensureHierarquia.js';

const participanteRouter = Router();

participanteRouter.get('/mesas/:mesaId/participantes', ensureAuthenticated, ensureTable, participanteController.obterParticipantesPorMesaId);
participanteRouter.get('/mesas/:mesaId/participantes/role/me', ensureAuthenticated, ensureTable, participanteController.obterRoleParticipante);
participanteRouter.post('/mesas/join', ensureAuthenticated, participanteController.adicionarParticipante);
participanteRouter.patch('/mesas/:mesaId/participantes/:usuarioId/role', ensureAuthenticated, ensureTable, apenasMestre, participanteController.atualizarParticipante);
participanteRouter.delete('/mesas/:mesaId/participantes/me', ensureAuthenticated, ensureTable, naoPodeSair, participanteController.sairDaMesa);
participanteRouter.delete('/mesas/:mesaId/participantes/:usuarioId', ensureAuthenticated, ensureTable, podeGerenciarconteudo, participanteController.removerParticipante);

export default participanteRouter;
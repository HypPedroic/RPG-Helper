import { Router } from "express";
import ensureAuthenticated from "../middleware/ensureAutheticated.js";
import { ensureTable } from "../middleware/ensureTable.js";
import { podeGerenciarconteudo } from "../middleware/ensureHierarquia.js";
import * as sessaoController from "../controllers/sessaoController.js";

const sessaoRouter = Router();

sessaoRouter.get("/mesas/:mesaId/sessoes", ensureAuthenticated, ensureTable, sessaoController.listarSessoes);
sessaoRouter.get("/mesas/:mesaId/sessoes/:sessaoId", ensureAuthenticated, ensureTable, sessaoController.obterSessao);
sessaoRouter.get("/mesas/:mesaId/sessoes/:sessaoId/presencas", ensureAuthenticated, ensureTable, podeGerenciarconteudo, sessaoController.listarPresencas);
sessaoRouter.get("/mesas/:mesaId/sessoes/:sessaoId/metricas", ensureAuthenticated, ensureTable, podeGerenciarconteudo, sessaoController.obterMetricasPresenca);
sessaoRouter.post("/mesas/:mesaId/sessoes", ensureAuthenticated, ensureTable, podeGerenciarconteudo, sessaoController.criarSessao);
sessaoRouter.patch("/mesas/:mesaId/sessoes/:sessaoId", ensureAuthenticated, ensureTable, podeGerenciarconteudo, sessaoController.atualizarSessao);
sessaoRouter.patch("/mesas/:mesaId/sessoes/:sessaoId/concluir", ensureAuthenticated, ensureTable, podeGerenciarconteudo, sessaoController.concluirSessao);
sessaoRouter.patch("/mesas/:mesaId/sessoes/:sessaoId/resumo", ensureAuthenticated, ensureTable, podeGerenciarconteudo, sessaoController.atualizarResumoPosJogo);
sessaoRouter.patch("/mesas/:mesaId/sessoes/:sessaoId/presenca/me", ensureAuthenticated, ensureTable, sessaoController.marcarPresenca);
sessaoRouter.delete("/mesas/:mesaId/sessoes/:sessaoId", ensureAuthenticated, ensureTable, podeGerenciarconteudo, sessaoController.removerSessao);

export default sessaoRouter;
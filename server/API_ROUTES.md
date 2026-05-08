# API Routes - RPG Helper

Base URL:
- `http://localhost:3000/api/v1`

Autenticacao:
- Rotas protegidas exigem header `Authorization: Bearer <token>`.
- Rotas com `ensureTable` exigem que o usuario participe da mesa.
- Rotas com `apenasMestre` exigem role `mestre` na mesa.
- Rotas com `podeGerenciarconteudo` exigem role `mestre` ou `co-mestre`.
- Rotas com `naoPodeSair` impedem o mestre de sair da mesa.
- Rotas de sessoes usam o mesmo padrao de permissao da mesa: listagem e presenca exigem participacao na mesa, enquanto criacao, edicao, conclusao e exclusao exigem `mestre` ou `co-mestre`.

## Auth
| Metodo | Endpoint | Auth | Descricao |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/login` | Nao | Login de usuario |
| POST | `/api/v1/auth/register` | Nao | Cadastro de usuario |
| GET | `/api/v1/auth/email-availability/:email` | Nao | Verifica se email ja existe |
| GET | `/api/v1/auth/nickname-availability/:nickname` | Nao | Verifica se nickname ja existe |

## Users
| Metodo | Endpoint | Auth | Descricao |
| --- | --- | --- | --- |
| GET | `/api/v1/users` | Nao | Lista usuarios |
| GET | `/api/v1/users/me` | Sim | Retorna perfil do usuario autenticado |
| GET | `/api/v1/users/by-email?email=...` | Sim | Busca usuario por email |
| POST | `/api/v1/users` | Sim | Cria usuario |
| PUT | `/api/v1/users/:userId` | Sim | Atualiza usuario |
| DELETE | `/api/v1/users/:userId` | Sim | Remove usuario |

## Mesas
| Metodo | Endpoint | Auth | Middleware adicional | Descricao |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/mesas` | Sim | - | Cria nova mesa |
| GET | `/api/v1/mesas` | Nao | - | Lista mesas |
| GET | `/api/v1/mesas/:mesaId` | Sim | `ensureTable` | Detalhes da mesa |
| PUT | `/api/v1/mesas/:mesaId` | Sim | `ensureTable`, `apenasMestre` | Atualiza dados da mesa |
| DELETE | `/api/v1/mesas/:mesaId` | Sim | `ensureTable`, `apenasMestre` | Exclui mesa |
| PATCH | `/api/v1/mesas/:mesaId/invite-code` | Sim | `ensureTable`, `apenasMestre` | Regenera codigo de convite |
| PATCH | `/api/v1/mesas/:mesaId/master` | Sim | `ensureTable`, `apenasMestre` | Transfere mestragem |
| GET | `/api/v1/users/me/mesas` | Sim | - | Lista mesas do usuario autenticado |

## Participantes
| Metodo | Endpoint | Auth | Middleware adicional | Descricao |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/mesas/:mesaId/participantes` | Sim | `ensureTable` | Lista participantes da mesa |
| GET | `/api/v1/mesas/:mesaId/participantes/role/me` | Sim | `ensureTable` | Obtem o role do usuario autenticado na mesa |
| POST | `/api/v1/mesas/join` | Sim | - | Entra em mesa via codigo de convite |
| PATCH | `/api/v1/mesas/:mesaId/participantes/:usuarioId/role` | Sim | `ensureTable`, `apenasMestre` | Altera role do participante |
| DELETE | `/api/v1/mesas/:mesaId/participantes/me` | Sim | `ensureTable`, `naoPodeSair` | Usuario autenticado sai da mesa |
| DELETE | `/api/v1/mesas/:mesaId/participantes/:usuarioId` | Sim | `ensureTable`, `podeGerenciarconteudo` | Remove participante da mesa |

## Sessoes
| Metodo | Endpoint | Auth | Middleware adicional | Descricao |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/mesas/:mesaId/sessoes` | Sim | `ensureTable` | Lista todas as sessoes da mesa |
| GET | `/api/v1/mesas/:mesaId/sessoes/:sessaoId` | Sim | `ensureTable` | Detalha uma sessao |
| GET | `/api/v1/mesas/:mesaId/sessoes/:sessaoId/presencas` | Sim | `ensureTable`, `podeGerenciarconteudo` | Lista presencas registradas na sessao |
| GET | `/api/v1/mesas/:mesaId/sessoes/:sessaoId/metricas` | Sim | `ensureTable`, `podeGerenciarconteudo` | Retorna metricas de presenca da sessao |
| POST | `/api/v1/mesas/:mesaId/sessoes` | Sim | `ensureTable`, `podeGerenciarconteudo` | Cria sessao |
| PATCH | `/api/v1/mesas/:mesaId/sessoes/:sessaoId` | Sim | `ensureTable`, `podeGerenciarconteudo` | Atualiza dados da sessao |
| PATCH | `/api/v1/mesas/:mesaId/sessoes/:sessaoId/concluir` | Sim | `ensureTable`, `podeGerenciarconteudo` | Marca a sessao como concluida no dia marcado |
| PATCH | `/api/v1/mesas/:mesaId/sessoes/:sessaoId/resumo` | Sim | `ensureTable`, `podeGerenciarconteudo` | Atualiza o resumo pos-jogo apos conclusao |
| PATCH | `/api/v1/mesas/:mesaId/sessoes/:sessaoId/presenca/me` | Sim | `ensureTable` | Registra ou atualiza a propria presenca |
| DELETE | `/api/v1/mesas/:mesaId/sessoes/:sessaoId` | Sim | `ensureTable`, `podeGerenciarconteudo` | Remove sessao |

## Observacoes
- Convencao atual: API versionada em `/api/v1`.
- O frontend atualmente consome as rotas de autenticacao em `/api/v1/auth` para login, registro e validacoes de cadastro.
- Ao atualizar `data_hora` de uma sessao que ainda nao foi concluida, o status volta para `agendada` para forcar uma nova confirmacao de presenca.

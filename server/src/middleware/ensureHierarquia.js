


export function apenasMestre(req, res, next) {
    if(req.user.role !== 'mestre'){
        return res.status(403).json({ error: "Acesso negado: apenas mestres tem permissão para essa ação." });
    }
    next();
};

export function podeGerenciarconteudo(req, res, next) {
    if(req.user.role !== 'mestre' && req.user.role !== 'co-mestre'){
        return res.status(403).json({ error: "Acesso negado: apenas mestres e co-mestres tem permissão para essa ação." });
    }
    next();
};

export function naoPodeSair(req, res, next) {
    if(req.user.role === 'mestre'){
        return res.status(403).json({ error: "Acesso negado: mestres não podem sair da mesa, mas podem excluir a mesa ou transferir a mestragem para outro participante." });
    }
    next();
};
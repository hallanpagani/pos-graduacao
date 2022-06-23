export const orderStatus = [
  { status: 'Solicitado', usuario: 'cliente' },
  { status: 'Cancelou', usuario: 'cliente' },
  { status: 'Processando', usuario: 'dono' },
  { status: 'Em Rota', usuario: 'dono' },
  { status: 'Entregue', usuario: 'dono' },
  { status: 'Recebido', usuario: 'cliente' },
];

enum STATUS {
  Solicitado = 'Solicitado',
  Processando = 'Processando',
  Recebido = 'Recebido',
}

export const ValidarStatusAtualPedido = (
  dono: boolean,
  newStatus: string,
  oldStatus: string,
) => {
  if (oldStatus == STATUS.Recebido) {
    return false;
  }

  if (oldStatus == STATUS.Solicitado && newStatus == STATUS.Processando && dono) {
    return true;
  }

  const usuarioType = dono ? 'dono' : 'cliente';

  for (const [idx, oStatus] of orderStatus.entries()) {
    if (oStatus.status == oldStatus) {
      const nextStatus = orderStatus[idx + 1];

      if (nextStatus.status == newStatus && nextStatus.usuario == usuarioType) {
        return true;
      }
    }
  }

  return false;
};

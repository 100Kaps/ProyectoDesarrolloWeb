const API_BASE = '/api';

const API = {
  async getSucursales() {
    const res = await fetch(`${API_BASE}/sucursales`);
    return await res.json();
  },

  async getProductos(idTipo = null) {
    const url = idTipo ? `${API_BASE}/productos?id_tipo=${idTipo}` : `${API_BASE}/productos`;
    const res = await fetch(url);
    return await res.json();
  },

  async registrarPedido(datosPedido) {
    const res = await fetch(`${API_BASE}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosPedido)
    });
    return await res.json();
  },

  async getPedidos() {
    const res = await fetch(`${API_BASE}/pedidos`);
    return await res.json();
  },

  async getPedidoDetalle(idPedido) {
    const res = await fetch(`${API_BASE}/pedidos/${idPedido}`);
    return await res.json();
  },

  async cambiarEstadoPedido(idPedido, estado) {
    const res = await fetch(`/api/pedidos/${idPedido}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado })
    });
    return await res.json();
  }
};
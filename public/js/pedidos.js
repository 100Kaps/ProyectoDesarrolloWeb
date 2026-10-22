document.addEventListener('DOMContentLoaded', async () => {
  await cargarSucursales();
  await cargarProductos();

  document.getElementById('form-pedido').addEventListener('submit', guardarPedido);
});

async function cargarSucursales() {
  const select = document.getElementById('select-sucursal');
  try {
    const response = await API.getSucursales();
    if (response.success) {
      select.innerHTML = '<option value="">-- Seleccione una sucursal --</option>' +
        response.data.map(s => `<option value="${s.ID_SUCURSAL}">${s.NOMBRE}</option>`).join('');
    }
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar sucursales</option>';
  }
}

async function cargarProductos() {
  const tbody = document.getElementById('tabla-panes-body');
  try {
    // Carga únicamente productos finales (panes)
    const response = await API.getProductos(1);
    if (response.success && response.data.length > 0) {
      tbody.innerHTML = response.data.map(p => `
        <tr class="fila-producto" data-id="${p.ID_PRODUCTO}">
          <td style="text-align: left; font-weight: bold;">${p.NOMBRE}</td>
          <td><input type="number" class="cant-manana" min="0" value="0"></td>
          <td><input type="number" class="cant-resto" min="0" value="0"></td>
          <td><input type="number" class="cant-tarde" min="0" value="0"></td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="4">No hay productos disponibles.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4">Error al cargar lista de productos.</td></tr>';
  }
}

async function guardarPedido(e) {
  e.preventDefault();

  const idSucursal = document.getElementById('select-sucursal').value;
  const ruta = document.getElementById('input-ruta').value.trim();

  if (!idSucursal) {
    alert('Por favor seleccione una sucursal.');
    return;
  }

  const filas = document.querySelectorAll('.fila-producto');
  const detalles = [];

  filas.forEach(fila => {
    const idProducto = parseInt(fila.dataset.id);
    const cantManana = parseInt(fila.querySelector('.cant-manana').value) || 0;
    const cantResto = parseInt(fila.querySelector('.cant-resto').value) || 0;
    const cantTarde = parseInt(fila.querySelector('.cant-tarde').value) || 0;

    if (cantManana > 0 || cantResto > 0 || cantTarde > 0) {
      detalles.push({ idProducto, cantManana, cantResto, cantTarde });
    }
  });

  if (detalles.length === 0) {
    alert('Debe ingresar al menos una cantidad en algún producto.');
    return;
  }

  try {
    const respuesta = await API.registrarPedido({ idSucursal, ruta, detalles });
    if (respuesta.success) {
      alert(`¡Pedido registrado exitosamente! ID de Pedido: ${respuesta.idPedido}`);
      window.location.href = '/';
    } else {
      alert(`Error al registrar pedido: ${respuesta.message}`);
    }
  } catch (err) {
    alert('Ocurrió un error al enviar la solicitud al servidor.');
  }
}
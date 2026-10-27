const oracledb = require('oracledb');
const dbConfig = require('../config/db');

/**
 * Inserta la cabecera y los detalles del pedido invocando el paquete PL/SQL PKG_GESTION_PEDIDOS.
 */
async function crearPedidoCompleto(idSucursal, ruta, detalles) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // 1. Invocación del Stored Procedure para insertar la Cabecera del Pedido
    const resultCabecera = await connection.execute(
      `BEGIN 
         PKG_GESTION_PEDIDOS.registrar_pedido(:id_suc, :ruta, :id_out); 
       END;`,
      {
        id_suc: idSucursal,
        ruta: ruta,
        id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    const idPedido = resultCabecera.outBinds.id_out;

    // 2. Invocación iterativa para cada producto en el detalle del pedido
    for (const item of detalles) {
      await connection.execute(
        `BEGIN 
           PKG_GESTION_PEDIDOS.agregar_detalle_pedido(:id_ped, :id_prod, :manana, :resto, :tarde); 
         END;`,
        {
          id_ped: idPedido,
          id_prod: item.idProducto,
          manana: item.cantManana || 0,
          resto: item.cantResto || 0,
          tarde: item.cantTarde || 0
        }
      );
    }

    return { idPedido };
  } catch (error) {
    console.error('Error en pedidoService.crearPedidoCompleto:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Obtiene el listado de pedidos realizados.
 */
async function obtenerPedidos({ fecha, idSucursal } = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let query = `
      SELECT c.id_pedido, s.nombre AS sucursal, TO_CHAR(c.fecha_pedido, 'YYYY-MM-DD HH24:MI') AS fecha, c.ruta, c.estado
      FROM PEDIDOS_CABECERA c
      JOIN SUCURSALES s ON c.id_sucursal = s.id_sucursal
      WHERE 1=1
    `;
    const binds = [];

    if (idSucursal) {
      query += ` AND c.id_sucursal = :idSucursal`;
      binds.push(idSucursal);
    }

    if (fecha) {
      query += ` AND TRUNC(c.fecha_pedido) = TO_DATE(:fecha, 'YYYY-MM-DD')`;
      binds.push(fecha);
    }

    query += ` ORDER BY c.fecha_pedido DESC`;

    const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;
  } catch (error) {
    console.error('Error en pedidoService.obtenerPedidos:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Obtiene la cabecera y el detalle de ítems de un pedido por su ID.
 */
async function obtenerPedidoPorId(idPedido) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    // Consulta de Cabecera
    const resultCab = await connection.execute(
      `SELECT c.id_pedido, c.id_sucursal, s.nombre AS sucursal, TO_CHAR(c.fecha_pedido, 'YYYY-MM-DD HH24:MI') AS fecha, c.ruta, c.estado
       FROM PEDIDOS_CABECERA c
       JOIN SUCURSALES s ON c.id_sucursal = s.id_sucursal
       WHERE c.id_pedido = :idPedido`,
      [idPedido],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (resultCab.rows.length === 0) {
      return null;
    }

    const pedido = resultCab.rows[0];

    // Consulta de Detalle
    const resultDet = await connection.execute(
      `SELECT d.id_detalle, d.id_producto, p.nombre AS producto, d.cant_manana, d.cant_resto, d.cant_tarde
       FROM PEDIDOS_DETALLE d
       JOIN PRODUCTOS p ON d.id_producto = p.id_producto
       WHERE d.id_pedido = :idPedido`,
      [idPedido],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    pedido.detalles = resultDet.rows;
    return pedido;
  } catch (error) {
    console.error('Error en pedidoService.obtenerPedidoPorId:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*
Actualizar el estado del pedido a ENTREGADO
*/

/**
 * Actualiza el estado de un pedido (ej. de 'PENDIENTE' a 'ENTREGADO').
 */
async function cambiarEstadoPedido(idPedido, nuevoEstado) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    // AQUÍ DEBES DECLARAR 'const result ='
    const result = await connection.execute(
      `UPDATE PEDIDOS_CABECERA 
       SET estado = :nuevoEstado 
       WHERE id_pedido = :idPedido`,
      { nuevoEstado, idPedido },
      { autoCommit: true } // Confirmar el cambio automáticamente en Oracle
    );

    // Ahora 'result' sí está definido y se puede leer rowsAffected
    return result.rowsAffected > 0;
  } catch (error) {
    console.error('Error en pedidoService.cambiarEstadoPedido:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  crearPedidoCompleto,
  obtenerPedidos,
  obtenerPedidoPorId,
  cambiarEstadoPedido
};
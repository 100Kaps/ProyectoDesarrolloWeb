const oracledb = require('oracledb');
const dbConfig = require('../config/db');

/**
 * Obtiene los productos registrados. Puede filtrarse por tipo de producto (Ej: 1 = Producto Final, 2 = Insumo).
 */
async function obtenerProductos(idTipo = null) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    let query = `
      SELECT p.id_producto, p.nombre, p.unidad_medida, t.descripcion AS tipo_producto
      FROM PRODUCTOS p
      JOIN TIPOS_PRODUCTO t ON p.id_tipo = t.id_tipo
    `;
    const binds = [];

    if (idTipo) {
      query += ` WHERE p.id_tipo = :idTipo`;
      binds.push(idTipo);
    }

    query += ` ORDER BY p.nombre ASC`;

    const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;
  } catch (error) {
    console.error('Error en productoService.obtenerProductos:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Registra un nuevo producto en la base de datos.
 */
async function crearProducto({ id_tipo, nombre, unidad_medida = 'UNIDAD' }) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    const result = await connection.execute(
      `INSERT INTO PRODUCTOS (id_producto, id_tipo, nombre, unidad_medida)
       VALUES (seq_productos.NEXTVAL, :id_tipo, :nombre, :unidad_medida)
       RETURNING id_producto INTO :id_out`,
      {
        id_tipo,
        nombre,
        unidad_medida,
        id_out: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );

    const idProducto = result.outBinds.id_out[0];
    return { id_producto: idProducto, id_tipo, nombre, unidad_medida };
  } catch (error) {
    console.error('Error en productoService.crearProducto:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Obtiene los ingredientes / insumos asociados a la receta de un pan específico.
 */
async function obtenerRecetaPorProducto(idProductoFinal) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT r.id_insumo, p.nombre AS insumo, r.cantidad_requerida, p.unidad_medida
       FROM RECETAS r
       JOIN PRODUCTOS p ON r.id_insumo = p.id_producto
       WHERE r.id_producto_final = :idProducto`,
      [idProductoFinal],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } catch (error) {
    console.error('Error en productoService.obtenerRecetaPorProducto:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerRecetaPorProducto
};
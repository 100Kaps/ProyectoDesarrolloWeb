const oracledb = require('oracledb');
const dbConfig = require('../config/db');

/**
 * Obtiene el listado de todas las sucursales registradas.
 */
async function obtenerSucursales() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT id_sucursal, nombre, estado 
       FROM SUCURSALES 
       WHERE estado = 'A'
       ORDER BY id_sucursal ASC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } catch (error) {
    console.error('Error en sucursalService.obtenerSucursales:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/**
 * Obtiene una sucursal por su ID.
 */
async function obtenerSucursalPorId(id) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT id_sucursal, nombre, estado 
       FROM SUCURSALES 
       WHERE id_sucursal = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error en sucursalService.obtenerSucursalPorId:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  obtenerSucursales,
  obtenerSucursalPorId
};
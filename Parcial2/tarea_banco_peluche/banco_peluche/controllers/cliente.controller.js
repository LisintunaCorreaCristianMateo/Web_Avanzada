import Cliente from "../models/Cliente.js";
import clienteService from "../services/cliente.service.js";
import clienteMongoService from "../services/clienteMongo.service.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

class ClienteController {
  static async calcular(req, res) {
    try {
      const { nombre, dni, edad, saldoAnterior, montoCompras, pagoRealizado } = req.body;
      
      if(
        !nombre ||
        !dni ||
        edad === undefined ||
        saldoAnterior === undefined ||
        montoCompras === undefined ||
        pagoRealizado === undefined
      ){
        return res.status(400).json({
          ok: false,
          msg: "All fields are required (nombre, dni, edad, saldoAnterior, montoCompras, pagoRealizado)"
        });
      }

      if(
        isNaN(edad) ||
        isNaN(saldoAnterior) ||
        isNaN(montoCompras) ||
        isNaN(pagoRealizado)
      ){
        return res.status(400).json({
          ok: false,
          msg: "Edad and financial values must be valid numbers"
        });
      }

      if(edad < 18){
        return res.status(400).json({
          ok: false,
          msg: "Client must be at least 18 years old"
        });
      }

      if(saldoAnterior < 0 || montoCompras < 0 || pagoRealizado < 0){
        return res.status(400).json({
          ok: false,
          msg: "Financial values cannot be negative numbers"
        });
      }

      const cliente = new Cliente(nombre, dni, edad, saldoAnterior, montoCompras, pagoRealizado);

      const resultado = clienteService.calcularCliente(cliente);
      
      // Combinar datos personales con el resultado
      const datosCompletos = {
        nombre,
        dni,
        edad,
        ...resultado
      };
      
      //guardar en MongoDB usando el servicio
      await clienteMongoService.guardarCliente(datosCompletos);

      res.json({
        ok: true,
        data: datosCompletos
      });

    } catch (err) {
      console.error("Error calcular:", err);
      res.status(500).json({
        ok: false,
        msg: "Error interno al calcular datos del cliente"
      });
    }
  }

  static async obtenerClientes(req, res){
    try{
      const clientes = await clienteMongoService.obtenerTodos();
      res.json({
        ok: true,
        data: clientes
      });
    }catch(error){
      console.error("Error al obtener clientes:", error);
      res.status(500).json({
        ok: false,
        msg: "Error to obtain the clients"
      });
    }
  }

  static async estadisticas(req, res){
    try{
      const stats = await clienteMongoService.calcularEstadisticas();

      res.json({
        ok: true,
        data: stats
      });
    }catch(error){
      console.error("Error statistics", error);
      res.status(500).json({
        ok: false,
        msg: "Error to calculate statistics"
      });
    }
  }

  static async exportarPDF(req, res){
    try{
      const clientes = await clienteMongoService.obtenerTodos();

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=clientes.pdf");

      doc.pipe(res);

      doc.fontSize(20).text("Reporte de Clientes - Banco Peluche", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, { align: "center" });
      doc.moveDown(2);

      clientes.forEach((c, index) => {
        doc.fontSize(14).text(`Cliente ${index + 1}`, { underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(11).text(`Nombre: ${c.nombre}`);
        doc.text(`DNI: ${c.dni}`);
        doc.text(`Edad: ${c.edad} años`);
        doc.moveDown(0.5);
        
        doc.text(`Saldo Anterior: $${c.saldoAnterior.toFixed(2)}`);
        doc.text(`Monto Compras: $${c.montoCompras.toFixed(2)}`);
        doc.text(`Pago Realizado: $${c.pagoRealizado.toFixed(2)}`);
        doc.text(`Saldo Actual: $${c.saldoActual.toFixed(2)}`, { continued: true });
        doc.text(` - Estado: ${c.esMoroso ? 'MOROSO' : 'AL DÍA'}`);
        doc.text(`Interés: $${c.interes.toFixed(2)}`);
        doc.text(`Multa: $${c.multa.toFixed(2)}`);
        doc.moveDown();
        doc.text('_'.repeat(80));
        doc.moveDown();
      });

      doc.end();
    }catch(error){
      res.status(500).json({ ok: false, msg: "Error to export the PDF" });
    }
  }

  static async exportarExcel(req, res){
    try{
      const clientes = await clienteMongoService.obtenerTodos();

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Clientes");

      sheet.columns = [
        { header: "Nombre", key: "nombre", width: 25},
        { header: "DNI", key: "dni", width: 15},
        { header: "Edad", key: "edad", width: 10},
        { header: "SaldoAnterior", key: "saldoAnterior", width: 15},
        { header: "MontoCompras", key: "montoCompras", width: 15},
        { header: "PagoRealizado", key: "pagoRealizado", width: 15},
        { header: "SaldoActual", key: "saldoActual", width: 15},
        { header: "PagoMinimo", key: "pagoMinimo", width: 15},
        { header: "EsMoroso", key: "esMoroso", width: 10},
        { header: "Interes", key: "interes", width: 10},
        { header: "Multa", key: "multa", width: 10},
        { header: "FechaRegistro", key: "fechaRegistro", width: 20}
      ];

      clientes.forEach(c => sheet.addRow(c.toObject()));

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=clientes.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    }catch(error){
      res.status(500).json({ ok: false, msg: "Error to export the Excel"});
    }
  }

  static async exportarPDFCliente(req, res){
    try{
      const { id } = req.params;
      const cliente = await clienteMongoService.obtenerPorId(id);

      if (!cliente) {
        return res.status(404).json({ ok: false, msg: "Cliente no encontrado" });
      }

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=cliente_${cliente.dni}.pdf`);

      doc.pipe(res);

      doc.fontSize(22).text("Banco Peluche", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text("Reporte Individual de Cliente", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, { align: "center" });
      doc.moveDown(2);

      // Datos Personales
      doc.fontSize(14).text("DATOS PERSONALES", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).text(`Nombre: ${cliente.nombre}`);
      doc.text(`DNI: ${cliente.dni}`);
      doc.text(`Edad: ${cliente.edad} años`);
      doc.text(`Fecha de Registro: ${new Date(cliente.fechaRegistro).toLocaleString('es-ES')}`);
      doc.moveDown(1.5);

      // Datos Financieros
      doc.fontSize(14).text("DATOS FINANCIEROS", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).text(`Saldo Anterior: $${cliente.saldoAnterior.toFixed(2)}`);
      doc.text(`Monto de Compras: $${cliente.montoCompras.toFixed(2)}`);
      doc.text(`Pago Realizado: $${cliente.pagoRealizado.toFixed(2)}`);
      doc.text(`Saldo Base: $${cliente.saldoBase.toFixed(2)}`);
      doc.moveDown(1.5);

      // Resultados
      doc.fontSize(14).text("RESULTADOS DEL CÁLCULO", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).text(`Saldo Actual: $${cliente.saldoActual.toFixed(2)}`);
      doc.text(`Pago Mínimo: $${cliente.pagoMinimo.toFixed(2)}`);
      doc.text(`Pago sin Intereses: $${cliente.pagoNoIntereses.toFixed(2)}`);
      doc.text(`Interés Aplicado: $${cliente.interes.toFixed(2)}`);
      doc.text(`Multa: $${cliente.multa.toFixed(2)}`);
      doc.moveDown(0.5);
      
      const estadoTexto = cliente.esMoroso ? 'MOROSO' : 'AL DÍA';
      const colorEstado = cliente.esMoroso ? 'red' : 'green';
      doc.fontSize(12).fillColor(colorEstado).text(`Estado: ${estadoTexto}`, { bold: true });

      doc.end();
    }catch(error){
      console.error("Error al exportar PDF del cliente:", error);
      res.status(500).json({ ok: false, msg: "Error to export PDF"});
    }
  }

  static async exportarExcelCliente(req, res){
    try{
      const { id } = req.params;
      const cliente = await clienteMongoService.obtenerPorId(id);

      if (!cliente) {
        return res.status(404).json({ ok: false, msg: "Cliente no encontrado" });
      }

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Cliente");

      // Configurar columnas
      sheet.columns = [
        { header: "Campo", key: "campo", width: 25},
        { header: "Valor", key: "valor", width: 30}
      ];

      // Agregar datos del cliente
      sheet.addRow({ campo: "DATOS PERSONALES", valor: "" });
      sheet.addRow({ campo: "Nombre", valor: cliente.nombre });
      sheet.addRow({ campo: "DNI", valor: cliente.dni });
      sheet.addRow({ campo: "Edad", valor: `${cliente.edad} años` });
      sheet.addRow({ campo: "Fecha de Registro", valor: new Date(cliente.fechaRegistro).toLocaleString('es-ES') });
      sheet.addRow({ campo: "", valor: "" });
      
      sheet.addRow({ campo: "DATOS FINANCIEROS", valor: "" });
      sheet.addRow({ campo: "Saldo Anterior", valor: `$${cliente.saldoAnterior.toFixed(2)}` });
      sheet.addRow({ campo: "Monto de Compras", valor: `$${cliente.montoCompras.toFixed(2)}` });
      sheet.addRow({ campo: "Pago Realizado", valor: `$${cliente.pagoRealizado.toFixed(2)}` });
      sheet.addRow({ campo: "Saldo Base", valor: `$${cliente.saldoBase.toFixed(2)}` });
      sheet.addRow({ campo: "", valor: "" });
      
      sheet.addRow({ campo: "RESULTADOS", valor: "" });
      sheet.addRow({ campo: "Saldo Actual", valor: `$${cliente.saldoActual.toFixed(2)}` });
      sheet.addRow({ campo: "Pago Mínimo", valor: `$${cliente.pagoMinimo.toFixed(2)}` });
      sheet.addRow({ campo: "Pago sin Intereses", valor: `$${cliente.pagoNoIntereses.toFixed(2)}` });
      sheet.addRow({ campo: "Interés", valor: `$${cliente.interes.toFixed(2)}` });
      sheet.addRow({ campo: "Multa", valor: `$${cliente.multa.toFixed(2)}` });
      sheet.addRow({ campo: "Estado", valor: cliente.esMoroso ? 'MOROSO' : 'AL DÍA' });

      // Estilizar encabezados
      sheet.getRow(1).font = { bold: true, size: 12 };
      sheet.getRow(6).font = { bold: true, size: 12 };
      sheet.getRow(12).font = { bold: true, size: 12 };

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=cliente_${cliente.dni}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
    }catch(error){
      console.error("Error al exportar Excel del cliente:", error);
      res.status(500).json({ ok: false, msg: "Error to export Excel"});
    }
  }
}

export default ClienteController;
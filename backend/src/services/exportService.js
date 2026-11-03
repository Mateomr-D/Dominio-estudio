const ExcelJS = require('exceljs');
const { stringify } = require('csv-stringify/sync');

/**
 * Servicio para generar la Matriz de Estimación en formatos Excel (.xlsx) y CSV
 * Conforme a RF-08 y criterios de trazabilidad (RNF)
 */

async function generateExcelMatrix(proposalData, totals) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Dominio Estudio - Prototipo de Estimación';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Matriz de Estimación', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  // Estilos de cabecera institucional Dominio Estudio
  const brandDarkBlue = '1E3A8A';
  const brandSoftBlue = 'DBEAFE';
  const grayLight = 'F3F4F6';

  // Título
  sheet.mergeCells('A1:M1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'DOMINIO ESTUDIO - MATRIZ DE ESTIMACIÓN DE TAREAS TÉCNICAS';
  titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: brandDarkBlue } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  // Metadatos de la propuesta
  sheet.getCell('A3').value = 'Propuesta:';
  sheet.getCell('A3').font = { bold: true };
  sheet.getCell('B3').value = proposalData.nombre;

  sheet.getCell('D3').value = 'Cliente / Ref:';
  sheet.getCell('D3').font = { bold: true };
  sheet.getCell('E3').value = proposalData.referencia_cliente;

  sheet.getCell('G3').value = 'Fecha:';
  sheet.getCell('G3').font = { bold: true };
  sheet.getCell('H3').value = proposalData.fecha;

  sheet.getCell('J3').value = 'Tecnologías:';
  sheet.getCell('J3').font = { bold: true };
  sheet.getCell('K3').value = proposalData.tecnologias;

  sheet.getCell('A4').value = 'Reserva Contingencia:';
  sheet.getCell('A4').font = { bold: true };
  sheet.getCell('B4').value = `${totals.reserva_porcentaje}%`;

  sheet.getCell('D4').value = 'Factores Complejidad:';
  sheet.getCell('D4').font = { bold: true };
  sheet.getCell('E4').value = `Baja: ${proposalData.factor_baja} | Media: ${proposalData.factor_media} | Alta: ${proposalData.factor_alta}`;

  // Encabezados de tabla
  const headers = [
    'Componente',
    'Categoría',
    'Complejidad',
    'Factor (f)',
    'Tarea Técnica',
    'Perfil',
    'Optimista (O)',
    'Probable (M)',
    'Pesimista (P)',
    'Horas PERT (E)',
    'Horas Ajustadas (H)',
    'Desviación (σ)',
    'Trazabilidad / Origen / Justificación'
  ];

  const headerRowIndex = 6;
  const headerRow = sheet.getRow(headerRowIndex);
  headerRow.values = headers;
  headerRow.height = 25;

  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    };
  });

  let currentRowIndex = 7;

  // Filas por cada componente y tarea
  totals.componentes.forEach((comp) => {
    comp.tareas.forEach((tarea) => {
      const row = sheet.getRow(currentRowIndex);

      let trazabilidad = tarea.fuente || 'Histórico Dominio Estudio';
      if (tarea.editado_manualmente) {
        trazabilidad = `[EDITADO MANUAL] Justificación: ${tarea.justificacion || 'Sin justificación'} (Original PERT: ${tarea.horas_esperadas}h)`;
      }

      row.values = [
        comp.nombre,
        comp.categoria || 'General',
        (comp.complejidad || 'media').toUpperCase(),
        comp.factor_f,
        tarea.nombre,
        tarea.perfil || 'Desarrollo',
        tarea.O,
        tarea.M,
        tarea.P,
        tarea.horas_esperadas,
        tarea.horas_ajustadas,
        tarea.desviacion,
        trazabilidad
      ];

      // Formato celdas de números
      [7, 8, 9, 10, 11, 12].forEach((colIdx) => {
        row.getCell(colIdx).numFmt = '#,##0.00';
        row.getCell(colIdx).alignment = { horizontal: 'right' };
      });

      if (tarea.editado_manualmente) {
        row.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } }; // resaltado amarillo suave
      }

      currentRowIndex++;
    });

    // Subtotal de componente
    const subtotalRow = sheet.getRow(currentRowIndex);
    subtotalRow.values = [
      `Subtotal ${comp.nombre}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      comp.subtotal_horas,
      comp.desviacion,
      `Rango estimado: ${comp.rango_componente[0]}h - ${comp.rango_componente[1]}h`
    ];
    subtotalRow.font = { bold: true };
    subtotalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: grayLight } };
    subtotalRow.getCell(11).numFmt = '#,##0.00';
    subtotalRow.getCell(12).numFmt = '#,##0.00';
    currentRowIndex++;
  });

  // Espacio
  currentRowIndex++;

  // Resumen final
  const summaryStart = currentRowIndex;

  sheet.getCell(`J${summaryStart}`).value = 'Subtotal Base:';
  sheet.getCell(`J${summaryStart}`).font = { bold: true };
  sheet.getCell(`K${summaryStart}`).value = totals.base_total_horas;
  sheet.getCell(`K${summaryStart}`).numFmt = '#,##0.00';
  sheet.getCell(`K${summaryStart}`).font = { bold: true };

  sheet.getCell(`J${summaryStart + 1}`).value = `Reserva (${totals.reserva_porcentaje}%):`;
  sheet.getCell(`J${summaryStart + 1}`).font = { bold: true };
  sheet.getCell(`K${summaryStart + 1}`).value = totals.horas_reserva;
  sheet.getCell(`K${summaryStart + 1}`).numFmt = '#,##0.00';

  sheet.getCell(`J${summaryStart + 2}`).value = 'TOTAL ESTIMADO:';
  sheet.getCell(`J${summaryStart + 2}`).font = { bold: true, size: 11, color: { argb: 'FFFFFF' } };
  sheet.getCell(`J${summaryStart + 2}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: brandDarkBlue } };

  sheet.getCell(`K${summaryStart + 2}`).value = totals.total_con_reserva;
  sheet.getCell(`K${summaryStart + 2}`).numFmt = '#,##0.00';
  sheet.getCell(`K${summaryStart + 2}`).font = { bold: true, size: 11, color: { argb: 'FFFFFF' } };
  sheet.getCell(`K${summaryStart + 2}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: brandDarkBlue } };

  sheet.getCell(`L${summaryStart + 2}`).value = `± ${totals.desviacion_total}h (Rango: ${totals.intervalo_total[0]}h a ${totals.intervalo_total[1]}h)`;
  sheet.getCell(`L${summaryStart + 2}`).font = { italic: true };

  // Ajustar anchos de columnas
  sheet.columns = [
    { width: 26 }, // Componente
    { width: 16 }, // Categoría
    { width: 14 }, // Complejidad
    { width: 12 }, // Factor f
    { width: 32 }, // Tarea Técnica
    { width: 14 }, // Perfil
    { width: 14 }, // O
    { width: 14 }, // M
    { width: 14 }, // P
    { width: 16 }, // E
    { width: 18 }, // H
    { width: 14 }, // Desviación
    { width: 45 }  // Trazabilidad
  ];

  return await workbook.xlsx.writeBuffer();
}

function generateCSVMatrix(proposalData, totals) {
  const records = [];

  // Metadata headers
  records.push(['# DOMINIO ESTUDIO - MATRIZ DE ESTIMACION']);
  records.push(['# Propuesta', proposalData.nombre]);
  records.push(['# Cliente / Referencia', proposalData.referencia_cliente]);
  records.push(['# Tecnologías', proposalData.tecnologias]);
  records.push(['# Fecha', proposalData.fecha]);
  records.push(['# Reserva %', `${totals.reserva_porcentaje}%`]);
  records.push([]);

  // Table header
  records.push([
    'Componente',
    'Categoria',
    'Complejidad',
    'Factor_f',
    'Tarea_Tecnica',
    'Perfil',
    'Optimista_O',
    'Probable_M',
    'Pesimista_P',
    'Horas_PERT_E',
    'Horas_Ajustadas_H',
    'Desviacion_sigma',
    'Editado_Manualmente',
    'Horas_Editadas',
    'Justificacion',
    'Trazabilidad_Origen'
  ]);

  totals.componentes.forEach((comp) => {
    comp.tareas.forEach((t) => {
      records.push([
        comp.nombre,
        comp.categoria || 'General',
        comp.complejidad,
        comp.factor_f,
        t.nombre,
        t.perfil || 'Desarrollo',
        t.O,
        t.M,
        t.P,
        t.horas_esperadas,
        t.horas_ajustadas,
        t.desviacion,
        t.editado_manualmente ? 'SI' : 'NO',
        t.horas_editadas !== null ? t.horas_editadas : '',
        t.justificacion || '',
        t.fuente || 'Historico Dominio Estudio'
      ]);
    });
  });

  records.push([]);
  records.push(['TOTALES']);
  records.push(['Subtotal Horas Base', totals.base_total_horas]);
  records.push([`Reserva Contingencia (${totals.reserva_porcentaje}%)`, totals.horas_reserva]);
  records.push(['TOTAL FINAL ESTIMADO', totals.total_con_reserva]);
  records.push(['Desviacion Estandar Total', totals.desviacion_total]);
  records.push(['Rango Minimo (Total - sigma)', totals.intervalo_total[0]]);
  records.push(['Rango Maximo (Total + sigma)', totals.intervalo_total[1]]);

  const csvString = stringify(records);
  // Add UTF-8 BOM so Excel opens it with accents correctly
  return '\uFEFF' + csvString;
}

module.exports = {
  generateExcelMatrix,
  generateCSVMatrix
};

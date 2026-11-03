const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { app } = require('../src/server');
const { initDatabase } = require('../src/config/database');
const { runSeed } = require('../src/seeds/runSeed');

let server;
let baseUrl;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || '';
        let body;
        if (contentType.includes('application/json')) {
          try {
            body = JSON.parse(buffer.toString('utf-8'));
          } catch (e) {
            body = buffer.toString('utf-8');
          }
        } else {
          body = buffer;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      if (typeof options.body === 'object') {
        req.write(JSON.stringify(options.body));
      } else {
        req.write(options.body);
      }
    }

    req.end();
  });
}

describe('Pruebas de Integración de API REST (RF-01 a RF-10)', () => {
  before(async () => {
    await initDatabase();
    await runSeed();
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('Debe responder correctamente al Health Check', async () => {
    const res = await request('/api/health');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'ok');
  });

  it('RF-01: Debe listar componentes del catálogo', async () => {
    const res = await request('/api/catalog/components');
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.data.length >= 6);
  });

  it('RF-02 & RF-03: Debe obtener componente con sus tareas y referencias históricas', async () => {
    const res = await request('/api/catalog/components/1');
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.data.tareas.length > 0);
    const tarea = res.body.data.tareas[0];
    assert.ok(tarea.referencias.length > 0);
    assert.ok(tarea.calculo_base.O > 0);
    assert.ok(tarea.calculo_base.M > 0);
    assert.ok(tarea.calculo_base.P > 0);
    assert.ok(tarea.calculo_base.horasEsperadas > 0);
  });

  it('RF-04 & RF-05: Debe crear una propuesta y armarla con componentes', async () => {
    const res = await request('/api/proposals', {
      method: 'POST',
      body: {
        nombre: 'App Móvil y Web Logística',
        referencia_cliente: 'Transportes del Norte S.A.S.',
        tecnologias: 'React Native, Node.js, MySQL',
        fecha: '2026-11-03',
        reserva_porcentaje: 15,
        componentes_ids: [1, 2] // Autenticación y Panel
      }
    });

    assert.equal(res.statusCode, 201);
    assert.ok(res.body.data.id > 0);
    const propId = res.body.data.id;

    // Verificar detalle de la propuesta armada
    const detailRes = await request(`/api/proposals/${propId}`);
    assert.equal(detailRes.statusCode, 200);
    assert.equal(detailRes.body.data.componentes.length, 2);
    assert.ok(detailRes.body.data.totales.total_con_reserva > 0);
  });

  it('RF-06: Debe ajustar la complejidad de un componente y recalcular', async () => {
    const detail = await request('/api/proposals/1');
    const comp = detail.body.data.componentes[0];

    const patchRes = await request(`/api/proposals/1/components/${comp.id}/complexity`, {
      method: 'PATCH',
      body: { complejidad: 'alta' }
    });
    assert.equal(patchRes.statusCode, 200);
    assert.equal(patchRes.body.factor_f, 1.3);
  });

  it('RF-09: Debe permitir editar manualmente las horas de una tarea con justificación', async () => {
    const detail = await request('/api/proposals/1');
    const task = detail.body.data.componentes[0].tareas[0];

    const editRes = await request(`/api/proposals/1/tasks/${task.id}/manual-edit`, {
      method: 'PATCH',
      body: {
        horas: 25.5,
        justificacion: 'Revisión con líder de arquitectura por requerimientos estrictos de 2FA.'
      }
    });
    assert.equal(editRes.statusCode, 200);
    assert.equal(editRes.body.data.horas_ajustadas, 25.5);
  });

  it('RF-10: Debe registrar estimación manual y calcular diferencias y MRE', async () => {
    const res = await request('/api/proposals/1/comparison', {
      method: 'PATCH',
      body: {
        estimacion_manual: 200,
        horas_reales: 225
      }
    });
    assert.equal(res.statusCode, 200);

    const detail = await request('/api/proposals/1');
    assert.ok(detail.body.data.comparacion.comparacion_real.mre >= 0);
  });

  it('RF-08: Debe exportar la propuesta a Excel (.xlsx) y CSV', async () => {
    const excelRes = await request('/api/export/proposals/1/excel');
    assert.equal(excelRes.statusCode, 200);
    assert.ok(excelRes.body.length > 500);

    const csvRes = await request('/api/export/proposals/1/csv');
    assert.equal(csvRes.statusCode, 200);
    const csvText = csvRes.body.toString('utf-8');
    assert.ok(csvText.includes('DOMINIO ESTUDIO'));
  });
});

import * as cheerio from 'cheerio';
import axios from 'axios';
import iconv from 'iconv-lite';

export const resultadosSession = async (req, res) => {
  const link = req.query.link || req.body.link; // admite ambos métodos
  console.log('Link:', link);

  if (!link) {
    return res.status(400).json({ error: 'Falta el parámetro link en la solicitud.' });
  }

  try {
    const { data: buffer } = await axios.get(link, { responseType: 'arraybuffer' });
    const decodedData = iconv.decode(buffer, 'latin1');
    const $ = cheerio.load(decodedData);

    const resultado = [];

    $('div.ue-table-ranking-marca table tbody tr').each((i, row) => {
      const nombre = $(row).find('th.is-main span.ue-table-ranking__race-driver-name').text().trim();
      const equipo = $(row).find('td.ue-table-ranking__race-driver-team').text().trim();
      const t = $(row).find('td.ue-table-ranking__race-driver-time').text().trim();
      let tiempo = t.split(' ')[1] ? t.split(' ')[1] : t;

      if (nombre) {
        let [minuto, segundos] = tiempo.split(':').map((t) => t.padStart(2, '0'));

        const tiempoEnSegundos = parseFloat(minuto) * 60 + parseFloat(segundos);
        const tiempoEnMinutosDecimales = tiempoEnSegundos / 60;

        if (resultado.length > 0) {
          const primerTiempo = resultado[0].tiempo;
          const primerTiempoEnSegundos = parseFloat(primerTiempo) * 60;
          const diferenciaSegundos = tiempoEnSegundos + primerTiempoEnSegundos;

          const diferenciaMinutosDecimales = diferenciaSegundos / 60;
          tiempo = diferenciaMinutosDecimales.toFixed(3);
        } else {
          tiempo = tiempoEnMinutosDecimales.toFixed(3);
        }

        tiempo = tiempo.includes('.') ? parseFloat(tiempo).toFixed(3) : parseFloat(tiempo).toFixed(0);

        const exists = resultado.some((entry) => entry.nombre === nombre && entry.equipo === equipo && entry.tiempo === tiempo);
        if (!exists) {
          resultado.push({ nombre, equipo, tiempo });
        }
      }
    });

    res.json(resultado);
  } catch (err) {
    console.error('Error en resultadosSession:', err.message);
    res.status(500).json({ error: 'No se pudo obtener la tabla de resultados', detalle: err.message });
  }
};

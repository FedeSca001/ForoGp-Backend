import * as cheerio from 'cheerio';
import axios from 'axios';
import iconv from 'iconv-lite';

const url = 'https://www.marca.com/motor/motogp/calendario.html?intcmp=MENUMIGA&s_kw=calendario#';

export const updateCalendario = async (req, res) => {
    try {
        const { data: buffer } = await axios.get(url, { responseType: 'arraybuffer' });
        const decodedData = iconv.decode(buffer, 'latin1');
        const $ = cheerio.load(decodedData);

        const calendario = [];

        $('.gran-premio__element').each((index, element) => {
            const granPremio = $(element).find('.gran-premio__title-item a').text().trim();
            const fecha = $(element).find('.gran-premio__date').text().trim();
            const circuito = $(element).find('.gran-premio__circuit-name').text().trim();
            const imgCircuito = $(element).find('.gran-premio__img-circuit').attr('src');

            const podium = [];
            $(element)
                .find('.category-motogp .gran-premio__podium-item')
                .each((i, podiumItem) => {
                    const position = $(podiumItem).find('.gran-premio__podium-data').text().trim();
                    const piloto = $(podiumItem).text().replace(position, '').trim();
                    const bandera = $(podiumItem).find('img').attr('src');
                    podium.push({ position, piloto, bandera });
                });

            const competiciones = { motoGp: [], moto2: [], moto3: [] };
            let currentDay = null;

            $(element)
                .find('.gran-premio__schedule')
                .children()
                .each((i, child) => {
                    if ($(child).is('dt')) {
                        currentDay = $(child).text().trim();
                    } else if ($(child).is('dd')) {
                        const link = $(child).find('a').attr('href') || '';
                        const descripcion = $(child).find('a').text().trim();
                        const hora = $(child).find('.hora').text().trim();

                        if (competiciones.motoGp.length < 6) {
                            competiciones.motoGp.push({ dia: currentDay, descripcion, link, hora });
                        } else if (competiciones.moto2.length < 5) {
                            competiciones.moto2.push({ dia: currentDay, descripcion, link, hora });
                        } else {
                            competiciones.moto3.push({ dia: currentDay, descripcion, link, hora });
                        }
                    }
                });

            calendario.push({
                index,
                granPremio,
                fecha,
                circuito,
                imgCircuito,
                podium,
                competiciones,
            });
        });

        res.json(calendario); // RESPONDE al cliente correctamente
    } catch (error) {
        console.error('Error al obtener el calendario MotoGp:', error);
        res.status(500).json({
            error: 'Error al obtener el calendario MotoGp',
            detalle: error.message
        });
    }
};

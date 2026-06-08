// Mapea nombre de pais (tal como aparece en fixture.js) -> codigo ISO 3166-1 alpha-2.
// Se usa para construir la URL de la bandera en flagcdn.com, que funciona en
// todos los sistemas (Windows no renderiza los emojis de banderas de paises).

export const PAIS_ISO = {
  'México': 'mx',
  'Polonia': 'pl',
  'Arabia Saudita': 'sa',
  'Argentina': 'ar',
  'Francia': 'fr',
  'Australia': 'au',
  'Dinamarca': 'dk',
  'Túnez': 'tn',
  'Brasil': 'br',
  'Serbia': 'rs',
  'Suiza': 'ch',
  'Camerún': 'cm',
  'España': 'es',
  'Costa Rica': 'cr',
  'Alemania': 'de',
  'Japón': 'jp',
  'Bélgica': 'be',
  'Canadá': 'ca',
  'Marruecos': 'ma',
  'Croacia': 'hr',
  'Uruguay': 'uy',
  'Corea del Sur': 'kr',
  'Portugal': 'pt',
  'Ghana': 'gh',
  'EE.UU.': 'us',
  'Gales': 'gb-wls',
  'Inglaterra': 'gb-eng',
  'Irán': 'ir',
  'Países Bajos': 'nl',
  'Senegal': 'sn',
  'Ecuador': 'ec',
  'Qatar': 'qa',
  'Colombia': 'co',
  'Rumania': 'ro',
  'Turquía': 'tr',
  'Nueva Zelanda': 'nz',
  'Chile': 'cl',
  'Noruega': 'no',
  'Perú': 'pe',
  'Italia': 'it',
  'Albania': 'al',
  'Eslovaquia': 'sk',
  'Venezuela': 've',
  'Irlanda': 'ie',
  'Nigeria': 'ng',
  'República Checa': 'cz',
  'Sudáfrica': 'za',
}

// Devuelve la URL de la bandera (PNG de 40px de ancho) o null si no es un pais
// conocido (ej. placeholders de eliminatorias como '1A', 'W73').
export function flagUrl(nombrePais) {
  const code = PAIS_ISO[nombrePais]
  return code ? `https://flagcdn.com/w40/${code}.png` : null
}

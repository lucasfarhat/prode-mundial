// Mapea nombre de pais (tal como aparece en fixture.js) -> codigo ISO 3166-1 alpha-2.
// Se usa para construir la URL de la bandera en flagcdn.com, que funciona en
// todos los sistemas (Windows no renderiza los emojis de banderas de paises).
// Cubre los 48 equipos clasificados al Mundial 2026.

export const PAIS_ISO = {
  // Grupo A
  'México': 'mx',
  'Sudáfrica': 'za',
  'Corea del Sur': 'kr',
  'República Checa': 'cz',
  // Grupo B
  'Canadá': 'ca',
  'Bosnia y Herzegovina': 'ba',
  'Qatar': 'qa',
  'Suiza': 'ch',
  // Grupo C
  'Brasil': 'br',
  'Marruecos': 'ma',
  'Haití': 'ht',
  'Escocia': 'gb-sct',
  // Grupo D
  'EE.UU.': 'us',
  'Paraguay': 'py',
  'Australia': 'au',
  'Turquía': 'tr',
  // Grupo E
  'Alemania': 'de',
  'Curazao': 'cw',
  'Costa de Marfil': 'ci',
  'Ecuador': 'ec',
  // Grupo F
  'Países Bajos': 'nl',
  'Japón': 'jp',
  'Suecia': 'se',
  'Túnez': 'tn',
  // Grupo G
  'Bélgica': 'be',
  'Egipto': 'eg',
  'Irán': 'ir',
  'Nueva Zelanda': 'nz',
  // Grupo H
  'España': 'es',
  'Cabo Verde': 'cv',
  'Arabia Saudita': 'sa',
  'Uruguay': 'uy',
  // Grupo I
  'Francia': 'fr',
  'Senegal': 'sn',
  'Irak': 'iq',
  'Noruega': 'no',
  // Grupo J
  'Argentina': 'ar',
  'Argelia': 'dz',
  'Austria': 'at',
  'Jordania': 'jo',
  // Grupo K
  'Portugal': 'pt',
  'RD Congo': 'cd',
  'Uzbekistán': 'uz',
  'Colombia': 'co',
  // Grupo L
  'Inglaterra': 'gb-eng',
  'Croacia': 'hr',
  'Ghana': 'gh',
  'Panamá': 'pa',
}

// Devuelve la URL de la bandera (PNG de 40px de ancho) o null si no es un pais
// conocido (ej. placeholders de eliminatorias).
export function flagUrl(nombrePais) {
  const code = PAIS_ISO[nombrePais]
  return code ? `https://flagcdn.com/w40/${code}.png` : null
}

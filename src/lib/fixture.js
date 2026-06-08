// Fixture completo del Mundial 2026 (fase de grupos)
// Las fases eliminatorias se completan dinámicamente según resultados

export const PARTIDOS_GRUPOS = [
  // GRUPO A
  { id: 1, fase: 'Grupos', grupo: 'A', local: 'México', flagLocal: '🇲🇽', visitante: 'Polonia', flagVisitante: '🇵🇱', fecha: '2026-06-11T20:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },
  { id: 2, fase: 'Grupos', grupo: 'A', local: 'Arabia Saudita', flagLocal: '🇸🇦', visitante: 'Argentina', flagVisitante: '🇦🇷', fecha: '2026-06-11T23:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 3, fase: 'Grupos', grupo: 'A', local: 'México', flagLocal: '🇲🇽', visitante: 'Argentina', flagVisitante: '🇦🇷', fecha: '2026-06-15T23:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 4, fase: 'Grupos', grupo: 'A', local: 'Polonia', flagLocal: '🇵🇱', visitante: 'Arabia Saudita', flagVisitante: '🇸🇦', fecha: '2026-06-15T20:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 5, fase: 'Grupos', grupo: 'A', local: 'Argentina', flagLocal: '🇦🇷', visitante: 'Polonia', flagVisitante: '🇵🇱', fecha: '2026-06-19T20:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },
  { id: 6, fase: 'Grupos', grupo: 'A', local: 'Arabia Saudita', flagLocal: '🇸🇦', visitante: 'México', flagVisitante: '🇲🇽', fecha: '2026-06-19T20:00:00', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México' },

  // GRUPO B
  { id: 7, fase: 'Grupos', grupo: 'B', local: 'Francia', flagLocal: '🇫🇷', visitante: 'Australia', flagVisitante: '🇦🇺', fecha: '2026-06-12T17:00:00', estadio: 'Rose Bowl', ciudad: 'Los Angeles' },
  { id: 8, fase: 'Grupos', grupo: 'B', local: 'Dinamarca', flagLocal: '🇩🇰', visitante: 'Túnez', flagVisitante: '🇹🇳', fecha: '2026-06-12T20:00:00', estadio: 'Lumen Field', ciudad: 'Seattle' },
  { id: 9, fase: 'Grupos', grupo: 'B', local: 'Francia', flagLocal: '🇫🇷', visitante: 'Dinamarca', flagVisitante: '🇩🇰', fecha: '2026-06-16T20:00:00', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta' },
  { id: 10, fase: 'Grupos', grupo: 'B', local: 'Túnez', flagLocal: '🇹🇳', visitante: 'Australia', flagVisitante: '🇦🇺', fecha: '2026-06-16T17:00:00', estadio: 'Rose Bowl', ciudad: 'Los Angeles' },
  { id: 11, fase: 'Grupos', grupo: 'B', local: 'Australia', flagLocal: '🇦🇺', visitante: 'Dinamarca', flagVisitante: '🇩🇰', fecha: '2026-06-20T20:00:00', estadio: 'BC Place', ciudad: 'Vancouver' },
  { id: 12, fase: 'Grupos', grupo: 'B', local: 'Túnez', flagLocal: '🇹🇳', visitante: 'Francia', flagVisitante: '🇫🇷', fecha: '2026-06-20T20:00:00', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco' },

  // GRUPO C
  { id: 13, fase: 'Grupos', grupo: 'C', local: 'Brasil', flagLocal: '🇧🇷', visitante: 'Serbia', flagVisitante: '🇷🇸', fecha: '2026-06-13T17:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 14, fase: 'Grupos', grupo: 'C', local: 'Suiza', flagLocal: '🇨🇭', visitante: 'Camerún', flagVisitante: '🇨🇲', fecha: '2026-06-13T20:00:00', estadio: 'Gillette Stadium', ciudad: 'Boston' },
  { id: 15, fase: 'Grupos', grupo: 'C', local: 'Brasil', flagLocal: '🇧🇷', visitante: 'Suiza', flagVisitante: '🇨🇭', fecha: '2026-06-17T20:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 16, fase: 'Grupos', grupo: 'C', local: 'Camerún', flagLocal: '🇨🇲', visitante: 'Serbia', flagVisitante: '🇷🇸', fecha: '2026-06-17T17:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },
  { id: 17, fase: 'Grupos', grupo: 'C', local: 'Brasil', flagLocal: '🇧🇷', visitante: 'Camerún', flagVisitante: '🇨🇲', fecha: '2026-06-21T20:00:00', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco' },
  { id: 18, fase: 'Grupos', grupo: 'C', local: 'Serbia', flagLocal: '🇷🇸', visitante: 'Suiza', flagVisitante: '🇨🇭', fecha: '2026-06-21T20:00:00', estadio: 'BC Place', ciudad: 'Vancouver' },

  // GRUPO D
  { id: 19, fase: 'Grupos', grupo: 'D', local: 'España', flagLocal: '🇪🇸', visitante: 'Costa Rica', flagVisitante: '🇨🇷', fecha: '2026-06-12T17:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },
  { id: 20, fase: 'Grupos', grupo: 'D', local: 'Alemania', flagLocal: '🇩🇪', visitante: 'Japón', flagVisitante: '🇯🇵', fecha: '2026-06-12T23:00:00', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta' },
  { id: 21, fase: 'Grupos', grupo: 'D', local: 'España', flagLocal: '🇪🇸', visitante: 'Alemania', flagVisitante: '🇩🇪', fecha: '2026-06-16T23:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 22, fase: 'Grupos', grupo: 'D', local: 'Japón', flagLocal: '🇯🇵', visitante: 'Costa Rica', flagVisitante: '🇨🇷', fecha: '2026-06-16T17:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 23, fase: 'Grupos', grupo: 'D', local: 'España', flagLocal: '🇪🇸', visitante: 'Japón', flagVisitante: '🇯🇵', fecha: '2026-06-20T20:00:00', estadio: 'Gillette Stadium', ciudad: 'Boston' },
  { id: 24, fase: 'Grupos', grupo: 'D', local: 'Costa Rica', flagLocal: '🇨🇷', visitante: 'Alemania', flagVisitante: '🇩🇪', fecha: '2026-06-20T20:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },

  // GRUPO E
  { id: 25, fase: 'Grupos', grupo: 'E', local: 'Bélgica', flagLocal: '🇧🇪', visitante: 'Canadá', flagVisitante: '🇨🇦', fecha: '2026-06-13T17:00:00', estadio: 'BMO Field', ciudad: 'Toronto' },
  { id: 26, fase: 'Grupos', grupo: 'E', local: 'Marruecos', flagLocal: '🇲🇦', visitante: 'Croacia', flagVisitante: '🇭🇷', fecha: '2026-06-13T20:00:00', estadio: 'BC Place', ciudad: 'Vancouver' },
  { id: 27, fase: 'Grupos', grupo: 'E', local: 'Bélgica', flagLocal: '🇧🇪', visitante: 'Marruecos', flagVisitante: '🇲🇦', fecha: '2026-06-17T20:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 28, fase: 'Grupos', grupo: 'E', local: 'Croacia', flagLocal: '🇭🇷', visitante: 'Canadá', flagVisitante: '🇨🇦', fecha: '2026-06-17T17:00:00', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta' },
  { id: 29, fase: 'Grupos', grupo: 'E', local: 'Bélgica', flagLocal: '🇧🇪', visitante: 'Croacia', flagVisitante: '🇭🇷', fecha: '2026-06-21T20:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 30, fase: 'Grupos', grupo: 'E', local: 'Canadá', flagLocal: '🇨🇦', visitante: 'Marruecos', flagVisitante: '🇲🇦', fecha: '2026-06-21T20:00:00', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México' },

  // GRUPO F
  { id: 31, fase: 'Grupos', grupo: 'F', local: 'Uruguay', flagLocal: '🇺🇾', visitante: 'Corea del Sur', flagVisitante: '🇰🇷', fecha: '2026-06-14T17:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 32, fase: 'Grupos', grupo: 'F', local: 'Portugal', flagLocal: '🇵🇹', visitante: 'Ghana', flagVisitante: '🇬🇭', fecha: '2026-06-14T20:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },
  { id: 33, fase: 'Grupos', grupo: 'F', local: 'Portugal', flagLocal: '🇵🇹', visitante: 'Uruguay', flagVisitante: '🇺🇾', fecha: '2026-06-18T20:00:00', estadio: 'Gillette Stadium', ciudad: 'Boston' },
  { id: 34, fase: 'Grupos', grupo: 'F', local: 'Ghana', flagLocal: '🇬🇭', visitante: 'Corea del Sur', flagVisitante: '🇰🇷', fecha: '2026-06-18T17:00:00', estadio: 'BC Place', ciudad: 'Vancouver' },
  { id: 35, fase: 'Grupos', grupo: 'F', local: 'Portugal', flagLocal: '🇵🇹', visitante: 'Corea del Sur', flagVisitante: '🇰🇷', fecha: '2026-06-22T20:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 36, fase: 'Grupos', grupo: 'F', local: 'Ghana', flagLocal: '🇬🇭', visitante: 'Uruguay', flagVisitante: '🇺🇾', fecha: '2026-06-22T20:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },

  // GRUPO G
  { id: 37, fase: 'Grupos', grupo: 'G', local: 'EE.UU.', flagLocal: '🇺🇸', visitante: 'Gales', flagVisitante: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', fecha: '2026-06-14T17:00:00', estadio: 'Rose Bowl', ciudad: 'Los Angeles' },
  { id: 38, fase: 'Grupos', grupo: 'G', local: 'Inglaterra', flagLocal: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'Irán', flagVisitante: '🇮🇷', fecha: '2026-06-14T20:00:00', estadio: 'Khalifa International', ciudad: 'Dallas' },
  { id: 39, fase: 'Grupos', grupo: 'G', local: 'EE.UU.', flagLocal: '🇺🇸', visitante: 'Inglaterra', flagVisitante: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fecha: '2026-06-18T20:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 40, fase: 'Grupos', grupo: 'G', local: 'Irán', flagLocal: '🇮🇷', visitante: 'Gales', flagVisitante: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', fecha: '2026-06-18T17:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 41, fase: 'Grupos', grupo: 'G', local: 'EE.UU.', flagLocal: '🇺🇸', visitante: 'Irán', flagVisitante: '🇮🇷', fecha: '2026-06-22T20:00:00', estadio: 'Rose Bowl', ciudad: 'Los Angeles' },
  { id: 42, fase: 'Grupos', grupo: 'G', local: 'Gales', flagLocal: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', visitante: 'Inglaterra', flagVisitante: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fecha: '2026-06-22T20:00:00', estadio: 'Gillette Stadium', ciudad: 'Boston' },

  // GRUPO H
  { id: 43, fase: 'Grupos', grupo: 'H', local: 'Países Bajos', flagLocal: '🇳🇱', visitante: 'Senegal', flagVisitante: '🇸🇳', fecha: '2026-06-15T17:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 44, fase: 'Grupos', grupo: 'H', local: 'Ecuador', flagLocal: '🇪🇨', visitante: 'Qatar', flagVisitante: '🇶🇦', fecha: '2026-06-15T20:00:00', estadio: 'Rose Bowl', ciudad: 'Los Angeles' },
  { id: 45, fase: 'Grupos', grupo: 'H', local: 'Países Bajos', flagLocal: '🇳🇱', visitante: 'Ecuador', flagVisitante: '🇪🇨', fecha: '2026-06-19T17:00:00', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco' },
  { id: 46, fase: 'Grupos', grupo: 'H', local: 'Qatar', flagLocal: '🇶🇦', visitante: 'Senegal', flagVisitante: '🇸🇳', fecha: '2026-06-19T20:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 47, fase: 'Grupos', grupo: 'H', local: 'Países Bajos', flagLocal: '🇳🇱', visitante: 'Qatar', flagVisitante: '🇶🇦', fecha: '2026-06-23T20:00:00', estadio: 'SoFi Stadium', ciudad: 'Los Angeles' },
  { id: 48, fase: 'Grupos', grupo: 'H', local: 'Senegal', flagLocal: '🇸🇳', visitante: 'Ecuador', flagVisitante: '🇪🇨', fecha: '2026-06-23T20:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },

  // GRUPOS I-L (Mundial 2026 tiene 12 grupos, 48 equipos)
  // GRUPO I
  { id: 49, fase: 'Grupos', grupo: 'I', local: 'Colombia', flagLocal: '🇨🇴', visitante: 'Rumania', flagVisitante: '🇷🇴', fecha: '2026-06-13T17:00:00', estadio: 'BMO Field', ciudad: 'Toronto' },
  { id: 50, fase: 'Grupos', grupo: 'I', local: 'Turquía', flagLocal: '🇹🇷', visitante: 'Nueva Zelanda', flagVisitante: '🇳🇿', fecha: '2026-06-13T23:00:00', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México' },
  { id: 51, fase: 'Grupos', grupo: 'I', local: 'Colombia', flagLocal: '🇨🇴', visitante: 'Turquía', flagVisitante: '🇹🇷', fecha: '2026-06-17T17:00:00', estadio: 'Rose Bowl', ciudad: 'Los Angeles' },
  { id: 52, fase: 'Grupos', grupo: 'I', local: 'Nueva Zelanda', flagLocal: '🇳🇿', visitante: 'Rumania', flagVisitante: '🇷🇴', fecha: '2026-06-17T20:00:00', estadio: 'Lumen Field', ciudad: 'Seattle' },
  { id: 53, fase: 'Grupos', grupo: 'I', local: 'Colombia', flagLocal: '🇨🇴', visitante: 'Nueva Zelanda', flagVisitante: '🇳🇿', fecha: '2026-06-21T20:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 54, fase: 'Grupos', grupo: 'I', local: 'Rumania', flagLocal: '🇷🇴', visitante: 'Turquía', flagVisitante: '🇹🇷', fecha: '2026-06-21T17:00:00', estadio: 'BMO Field', ciudad: 'Toronto' },

  // GRUPO J
  { id: 55, fase: 'Grupos', grupo: 'J', local: 'Chile', flagLocal: '🇨🇱', visitante: 'Noruega', flagVisitante: '🇳🇴', fecha: '2026-06-15T17:00:00', estadio: 'BC Place', ciudad: 'Vancouver' },
  { id: 56, fase: 'Grupos', grupo: 'J', local: 'México', flagLocal: '🇲🇽', visitante: 'Perú', flagVisitante: '🇵🇪', fecha: '2026-06-15T20:00:00', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México' },
  { id: 57, fase: 'Grupos', grupo: 'J', local: 'Chile', flagLocal: '🇨🇱', visitante: 'México', flagVisitante: '🇲🇽', fecha: '2026-06-19T17:00:00', estadio: 'BMO Field', ciudad: 'Toronto' },
  { id: 58, fase: 'Grupos', grupo: 'J', local: 'Perú', flagLocal: '🇵🇪', visitante: 'Noruega', flagVisitante: '🇳🇴', fecha: '2026-06-19T23:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 59, fase: 'Grupos', grupo: 'J', local: 'Chile', flagLocal: '🇨🇱', visitante: 'Perú', flagVisitante: '🇵🇪', fecha: '2026-06-23T20:00:00', estadio: 'Rose Bowl', ciudad: 'Los Angeles' },
  { id: 60, fase: 'Grupos', grupo: 'J', local: 'Noruega', flagLocal: '🇳🇴', visitante: 'México', flagVisitante: '🇲🇽', fecha: '2026-06-23T17:00:00', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco' },

  // GRUPO K
  { id: 61, fase: 'Grupos', grupo: 'K', local: 'Italia', flagLocal: '🇮🇹', visitante: 'Albania', flagVisitante: '🇦🇱', fecha: '2026-06-14T17:00:00', estadio: 'Mercedes-Benz Stadium', ciudad: 'Atlanta' },
  { id: 62, fase: 'Grupos', grupo: 'K', local: 'Eslovaquia', flagLocal: '🇸🇰', visitante: 'Venezuela', flagVisitante: '🇻🇪', fecha: '2026-06-14T23:00:00', estadio: 'Lumen Field', ciudad: 'Seattle' },
  { id: 63, fase: 'Grupos', grupo: 'K', local: 'Italia', flagLocal: '🇮🇹', visitante: 'Eslovaquia', flagVisitante: '🇸🇰', fecha: '2026-06-18T17:00:00', estadio: 'BMO Field', ciudad: 'Toronto' },
  { id: 64, fase: 'Grupos', grupo: 'K', local: 'Venezuela', flagLocal: '🇻🇪', visitante: 'Albania', flagVisitante: '🇦🇱', fecha: '2026-06-18T23:00:00', estadio: 'Estadio Azteca', ciudad: 'Ciudad de México' },
  { id: 65, fase: 'Grupos', grupo: 'K', local: 'Italia', flagLocal: '🇮🇹', visitante: 'Venezuela', flagVisitante: '🇻🇪', fecha: '2026-06-22T20:00:00', estadio: 'BC Place', ciudad: 'Vancouver' },
  { id: 66, fase: 'Grupos', grupo: 'K', local: 'Albania', flagLocal: '🇦🇱', visitante: 'Eslovaquia', flagVisitante: '🇸🇰', fecha: '2026-06-22T17:00:00', estadio: 'Gillette Stadium', ciudad: 'Boston' },

  // GRUPO L
  { id: 67, fase: 'Grupos', grupo: 'L', local: 'Irlanda', flagLocal: '🇮🇪', visitante: 'Nigeria', flagVisitante: '🇳🇬', fecha: '2026-06-16T17:00:00', estadio: 'Lumen Field', ciudad: 'Seattle' },
  { id: 68, fase: 'Grupos', grupo: 'L', local: 'República Checa', flagLocal: '🇨🇿', visitante: 'Sudáfrica', flagVisitante: '🇿🇦', fecha: '2026-06-16T20:00:00', estadio: 'BMO Field', ciudad: 'Toronto' },
  { id: 69, fase: 'Grupos', grupo: 'L', local: 'Irlanda', flagLocal: '🇮🇪', visitante: 'República Checa', flagVisitante: '🇨🇿', fecha: '2026-06-20T17:00:00', estadio: 'BC Place', ciudad: 'Vancouver' },
  { id: 70, fase: 'Grupos', grupo: 'L', local: 'Sudáfrica', flagLocal: '🇿🇦', visitante: 'Nigeria', flagVisitante: '🇳🇬', fecha: '2026-06-20T23:00:00', estadio: 'MetLife Stadium', ciudad: 'Nueva York' },
  { id: 71, fase: 'Grupos', grupo: 'L', local: 'Irlanda', flagLocal: '🇮🇪', visitante: 'Sudáfrica', flagVisitante: '🇿🇦', fecha: '2026-06-24T20:00:00', estadio: 'AT&T Stadium', ciudad: 'Dallas' },
  { id: 72, fase: 'Grupos', grupo: 'L', local: 'Nigeria', flagLocal: '🇳🇬', visitante: 'República Checa', flagVisitante: '🇨🇿', fecha: '2026-06-24T17:00:00', estadio: 'Levi\'s Stadium', ciudad: 'San Francisco' },
]

// Fases eliminatorias (se completan dinámicamente)
export const PARTIDOS_ELIMINATORIOS = [
  { id: 73, fase: 'R16', local: '1A', flagLocal: '🔵', visitante: '2B', flagVisitante: '🔴', fecha: '2026-06-29T20:00:00' },
  { id: 74, fase: 'R16', local: '1C', flagLocal: '🔵', visitante: '2D', flagVisitante: '🔴', fecha: '2026-06-29T23:00:00' },
  { id: 75, fase: 'R16', local: '1E', flagLocal: '🔵', visitante: '2F', flagVisitante: '🔴', fecha: '2026-06-30T20:00:00' },
  { id: 76, fase: 'R16', local: '1G', flagLocal: '🔵', visitante: '2H', flagVisitante: '🔴', fecha: '2026-06-30T23:00:00' },
  { id: 77, fase: 'R16', local: '1B', flagLocal: '🔵', visitante: '2A', flagVisitante: '🔴', fecha: '2026-07-01T20:00:00' },
  { id: 78, fase: 'R16', local: '1D', flagLocal: '🔵', visitante: '2C', flagVisitante: '🔴', fecha: '2026-07-01T23:00:00' },
  { id: 79, fase: 'R16', local: '1F', flagLocal: '🔵', visitante: '2E', flagVisitante: '🔴', fecha: '2026-07-02T20:00:00' },
  { id: 80, fase: 'R16', local: '1H', flagLocal: '🔵', visitante: '2G', flagVisitante: '🔴', fecha: '2026-07-02T23:00:00' },
  { id: 81, fase: 'QF', local: 'W73', flagLocal: '⭐', visitante: 'W74', flagVisitante: '⭐', fecha: '2026-07-05T20:00:00' },
  { id: 82, fase: 'QF', local: 'W75', flagLocal: '⭐', visitante: 'W76', flagVisitante: '⭐', fecha: '2026-07-05T23:00:00' },
  { id: 83, fase: 'QF', local: 'W77', flagLocal: '⭐', visitante: 'W78', flagVisitante: '⭐', fecha: '2026-07-06T20:00:00' },
  { id: 84, fase: 'QF', local: 'W79', flagLocal: '⭐', visitante: 'W80', flagVisitante: '⭐', fecha: '2026-07-06T23:00:00' },
  { id: 85, fase: 'SF', local: 'W81', flagLocal: '⭐', visitante: 'W82', flagVisitante: '⭐', fecha: '2026-07-09T20:00:00' },
  { id: 86, fase: 'SF', local: 'W83', flagLocal: '⭐', visitante: 'W84', flagVisitante: '⭐', fecha: '2026-07-10T20:00:00' },
  { id: 87, fase: '3er', local: 'Perdedor SF1', flagLocal: '⭐', visitante: 'Perdedor SF2', flagVisitante: '⭐', fecha: '2026-07-13T16:00:00' },
  { id: 88, fase: 'F', local: 'W85', flagLocal: '🏆', visitante: 'W86', flagVisitante: '🏆', fecha: '2026-07-13T20:00:00' },
]

export const TODAS_FASES = ['Grupos', 'R16', 'QF', 'SF', 'F']

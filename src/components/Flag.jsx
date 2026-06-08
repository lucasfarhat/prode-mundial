import { flagUrl } from '../lib/flags'

// Renderiza la bandera de un pais como imagen (flagcdn.com).
// Si el nombre no es un pais conocido (placeholders de eliminatorias),
// cae al emoji que viene en el fixture.
export default function Flag({ name, emoji }) {
  const url = flagUrl(name)
  if (!url) {
    return <span className="team-flag">{emoji}</span>
  }
  return <img className="team-flag-img" src={url} alt={name} loading="lazy" />
}

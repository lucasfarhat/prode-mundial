# 🏆 Prode Mundial 2026

App completa para hacer pronósticos del Mundial 2026. Construida con React + Vite + Supabase.

---

## 🚀 GUÍA DE DEPLOY — PASO A PASO

### PASO 1 — Crear proyecto en Supabase (gratis)

1. Ir a https://supabase.com y crear cuenta
2. Crear nuevo proyecto (nombre: `prode-mundial`, región: South America)
3. Guardar la contraseña del proyecto
4. Esperar ~2 minutos a que el proyecto se configure

### PASO 2 — Crear las tablas en Supabase

1. En tu proyecto de Supabase, ir a **SQL Editor** (barra lateral izquierda)
2. Hacer clic en **New query**
3. Copiar y pegar todo el contenido de `supabase-schema.sql`
4. Hacer clic en **Run** (o Ctrl+Enter)
5. Verificar que no haya errores (debe decir "Success")

### PASO 3 — Obtener las claves de API

1. En Supabase, ir a **Settings → API**
2. Copiar:
   - **Project URL** → `https://xxx.supabase.co`
   - **anon public key** → `eyJhbGci...`

### PASO 4 — Configurar el proyecto localmente

1. Copiar el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Editar `.env.local` y pegar tus claves:
   ```
   VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Correr en local:
   ```bash
   npm run dev
   ```
   Abrir http://localhost:5173

### PASO 5 — Deploy en Vercel (gratis)

**Opción A — Desde GitHub (recomendado):**

1. Subir el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Prode Mundial 2026"
   git remote add origin https://github.com/TU_USUARIO/prode-mundial.git
   git push -u origin main
   ```

2. Ir a https://vercel.com → New Project → importar el repo
3. En **Environment Variables** agregar:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key
4. Hacer clic en **Deploy**
5. En ~1 minuto tenés tu URL pública tipo: `https://prode-mundial.vercel.app`

**Opción B — Desde la CLI de Vercel:**
```bash
npm install -g vercel
vercel
# Seguir los pasos interactivos
```

---

## 👤 Crear el primer admin

Después de que alguien se registre, para hacerlo admin ejecutar en el SQL Editor de Supabase:

```sql
update public.perfiles
set es_admin = true
where email = 'tu@email.com';
```

El admin puede:
- Cargar los resultados reales de cada partido
- Los puntos se calculan automáticamente (trigger en la DB)
- Ver el panel admin en la app

---

## 🗓 Calcular ganador semanal

Cada domingo, ejecutar en el SQL Editor:

```sql
-- Cambiar el número de semana y las fechas
select public.calcular_ganador_semanal(
  1,             -- número de semana
  '2026-06-11',  -- lunes de esa semana
  '2026-06-17'   -- domingo de esa semana
);
```

O podés automatizarlo con un cron job en Supabase Edge Functions.

---

## 🗂 Estructura del proyecto

```
prode-mundial/
├── src/
│   ├── lib/
│   │   ├── supabase.js      # Cliente + funciones de base de datos
│   │   └── fixture.js       # Todos los partidos del Mundial 2026
│   ├── pages/
│   │   ├── Fixture.jsx      # Ingreso de pronósticos
│   │   ├── Tabla.jsx        # Tabla de posiciones
│   │   ├── Semanal.jsx      # Ganador semanal
│   │   ├── Registro.jsx     # Login / Registro
│   │   ├── Reglas.jsx       # Reglas del prode
│   │   └── Admin.jsx        # Panel de administración
│   ├── App.jsx              # App principal con navegación
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos
├── supabase-schema.sql      # Schema completo de base de datos
├── .env.example             # Template de variables de entorno
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎯 Funcionalidades incluidas

- ✅ Registro y login con Supabase Auth
- ✅ Fixture completo del Mundial 2026 (72 partidos de grupos + eliminatorias)
- ✅ Bloqueo automático 1h antes de cada partido
- ✅ 3 pts resultado exacto / 1 pt ganador correcto
- ✅ Tabla de posiciones en tiempo real
- ✅ Desempate por exactos y diferencia de goles
- ✅ Ganador semanal con su lógica de desempate
- ✅ Panel admin para cargar resultados
- ✅ Cálculo automático de puntos vía DB trigger
- ✅ Diseño mobile-friendly

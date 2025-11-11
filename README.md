# 🌍 RUMBO FRONTEND (MVP)

Rumbo es una aplicación de viajes colaborativos donde los usuarios pueden crear, compartir y unirse a viajes de manera simple y segura.  
Este repositorio contiene el **frontend (MVP)** del proyecto, desarrollado con **Next.js**.

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tuusuario/rumbo.git
cd rumbo
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Compilar el proyecto
```bash
npm run build
```

### 4️⃣ Iniciar el entorno de desarrollo
```bash
npm run dev
```

La aplicación se ejecutará en [http://localhost:3000](http://localhost:3000).

---

## 🧭 Cargar 10 viajes en POSTMAN (Se debe cargar de a 1) 

```json
[
  {
    "driverId": "Gianfranco Mazzei",
    "origin": "Buenos Aires",
    "destination": "Rosario",
    "date": "2025-11-20",
    "time": "08:30",
    "availableSeats": 3,
    "pricePerPerson": 12000,
    "vehicle": "Toyota Corolla 2020",
    "createdByUserId": "Gianfranco Mazzei",
    "music": true,
    "pets": false,
    "children": true,
    "luggage": true,
    "notes": "Salida puntual desde Retiro."
  },
  {
    "driverId": "Tomás Lecuenis",
    "origin": "Córdoba",
    "destination": "Mendoza",
    "date": "2025-12-02",
    "time": "07:00",
    "availableSeats": 2,
    "pricePerPerson": 18000,
    "vehicle": "Peugeot 308",
    "createdByUserId": "Tomás Lecuenis",
    "music": true,
    "pets": true,
    "children": false,
    "luggage": true,
    "notes": "Se permite una mochila por persona."
  },
  {
    "driverId": "Baltazar Marenda",
    "origin": "Salta",
    "destination": "Tucumán",
    "date": "2025-11-25",
    "time": "10:00",
    "availableSeats": 4,
    "pricePerPerson": 9500,
    "vehicle": "Volkswagen Gol Trend",
    "createdByUserId": "Baltazar Marenda",
    "music": false,
    "pets": false,
    "children": true,
    "luggage": true,
    "notes": "Parada técnica en Metán."
  },
  {
    "driverId": "Máximo Bonarrico",
    "origin": "Mar del Plata",
    "destination": "Buenos Aires",
    "date": "2025-11-19",
    "time": "18:00",
    "availableSeats": 3,
    "pricePerPerson": 16000,
    "vehicle": "Chevrolet Cruze",
    "createdByUserId": "Máximo Bonarrico",
    "music": true,
    "pets": true,
    "children": false,
    "luggage": true,
    "notes": "Salida desde la terminal nueva."
  },
  {
    "driverId": "Theo Ruschanoff",
    "origin": "Neuquén",
    "destination": "Bariloche",
    "date": "2025-12-10",
    "time": "09:15",
    "availableSeats": 2,
    "pricePerPerson": 25000,
    "vehicle": "Ford EcoSport",
    "createdByUserId": "Theo Ruschanoff",
    "music": true,
    "pets": false,
    "children": true,
    "luggage": true,
    "notes": "Solo se aceptan valijas pequeñas."
  },
  {
    "driverId": "Felipe Alzamora",
    "origin": "Posadas",
    "destination": "Corrientes",
    "date": "2025-11-22",
    "time": "06:30",
    "availableSeats": 4,
    "pricePerPerson": 14000,
    "vehicle": "Renault Logan",
    "createdByUserId": "Felipe Alzamora",
    "music": false,
    "pets": false,
    "children": true,
    "luggage": false,
    "notes": "Sin paradas intermedias."
  },
  {
    "driverId": "Sergio Casanova",
    "origin": "San Juan",
    "destination": "La Rioja",
    "date": "2025-12-03",
    "time": "08:00",
    "availableSeats": 3,
    "pricePerPerson": 11000,
    "vehicle": "Nissan Versa",
    "createdByUserId": "Sergio Casanova",
    "music": true,
    "pets": false,
    "children": false,
    "luggage": true,
    "notes": "Auto con aire acondicionado."
  },
  {
    "driverId": "Juan Cruz Iuliano",
    "origin": "Bahía Blanca",
    "destination": "Tres Arroyos",
    "date": "2025-11-18",
    "time": "13:00",
    "availableSeats": 4,
    "pricePerPerson": 8000,
    "vehicle": "Honda Fit",
    "createdByUserId": "Juan Cruz Iuliano",
    "music": true,
    "pets": true,
    "children": true,
    "luggage": true,
    "notes": "Se escuchará rock nacional."
  },
  {
    "driverId": "Guido Morabito",
    "origin": "Santa Fe",
    "destination": "Paraná",
    "date": "2025-11-23",
    "time": "09:45",
    "availableSeats": 2,
    "pricePerPerson": 7000,
    "vehicle": "Fiat Cronos",
    "createdByUserId": "Guido Morabito",
    "music": false,
    "pets": false,
    "children": false,
    "luggage": true,
    "notes": "Cruce por el túnel subfluvial."
  },
  {
    "driverId": "Agustín Chung",
    "origin": "Buenos Aires",
    "destination": "La Plata",
    "date": "2025-11-21",
    "time": "17:30",
    "availableSeats": 3,
    "pricePerPerson": 6000,
    "vehicle": "Citroën C3",
    "createdByUserId": "Agustin Chung",
    "music": true,
    "pets": false,
    "children": true,
    "luggage": true,
    "notes": "Salida desde Plaza Miserere."
  }
]
```

---

## 🧑‍💻 Tecnologías principales

- ⚛️ **Next.js 14**
- 🎨 **Tailwind CSS**
- 🔄 **API REST** (Node.js / Express)
- 🧩 **Postman** para testeo de endpoints

---

## 🛠️ Scripts disponibles

| Script | Descripción |
|--------|--------------|
| `npm run dev` | Inicia el entorno de desarrollo. |
| `npm run build` | Compila la app para producción. |
| `npm start` | Inicia la app compilada. |

---

## 💡 Autor

Desarrollado con 💙 por **Rumbo Dev Team**  
📦 *Versión:* `1.0.0`

---

> _“El viaje importa tanto como el destino.” — Rumbo Team_ ✈️


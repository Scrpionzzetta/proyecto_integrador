# Proyecto Integrador

Plataforma digital para la gestion productiva de pequeños y medianos productores de berries de la comuna de Parral. Desarrollada en convenio con la Oficina de Desarrollo Rural de la Municipalidad de Parral.

CFT Maule — Campus Parral - TNS Informatica - 2026

---

## Tecnologias

| Capa                  | Tecnologia                        |
|-----------------------|-----------------------------------|
| Frontend              | Vue 3 + Vite + Pinia + Vue Router |
| Backend               | Node.js + Express                 |
| Base de datos         | Firebase Firestore                |
| Autenticacion         | Firebase Authentication           |

---

## Estructura del proyecto

El proyecto esta organizado como monorepo, es decir que el backend y el frontend conviven en la misma carpeta raiz(PROYECTO_INTEGRADOR).

```
PROYECTO_INTEGRADOR/
├── src/                        # Backend Node.js
│   ├── config/
│   │   └── firebase.js
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── compradores.controller.js
│   │   ├── fichas.controller.js
│   │   ├── huertos.controller.js
│   │   ├── pagos.controller.js
│   │   ├── recolecciones.controller.js
│   │   ├── reportes.controller.js
│   │   ├── temporadas.controller.js
│   │   ├── trabajadores.controller.js
│   │   ├── usuarios.controller.js
│   │   └── ventas.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── roles.middleware.js
│   └── routes/
│       ├── auth.routes.js
│       ├── compradores.routes.js
│       ├── fichas.routes.js
│       ├── huertos.routes.js
│       ├── pagos.routes.js
│       ├── recolecciones.routes.js
│       ├── reportes.routes.js
│       ├── temporadas.routes.js
│       ├── trabajadores.routes.js
│       ├── usuarios.routes.js
│       └── ventas.routes.js
├── index.js                    # Entrada del servidor
├── package.json
├── .env                        # Variables de entorno (no subir a Git)
└── client/                     # Frontend Vue 3
    └── src/
        ├── components/
        │   └── AppSidebar.vue
        ├── composables/
        ├── router/
        ├── services/
        │   └── api.js
        ├── stores/
        ├── views/
        ├── App.vue
        ├── main.js
        └── style.css
```

---

## Requisitos previos

- Node.js v18 o superior
- Cuenta en Firebase con un proyecto creado
- Firestore habilitado en el proyecto Firebase
- Archivo de credenciales de Firebase Admin SDK (`.json`)

---

## Instalacion

### 1. Clonar el repositorio

```bash
git clone https://github.com/Scrpionzzetta/proyecto_integrador
cd PROYECTO_INTEGRADOR
```

### 2. Configurar el backend

```bash
npm install
```

Crear el archivo `.env` en la raiz del proyecto (Opcional, modificar el `env` a `.env` en la raiz del proyecrto):

```
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS=./src/config/nombre-del-archivo-firebase.json
```

Colocar el archivo `.json` de credenciales de Firebase Admin SDK dentro de `src/config/`.

Levantar el servidor backend:

```bash
npm run dev
```

El servidor quedara disponible en `http://localhost:3000`

### 3. Configurar el frontend

```bash
cd client
npm install
npm run dev
```

El frontend quedara disponible en `http://localhost:5173`

---

## Roles del sistema

## Roles del sistema

**Administrador** — Personal de la Oficina Rural de la Municipalidad de Parral
- Crea y gestiona cuentas de productores
- Visualiza estadisticas consolidadas de produccion
- Genera reportes por productor, especie y temporada

**Productor** — Dueno del campo o huerto agricola
- Gestiona sus cosecheros y temporadas
- Registra cosechas diarias por cosechero
- Controla pagos y lleva registro de ventas
- Genera reporte de cierre de temporada

> Los cosecheros no tienen acceso al sistema web. Son registrados
> por el productor y aparecen en los registros de cosecha y pagos.

Los cosecheros no tienen acceso al sistema web. Son registrados por el productor y aparecen en los registros de cosecha y pagos.

---

## Rutas de la API

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <uid>
```
### Autenticacion

**POST** `/auth/registro` — Crear nuevo usuario — Publico
**POST** `/auth/login` — Iniciar sesion — Publico

### Usuarios

**GET** `/usuarios` — Listar usuarios — admin, dueno
**GET** `/usuarios/:id` — Obtener usuario por ID — admin, dueno
**PUT** `/usuarios/:id` — Editar usuario — admin
**DELETE** `/usuarios/:id` — Eliminar usuario — admin
**PUT** `/usuarios/:id/desactivar` — Desactivar cuenta — admin, dueno
**PUT** `/usuarios/:id/activar` — Reactivar cuenta — admin

### Huertos

**GET** `/huertos` — Listar huertos — admin, dueno
**POST** `/huertos` — Crear huerto — admin, dueno
**GET** `/huertos/:id` — Obtener huerto por ID — admin, dueno
**PUT** `/huertos/:id` — Editar huerto — admin, dueno
**DELETE** `/huertos/:id` — Eliminar huerto — admin
**POST** `/huertos/:id/asignar` — Asignar cosechero — admin, dueno
**POST** `/huertos/:id/desasignar` — Desasignar cosechero — admin, dueno

### Temporadas

**GET** `/temporadas` — Listar temporadas — admin, dueno
**POST** `/temporadas` — Crear temporada — admin, dueno
**GET** `/temporadas/:id` — Obtener temporada por ID — admin, dueno
**PUT** `/temporadas/:id/cerrar` — Cerrar temporada — admin, dueno
**DELETE** `/temporadas/:id` — Eliminar temporada cerrada — admin, dueno

### Recolecciones

**GET** `/recolecciones` — Listar recolecciones — admin, dueno
**POST** `/recolecciones` — Registrar recoleccion — admin, dueno
**GET** `/recolecciones/trabajador/:id` — Por cosechero — admin, dueno
**GET** `/recolecciones/temporada/:id` — Por temporada — admin, dueno

### Pagos

**GET** `/pagos` — Listar pagos — admin, dueno
**POST** `/pagos/calcular` — Calcular pago por periodo — admin, dueno
**POST** `/pagos` — Registrar pago — admin, dueno
**GET** `/pagos/trabajador/:id` — Pagos por cosechero — admin, dueno

### Ventas

**GET** `/ventas` — Listar ventas — admin, dueno
**POST** `/ventas` — Registrar venta — admin, dueno
**DELETE** `/ventas/:id` — Eliminar venta — admin, dueno

### Compradores

**GET** `/compradores` — Listar compradores — admin, dueno
**POST** `/compradores` — Crear comprador — admin, dueno
**DELETE** `/compradores/:id` — Eliminar comprador — admin, dueno

### Trabajadores

**GET** `/trabajadores/mis-trabajadores` — Cosecheros asignados al dueno — admin, dueno
**GET** `/trabajadores/libres` — Cosecheros sin huerto asignado — admin, dueno

### Fichas

**GET** `/fichas` — Fichas de todos los cosecheros — admin, dueno
**GET** `/fichas/:trabajadorId` — Ficha individual con estadisticas — admin, dueno

### Reportes

**GET** `/reportes` — Reporte global con filtros — admin
**GET** `/reportes/ultimos-ingresos` — Ultimas 10 recolecciones — admin
**GET** `/reportes/temporada/:id` — Reporte completo de temporada — admin, dueno
---

## Tutorial de uso

### Administrador (Municipalidad de Parral)

El administrador es el primer usuario del sistema. Su cuenta debe crearse directamente desde la API antes de que el sistema este operativo.

**Paso 1 — Crear la cuenta de administrador**

Usar Postman o cualquier cliente HTTP:

```
POST http://localhost:3000/auth/registro

{
  "nombre": "Nombre del Administrador",
  "email": "admin@municipalidadparral.cl",
  "password": "contrasena_segura",
  "rol": "admin",
  "tipo_documento": "rut",
  "numero_documento": "12.345.678-9",
  "fecha_nacimiento": "1980-01-01"
}
```

**Paso 2 — Ingresar al sistema**

Abrir el navegador en `http://localhost:5173` (o la URL del servidor en produccion), ingresar el correo y la contrasena creados. El sistema redirige automaticamente al panel de administracion.

**Paso 3 — Crear cuentas de productores**

Desde el menu lateral ir a Productores y hacer clic en Nuevo Productor. Completar nombre, RUT, correo y contrasena inicial. Las credenciales deben entregarse personalmente al productor.

**Paso 4 — Gestionar productores activos**

En la vista de Productores se puede ver el estado de cada cuenta. Usar Desactivar para bloquear el acceso de un productor sin eliminar su historial, y Activar para restaurarlo.

**Paso 5 — Ver reportes globales**

Desde el menu ir a Reportes globales. Usar los filtros de productor, especie y temporada para acotar los resultados. Sin filtros se muestra la produccion consolidada de todos los productores.

---

### Productor (Dueno del huerto)

El productor ingresa con las credenciales que le entrego el administrador.

**Paso 1 — Ingresar al sistema**

Abrir el navegador en la URL del sistema, ingresar el correo y la contrasena. El sistema redirige automaticamente al panel del productor.

**Paso 2 — Registrar un huerto**

Ir a Huertos y hacer clic en Nuevo Huerto. Ingresar nombre y ubicacion. El huerto quedara registrado a nombre del productor.

**Paso 3 — Registrar cosecheros**

Ir a Cosecheros y hacer clic en Nuevo Cosechero. Completar los datos del trabajador: nombre, RUT o pasaporte, fecha de nacimiento, telefono, nacionalidad y tipo de contrato. El cosechero no tendra acceso al sistema web.

**Paso 4 — Asignar cosecheros al huerto**

En la vista de Huertos, hacer clic en Asignar en el huerto correspondiente. Seleccionar el cosechero de la lista de disponibles. Un cosechero puede estar asignado a varios huertos del mismo productor pero no a huertos de otro productor.

**Paso 5 — Crear una temporada**

Ir a Temporadas y hacer clic en Nueva Temporada. Seleccionar el huerto, ingresar la especie o variedad de fruta, la fecha de inicio y los precios por bandeja y por kilo. Solo puede haber una temporada activa por huerto.

**Paso 6 — Registrar cosechas diarias**

Ir a Cosechas diarias y hacer clic en Registrar Cosecha. Seleccionar el huerto, el cosechero asignado y la temporada activa. Elegir el tipo (bandeja o granel) e ingresar la cantidad. El precio vigente se guarda automaticamente en el registro.

**Paso 7 — Calcular y registrar pagos**

Ir a Pagos y hacer clic en Calcular Pago. Seleccionar el huerto, el cosechero y la temporada. Elegir el periodo (quincenal o mensual) e ingresar el rango de fechas. El sistema calcula automaticamente el total segun los kilos registrados y el precio vigente al momento de cada cosecha. Hacer clic en Registrar Pago para guardar.

**Paso 8 — Registrar ventas**

Ir a Compradores y agregar los compradores de la temporada (empresa o persona). Luego ir a Ventas y registrar cada operacion indicando comprador, fecha, especie, cantidad y precio de venta.

**Paso 9 — Ver el reporte de temporada**

Ir a Reporte de temporada, seleccionar la temporada y hacer clic en Generar Reporte. El sistema muestra el balance completo: kilos cosechados, ventas realizadas, pagos a cosecheros y balance financiero. Este documento puede presentarse a la Oficina de Desarrollo Rural.

**Paso 10 — Cerrar la temporada**

Cuando la cosecha finalice, ir a Temporadas y hacer clic en Cerrar. Ingresar la fecha de cierre. Una temporada cerrada no acepta nuevas cosechas pero conserva todo su historial.

---

## Checklist de seguridad para produccion

Antes de publicar el sistema en un servidor de internet verificar los siguientes puntos:

- El archivo `.env` no esta incluido en el repositorio Git (verificar `.gitignore`)
- El archivo de credenciales Firebase `.json` no esta incluido en el repositorio Git
- La variable `origin` en `app.use(cors(...))` apunta a la URL real del frontend, no a `localhost`
- El frontend apunta a la URL real del backend en `client/src/services/api.js`
- Firebase tiene reglas de seguridad configuradas en Firestore (no en modo test)
- Las contrasenas iniciales de los productores se cambian tras el primer ingreso
- El servidor backend corre detras de un proxy inverso (Nginx o similar) con HTTPS habilitado
- El puerto 3000 no esta expuesto directamente a internet

---

## Variables de entorno requeridas(esta debe crearce al momento de levantar el proyecto)

```
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS=./src/config/nombre-credencial-firebase.json
```

---

## Levantar ambos servidores en desarrollo

Abrir dos terminales en la raiz del proyecto:

Terminal 1 — Backend:
```bash
npm run dev
```

Terminal 2 — Frontend:
```bash
cd client
npm run dev
```

---

## Creditos

Proyecto desarrollado por estudiantes de TNS Informatica del CFT Maule Campus Parral, primer semestre 2026, en convenio con la Oficina de Desarrollo Rural de la Municipalidad de Parral.

Coordinador: Pablo Sepulveda
Docentes: Rocio Ortiz y Daniel Scarlazzetta
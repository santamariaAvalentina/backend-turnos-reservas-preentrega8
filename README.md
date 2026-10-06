# Backend Turnos y Reservas

Proyecto backend desarrollado con **Node.js** y **Express**, utilizando **ESM (ECMAScript Modules)**, para la gestión de servicios y reservas dentro de un sistema de turnos.

El proyecto implementa una API REST organizada mediante una arquitectura en capas, separando las responsabilidades de cada componente:

* **Routes:** definición de endpoints.
* **Controllers:** recepción de requests y envío de responses.
* **Services:** lógica de negocio.
* **Repositories:** intermediarios entre los Services y los DAO.
* **DAO:** acceso directo y persistencia de datos.
* **MongoDB:** almacenamiento de la información.
* **Mongoose:** ODM utilizado para trabajar con MongoDB.
* **Zod:** validación de los datos recibidos por la API.
* **Handlebars:** generación de vistas del lado del servidor.
* **Socket.io:** comunicación en tiempo real entre el servidor y los clientes.

La arquitectura permite mantener el código organizado y facilita el reemplazo o modificación de la capa de persistencia sin afectar las demás capas de la aplicación.

---

# 📌 Objetivo del proyecto

El objetivo es desarrollar y organizar una aplicación backend para administrar los servicios disponibles y las reservas de un sistema de turnos.

La aplicación permite:

* Consultar servicios.
* Buscar servicios por ID.
* Filtrar servicios por categoría.
* Filtrar servicios según disponibilidad.
* Paginar los resultados de servicios.
* Ordenar los servicios.
* Crear nuevos servicios.
* Modificar servicios existentes.
* Eliminar servicios.
* Validar los datos recibidos antes de acceder a MongoDB.
* Crear reservas.
* Consultar reservas por ID.
* Agregar servicios a una reserva.
* Consultar una reserva con sus servicios mediante `populate`.
* Crear y consultar mensajes.
* Mostrar los servicios mediante vistas desarrolladas con Handlebars.
* Mostrar las reservas mediante vistas desarrolladas con Handlebars.
* Actualizar la vista de servicios en tiempo real utilizando Socket.io.

La arquitectura separa las responsabilidades entre **Routes, Controllers, Services, Repositories y DAO**, permitiendo una estructura clara y preparada para trabajar con una base de datos.

---

# 🏗️ Arquitectura en capas

El flujo de las peticiones de la API REST sigue la siguiente estructura:

```text
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
Mongoose
   ↓
MongoDB Atlas
```

## Routes

Los routers se encargan de definir los endpoints y conectarlos con los métodos correspondientes de los Controllers.

También incorporan los middlewares de validación cuando corresponde.

No contienen lógica de negocio ni acceso directo a MongoDB.

## Controllers

Los Controllers reciben las requests y trabajan con:

* `req.params`
* `req.query`
* `req.body`

Luego llaman a los Services correspondientes y construyen las respuestas mediante `res.status().json()`.

Los Controllers no acceden directamente a MongoDB ni contienen la lógica de negocio principal.

## Services

Los Services contienen la lógica de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

* Comprobar la existencia de entidades.
* Aplicar reglas de negocio.
* Coordinar las operaciones mediante los Repositories.

Las validaciones de formato y estructura de los datos se realizan mediante middlewares específicos con Zod antes de llegar a esta capa.

Los Services no utilizan `req` ni `res` y no acceden directamente a MongoDB.

## Repositories

Los Repositories funcionan como una capa intermedia entre los Services y los DAO.

Se encargan de utilizar los métodos del DAO y abstraer la forma en que los Services acceden a los datos.

Esto permite que la lógica de negocio no dependa directamente de la implementación de persistencia.

## DAO

Los DAO se encargan del acceso directo a los datos mediante los modelos de Mongoose.

Son responsables de realizar operaciones de persistencia como:

* Buscar documentos.
* Buscar documentos por ID.
* Crear documentos.
* Actualizar documentos.
* Eliminar documentos.
* Aplicar filtros, paginación y ordenamiento en las consultas correspondientes.
* Utilizar `populate` para obtener información relacionada.

Los DAO no utilizan `req` o `res`.

---

# ✅ Validación de datos con Zod

El proyecto utiliza **Zod** para validar los datos recibidos por la API.

Las validaciones se encuentran separadas de las rutas y modelos, utilizando schemas y middlewares específicos.

El flujo es:

```text
Request
   ↓
Validation Middleware
   ↓
¿Datos válidos?
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
MongoDB
```

De esta manera, los datos inválidos son rechazados antes de llegar a MongoDB.

## Servicios

Se valida la información utilizada para:

* Crear un servicio.
* Actualizar un servicio.

Se controlan campos como:

* `name`
* `description`
* `duration`
* `price`
* `category`
* `available`

Además:

* `duration` debe ser mayor que cero.
* `price` no puede ser negativo.
* `available` es opcional.

## Reservas

Se valida la información utilizada para crear una reserva:

* `clientName`
* `clientEmail`
* `date`
* `time`
* `status`

El email debe tener un formato válido.

## Agregar servicios a una reserva

También se validan los parámetros utilizados para:

```text
POST /api/bookings/:bid/services/:sid
```

Se validan:

* `bid`
* `sid`

Las validaciones inválidas devuelven una respuesta `400 Bad Request`.

---

# 🖥️ Vistas con Handlebars

El proyecto incorpora **Handlebars** para generar vistas HTML desde el servidor.

La configuración se realiza mediante `express-handlebars`.

Las vistas utilizan información obtenida desde MongoDB a través de las capas existentes:

```text
Vista
   ↓
Views Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
MongoDB
```

De esta manera, las vistas no utilizan datos hardcodeados.

## Servicios

La vista de servicios permite visualizar:

* Nombre.
* Descripción.
* Duración.
* Precio.
* Categoría.
* Disponibilidad.

Ruta:

```http
GET /views/services
```

## Reservas

La vista de reservas permite visualizar las reservas almacenadas en MongoDB.

Ruta:

```http
GET /views/bookings
```

## Detalle de servicio

También se dispone de una vista para consultar el detalle de un servicio:

```http
GET /views/services/:sid
```

## Detalle de reserva

La vista permite consultar una reserva específica:

```http
GET /views/bookings/:bid
```

---

# ⚡ Comunicación en tiempo real con Socket.io

El proyecto incorpora **Socket.io** para permitir comunicación en tiempo real entre el servidor y los clientes.

Socket.io se configura sobre el servidor HTTP de Node.js.

Cuando un cliente se conecta, el servidor establece la comunicación mediante WebSockets.

```text
Cliente
   ↕
Socket.io
   ↕
Servidor
```

## Actualización de servicios en tiempo real

Se implementó un evento llamado:

```text
servicesUpdated
```

Cuando se crea un nuevo servicio mediante la API REST, el servidor obtiene nuevamente los servicios y emite el evento `servicesUpdated`.

El navegador escucha este evento mediante:

```javascript
socket.on("servicesUpdated", ...)
```

Cuando recibe los nuevos datos, actualiza la vista de servicios sin necesidad de recargar manualmente la página.

---

# 🎨 Estilos

Las vistas utilizan un archivo CSS ubicado en:

```text
public/css/styles.css
```

Los estilos utilizan **Flexbox** para organizar las tarjetas de servicios y reservas de forma responsive.

---

# 🗄️ MongoDB

El proyecto utiliza **MongoDB Atlas** como base de datos y **Mongoose** como ODM para trabajar con MongoDB desde Node.js.

La base de datos utilizada es:

```text
booking_system
```

Las principales colecciones utilizadas son:

```text
services
bookings
messages
```

Los documentos utilizan un identificador `_id` generado por MongoDB/Mongoose.

## Relación entre reservas y servicios

En las reservas, los servicios asociados se almacenan mediante referencias `ObjectId`.

La estructura utilizada es:

```text
services
   ↓
service: ObjectId
quantity: Number
```

Por ejemplo:

```json
{
  "service": "6abc50b79689e9c3591a1a81",
  "quantity": 1
}
```

No se guarda el objeto completo del servicio dentro de la reserva.

Para consultar una reserva junto con la información completa de sus servicios se utiliza Mongoose `populate`:

```javascript
.populate("services.service")
```

De esta manera, la referencia almacenada en MongoDB se completa al realizar la consulta.

---

# 🛠️ Tecnologías utilizadas

* **Node.js**
* **Express**
* **JavaScript**
* **ESM (ECMAScript Modules)**
* **Mongoose**
* **MongoDB Atlas**
* **dotenv**
* **Zod**
* **Handlebars**
* **express-handlebars**
* **Socket.io**
* **HTML**
* **CSS**
* **Postman**

---

# 📁 Estructura del proyecto

```text
backend-turnos-reservas/

│
├── public/
│   ├── css/
│   │   └── styles.css
│   │
│   └── js/
│       └── socket.js
│
├── src/
│   │
│   ├── config/
│   │   ├── env.config.js
│   │   └── database.config.js
│   │
│   ├── controllers/
│   │   ├── services.controller.js
│   │   ├── bookings.controller.js
│   │   ├── messages.controller.js
│   │   └── views.controller.js
│   │
│   ├── middlewares/
│   │   └── validation.middleware.js
│   │
│   ├── validations/
│   │   ├── service.validation.js
│   │   └── booking.validation.js
│   │
│   ├── services/
│   │   ├── services.service.js
│   │   ├── bookings.service.js
│   │   └── messages.service.js
│   │
│   ├── repositories/
│   │   ├── services.repository.js
│   │   ├── bookings.repository.js
│   │   └── messages.repository.js
│   │
│   ├── dao/
│   │   ├── services.dao.js
│   │   ├── bookings.dao.js
│   │   ├── messages.dao.js
│   │   └── models/
│   │       ├── service.model.js
│   │       ├── booking.model.js
│   │       └── message.model.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   ├── bookings.router.js
│   │   ├── messages.router.js
│   │   └── views.router.js
│   │
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   │
│   │   ├── services.handlebars
│   │   ├── service-detail.handlebars
│   │   ├── bookings.handlebars
│   │   ├── booking-detail.handlebars
│   │   └── realtime-services.handlebars
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> El archivo `.env` se utiliza de forma local y se encuentra incluido en `.gitignore`, por lo que no debe subirse al repositorio.

---

# 📡 API REST

La API utiliza las siguientes rutas base:

```text
/api/services
/api/bookings
/api/messages
```

Las funcionalidades de Handlebars utilizan una ruta independiente:

```text
/views/services
/views/bookings
```

De esta manera, la incorporación de las vistas no reemplaza ni modifica la API REST existente.

---

# 🦷 Services

## 📋 GET - Obtener servicios

```http
GET /api/services
```

Permite consultar los servicios almacenados en MongoDB.

La respuesta incluye la lista de servicios y metadatos de paginación.

Ejemplo de respuesta:

```json
{
  "status": "success",
  "services": [],
  "total": 7,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "hasPrevPage": false,
  "hasNextPage": false
}
```

---

## 🔎 GET - Filtrar servicios por categoría

```http
GET /api/services?category=Odontología
```

Permite obtener únicamente los servicios pertenecientes a una determinada categoría.

---

## ✅ GET - Filtrar servicios por disponibilidad

```http
GET /api/services?available=true
```

Permite obtener los servicios disponibles.

También se pueden consultar los servicios no disponibles:

```http
GET /api/services?available=false
```

---

## 📄 GET - Paginación

Los resultados pueden paginarse mediante los parámetros:

* `page`
* `limit`

Ejemplo:

```http
GET /api/services?page=1&limit=3
```

La respuesta incluye:

* `total`
* `page`
* `limit`
* `totalPages`
* `hasPrevPage`
* `hasNextPage`

Por ejemplo:

```json
{
  "status": "success",
  "services": [],
  "total": 7,
  "page": 1,
  "limit": 3,
  "totalPages": 3,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

---

## ↕️ GET - Ordenar servicios

Los servicios pueden ordenarse utilizando:

* `sortBy`: campo por el cual ordenar.
* `order`: `asc` o `desc`.

Ejemplo para ordenar por precio de menor a mayor:

```http
GET /api/services?sortBy=price&order=asc
```

Ejemplo para ordenar por precio de mayor a menor:

```http
GET /api/services?sortBy=price&order=desc
```

---

## 🔍 GET - Obtener un servicio por ID

```http
GET /api/services/:sid
```

Permite obtener un servicio específico utilizando su identificador de MongoDB.

Si el servicio solicitado no existe, la API devuelve:

```text
404 Not Found
```

---

## ➕ POST - Crear un servicio

```http
POST /api/services
```

Permite agregar un nuevo servicio.

Los datos se envían mediante el body de la petición en formato JSON.

Ejemplo:

```json
{
  "name": "Consulta",
  "description": "Consulta general",
  "duration": 60,
  "price": 5000,
  "category": "salud",
  "available": true
}
```

El campo `available` es opcional y posee un valor predeterminado de `true` en el modelo cuando no se especifica.

Los datos son validados mediante Zod antes de llegar a MongoDB.

Si la creación es correcta, la API responde:

```text
201 Created
```

Además, al crear un servicio se emite el evento `servicesUpdated` mediante Socket.io.

---

## ✏️ PUT - Actualizar un servicio

```http
PUT /api/services/:sid
```

Permite modificar los datos de un servicio existente utilizando su ID.

Los datos actualizados se envían mediante el body en formato JSON y son validados mediante Zod.

Si los datos son inválidos:

```text
400 Bad Request
```

Si el servicio no existe:

```text
404 Not Found
```

---

## 🗑️ DELETE - Eliminar un servicio

```http
DELETE /api/services/:sid
```

Permite eliminar un servicio utilizando su identificador.

Si el servicio existe, se elimina correctamente.

Si el ID solicitado no existe, la API devuelve:

```text
404 Not Found
```

---

# 📅 Bookings

## ➕ POST - Crear una reserva

```http
POST /api/bookings
```

Permite crear una nueva reserva.

Ejemplo:

```json
{
  "clientName": "Valentina",
  "clientEmail": "vale@example.com",
  "date": "2026-10-05",
  "time": "10:00",
  "status": "pending"
}
```

Los datos son validados mediante Zod antes de llegar a MongoDB.

Al crear una reserva, el campo `services` se inicializa como un array vacío.

Si la creación es correcta:

```text
201 Created
```

---

## 🔍 GET - Obtener una reserva por ID

```http
GET /api/bookings/:bid
```

Permite consultar una reserva específica utilizando su identificador de MongoDB.

La consulta utiliza `populate` para obtener la información completa de los servicios asociados a la reserva.

Ejemplo:

```json
{
  "_id": "6ac5739c72ce574b1402e70a",
  "clientName": "Valentina",
  "clientEmail": "vale@example.com",
  "date": "2026-10-05",
  "time": "10:00",
  "status": "pending",
  "services": [
    {
      "service": {
        "_id": "6abc50b79689e9c3591a1a81",
        "name": "Blanqueamiento dental",
        "description": "Tratamiento de blanqueamiento dental",
        "duration": 60,
        "price": 25000,
        "category": "Odontología",
        "available": true
      },
      "quantity": 1
    }
  ]
}
```

Si la reserva no existe:

```text
404 Not Found
```

---

## ➕ Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Permite agregar un servicio existente a una reserva.

Los identificadores se reciben mediante los parámetros de la URL.

Ejemplo:

```http
POST /api/bookings/ID_DE_RESERVA/services/ID_DE_SERVICIO
```

Antes de agregar el servicio se comprueba:

1. Que la reserva exista.
2. Que el servicio exista.

Los parámetros `bid` y `sid` son validados mediante Zod antes de ejecutar la operación.

Si ambas entidades existen, el servicio se agrega a la reserva.

Si el mismo servicio ya se encuentra agregado, se incrementa su `quantity`.

La relación se almacena utilizando un `ObjectId`:

```json
{
  "service": "6abc50b79689e9c3591a1a81",
  "quantity": 1
}
```

El objeto completo del servicio no se duplica dentro de la reserva.

---

# 💬 Messages

## 📋 GET - Obtener todos los mensajes

```http
GET /api/messages
```

Devuelve todos los mensajes almacenados en MongoDB.

---

## 🔍 GET - Obtener un mensaje por ID

```http
GET /api/messages/:id
```

Permite obtener un mensaje específico utilizando su identificador.

Si el mensaje no existe:

```text
404 Not Found
```

---

## ➕ POST - Crear un mensaje

```http
POST /api/messages
```

Permite crear un nuevo mensaje.

Ejemplo:

```json
{
  "user": "Valentina",
  "message": "Mensaje de prueba"
}
```

Si la creación es correcta:

```text
201 Created
```

Mongoose genera automáticamente el `_id`, `createdAt` y `updatedAt`.

---

# ⚙️ Variables de entorno

El proyecto utiliza **dotenv** para trabajar con variables de entorno.

Se debe crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=tu_uri_de_mongodb
```

También se incluye un archivo `.env.example` como referencia:

```env
PORT=
NODE_ENV=
MONGO_URI=
```

El archivo `.env` se encuentra incluido en `.gitignore` para evitar subir información sensible al repositorio.

> Nunca se debe publicar la contraseña utilizada en la conexión a MongoDB.

---

# ▶️ Instalación y ejecución

Clonar o descargar el proyecto y acceder a su carpeta:

```bash
cd backend-turnos-reservas
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` en la raíz del proyecto y completar las variables de entorno.

Iniciar el servidor:

```bash
npm start
```

Si la conexión es correcta, se mostrará:

```text
Conexión a la base de datos establecida
Servidor escuchando en el puerto 8080
```

La aplicación estará disponible en:

```text
http://localhost:8080
```

Las vistas principales estarán disponibles en:

```text
http://localhost:8080/views/services
http://localhost:8080/views/bookings
```

---

# 🧪 Pruebas de la API

Las operaciones de la API fueron probadas utilizando **Postman**.

## Services

Se realizaron pruebas sobre:

* GET de todos los servicios.
* GET de un servicio por ID.
* GET de un ID inexistente.
* Filtrado por categoría.
* Filtrado por disponibilidad.
* Paginación.
* Ordenamiento por precio.
* POST para crear servicios.
* Validación de campos obligatorios.
* Validación de tipos de datos.
* PUT para actualizar servicios.
* PUT sin body.
* DELETE de servicios.
* DELETE de un ID inexistente.
* GET posterior a un DELETE para comprobar la eliminación.
* Actualización en tiempo real de la vista mediante Socket.io.

## Bookings

Se realizaron pruebas sobre:

* POST para crear reservas.
* Validación de los datos de una reserva.
* GET de reservas por ID.
* GET de reservas inexistentes.
* POST para agregar servicios a una reserva.
* Validación de los parámetros de la URL.
* Agregar nuevamente un servicio existente y comprobar el incremento de `quantity`.
* Validación de reserva inexistente.
* Validación de servicio inexistente.
* Consulta de reservas utilizando `populate`.
* Visualización de reservas mediante Handlebars.

## Messages

Se realizaron pruebas sobre:

* POST para crear mensajes.
* GET de todos los mensajes.
* GET de un mensaje por ID.

Las pruebas permitieron comprobar el funcionamiento de los endpoints y la correcta separación entre **Routes, Controllers, Services, Repositories y DAO**.

---

# 📦 Dependencias

El proyecto utiliza principalmente:

### Express

Framework utilizado para crear el servidor y gestionar las rutas y peticiones HTTP.

### Mongoose

ODM utilizado para trabajar con MongoDB desde Node.js, definir Schemas y Models y realizar operaciones sobre las colecciones.

### dotenv

Paquete utilizado para cargar las variables de entorno definidas en el archivo `.env`.

### Zod

Biblioteca utilizada para validar la estructura y los tipos de datos recibidos por la API antes de realizar operaciones sobre MongoDB.

### express-handlebars

Motor de vistas utilizado para generar páginas HTML dinámicas desde el servidor.

### Socket.io

Biblioteca utilizada para implementar comunicación en tiempo real entre el servidor y los clientes.

---

# 📚 Conceptos aplicados

Durante el desarrollo del proyecto se trabajaron conceptos de:

* Node.js
* Express
* ESM
* Importación y exportación de módulos
* Variables de entorno
* dotenv
* MongoDB
* MongoDB Atlas
* Mongoose
* Schemas
* Models
* ObjectId
* Referencias entre documentos
* `populate`
* Routing
* API REST
* Métodos HTTP
* CRUD
* Query parameters
* Route parameters
* Filtros
* Paginación
* Ordenamiento
* Controllers
* Services
* Repositories
* DAO
* Arquitectura en capas
* Separación de responsabilidades
* Zod
* Schemas de validación
* Middlewares
* Validación de datos
* Manejo de errores
* Clases y métodos
* Persistencia de datos
* Handlebars
* Vistas dinámicas
* Layouts
* Archivos estáticos
* CSS
* Flexbox
* Socket.io
* Comunicación en tiempo real
* Eventos de Socket.io
* Actualización dinámica de vistas
* Pruebas de API con Postman

---

# 👩‍💻 Autor

** Andrea Valentina Santamaria**

Proyecto desarrollado como parte del curso **Backend 1 - Coderhouse**.

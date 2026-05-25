#  Gestión de Empleados — Aplicación Web con Node.js + Docker

> API REST + interfaz web CRUD para gestión de empleados, contenida en Docker con MySQL.

---

##  Capturas de Pantalla

### Pantalla Principal — Formulario CRUD
![Formulario CRUD](<img width="1343" height="675" alt="Captura de pantalla 2026-05-25 123149" src="https://github.com/user-attachments/assets/c3dc5b36-d484-4b86-9e04-e422103bb4f6" />)

### Listado de Empleados
![Listado](<img width="791" height="564" alt="Captura de pantalla 2026-05-25 123013" src="https://github.com/user-attachments/assets/99c3b95b-f597-4b7b-8e5c-864e9d5f2e0e" />)

### Comando SQL Ejecutado
![SQL](<img width="836" height="94" alt="image" src="https://github.com/user-attachments/assets/9c85043e-2f0a-4d09-8da9-7ee8b317eff3" />)

---

## Video Demostración

> **[Ver demo en YouTube]([https://youtu.be/wemAci9hc-g])**  
> *Demostración completa del CRUD: crear, listar, actualizar y eliminar empleados.*

---

##  Inicio Rápido con Docker

### Opción 1 — Solo descargar `docker-compose.yml` (recomendado)

No necesitas clonar el repo. Solo descarga este archivo:

📥 **[Descargar docker-compose.yml](https://raw.githubusercontent.com/EdwinSarango12/Aplicacion-web-ES/main/docker-compose.yml)**

Luego ejecuta en tu terminal:

```bash
docker compose up -d
```

Abre tu navegador en: **http://localhost:3000**

---

### Opción 2 — Clonar el repositorio

```bash
git clone https://github.com/EdwinSarango12/Aplicacion-web-ES.git
cd Aplicacion-web-ES
docker compose up -d
```

Abre tu navegador en: **http://localhost:3000**

---

##  Requisitos

| Herramienta | Versión mínima |
|---|---|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 4.x |
| Navegador web | cualquiera |

> **No se necesita instalar Node.js ni MySQL.** Todo corre dentro de Docker.

---

##  Arquitectura Docker

```
┌─────────────────────────────────────────────┐
│              Docker Network: red-app         │
│                                             │
│  ┌──────────────────┐   ┌────────────────┐  │
│  │  contenedorAPP   │   │  contenedorBD  │  │
│  │  (Node.js 22)    │──▶│  (MySQL 9.7)   │  │
│  │  Puerto: 3000    │   │  Puerto: 3306  │  │
│  └──────────────────┘   └───────┬────────┘  │
│           │                     │           │
└───────────┼─────────────────────┼───────────┘
            │                     │
       localhost:3000        volumen-BD
       (tu navegador)        (datos MySQL
                              persistentes)
```

| Contenedor | Imagen | Puerto Host | Puerto Interno |
|---|---|---|---|
| `contenedorAPP` | `web-app` (build local) | `3000` | `3000` |
| `contenedorBD` | `mysql:latest` | `3307` | `3306` |

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Body requerido |
|---|---|---|---|
| `GET` | `/empleados` | Listar todos | — |
| `GET` | `/empleados/:id` | Obtener por ID | — |
| `POST` | `/empleados` | Crear empleado | `nombre`, `cargo`, `sueldo` |
| `PUT` | `/empleados/:id` | Actualizar empleado | `nombre`, `cargo`, `sueldo` |
| `DELETE` | `/empleados/:id` | Eliminar empleado | — |

Cada respuesta incluye el **comando SQL ejecutado**:

```json
{
  "sql": "SELECT * FROM personal",
  "data": [ ... ]
}
```

---

##  Estructura del Proyecto

```
Aplicacion-web-ES/
├── docker-compose.yml       ← Orquestación de contenedores
├── .dockerignore
├── package.json             ← Dependencias Node.js
├── package-lock.json
└── web/
    ├── Dockerfile           ← Imagen de la app Node.js
    ├── index.js             ← Servidor Express + rutas CRUD
    └── public/
        └── index.html       ← Interfaz web (formulario + resultados)
```

---

##  Comandos Útiles

```bash
# Levantar contenedores en segundo plano
docker compose up -d

# Ver logs de la aplicación
docker logs contenedorAPP

# Ver logs de la base de datos
docker logs contenedorBD

# Detener todo
docker compose down

# Reconstruir imagen tras cambios en el código
docker compose up --build -d
```

---

##  Tecnologías Usadas

- **Node.js 22** + **Express 5**
- **MySQL 9.7** (Docker)
- **mysql2** — driver Node.js para MySQL
- **Docker** + **Docker Compose**
- HTML / CSS / JavaScript vanilla

---

##  Autor

**Edwin Sarango**  
📧 edwin.s.12.xd@gmail.com  
🔗 [GitHub](https://github.com/EdwinSarango12)

---

> ⚠️ **Nota:** Los datos de conexión en `docker-compose.yml` son de desarrollo local. No usar en producción.

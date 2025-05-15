# Online Credit Frontend

## Descripción
Frontend de la plataforma de créditos en línea, desarrollado en Angular. Permite a los usuarios solicitar créditos y a los analistas gestionar y evaluar solicitudes.

## Tecnologías Utilizadas
- **Framework:** Angular 19 ([Descargar Angular CLI](https://angular.dev/tools/cli))
- **Node.js:** ([Descargar Node.js](https://nodejs.org/))
- **Gestor de paquetes:** npm (incluido con Node.js)
- **Estilos:** Angular Material

## Requisitos Previos
- Node.js (recomendado: versión 18.x o superior)
- npm (incluido con Node.js)
- Angular CLI (instalar con `npm install -g @angular/cli`)
- Git
- Un navegador moderno (Chrome, Edge, Firefox, etc.)

## Instalación y Primeros Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Lozano7/online-credits-frontend.git
   cd online-credits-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el archivo de entorno:**
   - Edita `src/environments/environment.ts` **y** `src/environments/environment.development.ts` y asegúrate de que la URL del backend (`apiUrl`) apunte a tu backend, por ejemplo:
     ```typescript
     export const environment = {
       production: false,
       apiUrl: 'http://localhost:5150/api'
     };
     ```

4. **Levantar el servidor de desarrollo:**
   ```bash
   ng serve
   ```
   - Abre tu navegador en [http://localhost:4200]

5. **(Solución a error común en PowerShell):**
   Si al ejecutar `ng serve` en PowerShell ves un error como:
   ```
   File C:\...\node_modules\@angular\cli\bin\ng.ps1 cannot be loaded because running scripts is disabled on this system.
   ```
   Ejecuta este comando en PowerShell como administrador:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
   Luego vuelve a intentar `ng serve`.

## Notas adicionales

- El frontend está preparado para trabajar con el backend en HTTP (`http://localhost:5150/api`).
- Si cambias el puerto del backend, actualiza la variable `apiUrl` en el archivo de entorno.
- Para pruebas de rol **Analista**, recuerda que el rol debe ser asignado manualmente desde la base de datos (ver README del backend).

## Vistas
- Login
![image](https://github.com/user-attachments/assets/b14c489d-4003-4275-a464-7d0b53d982cf)

- Registro
![image](https://github.com/user-attachments/assets/7169ee42-a5a4-4b15-9dd6-fbdca495fdfd)

- Analista
![image](https://github.com/user-attachments/assets/583ec0f1-60a1-46df-acb8-9e0122c0a64b)
![image](https://github.com/user-attachments/assets/35790c7e-c7d2-427d-946d-b780a1c2c1b9)
![image](https://github.com/user-attachments/assets/a161fdf8-6d10-4ba5-a24a-4cc1ea5c53aa)
![image](https://github.com/user-attachments/assets/742734ed-feea-43a8-bfdb-478ee01e8c56)
![image](https://github.com/user-attachments/assets/b58460db-7f30-4d29-a628-90e33ee95f8f)
![image](https://github.com/user-attachments/assets/d0dabb44-e56c-4aaa-a9f9-f71825775f42)

- Solicitante
![image](https://github.com/user-attachments/assets/0d90a66e-d81e-4bd2-8391-9ed9410c08ab)
![image](https://github.com/user-attachments/assets/bab01d8c-4171-44c8-bbda-9bfc16dfc813)
![image](https://github.com/user-attachments/assets/71a05049-f824-45cc-8268-fc8afa754620)
![image](https://github.com/user-attachments/assets/a2f3bb3a-306e-456d-8237-1071e66ae4a4)
![image](https://github.com/user-attachments/assets/e840165b-b1ee-43d0-aef0-d857dd9fd700)

## Estructura del Proyecto

La estructura del proyecto sigue los principios de organización de código recomendados para Angular, con una arquitectura modular y escalable:

```
src/
├── app/                     # Código principal de la aplicación
│   ├── core/                # Servicios singleton, modelos globales, interceptores, guards
│   │   ├── guards/          # Protección de rutas (AuthGuard)
│   │   ├── interceptors/    # Interceptores HTTP (token JWT, error handling)
│   │   ├── models/          # Interfaces y modelos de datos
│   │   └── services/        # Servicios compartidos (AuthService, CreditRequestService)
│   │
│   ├── features/            # Módulos de características principales
│   │   ├── auth/            # Autenticación (login, registro)
│   │   ├── credit-requests/ # Gestión de solicitudes de crédito
│   │   │   ├── admin/       # Vista de administrador/analista
│   │   │   └── client/      # Vista de cliente/solicitante
│   │   ├── dashboard/       # Panel principal del usuario
│   │   └── layout/          # Componentes de diseño (header, footer, sidebar)
│   │
│   ├── shared/              # Componentes, directivas y pipes reutilizables
│   │   ├── components/      # Componentes compartidos (loading, alerts, etc.)
│   │   ├── directives/      # Directivas personalizadas
│   │   └── pipes/           # Pipes personalizados
│   │
│   ├── app.component.*      # Componente raíz
│   ├── app.config.ts        # Configuración global de la aplicación
│   └── app.routes.ts        # Configuración de rutas principales
│
├── assets/                  # Recursos estáticos (imágenes, iconos, etc.)
├── environments/            # Configuración de entornos (dev, prod)
└── styles.scss              # Estilos globales
```

### Descripción de las carpetas principales

- **core**: Contiene los servicios, modelos y utilidades fundamentales que se utilizan en toda la aplicación.
- **features**: Contiene los módulos de características organizados por dominio.
- **shared**: Contiene componentes, directivas y pipes que se utilizan en múltiples módulos.
- **assets**: Contiene recursos estáticos como imágenes, fuentes e iconos.
- **environments**: Contiene configuraciones específicas para diferentes entornos (desarrollo, producción).


## Scripts útiles

- **Construir para producción:**
  ```bash
  ng build --configuration production
  ```

- **Ejecutar pruebas unitarias:**
  ```bash
  ng test
  ```

- **Ejecutar pruebas end-to-end:**
  ```bash
  ng e2e
  ```

## Recursos adicionales

- [Documentación oficial de Angular](https://angular.dev/docs)
- [Angular Material](https://material.angular.io/)



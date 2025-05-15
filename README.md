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



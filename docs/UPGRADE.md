# Proceso de actualización de paquetes

Este proceso se ejecuta al menos una vez al mes

## Verificaciones

Todas estas verificaciones se hacen para verificar las actualizaciones

Se sugiere validar que todos los cambios estén en master,
de ser posible no deben haber otras actualizaciones en curso

El proceso de verificación consta de los siguientes pasos:

- Hacer el build del sitio

  ```bash
  npm run build
  ```

- Ejecutar linters

  ```bash
  npm run lint
  ```

- Ejecutar todos los test

  ```bash
  npm run test
  ```

## Actualizar astro

Astro posee un script de actualización que además está documentado

<https://docs.astro.build/en/upgrade-astro/>

El script se encarga del package.json y si se requiere algún cambio en la configuración lo realiza

Ejecutar primero la actualización de astro antes que la actualización general

```bash
npx @astrojs/upgrade
```

## Actualización general

Para actualizar los demás paquetes se puede usar `npm-check-updates`

```bash
npx npm-check-updates -u
```

Después de finalizar de actualizar ejecutar build, linters, tests

Si algún paquete no puede ser actualizado revisar su valor.
Si un paquete no es mantenido, deberá ser eliminado

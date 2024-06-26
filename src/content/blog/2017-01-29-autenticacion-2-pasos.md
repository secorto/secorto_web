---
title: Autenticación de 2 pasos
tags:
  - dev
excerpt: A veces nos hacen sufrir las contraseñas por eso recurrimos a algo que tenemos
date: 2017-01-29
---

## Para que se usa

La verificación de 2 pasos nos sirve para verificar que estamos autorizados a usar un recurso web
se basa en el principio de algo que tenemos representado en unos códigos generados por la aplicación o un token generado al vuelo.

## Cuando pueden hacernos pasar malos ratos

- Si se borra la aplicación de autenticación
- Si se pierde el dispositivo movil asociado
- Si se pierde la master key a la aplicación de autenticación

### Contra-medidas

- Asignar métodos alternativos para generación de estos tokens.
- Almacenar una lista de tokens validos generado por el proveedor MFA.

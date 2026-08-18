---
title: Autenticación de 2 pasos
tags:
  - dev
excerpt: A veces nos hacen sufrir las contraseñas por eso recurrimos a algo que tenemos
date: 2017-01-29
---

## Para que se usa

La verificación en dos pasos (2FA/MFA) sirve para comprobar que realmente eres quien dices ser.
Se basa en combinar dos factores: algo que conoces (por ejemplo, una contraseña o PIN) y algo que
posees (un dispositivo, una app que genera códigos o un token físico). Esta combinación hace mucho
más difícil que un atacante obtenga acceso, ya que necesitaría ambos factores simultáneamente.

Introducir un segundo factor también aumenta la fragilidad operativa: si el dispositivo que genera
los códigos se pierde, se estropea o lo desinstalas por error, o si olvidas la contraseña, puedes
quedarte bloqueado sin acceso a la cuenta si no existen mecanismos de recuperación adecuados. Por
eso es importante planear cómo recuperar el acceso antes de que ocurra el problema.

## Desventajas y contra-medidas

La introducción de MFA mejora la seguridad, pero también trae desventajas operativas que dependen de la
plataforma y del proveedor. Las principales desventajas son:

- Pérdida del dispositivo que genera códigos (app desinstalada, teléfono robado o estropeado).
- Olvido de la contraseña que combina con el segundo factor.
- Pérdida o corrupción de la master key o seed de la app de autenticación.

Contra-medidas habituales (conviene comprobar si la plataforma las soporta):

- Generar y guardar códigos de recuperación (backup codes) al activar MFA.
- Registrar métodos alternativos (segundo dispositivo, SMS, correo alternativo).
- Mantener datos de contacto de recuperación verificados y actualizados.
- Documentar los requisitos del soporte del proveedor para la recuperación (qué pruebas piden).
- Almacenar seeds/keys cifrados en una bóveda de contraseñas para cuentas críticas.

Estas medidas dependen de la plataforma: algunas ofrecen flujos de recuperación completos, otras son
más restrictivas y requieren intervención del soporte.

## Flujos de recuperación y buenas prácticas

- Genera y guarda códigos de recuperación (backup codes) en un lugar seguro al activar MFA. Estos códigos
  suelen usarse una sola vez cada uno.
- Registra más de un dispositivo o método (p. ej. una segunda app de autenticación, número de teléfono o
  correo alternativo) para evitar el bloqueo por pérdida del dispositivo principal.
- Configura un correo y/o teléfono de recuperación verificados y revisa periódicamente los datos de
  contacto asociados a la cuenta.
- Algunos proveedores permiten delegar la recuperación a través de soporte con verificación adicional;
  documenta qué información pedirán (identidad, fechas, últimos inicios de sesión) para agilizar el
  proceso.
- Para cuentas críticas, considera almacenar una copia del seed (o la master key) cifrada en una bóveda de
  contraseñas o en un gestor de secretos del equipo.
- Implementa procedimientos de emergencia para restaurar acceso (por ejemplo, flujo interno de
  verificación para administradores) y limita su uso mediante auditoría.

## SSH y acceso a repositorios (uso práctico en Linux)

En entornos de desarrollo,
disponer de acceso SSH configurado puede ser un salvavidas: si pierdes acceso por MFA web,
a menudo puedes seguir trabajando desde un equipo con la clave SSH ya autorizada.
En el caso de GitHub, el acceso por HTTPS con contraseña es más incómodo y menos seguro;
configurar claves SSH en Linux es una alternativa robusta.

Pasos rápidos para generar una clave SSH en Linux y añadirla a GitHub:

```bash
ssh-keygen -t ed25519 -C "tu_email@example.com"
cat ~/.ssh/id_ed25519.pub
```

Luego copia la clave pública y pégala en la sección _SSH and GPG keys_ de tu perfil de GitHub. Tras eso,
podrás clonar y hacer push/pull usando la URL `git@github.com:usuario/repo.git` sin pedir contraseña
interactiva.

Nota: mantén tu clave privada segura (no la subas a repositorios) y considera protegerla con passphrase.
Utiliza `ssh-agent` para evitar introducir la passphrase constantemente.

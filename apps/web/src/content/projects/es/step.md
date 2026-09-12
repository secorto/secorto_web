---
title: "@secorto/step"
excerpt: "Capa de anti-corruptión para reportar pasos y decidir la estrategia de ejecución de pruebas."
image: "@assets/img/project/secorto_step.jpeg"
role: "Mantenedor"
responsibilities: "Diseñé un modelo de pasos perezosos y semánticos para desacoplar intención, ejecución y reporting."
website: "https://github.com/secorto/secorto_web/tree/master/packages/step"
tags:
  - secorto
  - testing
  - ai
---

`@secorto/step` no nació como una idea elegante de arquitectura.
Nació del dolor — del tipo de dolor que solo aparece cuando una suite E2E crece lo suficiente para mostrar todas sus grietas.

Durante años vi cómo los Page Objects terminaban mezclando negocio,
aserciones y detalles del runner. Los tests se llenaban de `expect()` crudos que no contaban ninguna historia.
Los reportes eran ruido: pasos sin intención, fallos sin contexto. La CI sufría por navegaciones duplicadas,
*flakiness* y combinatoria explosiva. Y cada *refactor* rompía algo porque la infraestructura estaba metida donde no debía.

El verdadero problema era siempre el mismo:
**la intención del usuario estaba atrapada dentro de la implementación.**

Un Page Object decidía si algo era *hard* o *soft*. Decidía cómo se reportaba. Decidía cuándo se ejecutaba.
El test no tenía control. La arquitectura estaba al revés.

## La trampa de la abstracción semántica

Muchos equipos intentan rescatar la narrativa de sus pruebas recurriendo a herramientas de lenguaje natural
o abstracciones globales. Sin embargo, a gran escala, la fricción de crear, mantener y mapear estas definiciones
introduce un problema peor: el dolor del mantenimiento técnico supera al beneficio.

Para evitar esa fricción, los automatizadores terminan reutilizando pasos genéricos de bajo nivel
(*"hacer clic en el botón X"*, *"escribir en el input Y"*).
El lenguaje natural se degrada en un pseudo-lenguaje de programación incómodo.
El test deja de hablar el lenguaje del negocio y empieza a hablar el lenguaje del *framework*.

Un día, tras ver cómo la complejidad y la duplicación mecánica destruían la mantenibilidad de suites enteras,
me hice una pregunta que cambió todo:

> **¿Y si los pasos no se ejecutaran todavía?**
>
> * ¿Y si un paso fuera un dato encapsulado, no una acción inmediata?
> * ¿Y si describiera intención pura, pero dejara la estrategia para el caso de prueba?
> * ¿Y si la ejecución fuera perezosa, inmutable y configurable en el *call site*?
> * ¿Y si el runner fuera solo un adaptador inyectado, no una dependencia acoplada?

## Una solución sin fricción corporativa

De esa premisa nació `@secorto/step`: una capa de *Anti‑Corruption* para *reporting*
que separa por completo la **intención**, la **ejecución** y la **infraestructura**.

A diferencia de las soluciones tradicionales, aquí no existen expresiones regulares,
archivos de definición huérfanos ni DSLs rígidos. Los pasos se vuelven estructuras diferidas (*lazy*),
semánticas y agnósticas al entorno de ejecución, escritas directamente donde vive el dominio del componente.

La estrategia se decide dinámicamente en el propio test mediante modificadores fluidos:
`.soft()`, `.with(expect)`, o `.raw()`. El Page Object se libera de la responsabilidad de controlar el flujo
y vuelve a hacer lo que mejor sabe hacer: representar el negocio.

El resultado es una arquitectura de automatización **más limpia, estable y expresiva**:

* **Los tests cuentan historias reales** sin la sobrecarga de mantener pesadas capas de traducción textual.
* **Los reportes son semánticos por diseño**, abstrayendo el ruido técnico innecesario de la infraestructura.
* **La CI respira** al flexibilizar los reintentos y las estrategias de aserción sin alterar el código base.
* **La automatización escala sin romperse**, devolviéndole el control arquitectónico al desarrollador.

`@secorto/step` no es una librería de utilidades más.
Es la respuesta de ingeniería a un dolor metodológico que toda la industria padece,
pero pocos resuelven desde la raíz.

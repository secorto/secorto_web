# Consejos prácticos de uso de IA

En este repositorio he aprendido a usar IA de forma bastante efectiva y he aprendido lo siguiente:

## Ser explicito en el contexto y el patrón a usar

Si bien la IA es capaz de identificar ciertos patrones existe el riesgo que amplifique un anti-patrón que encuentre en tu repositorio, aca es donde toca ser inteligente y saber que preguntarle y que archivos son tu ejemplo de lo que si se debe hacer

## Generar la descripción de un issue basado en los cambios vs master

Algo que no necesitaba hacer pero que de seguro me agregara mucho valor es documentar bien los issues pero seamos sinceros luego de hacer un poc lo que uno menos quiere pensar es exactamente que cambio y la IA es muy en esto, pero para ello toca darle mucho contexto siendo que acabas haciendo mas por menos, aunque... eso no me detuvo para crear un script que me crear automáticamente la descripción de un issue donde si ejecuto `python scripts/issue-context.py mejora` me arroja una descripción bastante acercada a lo que necesito diligenciar en caso de una solicitud de mejora y al ejecutar `python scripts/issue-context.py bug` me arroja lo que necesito diligenciar para crear un bug

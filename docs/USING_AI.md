# Consejos prácticos de uso de IA

En este repositorio he aprendido a usar IA de forma bastante efectiva y he aprendido lo siguiente:

## Ser explícito en el contexto y el patrón a usar

Si bien la IA es capaz de identificar ciertos patrones existe el riesgo que amplifique un anti-patrón que encuentre en tu repositorio, aca es donde toca ser inteligente y saber que preguntarle y que archivos son tu ejemplo de lo que si se debe hacer

## Generar la descripción de un issue basado en los cambios vs master

Algo que no era estrictamente necesario, pero que seguramente me aporta mucho valor, es documentar bien los issues. Sin embargo, seamos sinceros: después de hacer un PoC, lo último en lo que uno quiere pensar es en detallar exactamente qué cambió.
La IA puede ayudar muchísimo en esto, pero para que lo haga bien suele requerir mucho contexto, y terminas sintiendo que haces más trabajo del que ahorras.
Aun así, eso no me detuvo para crear un script que genera automáticamente la descripción de un issue:
si ejecuto `python scripts/issue-context.py mejora` obtengo una descripción bastante cercana a lo que necesito diligenciar para una solicitud de mejora,
y si ejecuto `python scripts/issue-context.py bug` me arroja lo que necesito diligenciar para crear un bug.

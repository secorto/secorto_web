---
title: Introducción a Python
tags:
    - dev
    - Python
excerpt: Gist que da una introducción a Python
date: 2022-07-11
---

En este [Gist alojado en GitHub](https://gist.github.com/Scot3004/c5a562df9ca6509820f6320b5e4c6900)
vemos un notebook sobre cómo se puede usar Python desde 0 y explica el uso de Jupyter Notebook,
además de un enlace para que hagas tus pruebas en Colab

<a href="https://colab.research.google.com/gist/Scot3004/c5a562df9ca6509820f6320b5e4c6900/introducci-n-a-python.ipynb" target="_parent">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

## Saludo

Hola, el día de hoy vamos a estar aprendiendo a programar en **Python** usando **Jupyter Notebook**,
esto para ir directo al código sin preocuparnos sobre cómo instalamos Python localmente.
En el mundo de la ciencia de datos es muy común usar dicha herramienta
para hacer scripts de prueba y compartir las notas sobre lo que se va desarrollando.

Adicionar nuevos bloques

En Jupyter existen 2 tipos de bloques, texto y código.

Para adicionar uno nuevo en Colab colocamos el mouse en el espacio en blanco entre los bloques donde se quiere agregar
y este nos va a preguntar el tipo de bloque a ser adicionado.

Cuando seleccionamos **Text**, podemos agregar Markdown para la edición.

Cuando seleccionamos **Code**, podemos agregar un fragmento de código.

## Qué es Python

Python es un lenguaje de programación interpretado creado por Guido van Rossum por allá en los años 90,
el cual destaca por su facilidad de lectura y escritura. Python puede ser usado tanto para la web como para
la automatización de tareas repetitivas (sí, las pruebas entran en esta categoría), y también como
herramienta para procesar datos masivos.

## Paradigmas de programación en Python

El paradigma también se puede denominar como un método para resolver algunos problemas o realizar algunas tareas.

Un paradigma de programación es un enfoque para resolver el problema usando algún lenguaje de programación
o también podemos decir que es un método para resolver un problema usando herramientas
y técnicas que están disponibles para nosotros siguiendo algún enfoque.

## Hola mundo

Como buena introducción a cualquier lenguaje de programación,
aprender a imprimir un mensaje en pantalla es de las primeras cosas aprendemos,
ademas de servir para corroborar que la herramienta quedo instalada satisfactoriamente,
vamos a iniciar con uno de mis programas favoritos "Hola mundo",
para lo cual nos apoyaremos en la función `print` la cual nos imprime por consola lo que escribamos entre comillas.

```python title="saludo.py"
print("hola")
```

```bash title="Salida saludo.py"
hola
```

## Variables

En python podemos definir variables que nos permitan representar los valores que vamos necesitando en nuestros scripts

por ejemplo podemos definir una variable llamada nombre para luego imprimir nuestro nombre en pantalla

```python  title="saludo_nombre.py"
nombre = "Sergio"
print("Hola " + nombre)
```

```bash title="Salida saludo_nombre.py"
Hola Sergio
```

## Tipos de datos

Python es un lenguaje de programación fuertemente tipado de tipado dinámico,
esto quiere decir que podemos crear variables con cualquier tipo de datos
sin preocuparnos por declarar explicitamente el tipo

> Python posee un mecanismo ([Type hints](https://peps.python.org/pep-0484/))
> con el que se puede definir los tipos que se van a usar, algo asi como lo que se hace con typescript.

### Cadenas de caracteres

En los ejemplos anteriores hemos estado usando cadenas de caracteres para imprimir nuestro nombre en pantalla,
estas cadenas de caracteres en python tienen el tipo de dato `str`

```python title="type.py"
type(nombre)
```

```bash title="Salida type.py"
str
```

#### Format

En lo personal, para concatenar cadenas recomiendo usar la función `format` en lugar del operador `+`.
Esta nos permite incluso definir formato para la salida de las variables.

```python title="format.py"
print("Hola {}".format(nombre))
```

```bash title="Salida format.py"
Hola Sergio
```

### **Números**

Python también puede trabajar con números y soporta las operaciones básicas, como la suma `+`, resta `-`,
multiplicación `*`, división `/`, división entera `//` y exponenciación `**`.

```python title="suma.py"
1 + 2
```

```bash title="Salida suma.py"
3
```

```python title="resta.py"
3 - 2
```

```bash title="Salida resta.py"
1
```

```python title="multiplica.py"
7 * 3
```

```bash title="Salida multiplica.py"
21
```

```python title="exponente.py"
2 ** 3
```

```bash title="Salida exponente.py"
8
```

```python title="division.py"
30 / 4
```

```bash title="Salida division.py"
7.5
```

```python title="division_entera.py"
30 // 4
```

```bash title="Salida division.py"
7
```

En cuanto a los números de coma flotante (`float`) recomiendo ser muy cuidadoso, dado que en Python por
defecto estos se representan en base 2. Por lo cual, al igual que en otros lenguajes de programación,
sumar `0.1 + 0.2` puede no dar el resultado esperado `0.3`.

```python title="type.py"
type(0.1)
```

```bash title="Salida type.py"
float
```

```python title="suma_float.py"
0.1 + 0.2
```

```bash title="Salida suma_float.py"
0.30000000000000004
```

Python también tiene soporte a números complejos

```python title="complejo.py"
complex_number = 1 + 2j
print(complex_number)
```

```bash title="Salida complejo.py"
(1+2j)
```

```python title="valor_i_cuadrado.py"
1j**2
```

```bash title="Salida valor_i_cuadrado.py"
(-1+0j)
```

### Import

Hay veces que los tipos de datos que vienen pre cargados en python no nos son suficientes
para lo cual necesitamos importar "objetos" externos por ejemplo funciones o bien clases,
en python el código esta organizado en paquetes y módulos

¿Recuerdan ese ejemplo donde intentábamos sumar `0.1 + 0.2`? Bueno, para poderlo resolver vamos a
importar la clase `Decimal` del módulo `decimal`, el cual nos va a permitir operar sobre números en base 10.

```python title="import_decimal.py"
from decimal import Decimal
Decimal('0.1') + Decimal('0.2')
```

```bash title="Salida import_decimal.py"
Decimal('0.3')
```

En python podemos importar el módulo completo

```python title="import_decimal_completo.py"
import decimal
decimal.Decimal('0.1') + decimal.Decimal('0.2')
```

```bash title="Salida import_decimal_completo.py"
Decimal('0.3')
```

Incluso podemos poner alias con la palabra `as`

```python title="import_decimal_alias.py"
import decimal as dec
dec.Decimal('0.1') + dec.Decimal('0.2')
```

```bash title="Salida import_decimal_alias.py"
Decimal('0.3')
```

### Listas

En Python podemos tener colecciones de objetos donde tengamos un listado de elementos en los que
necesitemos agregar o quitar valores (es decir, mutables). Para ello podemos usar listas (`list`)
representadas con corchetes.

```python title="lista.py"
lista = ["a", "b", "c", "a"]
print(lista)
```

```bash title="Salida lista.py"
['a', 'b', 'c', 'a']
```

```python title="type_lista.py"
print(type(lista))
```

```bash title="Salida type_lista.py"
<class 'list'>
```

```python title="append_list.py"
lista.append("z")
print(lista)
```

```bash title="Salida append_list.py"
['a', 'b', 'c', 'a', 'z']
```

En algunos escenarios no vamos a querer que los elementos de nuestra lista sea mutable
para lo cual lo mas recomendable es usar una tupla (tuple)

```python title="tupla.py"
tupla = ("a", "b", "c", "a")
print(tupla)
```

```bash title="Salida tupla.py"
('a', 'b', 'c', 'a')
```

```python title="type_tupla.py"
type(tupla)
```

```bash title="Salida type_tupla.py"
tuple
```

### Diccionarios

En algunos escenarios, podriamos a llegar a necesitar colecciones de clave valor,
para lo cual podemos usar diccionarios (dict)

```python title="dict.py"
sergio_orozco = {"nombre": "Sergio", "apellido": "Orozco", "listado": [1, 2, 3]}

print(sergio_orozco)
```

```bash title="Salida dict.py"
{'nombre': 'Sergio', 'apellido': 'Orozco', 'listado': [1, 2, 3]}
```

```python title="type_dict.py"
type(sergio_orozco)
```

```bash title="Salida type_dict.py"
dict
```

## Crear Funciones

Podemos crear funciones usando la palabra reservada def con el nombre de la función que deseamos crear,
por ejemplo crearemos una función suma

```python title="function.py"
def suma(a, b):
    return a + b

print(suma(3, 4))
print(suma(-1, 4))
```

```bash title="Salida function.py"
7
3
```

## Condicionales

En python podemos hacer uso de condicionales para ejecutar o no un fragmento de código

```python title="mayor_de_edad.py"
def mayor_de_edad(edad):
    if(edad >= 18):
        print("nos tomamos unas polas?")
    elif(edad>=2):
        print("quieres un helado?")
    else:
        print("quien es un bebe bonito?")

mayor_de_edad(21)
mayor_de_edad(12)
mayor_de_edad(1)
```

```bash title="Salida mayor_de_edad.py"
nos tomamos unas polas?
quieres un helado?
quien es un bebe bonito?
```

## Ciclos

En python podemos usar ciclos repetitivos para iterar una colección, por ejemplo podemos usar un **for**
para sacar los cuadrados de una lista

```python title="for_cuadrados.py"
numeros = [2, 3, 6, 8]
cuadrados = []

for numero in numeros:
    cuadrados.append(numero**2)

print(cuadrados)
```

```bash title="Salida for_cuadrados.py"
[4, 9, 36, 64]
```

Claro, que también hay una forma condensada de hacer el ejercicio anterior que puede ser usando list comprehension

```python title="comprehension_cuadrados.py"
[numero ** 2 for numero in numeros]
```

```bash title="Salida comprehension_cuadrados.py"
[4, 9, 36, 64]
```

También se puede crear un ciclo repetitivo **while**,
por ejemplo podemos seguir preguntando siempre si nos dan un valor distinto de 's'

```python title="while_respuesta_s.py"
respuesta = 's'
while respuesta == 's':
    respuesta = input("Desea continuar? ")
```

```bash title="Salida while_respuesta_s.py"
Desea continuar? s
Desea continuar? s
Desea continuar? s
Desea continuar? n
```

## Conclusión

Hemos cubierto los conceptos básicos: ejecución en Jupyter/Colab, tipos de datos,
estructuras comunes (listas, tuplas, diccionarios), funciones, condicionales y bucles.

Recursos útiles para seguir aprendiendo:

- Documentación oficial de Python: <https://docs.python.org/3/>
- The interactive tutorial (Colab notebook used in this post): [Open in Colab](https://colab.research.google.com/gist/Scot3004/c5a562df9ca6509820f6320b5e4c6900/introducci-n-a-python.ipynb)
- PEP 484 — Type hints: <https://peps.python.org/pep-0484/>
- Curso en DataCamp <https://www.datacamp.com/courses/intro-to-python-for-data-science>
- Patrones de código en refactoring guru <https://refactoring.guru/es/design-patterns/python>
- Curso de python para principiantes de microsoft <https://docs.microsoft.com/es-es/shows/intro-to-python-development/>

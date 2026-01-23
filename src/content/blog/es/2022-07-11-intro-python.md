---
title: Introducción a python
tags:
  - dev
  - python
excerpt: Gist que da una introducción a python
date: 2022-07-11
translation_status: 'original'
---

En este [gist alojado en github](https://gist.github.com/Scot3004/c5a562df9ca6509820f6320b5e4c6900) vemos un notebook sobre como se puede usar python desde 0 y explica el uso de jupyter notebook, ademas de un enlace para que hagas tus pruebas en colab

<a href="https://colab.research.google.com/gist/Scot3004/c5a562df9ca6509820f6320b5e4c6900/introducci-n-a-python.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

# Saludo

Hola, El dia de hoy vamos a estar aprendiendo a programar en **python** usando **jupyter notebook**, esto para ir directo al código sin preocuparnos sobre como instalamos python localmente.
En el mundo de la ciencia de datos es muy común usar dicha herramienta para hacer scripts de prueba y compartir las notas sobre lo que se va desarrollando.

Adicionar nuevos bloques

en jupyter existen 2 tipos de bloques, texto y código

Para adicionar uno nuevo en collab colocamos el mouse en el espacio en blanco entre los bloques donde se quiere agregar y este nos va a preguntar el tipo de bloque a ser adicionado
![image.png](data:image/png;base64,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)

Cuando selecccionamos **Text**, podemos agregar markdown para la edición

Cuando seleccionamos **Code**, podemos agregar un fragmento de código



# Que es python

Python es un lenguaje de programación interpretado creado por Guido Van Rossum por alla en los años 90 el cual es destaca por su facilidad de lectura y escritura, python puede ser usado tanto para la web, como la automatización de tareas repetitivas (si, las pruebas entran en esta categoria), tambien como herramienta para procesar datos masivos



## Paradigmas de programación en python

El paradigma también se puede denominar como un método para resolver algunos problemas o realizar algunas tareas. Un paradigma de programación es un enfoque para resolver el problema usando algún lenguaje de programación o también podemos decir que es un método para resolver un problema usando herramientas y técnicas que están disponibles para nosotros siguiendo algún enfoque.

# Hola mundo

Como buena introducción a cualquier lenguaje de programación, aprender a imprimir un mensaje en pantalla es de las primeras cosas aprendemos, ademas de servir para corroborar que la herramienta quedo instalada satisfactoriamente, vamos a iniciar con uno de mis programas favoritos "Hola mundo", para lo cual nos apoyaremos en la función `print` la cual nos imprime por consola lo que escribamos entre comillas.

A continuación tenemos un ejemplo de código, prueba a colocar tu nombre dentro de las comillas y presiona el botón para ejecutar el código ![image.png](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGhSURBVFhH7ZbNjcIwEEYnu3dyJ1Gq4O9OCkgaCAVABTntBWgA7nRAAzRAkjKABihgV581SEjLjG2t2Fz8pMg2AvwyHo8dZVn2TT3ywW1vBIEgEASCgHclHI/HNJ1OaTQamfZ6vVLTNHS73eh8PlPbtvxNN5wFkiSh9XptJtWA0GKxMK0Ln3Ecf3FfZLVa0W63ozRN+ROZwWBA8/nctIiMDasAJl8ulzxyA5NPJhOKosgqoSYhwu47+TNFUZic0VAFsOYSLmuMF9hutzx6jShQlqWacEi0/X7PIxlIaFEQBfBDDUQAiekiob2IKDAcDrmnA4k8z9UlQc2QEAWQxa489r4UDW37qknoAySkqGnLKQpcLhfu2cEEh8PBJO4rjscj934jCnRdxz0dTHo6ndREwzkhIQrgYLGx2WzMY0NLUFHgcbpJaCF/Bv+hLYF6GmJtEd6/UFWVekSruwChq+uaR/5gW9ruB9bT8H6/m8enLgBMjiJlo/cLideVDBIoNqhsOGAeUUHNwLZ965XsXahJ+B8EgSAQBHoXiGazWY+FiOgHoEip5E8rkqYAAAAASUVORK5CYII=) para que veas que sucede en tu pantalla



```python title="saludo.py"
print("hola")
```
```bash title="Salida saludo.py"
hola
```


# Variables

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

Python es un lenguaje de programación fuertemente tipado de tipado dinamico, esto quiere decir que podemos crear variables con cualquier tipo de datos sin preocuparnos por declarar explicitamente el tipo

> Python posee un mecanismo ([Type hints](https://peps.python.org/pep-0484/)) con el que se puede definir los tipos que se van a usar, algo asi como lo que se hace con typescript.

## Cadenas de caracteres

En los ejemplos anteriores hemos estado usando cadenas de caracteres para imprimir nuestro nombre en pantalla, estas cadenas de caracteres en python tienen el tipo de dato `str`


```python title="type.py"
type(nombre)
```
```bash title="Salida type.py"
str
```


### Format
En lo personal para concatenar cadenas recomiendo usar la función format en lugar del operador +, esta nos permite incluso definir formato para la salida de las variables


```python title="format.py"
print("Hola {}".format(nombre))
```

```bash title="Salida format.py"
Hola Sergio
```

## **Números**

Python tambien puede trabajar con números y soporta las operaciones básicas como la suma `+`, resta `-`, multiplicación `*`, división`/`, división entera `//`, exponenciación `**`


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


En cuanto a los numeros de coma flotante (float) recomiendo ser muy cuidadoso, dado que en python por defecto estos se representan en base 2, por lo cual al igual que en otros lenguajes de programación sumar `0.1 + 0.2` puede no dar el resultado esperado `0.3`


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


Python tambien tiene soporte a números complejos


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

## Import

Hay veces que los tipos de datos que vienen pre cargados en python no nos son suficientes para lo cual necesitamos importar "objetos" externos por ejemplo funciones o bien clases, en python el código esta organizado en paquetes y módulos


Recuerdan ese ejemplo donde intentabamos sumar `0.1 + 0.2`, bueno para poderlo resolver vamos a importar la clase `Decimal` del módulo `decimal` el cual nos va a permitir operar sobre números en base 10


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


## Listas

en python podemos tener colecciones de objetos donde tengamos un listado de elementos donde necesitemos agregar o quitar valores (es decir mutables) para lo cual podemos usar listas (list) representadas con corchetes


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

En algunos escenarios no vamos a querer que los elementos de nuestra lista sea mutable para lo cual lo mas recomendable es usar una tupla (tuple)




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


## Diccionarios
En algunos escenarios, podriamos a llegar a necesitar collecciones de clave valor, para lo cual podemos usar diccionarios (dict)


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


# Crear Funciones

Podemos crear funciones usando la palabra reservada def con el nombre de la función que deseamos crear, por ejemplo crearemos una función suma


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


# Condicionales

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

# Ciclos

En python podemos usar ciclos repetitivos para iterar una colección, por ejemplo podemos usar un **for** para sacar los cuadrados de una lista


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


Tambien se puede crear un ciclo repetitivo **while**, por ejemplo podemos seguir preguntando siempre si nos dan un valor distinto de 's'


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

# Conclusión

Python es un lenguaje bastante potente en el cual puedes realizar entre otras cosas automatizaciones de tareas repetitivas, o bien practicar tu lógica en programación, de hecho seria interesante si en este ultimo bloque escribes una funcion que te diga si una palabra es palidroma o no, (se lee igual si escribes los caracteres al reves), y un conversor de temperaturas

Codecamp es una plataforma que sirve para aprender a programar (está en ingles)echa
https://www.datacamp.com/courses/intro-to-python-for-data-science

Refactoring guru es un sitio donde se pueden encontrar ejemplos de como implementar patrones de código en distintos lenguajes de programación
https://refactoring.guru/es/design-patterns/python

Curso de python para principiantes de microsoft

https://docs.microsoft.com/es-es/shows/intro-to-python-development/

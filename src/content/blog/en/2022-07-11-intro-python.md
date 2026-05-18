---
title: Introduction to Python
tags:
  - dev
  - python
excerpt: A Gist that provides an introduction to Python
date: 2022-07-11
---

In this [Gist hosted on GitHub](https://gist.github.com/Scot3004/c5a562df9ca6509820f6320b5e4c6900)
we find a notebook showing how you can use Python from scratch and that explains the use of
Jupyter Notebook, plus a link so you can do your own testing in Colab.

<a href="https://colab.research.google.com/gist/Scot3004/c5a562df9ca6509820f6320b5e4c6900/introducci-n-a-python.ipynb" target="_parent">
<img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

## Greeting

Hello! Today we are going to learn how to program in **Python** using **Jupyter Notebook**,
this way we go straight to the code without worrying about how we install Python locally.
In the world of data science it is very common to use this tool to make test scripts
and share notes about what is being developed.

### Adding new blocks

In Jupyter there are 2 types of blocks, text and code.

To add a new one in Colab we place the mouse in the blank space between the blocks
where we want to add it and it will ask us the type of block to be added.

When we select **Text**, we can add Markdown for editing.

When we select **Code**, we can add a snippet of code.

## What is Python

Python is an interpreted programming language created by Guido van Rossum around the 1990s,
which stands out for its ease of reading and writing. Python can be used for the web,
as well as for automating repetitive tasks (yes, testing falls into this category),
and also as a tool for processing massive data.

## Programming paradigms in Python

A paradigm can also be called a method for solving some problems or performing some tasks.
A programming paradigm is an approach to solving the problem using some programming language,
or we can also say that it is a method to solve a problem using tools and techniques
that are available to us following some approach.

## Hello World

As a good introduction to any programming language,
learning how to print a message to the screen is one of the first things we learn,
plus it serves to confirm that the tool was installed successfully.
We are going to start with one of my favorite programs "Hello World",
for which we will rely on the `print` function which prints to the console what we write between quotes.

Below we have an example of code, try placing your name inside the quotes
and press the button to run the code to see what happens on your screen.

```python title="greeting.py"
print("hello")
```

```bash title="Output greeting.py"
hello
```

## Variables

In Python we can define variables that allow us to represent the values we need in our scripts.

For example, we can define a variable called name and then print our name to the screen.

```python  title="greeting_name.py"
name = "Sergio"
print("Hello " + name)
```

```bash title="Output greeting_name.py"
Hello Sergio
```

## Data Types

Python is a strongly typed language with dynamic typing, this means we can create variables with any data type
without worrying about explicitly declaring the type.

> Python has a mechanism ([Type hints](https://peps.python.org/pep-0484/))
> with which you can define the types you are going to use, something like what you do with TypeScript.

### Strings

In the previous examples we have been using strings to print our name to the screen,
these strings in Python have the data type `str`.

```python title="type.py"
type(name)
```

```bash title="Output type.py"
str
```

#### Format

Personally, to concatenate strings I recommend using the format function instead of the `+` operator,
this allows us to even define formatting for the output of the variables.

```python title="format.py"
print("Hello {}".format(name))
```

```bash title="Output format.py"
Hello Sergio
```

### Numbers

Python can also work with numbers and supports basic operations such as
addition `+`, subtraction `-`, multiplication `*`, division `/`, integer division `//`, and exponentiation `**`.

```python title="add.py"
1 + 2
```

```bash title="Output add.py"
3
```

```python title="subtract.py"
3 - 2
```

```bash title="Output subtract.py"
1
```

```python title="multiply.py"
7 * 3
```

```bash title="Output multiply.py"
21
```

```python title="power.py"
2 ** 3
```

```bash title="Output power.py"
8
```

```python title="division.py"
30 / 4
```

```bash title="Output division.py"
7.5
```

```python title="int_division.py"
30 // 4
```

```bash title="Output int_division.py"
7
```

Regarding floating point numbers (`float`) be careful: Python represents floats in base 2 by default,
so summing `0.1 + 0.2` may not give the expected `0.3`.

```python title="float_type.py"
type(0.1)
```

```bash title="Output float_type.py"
float
```

```python title="float_sum.py"
0.1 + 0.2
```

```bash title="Output float_sum.py"
0.30000000000000004
```

Python also supports complex numbers:

```python title="complex_number.py"
complex_number = 1 + 2j
print(complex_number)
```

```bash title="Output complex_number.py"
(1+2j)
```

```python title="i_squared.py"
1j**2
```

```bash title="Output i_squared.py"
(-1+0j)
```

### Import

Sometimes the built-in data types are not enough and we need to import external objects like functions or classes.
Python code is organized in packages and modules.

Remember the example where we tried to sum `0.1 + 0.2`: to solve it
we can import the `Decimal` class from the `decimal` module to work with base-10 decimals.

```python title="import_decimal.py"
from decimal import Decimal
Decimal('0.1') + Decimal('0.2')
```

```bash title="Output import_decimal.py"
Decimal('0.3')
```

You can also import the whole module:

```python title="import_decimal_full.py"
import decimal
decimal.Decimal('0.1') + decimal.Decimal('0.2')
```

```bash title="Output import_decimal_full.py"
Decimal('0.3')
```

Or use an alias with `as`:

```python title="import_decimal_alias.py"
import decimal as dec
dec.Decimal('0.1') + dec.Decimal('0.2')
```

```bash title="Output import_decimal_alias.py"
Decimal('0.3')
```

### Lists

In Python we can have collections of items where we may need to add or remove values (i.e., mutable).
For that we use lists (`list`) represented with square brackets.

```python title="lists.py"
list_items = ["a", "b", "c", "a"]
print(list_items)
```

```bash title="Output lists.py"
['a', 'b', 'c', 'a']
```

```python title="type_list.py"
print(type(list_items))
```

```bash title="Output type_list.py"
<class 'list'>
```

```python title="append_list.py"
list_items.append("z")
print(list_items)
```

```bash title="Output append_list.py"
['a', 'b', 'c', 'a', 'z']
```

If you want an immutable sequence use a tuple:

```python title="tuple.py"
tuple_items = ("a", "b", "c", "a")
print(tuple_items)
```

```bash title="Output tuple.py"
('a', 'b', 'c', 'a')
```

```python title="type_tuple.py"
type(tuple_items)
```

```bash title="Output type_tuple.py"
tuple
```

### Dictionaries

For key/value collections use dictionaries (`dict`).

```python title="dict_example.py"
person = {"first_name": "Sergio", "last_name": "Orozco", "items": [1, 2, 3]}

print(person)
```

```bash title="Output dict_example.py"
{'first_name': 'Sergio', 'last_name': 'Orozco', 'items': [1, 2, 3]}
```

```python title="type_dict.py"
type(person)
```

```bash title="Output type_dict.py"
dict
```

## Functions

You create functions with the `def` keyword. For example, a sum function:

```python title="function.py"
def add(a, b):
  return a + b

print(add(3, 4))
print(add(-1, 4))
```

```bash title="Output function.py"
7
3
```

## Conditionals

Use conditionals to execute code fragments depending on conditions.

```python title="age_check.py"
def is_adult(age):
  if age >= 18:
    print("Shall we have a beer?")
  elif age >= 2:
    print("Do you want an ice cream?")
  else:
    print("Who is a cute baby?")

is_adult(21)
is_adult(12)
is_adult(1)
```

```bash title="Output age_check.py"
Shall we have a beer?
Do you want an ice cream?
Who is a cute baby?
```

## Loops

You can use loops to iterate collections; for example, use a `for` to compute squares of numbers.

```python title="squares_for.py"
numbers = [2, 3, 6, 8]
squares = []

for n in numbers:
  squares.append(n**2)

print(squares)
```

```bash title="Output squares_for.py"
[4, 9, 36, 64]
```

You can do the same with a list comprehension:

```python title="comprehension_squares.py"
[n ** 2 for n in numbers]
```

```bash title="Output comprehension_squares.py"
[4, 9, 36, 64]
```

And a `while` example that keeps asking until the answer changes:

```python title="while_prompt.py"
answer = 'y'
while answer == 'y':
  answer = input("Continue? ")
```

```bash title="Output while_prompt.py"
Continue? y
Continue? y
Continue? y
Continue? n
```

## Conclusion

We covered the basics: running code in Jupyter/Colab, data types, common structures (lists, tuples, dicts),
functions, conditionals and loops.

Useful resources:

- Official Python docs: <https://docs.python.org/3/>
- The interactive tutorial (Colab/Gist used in this post)
- PEP 484 — Type hints: <https://peps.python.org/pep-0484/>
- DataCamp Intro to Python course: <https://www.datacamp.com/courses/intro-to-python-for-data-science>
- Refactoring Guru patterns: <https://refactoring.guru/design-patterns/python>
- Microsoft beginner Python course: <https://docs.microsoft.com/es-es/shows/intro-to-python-development/>

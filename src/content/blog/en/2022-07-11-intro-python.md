---
title: Introduction to Python
tags:
  - dev
  - python
excerpt: A Gist that provides an introduction to Python
date: 2022-07-11
translation_status: 'translated'
translation_origin:
  locale: 'es'
  id: '2022-07-11-intro-python'
---

In this [Gist hosted on GitHub](https://gist.github.com/Scot3004/c5a562df9ca6509820f6320b5e4c6900) we find a notebook on how you can use Python from scratch and it explains the use of Jupyter Notebook, plus a link so you can do your own testing in Colab.

<a href="https://colab.research.google.com/gist/Scot3004/c5a562df9ca6509820f6320b5e4c6900/introducci-n-a-python.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

# Greeting

Hello! Today we are going to learn how to program in **Python** using **Jupyter Notebook**, this way we go straight to the code without worrying about how we install Python locally. In the world of data science it is very common to use this tool to make test scripts and share notes about what is being developed.

## Adding new blocks

In Jupyter there are 2 types of blocks, text and code.

To add a new one in Colab we place the mouse in the blank space between the blocks where we want to add it and it will ask us the type of block to be added.

When we select **Text**, we can add Markdown for editing.

When we select **Code**, we can add a snippet of code.

# What is Python

Python is an interpreted programming language created by Guido Van Rossum around the 1990s, which stands out for its ease of reading and writing. Python can be used for the web, as well as for automating repetitive tasks (yes, testing falls into this category), and also as a tool for processing massive data.

## Programming paradigms in Python

A paradigm can also be called a method for solving some problems or performing some tasks. A programming paradigm is an approach to solving the problem using some programming language, or we can also say that it is a method to solve a problem using tools and techniques that are available to us following some approach.

# Hello World

As a good introduction to any programming language, learning how to print a message to the screen is one of the first things we learn, plus it serves to confirm that the tool was installed successfully. We are going to start with one of my favorite programs "Hello World", for which we will rely on the `print` function which prints to the console what we write between quotes.

Below we have an example of code, try placing your name inside the quotes and press the button to run the code to see what happens on your screen.

```python title="greeting.py"
print("hello")
```
```bash title="Output greeting.py"
hello
```

# Variables

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

Python is a strongly typed language with dynamic typing, this means we can create variables with any data type without worrying about explicitly declaring the type.

> Python has a mechanism ([Type hints](https://peps.python.org/pep-0484/)) with which you can define the types you are going to use, something like what you do with TypeScript.

## Strings

In the previous examples we have been using strings to print our name to the screen, these strings in Python have the data type `str`.

```python title="type.py"
type(name)
```
```bash title="Output type.py"
str
```

### Format

Personally, to concatenate strings I recommend using the format function instead of the `+` operator, this allows us to even define formatting for the output of the variables.

```python title="format.py"
print("Hello {}".format(name))
```

```bash title="Output format.py"
Hello Sergio
```

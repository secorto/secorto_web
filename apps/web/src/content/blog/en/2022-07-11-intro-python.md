---
title: Introduction to Python
image: "@assets/img/blog/python-introduction.svg"
tags:
  - dev
  - python
excerpt: "A progressive roadmap for learning modern Python, from the fundamentals to object-oriented programming, using interactive labs."
translationKey: intro-python
date: 2022-07-11
---

Welcome! The **Python** ecosystem has evolved significantly.

Python has evolved considerably in recent years. In addition to a simple and expressive syntax,
the modern ecosystem incorporates tools such as Type Hints,
dataclasses, and other features that facilitate code maintenance.

This unified guide works as your quick reference **roadmap (Cheatsheet)**. The goal is to give you a clear overview
of the essential concepts before you start experimenting. You will find the interactive laboratories, live code,
and detailed architecture diagrams directly in the **Google Colab Notebooks** within our new dedicated repository.

---

## 📘 Module 1: Fundamentals and Essential Syntax

This module is designed to take you from "Hello World" to controlling flows and basic collections. Python stands
out for its readability, but it hides typing and precision rules that you must know.

### Table of Contents - Module 1

* **Jupyter Environment:** Using text blocks (Markdown) and executable code blocks in Google Colab.
* **Variables and Data Types:** Handling strings (`str`), integers (`int`), and complex numbers.
* **Type Hints:** Conceptual introduction to optional static typing and code contract documentation.
* **Essential Collections:** Mutability differences and modern typing in **Lists**, **Tuples**, and **Dictionaries**.
* **Precision Note:** Importing the `Decimal` class to avoid precision loss in financial operations.
* **Control Flows:** Conditional structures (`if/elif/else`) and repetitive loops (`for`, `while`).
* **Optimization:** Creating functions with *Type Hints* and code optimization via *List Comprehension*.

### 🚀 Practical Laboratory 1

Open the interactive notebook in our repository to modify, experiment, and execute the essential syntax code
live (includes the palindrome detector challenge):

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/secorto/notebooks/blob/main/english/intro-python.ipynb)

---

## 📙 Module 2: Modern Object-Oriented Programming

When essential structures are not enough, we scale to the object-oriented paradigm to model complex problems.
Here, we leave obsolete practices behind to adopt professional modern Python standards.

### Table of Contents - Module 2

* **The Object Concept:** Why explicit use of `self` is mandatory in Python instance methods.
* **Efficient Modeling (`@dataclass`):** Using *dataclasses* (Python 3.7+) to autogenerate constructors (`__init__`)
  and clean representations without writing boilerplate code.
* **Magic Methods (*Dunder Methods*):** Intercepting and overloading native operators (`+`, `-`, `==`)
  in your custom classes.
* **Inheritance and Polymorphism:** Adopting and overriding methods from a base class into child classes.
* **Multiple Inheritance and MRO:** Resolving the "Diamond Problem" through the *Method Resolution Order* algorithm.
* **Language Philosophy:** *Duck Typing* and defining modern structural contracts using the `Protocol` class.

### 🚀 Practical Laboratory 2

To see in-depth explanations, interact with live code, and visualize advanced class architecture modeled with
PlantUML, access the second laboratory:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/secorto/notebooks/blob/main/english/poo-python.ipynb)

*Note on execution: For this advanced OOP notebook, we will be using natively executable class architecture
  diagrams. It is necessary to run the initial setup cell to install and load the `iplantuml` extension
  so that graphics render correctly in your browser.*

---

## 🏁 Next Steps

This technical article is your benchmark starting point. Once you master both notebooks, you will be ready to
jump into modern market frameworks like **FastAPI**, **Pydantic**, or **SQLAlchemy**, where the use of static types
and objects is the daily engineering standard.

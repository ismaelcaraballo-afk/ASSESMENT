# Python Basics — Start Here
## For Juan (and Ismael's refresher)

---

## What Is Python?

Python is a language you use to talk to your computer. Just like you speak English to talk to people, you write Python to tell your computer what to do.

The computer reads your instructions one line at a time, top to bottom, like reading a book.

---

## 1. Printing (Talking to the Screen)

The first thing you learn in any language is how to say something.

```python
print("Hello")
```

That's it. `print()` tells the computer: "show this on the screen."

Whatever you put inside the parentheses and quotes, it shows up.

```python
print("My name is Juan")
print("I am learning Python")
print("This is not that hard")
```

**Try it:** Change what's inside the quotes. Run it. See what happens.

**The rule:** Text always goes in quotes. Numbers don't.

```python
print("Hello")      # text needs quotes
print(42)            # numbers don't
print("I am", 25)   # you can mix them with a comma
```

---

## 2. Variables (Giving Names to Things)

A variable is a label you stick on something so you can use it later.

```python
name = "Juan"
age = 25
city = "New York"
```

Now instead of typing "Juan" every time, you just say `name`:

```python
print(name)          # shows: Juan
print(age)           # shows: 25
print("Hi my name is", name, "and I live in", city)
```

**Think of it like this:** Variables are like labeled boxes. You put something in the box, slap a name on it, and grab it whenever you need it.

```python
# You can change what's in the box
score = 10
print(score)         # shows: 10

score = 20
print(score)         # shows: 20 (the old 10 is gone)
```

**The rules:**
- Variable names can't have spaces (use `my_name` not `my name`)
- Variable names can't start with a number (`2cool` won't work, `cool2` will)
- Python cares about CAPS — `Name` and `name` are two different boxes

---

## 3. Math (Python Is a Calculator)

Python does math exactly like a calculator:

```python
print(5 + 3)         # 8        addition
print(10 - 4)        # 6        subtraction
print(6 * 7)         # 42       multiplication
print(20 / 4)        # 5.0      division
```

You can save math results in variables:

```python
price = 10
tax = 2
total = price + tax
print(total)         # 12
```

You can use variables in math just like numbers:

```python
hours = 8
pay_per_hour = 15
daily_pay = hours * pay_per_hour
print("You made $", daily_pay, "today")    # You made $ 120 today
```

**Bonus operators:**
```python
print(10 ** 2)       # 100      power (10 squared)
print(10 % 3)        # 1        remainder (10 divided by 3 = 3 remainder 1)
```

---

## 4. Strings (Text)

Text in Python is called a **string**. It's always in quotes.

```python
first = "Juan"
last = "Rodriguez"

# Combine strings with +
full_name = first + " " + last
print(full_name)     # Juan Rodriguez
```

Useful string tricks:

```python
word = "python"

print(word.upper())        # PYTHON
print(word.lower())        # python
print(word.capitalize())   # Python
print(len(word))           # 6 (counts the letters)
```

**f-strings** — the easy way to mix variables into text:

```python
name = "Juan"
age = 25
print(f"My name is {name} and I am {age} years old")
# My name is Juan and I am 25 years old
```

The `f` before the quote means "I'm going to put variables inside curly braces." Way easier than using commas.

---

## 5. Lists (A Collection of Things)

A list is exactly what it sounds like — a list of items.

```python
fruits = ["apple", "banana", "mango"]
numbers = [10, 20, 30, 40, 50]
```

**Getting items from a list:**

Python counts starting from 0, not 1. (Weird, but you get used to it.)

```python
fruits = ["apple", "banana", "mango"]

print(fruits[0])     # apple     (first item)
print(fruits[1])     # banana    (second item)
print(fruits[2])     # mango     (third item)
```

**Changing and adding:**

```python
fruits = ["apple", "banana", "mango"]

fruits.append("grape")          # add to the end
print(fruits)                   # ["apple", "banana", "mango", "grape"]

fruits[0] = "strawberry"        # replace the first one
print(fruits)                   # ["strawberry", "banana", "mango", "grape"]

print(len(fruits))              # 4 (how many items)
```

---

## 6. If/Else (Making Decisions)

This is how your program makes choices.

```python
age = 18

if age >= 18:
    print("You can vote")
else:
    print("Too young to vote")
```

**How to read this:** "If age is 18 or more, print 'You can vote.' Otherwise, print 'Too young to vote.'"

More options with `elif` (short for "else if"):

```python
grade = 85

if grade >= 90:
    print("A")
elif grade >= 80:
    print("B")
elif grade >= 70:
    print("C")
else:
    print("F")
```

**The comparison symbols:**
```
==    equals              (5 == 5 is True)
!=    not equal           (5 != 3 is True)
>     greater than        (10 > 5 is True)
<     less than           (3 < 7 is True)
>=    greater or equal    (5 >= 5 is True)
<=    less or equal       (3 <= 7 is True)
```

**IMPORTANT:** One `=` means "put this value in the box." Two `==` means "are these equal?"

```python
x = 5       # putting 5 in the box called x
x == 5      # asking: is x equal to 5? (True)
```

---

## 7. Loops (Doing Something Over and Over)

### For Loop — "Do this for each thing in the list"

```python
fruits = ["apple", "banana", "mango"]

for fruit in fruits:
    print(fruit)
```

Output:
```
apple
banana
mango
```

**How to read this:** "For each fruit in the fruits list, print it."

You can loop through numbers too:

```python
for number in range(5):
    print(number)
```

Output:
```
0
1
2
3
4
```

`range(5)` gives you 0 through 4 (five numbers, starting from 0).

### While Loop — "Keep doing this as long as something is true"

```python
count = 0

while count < 5:
    print(count)
    count = count + 1
```

Same output as above. But a while loop keeps going until the condition is false. **Be careful** — if you forget `count = count + 1`, it loops forever.

### When to use which?
- **for** — when you know how many times (a list, a range)
- **while** — when you don't know how many times (keep going until something happens)

---

## 8. Functions (Reusable Instructions)

A function is a set of instructions you give a name to, so you can use them over and over.

```python
def say_hello():
    print("Hello!")
    print("Welcome to Python!")

say_hello()          # runs the instructions
say_hello()          # runs them again
```

Functions can take **inputs** (called parameters):

```python
def greet(name):
    print(f"Hello {name}!")

greet("Juan")        # Hello Juan!
greet("Ismael")      # Hello Ismael!
greet("Kevin")       # Hello Kevin!
```

Functions can **return** a result:

```python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)        # 8

total = add(10, 20)
print(total)         # 30
```

**Think of it like this:** A function is a vending machine. You put something in (the inputs), it does its thing, and something comes out (the return value).

---

## 9. Dictionaries (Labeled Storage)

A dictionary stores pairs of things — a **key** and a **value**. Like a real dictionary: the word is the key, the definition is the value.

```python
person = {
    "name": "Juan",
    "age": 25,
    "city": "New York"
}

print(person["name"])     # Juan
print(person["age"])      # 25
```

Adding and changing:

```python
person["job"] = "developer"       # add new key
person["age"] = 26                # change existing key
print(person)
```

Loop through a dictionary:

```python
for key, value in person.items():
    print(f"{key}: {value}")
```

Output:
```
name: Juan
age: 25
city: New York
job: developer
```

---

## 10. Putting It All Together

Here's a small program that uses everything above:

```python
# A list of students and their scores
students = [
    {"name": "Juan", "score": 85},
    {"name": "Ismael", "score": 92},
    {"name": "Kevin", "score": 78}
]

# Function to check the grade
def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"

# Loop through each student and print their grade
for student in students:
    name = student["name"]
    score = student["score"]
    grade = get_grade(score)
    print(f"{name} scored {score} — Grade: {grade}")
```

Output:
```
Juan scored 85 — Grade: B
Ismael scored 92 — Grade: A
Kevin scored 78 — Grade: C
```

---

## Quick Reference Card

| Concept | Example | What It Does |
|---------|---------|-------------|
| Print | `print("hi")` | Shows text on screen |
| Variable | `x = 5` | Stores a value |
| Math | `x + y` | Calculator |
| String | `"hello"` | Text |
| f-string | `f"Hi {name}"` | Text with variables |
| List | `[1, 2, 3]` | Collection of things |
| Dictionary | `{"key": "value"}` | Labeled storage |
| If/Else | `if x > 5:` | Make decisions |
| For Loop | `for x in list:` | Do something for each item |
| While Loop | `while x < 10:` | Keep going until condition is false |
| Function | `def my_func():` | Reusable instructions |
| `len()` | `len(my_list)` | Count items |
| `range()` | `range(10)` | Numbers 0 through 9 |
| `append()` | `list.append(x)` | Add to end of list |
| `return` | `return result` | Send a value back from a function |

---

## What to Practice

Open a terminal and type `python3` to start the Python shell. Try these:

1. Make a variable with your name and print it
2. Do some math and save the result
3. Make a list of 5 things and loop through them
4. Write an if/else that checks if a number is positive or negative
5. Write a function that takes a name and says hello

That's it. You now know enough Python to do real things.

---

*Written by RRC for Juan (and Ismael's refresher) — Pursuit 2026*

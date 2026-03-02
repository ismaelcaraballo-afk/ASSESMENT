# Python for Clean Energy — Your Coding Superpower
## A Lesson for Juan | Pursuit Cycle 3 — Clean Energy / Renewables

---

## What Is Python?

Python is a language you use to talk to your computer. You write instructions,
and the computer follows them — one line at a time, top to bottom, like
reading a book.

Today, every example will be about **clean energy** — solar panels, wind
turbines, electric cars, and saving the planet. By the end of this lesson,
you will build a real program that tracks energy for a neighborhood.

Let us get started.

---

## 1. Printing (Talking to the Screen)

The first thing you learn is how to make the computer say something.

```python
print("Hello, I am learning about clean energy!")
```

Whatever you put inside the parentheses and quotes shows up on screen.

```python
print("Solar panels turn sunlight into electricity")
print("Wind turbines spin to make power")
print("Clean energy does not pollute the air")
```

**The rule:** Text always goes in quotes. Numbers do not need quotes.

```python
print("Solar panels")     # text needs quotes
print(12)                  # numbers do not
print("I have", 6, "solar panels on my roof")  # you can mix them
```

### Try It Yourself

Write 3 print statements about your favorite type of clean energy.
Maybe you like solar, wind, or even hydropower (water power). Run them and see.

---

## 2. Variables (Giving Names to Things)

A variable is a label you stick on a value so you can use it later.
Think of it like a labeled box — you put something in, slap a name on it,
and grab it whenever you need it.

```python
energy_source = "solar"
panels_on_roof = 10
city = "New York"
```

Now instead of typing "solar" every time, you just say `energy_source`:

```python
print("My energy source is", energy_source)
print("I have", panels_on_roof, "panels")
print("I live in", city)
```

You can change what is in the box at any time:

```python
panels_on_roof = 10
print(panels_on_roof)   # shows: 10

panels_on_roof = 14     # added 4 more panels!
print(panels_on_roof)   # shows: 14
```

**The rules:**
- No spaces in names (use `solar_panels` not `solar panels`)
- Cannot start with a number (`2panels` is wrong, `panels2` is fine)
- Python cares about CAPS — `Panels` and `panels` are different boxes

### Try It Yourself

Create variables for:
- The name of a clean energy source you like
- How many of them you would put on your house
- How much energy one of them makes per day (just guess a number)

Print them all out in a sentence.

---

## 3. Math (Python Is a Calculator)

Python can do all the math you know — and it is fast.

| Symbol | What It Does | Example        |
|--------|-------------|----------------|
| +      | Add         | 5 + 3 = 8     |
| -      | Subtract    | 10 - 4 = 6    |
| *      | Multiply    | 6 * 2 = 12    |
| /      | Divide      | 20 / 4 = 5.0  |

Let us use math to figure out how much energy solar panels make:

```python
panels = 8
energy_per_panel = 5    # kilowatt-hours per day

total_energy = panels * energy_per_panel
print("Total energy per day:", total_energy, "kWh")
```

What about a whole month?

```python
days_in_month = 30
monthly_energy = total_energy * days_in_month
print("Energy in one month:", monthly_energy, "kWh")
```

How about the money you save? Let us say electricity costs 15 cents per kWh:

```python
cost_per_kwh = 0.15
money_saved = monthly_energy * cost_per_kwh
print("Money saved this month: $", money_saved)
```

### Try It Yourself

A wind turbine makes about 35 kWh per day. If your school has 3 turbines:
1. How much energy do they make in one day?
2. How much in a week (7 days)?
3. If electricity costs /bin/sh.12 per kWh, how much money does the school save in a week?

Write the code to figure it out.

---

## 4. Strings (Working with Text)

A string is just text inside quotes. You already used them with `print()`.

```python
source = "wind turbine"
location = "rooftop"
```

You can glue strings together — this is called **concatenation** (a big word
that just means sticking things together):

```python
message = "We installed a " + source + " on the " + location
print(message)
# shows: We installed a wind turbine on the rooftop
```

You can also use **f-strings** — these are easier. Put an `f` before the
quotes and use curly braces `{}` to drop in variables:

```python
panels = 12
city = "Brooklyn"
print(f"There are {panels} solar panels in {city}")
# shows: There are 12 solar panels in Brooklyn
```

Useful string tricks:

```python
source = "solar energy"

print(source.upper())        # SOLAR ENERGY
print(source.title())        # Solar Energy
print(len(source))           # 12 (counts every character including the space)
```

### Try It Yourself

Create an f-string that says something like:
"My name is Juan and I think [energy source] is the future because [your reason]."

Fill in the blanks with variables.

---

## 5. Lists (Collections of Things)

A list holds multiple items in one place, like a backpack full of stuff.
You make one with square brackets:

```python
clean_sources = ["solar", "wind", "hydro", "geothermal"]
print(clean_sources)
```

Each item has a position number called an **index**. It starts at 0 (not 1):

```python
print(clean_sources[0])   # solar
print(clean_sources[1])   # wind
print(clean_sources[3])   # geothermal
```

You can add and remove items:

```python
clean_sources.append("tidal")       # adds tidal to the end
print(clean_sources)
# ["solar", "wind", "hydro", "geothermal", "tidal"]

clean_sources.remove("geothermal")  # takes geothermal out
print(clean_sources)
# ["solar", "wind", "hydro", "tidal"]
```

Lists can hold numbers too:

```python
daily_energy = [40, 35, 42, 38, 45, 50, 41]
print("Best day:", max(daily_energy), "kWh")
print("Worst day:", min(daily_energy), "kWh")
print("Total this week:", sum(daily_energy), "kWh")
```

How many items are in a list?

```python
print(len(clean_sources))   # tells you how many items
```

### Try It Yourself

1. Make a list of 5 things that use electricity in your house (TV, fridge, etc.)
2. Make a list of how many kWh each one uses per day (just guess)
3. Use `sum()` to find the total energy your house uses
4. Use `max()` to find which one uses the most

---

## 6. If / Else (Making Decisions)

Sometimes your program needs to choose what to do. That is where `if` and
`else` come in.

```python
solar_energy = 40
house_needs = 30

if solar_energy >= house_needs:
    print("Your solar panels make enough energy!")
else:
    print("You need more panels.")
```

**How it works:**
- `if` checks if something is true
- If it is true, the indented code under `if` runs
- If it is false, the indented code under `else` runs

You can check more than two options with `elif` (short for "else if"):

```python
wind_speed = 25  # miles per hour

if wind_speed >= 30:
    print("Wow! Turbines are making tons of energy!")
elif wind_speed >= 15:
    print("Good wind. Turbines are spinning nicely.")
elif wind_speed >= 5:
    print("Light breeze. Turbines are barely moving.")
else:
    print("No wind. Turbines are off today.")
```

**Comparison symbols:**

| Symbol | Meaning                |
|--------|------------------------|
| ==     | equals                 |
| !=     | does not equal         |
| >      | greater than           |
| <      | less than              |
| >=     | greater than or equal  |
| <=     | less than or equal     |

### Try It Yourself

Write a program that:
1. Sets a variable for how many solar panels a house has
2. If it has 10 or more, print "This house is fully solar powered!"
3. If it has between 5 and 9, print "Getting there! Need a few more panels."
4. If it has less than 5, print "Just getting started with solar."

---

## 7. Loops (Doing Things Over and Over)

A loop repeats code so you do not have to type the same thing 100 times.

### For Loops

A `for` loop goes through each item in a list:

```python
energy_sources = ["solar", "wind", "hydro", "geothermal"]

for source in energy_sources:
    print(f"{source} is a type of clean energy")
```

This prints:
```
solar is a type of clean energy
wind is a type of clean energy
hydro is a type of clean energy
geothermal is a type of clean energy
```

You can loop through numbers with `range()`:

```python
# Count from 1 to 5
for day in range(1, 6):
    print(f"Day {day}: Turbines are spinning!")
```

Let us calculate energy for each day of the week:

```python
daily_sunlight_hours = [6, 8, 5, 7, 9, 4, 6]
energy_per_hour = 5  # kWh per hour of sunlight

for day_number in range(7):
    hours = daily_sunlight_hours[day_number]
    energy = hours * energy_per_hour
    print(f"Day {day_number + 1}: {hours} hours of sun = {energy} kWh")
```

### While Loops

A `while` loop keeps going as long as something is true:

```python
battery_charge = 0

while battery_charge < 100:
    battery_charge = battery_charge + 20
    print(f"Battery is at {battery_charge}%")

print("Battery fully charged from solar power!")
```

### Try It Yourself

1. Make a list of 5 neighborhoods in your city
2. Use a for loop to print: "[neighborhood] should switch to solar!"
3. **Bonus:** Use a while loop to simulate a solar battery charging from 0 to 100
   in steps of 10

---

## 8. Functions (Reusable Machines)

A function is like a machine — you put something in, it does work, and gives
you something back. You build it once and use it as many times as you want.

```python
def calculate_solar_energy(panels, hours_of_sun):
    energy_per_panel = 5  # kWh per panel per day
    total = panels * energy_per_panel * (hours_of_sun / 8)
    return total
```

Now use it:

```python
my_energy = calculate_solar_energy(10, 6)
print(f"My house makes {my_energy} kWh today")

neighbor_energy = calculate_solar_energy(6, 8)
print(f"My neighbor makes {neighbor_energy} kWh today")
```

**Breaking it down:**
- `def` means "I am defining a new function"
- `calculate_solar_energy` is the name you give it
- `panels` and `hours_of_sun` are inputs (called **parameters**)
- `return` sends the answer back to you

Here is another one:

```python
def energy_grade(kwh_per_day):
    if kwh_per_day >= 50:
        return "A+ Amazing!"
    elif kwh_per_day >= 30:
        return "B  Good job!"
    elif kwh_per_day >= 15:
        return "C  Keep going!"
    else:
        return "D  Needs more panels!"

my_grade = energy_grade(42)
print("Your energy grade:", my_grade)
```

### Try It Yourself

Write a function called `wind_energy` that takes two inputs:
- `turbines` (how many wind turbines)
- `wind_speed` (in mph)

If wind speed is 10 or more, each turbine makes 35 kWh.
If wind speed is less than 10, each turbine makes only 10 kWh.

Return the total energy. Then call your function a few times with different
numbers and print the results.

---

## 9. Dictionaries (Labeled Storage)

A dictionary is like a list, but instead of position numbers, each item has
a **name** (called a key). Think of it like a real dictionary: you look up
a word (key) and get the definition (value).

```python
solar_panel = {
    "brand": "SunPower",
    "watts": 400,
    "location": "rooftop",
    "installed": True
}
```

Get a value by its key:

```python
print(solar_panel["brand"])       # SunPower
print(solar_panel["watts"])       # 400
```

Add or change values:

```python
solar_panel["age_years"] = 2      # adds a new key
solar_panel["watts"] = 420        # updates the value
```

Loop through a dictionary:

```python
for key, value in solar_panel.items():
    print(f"{key}: {value}")
```

Here is a more useful example — tracking energy by source:

```python
neighborhood_energy = {
    "solar": 120,
    "wind": 85,
    "hydro": 60
}

total = 0
for source, kwh in neighborhood_energy.items():
    print(f"{source}: {kwh} kWh")
    total = total + kwh

print(f"Total clean energy: {total} kWh")
```

### Try It Yourself

Make a dictionary for a wind turbine with these keys:
- `name` (give it a fun name)
- `height_feet`
- `blades`
- `daily_kwh`
- `location`

Print each piece of info in a nice sentence using a loop or f-strings.

---

## 10. Putting It All Together

Time to build a real program. This one tracks clean energy for a whole
neighborhood. It uses **everything** you learned: print, variables, math,
strings, lists, if/else, loops, functions, and dictionaries.

Read through it, then type it out yourself. Change the numbers. Add houses.
Make it yours.

```python
# ============================================
# NEIGHBORHOOD CLEAN ENERGY TRACKER
# Built by Juan — Pursuit Cycle 3
# ============================================

# --- FUNCTION: Calculate daily solar energy ---
def solar_energy(panels, sun_hours):
    kwh_per_panel = 5
    return panels * kwh_per_panel * (sun_hours / 8)

# --- FUNCTION: Calculate daily wind energy ---
def wind_energy(turbines, wind_speed):
    if wind_speed >= 15:
        kwh_per_turbine = 35
    elif wind_speed >= 8:
        kwh_per_turbine = 18
    else:
        kwh_per_turbine = 5
    return turbines * kwh_per_turbine

# --- FUNCTION: Give an energy grade ---
def energy_grade(kwh):
    if kwh >= 80:
        return "A+"
    elif kwh >= 50:
        return "A"
    elif kwh >= 30:
        return "B"
    elif kwh >= 15:
        return "C"
    else:
        return "D"

# --- DATA: Our neighborhood ---
houses = [
    {"owner": "Juan", "panels": 10, "turbines": 0},
    {"owner": "Maria", "panels": 6, "turbines": 1},
    {"owner": "Derek", "panels": 0, "turbines": 2},
    {"owner": "Aisha", "panels": 14, "turbines": 1},
    {"owner": "Sam", "panels": 4, "turbines": 0},
]

# --- TODAY'S CONDITIONS ---
sun_hours = 7
wind_speed = 18

# --- REPORT ---
print("=" * 50)
print("  NEIGHBORHOOD CLEAN ENERGY REPORT")
print(f"  Sun: {sun_hours} hours | Wind: {wind_speed} mph")
print("=" * 50)
print()

all_energy = []

for house in houses:
    name = house["owner"]
    solar = solar_energy(house["panels"], sun_hours)
    wind = wind_energy(house["turbines"], wind_speed)
    total = solar + wind
    grade = energy_grade(total)

    all_energy.append(total)

    print(f"{name}"s House:")
    print(f"  Solar panels: {house["panels"]}  -> {solar:.1f} kWh")
    print(f"  Wind turbines: {house["turbines"]} -> {wind:.1f} kWh")
    print(f"  Total: {total:.1f} kWh  |  Grade: {grade}")
    print()

# --- NEIGHBORHOOD TOTALS ---
print("-" * 50)
print(f"Neighborhood total: {sum(all_energy):.1f} kWh")
print(f"Average per house:  {sum(all_energy) / len(all_energy):.1f} kWh")
print(f"Best house:         {max(all_energy):.1f} kWh")
print(f"Needs improvement:  {min(all_energy):.1f} kWh")

# --- MONEY SAVED ---
cost_per_kwh = 0.15
total_saved = sum(all_energy) * cost_per_kwh
yearly_saved = total_saved * 365

print()
print(f"Money saved today:    ")
print(f"Money saved per year: ")
print()
print("Clean energy is the future!")
print("=" * 50)
```

### What to Do With This

1. **Type it out** — do not copy-paste. You learn more by typing.
2. **Run it** and look at the output.
3. **Change things:**
   - Add your own house to the list
   - Change the sun hours or wind speed
   - Add a new energy source (like hydro)
4. **Break it on purpose** — remove a colon or a quote and see what error
   you get. Learning to read errors is a superpower.

---

## Quick Reference Card

Keep this handy while you code.

### Print
```python
print("Hello")
print("I have", 5, "panels")
print(f"Total: {some_variable} kWh")
```

### Variables
```python
name = "Juan"
panels = 10
is_sunny = True
```

### Math
```python
total = 8 * 5          # multiply
average = 100 / 4      # divide
remaining = 50 - 12    # subtract
combined = 30 + 20     # add
```

### Strings
```python
word = "solar"
print(word.upper())           # SOLAR
print(word.title())           # Solar
print(f"I like {word}")       # I like solar
print(len(word))              # 5
```

### Lists
```python
sources = ["solar", "wind", "hydro"]
sources.append("geothermal")  # add item
sources.remove("hydro")       # remove item
print(sources[0])             # first item
print(len(sources))           # how many items
print(sum([10, 20, 30]))      # 60
print(max([10, 20, 30]))      # 30
print(min([10, 20, 30]))      # 10
```

### If / Elif / Else
```python
if energy >= 50:
    print("Great!")
elif energy >= 25:
    print("Good")
else:
    print("Needs work")
```

### For Loop
```python
for item in my_list:
    print(item)

for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):     # 1, 2, 3, 4, 5
    print(i)
```

### While Loop
```python
count = 0
while count < 10:
    print(count)
    count = count + 1
```

### Functions
```python
def my_function(input1, input2):
    result = input1 + input2
    return result

answer = my_function(5, 10)
print(answer)   # 15
```

### Dictionaries
```python
my_dict = {
    "name": "Juan",
    "panels": 10
}

print(my_dict["name"])         # Juan
my_dict["city"] = "Brooklyn"   # add new key

for key, value in my_dict.items():
    print(key, value)
```

### Common Errors and What They Mean

| Error | What Happened |
|-------|---------------|
| SyntaxError | You typed something Python does not understand (missing quote, colon, etc.) |
| NameError | You used a variable that does not exist yet |
| TypeError | You tried to mix things that do not go together (like adding a string and a number) |
| IndexError | You asked for an item in a list that does not exist (like item 10 in a 5-item list) |
| KeyError | You asked for a dictionary key that does not exist |

### How to Fix Errors

1. Read the error message — it tells you the line number
2. Go to that line and look carefully
3. Check for missing quotes, colons, or parentheses
4. Check your spelling — Python is picky
5. If stuck, add `print()` statements to see what your variables actually hold

---

## What is Next?

Now that you know the basics, here are ideas for your Cycle 3 project:

- **Energy calculator** — Let a user type in how many panels they have and
  calculate savings
- **Energy comparison tool** — Compare solar vs wind vs hydro for a city
- **Clean energy quiz** — Ask questions and keep score
- **Neighborhood planner** — Figure out the best mix of solar and wind for
  different houses

The code you wrote today is real. It is not a toy. Scientists, engineers,
and companies use Python every day to plan clean energy systems. You just
learned the same language they use.

Keep going, Juan.

---

*Written by RRC for Juan -- Pursuit 2026*

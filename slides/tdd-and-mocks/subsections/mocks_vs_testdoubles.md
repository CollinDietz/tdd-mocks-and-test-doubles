---
layout: intro
---

# Mocks Vs TestDoubles
Or what is a Mock?

---

# Why do need

- Test's need ways to _prove_ what we want to happen is happening
  - If test's just ran the code you wouldn't really prove much
- For simple things, just check the output

```
uint8_t result = some_func(1,1);
CHECK_EQUAL(10, 1);
```

- What if the module we want to test _depends_ on another module?
  - In an object-oriented world you want something that can fulfil the responsibilities of an object
```
SomeComplicatedModule_Init(instance, &someOtherComplicatedModule);
SomeComplicatedModule_DoSomething();
// prove that something has happened to someOtherComplicatedModule
```


---

# Testing Dependencies

- Unit tests for a module with dependencies we broadly have two options (at GEA)
  - TestDoubles
  - Mocks
- These are "not GE special names"
  - Some people have Fakes, Spys, Stubs, etc.
- Broadly these fall into two categories
  - Testing Data
  - Testing Interaction

---

# Testing Data (Test Doubles)

- Often we only need to prove what our module does to the data maintained by another module
- Think about blinky
```
GivenBlinkyInit();
LedShouldBe(ON);
After(SomeBlinkPeriod);
LedShouldBe(Off);
```

- Our primary concern is what Blinky does to the _state_ of the Led
- This can be modeled without needing an actual LED, just enough memory to model the state of one

```mermaid
graph LR
subgraph Blinky
end

subgraph LedTestDouble
 a[_private->state]
end

subgraph Tests
end

Blinky --> |"Write(ledTestDouble)"| a
a --> |Read| Tests
```

----

# When Is This Not Enough?

```
GivenBlinkyInit();
LedShouldBe(ON);
After(SomeBlinkPeriod - 1)
LedShouldBe(On);
After(1);
LedShouldBe(Off);
```

- Something that toggles the LED _way_ more often would still pass this test
- We prove that
  - at `t=0` and `t=SomeBlinkPeriod-1` the LED is on
  - at `t=SomeBlinkPeriod` the LED is off
- But the LED could _technically_ be anything at any other time
  - We might not care to prove something more rigorous
  - But what if it interacts with _many_ other modules?
  - What if the _order_ that it interacts with them is very specific?

---

# Proving Interactions

- Mocks let you prove out the specifics of two or more modules interacting
- They prove
  - Order of interactions*
  - Data used in interactions
- For Blinky
  - A test double shows what state the LED is in
  - A mock shows how and in what order the LED is asked to change

```
TheLedShouldBeTurned(On);
WhenBlinkyInit();

NothingShouldHappen()
After(SomeBlinkPeriod - 1);

TheLedShouldBeTurned(Off);
After(SomeBlinkPeriod);
```

---

# How does this happen?

- The mock doesn't need to track the _state_ of the module
- It just needs to remember what _should_ happen (in order*) and compare that to what _does_ happen

```mermaid
graph LR
subgraph Expected
a["Write(On)"];
b["Write(Off)"];
c["Write(On)"];
end

subgraph Actual
d["Write(On)"];
e["Write(Off)"];
f["Write(Off)"];

a --- |"✅"| d
b --- |"✅"| e
c --- |"❌"| f
end
```

---

# How does this happen?
- The test builds up a list of "Expected Calls"
- When the mocking system sees an "Actual Call"
  - It looks at the list of expected calls
  - Compares if its the right call and if it was called with the right parameters
  - If the call was not expected or called with the wrong parameters, it errors

---
layout: two-cols
---

# How does this happen?

```{1}
TheLedShouldBeTurned(On);
WhenBlinkyInit();

NothingShouldHappen()
After(SomeBlinkPeriod - 1);

TheLedShouldBeTurned(Off);
After(SomeBlinkPeriod);
```

::right::
```mermaid
graph LR
subgraph Expected
a["Write(On)"];
end

subgraph Actual
end

a ~~~ Actual
```

---
layout: two-cols
---

# How does this happen?

```{2}
TheLedShouldBeTurned(On);
WhenBlinkyInit();

NothingShouldHappen()
After(SomeBlinkPeriod - 1);

TheLedShouldBeTurned(Off);
After(SomeBlinkPeriod);
```

::right::
```mermaid
graph LR
subgraph Expected
a["Write(On)"];
end

subgraph Actual
b["Write(On)"];
end

a ---|"✅"| b
```

---
layout: two-cols
---

# How does this happen?

```{4,5}
TheLedShouldBeTurned(On);
WhenBlinkyInit();

NothingShouldHappen()
After(SomeBlinkPeriod - 1);

TheLedShouldBeTurned(Off);
After(SomeBlinkPeriod);
```

::right::
```mermaid
graph LR
subgraph Expected
a["Write(On)"];
end

subgraph Actual
b["Write(On)"];
end

a ---|"✅"| b
```

---
layout: two-cols
---

# How does this happen?

```{7}
TheLedShouldBeTurned(On);
WhenBlinkyInit();

NothingShouldHappen()
After(SomeBlinkPeriod - 1);

TheLedShouldBeTurned(Off);
After(SomeBlinkPeriod);
```

::right::
```mermaid
graph LR
subgraph Expected
a["Write(On)"];
c["Write(Off)"];
end

subgraph Actual
b["Write(On)"];
end

a ---|"✅"| b
```

---
layout: two-cols
---

# How does this happen?

```{8}
TheLedShouldBeTurned(On);
WhenBlinkyInit();

NothingShouldHappen()
After(SomeBlinkPeriod - 1);

TheLedShouldBeTurned(Off);
After(SomeBlinkPeriod);
```

::right::
```mermaid
graph LR
subgraph Expected
a["Write(On)"];
c["Write(Off)"];
end

subgraph Actual
b["Write(On)"];
d["Write(Off)"];
end

a ---|"✅"| b
c ---|"✅"| d
```

---
layout: two-cols
---

# What If Something Had Happened?

```{4,5}
TheLedShouldBeTurned(On);
WhenBlinkyInit();

NothingShouldHappen()
After(SomeBlinkPeriod - 1);

TheLedShouldBeTurned(Off);
After(SomeBlinkPeriod);
```

::right::
```mermaid
graph LR
subgraph Expected
a["Write(On)"];
c["No Call Expected"]

end

subgraph Actual
b["Write(On)"];
d["Write(Off)"];
end

a ---|"✅"| b
c ---|❌| d


style c stroke-dasharray: 5 5;
```

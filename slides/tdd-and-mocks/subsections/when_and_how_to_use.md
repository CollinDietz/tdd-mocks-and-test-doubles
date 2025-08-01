---
layout: intro
---

# When And How To Use

---
layout: two-cols
---

# Pros And Cons

## Pros

- Mocks are strict
- Everything is accounted for
- Changes to module are very likely to break tests

::right::

<br>
<br>

## Cons

- Mocks are "noisy"
- Everything _must_ be accounted for
- Changes to module are very likely to break tests

---
layout: two-cols
---

# When To Use and Not Use

## To Use

- Things that are more about behavior then data
  - CycleSteps, Signals
- When modeling the underlying state is difficult
  - Not worth writing a test double that approximates behavior
- When a mock exists, but not a test double

::right::

<br>
<br>

## To Not Use

- Things that are more about data then behavior
  - Erds, InputOutputs, DigitalInputs, etc
    - Would have to provide data _each_ time its read with a mock
    - Test Doubles set state only when changes
- Things that don't change state very often
- Things that change state very often, but you don't care

---

# How To Use

- Need a module that consumes an interface of some kind
  - `void Blinky_Init(Blinky_t *instance, I_DigitalOutput_t *led)`
- Instead of providing a `DigitalOutput_TestDouble_t *` provide a `DigitalOutput_Mock_t *`
- Define possible expected calls in tests
  - Actual's are already made
- Write `Should ... When` tests instead of `When ... Should` tests

---
layout: two-cols
---

# Example

### Code
```c
void Blinky_Init(
    Blinky_t *instance,
    I_DigitalOutput_t *led);
```

::right::

<br>
<br>

### Tests
```cpp
TEST_GROUP(mocks)
{
   Blinky_t instance;
   DigitalOutput_Mock_t ledMock;

   void setup()
   {
      DigitalOutput_Mock_Init(&ledMock);
      Blinky_Init(&instance, &ledMock.interface);
   }
```

---
layout: two-cols
---

# Define Expected Calls

- Actual call already exists
  - test/Mocks/DigitalOutput_Mock.cpp
```c{|3}
static void Write(I_DigitalOutput_t *instance, bool state)
{
   mock().actualCall("Write")
      .onObject(instance)
      .withParameter("state", state);
}
```

::right::

<br>
<br>

- Make a helper for your expected call

<br>

```c{|3}
void LedShouldBeSetTo(bool state)
{
   mock().expectOneCall("Write")
      .onObject(&ledMock)
      .withParameter("state", state);
}
```

---

# Write `Should ... When` tests

```c{|1,2|4,5|7,8}
LedShouldBeSetTo(Off);
WhenModuleIsInitialized();

NothingShouldHappen();
After(Period - 1);

LedShouldBeSetTo(On);
After(1);
```

---

# Additional Use Case: Mocking a Erd

- What if I have something that a module interacts with that is _not_ a mock
- But I want to mock it?
- For example `Erd_SomeSignal`
- Just mock it yourself!

---

# Example


```c
void setup()
{
    EventSubscription_Init(&dataChangeSubscription, NULL, DataChanged);
    DataSource_SubscribeAll(&dataSource.interface, &dataChangeSubscription);
    Module_Init(&instance, &dataSource.interface);
}

static void DataChanged(void *context, const void *_args)
{
    REINTERPRET(args, _args, const DataModelOnDataChangeArgs_t *);
    IGNORE(context);

    if(args->erd == Erd_SomeSignal)
    {
        mock().actualCall("Erd_SomeSignal");
    }
}

void SomeSignalShouldBeSent()
{
    mock.expectOneCall("Erd_SomeSignal");
}
```

---

# Pitfalls

## Order Matters! ... Kinda

- If you set your expectations right before the actions that trigger them, you get in order checking
- If you set all your expectations before the test starts you don't
- By default cpputest does not enforce strict order on the actuals

```c
LedShouldBeSetTo(On);
LedShouldBeSetTo(Off);
WhenModuleIsInitialized();
After(Period);
```
Passes!

```c
mock().strictOrder();
LedShouldBeSetTo(On);
LedShouldBeSetTo(Off);
WhenModuleIsInitialized();
After(Period);
```
Fails!

---

# Pitfalls

## Enable/Disable
- You can momentarily turn off and on the mocking framework
```c
mock().disable();
doLotsOfThingsUnchecked();
mock().enable();
```

- This can be tempting when you want to test something after a bunch of other mock calls happen
  - ex. What is the LED doing after 5 s of blinking at 100 ms?
  - When mocks feel noisy
- My `opinion` don't do this!
  - Mocks provide lots of protection, why turn it off?
  - Easy to feel like you know what you are skipping over, but easy to be wrong (you're blind)
  - Dealing with the noisiness can be handled in well written test helpers
- More realistically, there is a time and a place

---

# Pitfalls

## Long Tests And Big Errors
- Often Mocks are most helpful with long complicated modules with complex interactions
- But mocks need to have _all_ their calls accounted for
- So what happens if you need to test something that takes a lot of time to get to after Init?

---

```shell
test/Tests/Common/SmartPlaster/CycleSteps/CycleStep_SmartPlaster_Test.cpp:894: error: Failure in TEST(CycleStep_SmartPlaster, ShouldUseUpARebalanceIfExitingPlasterStepBecauseOfAnOOB)
        Mock Failure: Unexpected additional (46th) call to function: Stop
        EXPECTED calls that WERE NOT fulfilled:
                <none>
        EXPECTED calls that WERE fulfilled:
                (object address: 0x628000f5c1d8)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1e8)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c218)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c248)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c258)::Select -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1d8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1d8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1e8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1e8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c218)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c218)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c248)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c248)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c258)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c258)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1d8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1d8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1e8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1e8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c218)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c218)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c248)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c248)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1d8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1d8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1e8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1e8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c208)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c218)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c218)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c248)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c238)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Start -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c228)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c1f8)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c248)::Stop -> no parameters (expected 1 call, called 1 time)
                (object address: 0x628000f5c258)::Start -> no parameters (expected 1 call, called 1 time)
```

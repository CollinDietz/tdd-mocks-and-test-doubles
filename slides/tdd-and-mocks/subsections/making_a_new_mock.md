---
layout: intro
---

# How to Setup a New Mock

---

# When Would You _Need_ a New Mock

- Its good practice to make a new mock when you make a new interface
  - If an interface is being made then so is a module that will use it
  - And that module will need tests
- If there is only a TestDouble for that interface
  - Rare anymore, especially with applcommon interfaces

---

# Steps

1. Make new interface definition (`I_CoolNewInterface_t`)
2. Make the implementation files
   - CoolNewInterface_Mock.h
   - CoolNewInterface_Mock.cpp
3. Write function prototypes for the interface + Init
4. Fill out the mock details for each function

---

# 1. Make new interface definition

```c{|3,5,7}
typedef struct I_Gpio_Api_t
{
   bool (*Read)(I_Gpio_t *instance);

   void (*Write)(I_Gpio_t *instance, const bool state);

   void (*SetDirection)(I_Gpio_t *instance, const GpioDirection_t direction);
} I_Gpio_Api_t;
```

---

# 2. Make the Implementation Files
Gpio_Mock.h
```c{|4,8,9,11}
#ifndef GPIO_MOCK_H
#define GPIO_MOCK_H

#include "I_Gpio.h"

typedef struct
{
   I_Gpio_t interface;
} Gpio_Mock_t;

void Gpio_Mock_Init(Gpio_Mock_t *instance);

#endif
```

---

# 3. Write Function Prototypes for the Interface + Init
Gpio_Mock.cpp

```cpp
static bool Read(I_Gpio_t *instance)
{

}

static void Write(I_Gpio_t *instance, const bool state)
{

}

static void SetDirection(I_Gpio_t *instance, const GpioDirection_t direction)
{

}

static const I_Gpio_Api_t api = { Read, Write, SetDirection };

void Gpio_Mock_Init(Gpio_Mock_t *instance)
{
   instance->interface.api = &api;
}
```

---

# 4. Fill Out the Mock Details for each Function

```c{||none}
static void Write(I_Gpio_t *instance, const bool state)
{
   mock()
      .actualCall("Write")
      .onObject(instance)
      .withParameter("state", state);
}
```
```c{|none||none}{at:1}
static void SetDirection(I_Gpio_t *instance, const GpioDirection_t direction)
{
   mock()
      .actualCall("SetDirection")
      .onObject(instance)
      .withParameter("direction", direction);
}
```
```c{|none|none|}{at:1}
static bool Read(I_Gpio_t *instance)
{
   return mock()
      .actualCall("Read")
      .onObject(instance)
      .returnBoolValue();
}
```

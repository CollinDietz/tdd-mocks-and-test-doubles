# Mocks in Unit Testing (C Language)

## 1. Introduction
- Unit testing in C involves testing individual functions or modules in isolation.
- Isolation ensures tests are fast, reliable, and not dependent on external systems.
- C has unique challenges: no built-in mocking, no interfaces or OOP.

## 2. What Are Mocks?
- A **mock** is a stand-in for a real function or module during testing.
- It simulates behavior and allows control and observation of interactions.
- Mocks help:
  - Replace hardware or external systems
  - Simulate edge cases
  - Track how dependencies are used (e.g., call counts, arguments)

## 3. Why Use Mocks in C
- Isolate the unit under test from:
  - Hardware (sensors, actuators)
  - OS functions (file I/O, timing)
  - Network or external libraries
- Speed up tests and avoid side effects
- Test behavior under controlled conditions
- Verify interactions (i.e., was a function called?)

## 4. Common Mocking Techniques in C

### 4.1 Manual Mocking via Link-Time Substitution
- Provide a different implementation of the function during tests.

```c
// production code
int read_sensor(void);

// in test file
int read_sensor(void) {
    return 42; // mocked return value
}
```

### 4.2 Preprocessor-Based Mocking
- Use `#define` to redirect function calls in test builds.

```c
// test build
#define read_sensor mock_read_sensor

int mock_read_sensor(void) {
    return 99;
}
```

### 4.3 Function Pointer Injection
- Use function pointers to inject real or mock behavior.

```c
int (*read_sensor_func)(void); // global or passed to function

int real_read_sensor(void) { /* real code */ }
int mock_read_sensor(void) { return 123; }

// test setup
read_sensor_func = mock_read_sensor;
```

### 4.4 Using Mocking Frameworks

#### CMock + Unity (Ceedling)
- Auto-generates mocks from header files.
- Handles expectations and verification.

```c
read_sensor_ExpectAndReturn(25);
```

#### Fake Function Framework (FFF)
- Macro-based, easy setup for simple mocks.

```c
FAKE_VALUE_FUNC(int, read_sensor)

void test_temp_read(void) {
    read_sensor_fake.return_val = 42;
    get_temp(); // calls read_sensor internally
    TEST_ASSERT_EQUAL(1, read_sensor_fake.call_count);
}
```

## 5. When to Use Mocks
- You are calling:
  - Hardware interfaces
  - Device drivers
  - OS-level APIs
  - Third-party or untestable libraries
- You need to simulate:
  - Failure conditions
  - Delays, timeouts, retries
  - Edge values

## 6. Best Practices
- Mock only what's external or non-deterministic
- Keep mocks simple — avoid complex logic
- Reset mocks between tests
- Don't mock what you can test directly
- Use naming conventions (e.g., `mock_`, `_fake`) for clarity
- Prefer automatic mocking tools for scalability

## 7. Common Pitfalls
- Over-mocking: fragile tests that break with implementation changes
- Mocking internals instead of dependencies
- Leaving mocks in production builds
- Not validating that mocks were called correctly
- Forgetting to reset or clean mock state between tests

## 8. Real-World Example: Mocking a Sensor Read

### Production Code
```c
int read_sensor(void); // actual hardware read
int get_temperature(void) {
    return read_sensor(); // uses real sensor
}
```

### Test Code with CMock
```c
#include "mock_sensor.h"

void test_get_temperature_returns_mocked_value(void) {
    read_sensor_ExpectAndReturn(22);
    int temp = get_temperature();
    TEST_ASSERT_EQUAL(22, temp);
}
```

### Test Code with FFF
```c
FAKE_VALUE_FUNC(int, read_sensor);

void test_get_temperature_uses_fake(void) {
    read_sensor_fake.return_val = 55;
    int result = get_temperature();
    TEST_ASSERT_EQUAL(55, result);
    TEST_ASSERT_EQUAL(1, read_sensor_fake.call_count);
}
```

## 9. Summary
- Mocks simulate real components in tests to isolate and control execution.
- C requires manual effort or frameworks to support mocking.
- Techniques include link-time overrides, function pointers, macros, and tools like CMock or FFF.
- Use mocks wisely to make tests fast, focused, and meaningful.

## 10. Resources
- Unity/CMock/Ceedling: https://throwtheswitch.org/
- Fake Function Framework (FFF): https://github.com/meekrosoft/fff
- Martin Fowler on Test Doubles: https://martinfowler.com/bliki/TestDouble.html

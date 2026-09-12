---
title: "@secorto/step"
excerpt: "Reporting anti-corruption layer to express test steps and choose execution strategy cleanly."
image: "@assets/img/project/secorto_step.jpeg"
role: "Maintainer"
responsibilities: "I designed semantic steps and execution boundaries for automated
tests with clear reporting and configurable behavior"
website: "https://github.com/secorto/secorto_web/tree/master/packages/step"
tags:
  - secorto
  - ai
---

I created `@secorto/step` to solve a recurring problem in automation: page
objects were mixing business intent, assertions and runner-specific details.
That made tests harder to read and reports noisier than they should be.

The project introduced a reporting boundary where each step describes the user
intent and the execution layer decides how that step is validated and reported.
Instead of burying assertions inside the flow, I separated the semantic action
from the execution strategy so the same step can fail fast or continue with soft
expectations depending on the test context.

The hardest part was keeping the abstraction useful without making it too
abstract. I needed the automation to keep speaking the language of the product,
not the language of the test framework. That led me to a generic, reusable layer
with explicit boundaries, cleaner debug output and less coupling between the
scenario logic and the infrastructure that runs it.

The result is a more maintainable QA architecture with better reports, clearer
intent and less fragility as the suite grows.

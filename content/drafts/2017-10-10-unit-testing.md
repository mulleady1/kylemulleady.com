---
title: "Unit testing"
date: 2017-10-10
slug: unit-testing
legacy_id: 14
---

Short, opinionated post. 

There are pros and cons to unit testing. Here's a quick list about unit testing React apps.

PROS:
- It's so much faster to test browser code in a headless Node.js environment than to load the app in the browser, navigate to a feature, and click around or do whatever else needs to be done to test the functionality of that feature.
- It _really_ helps you think about how to design your code well. Without tests, you can implement some feature however you want and however hacky you want. With tests, every piece of functionality needs to be broken down into simple blocks that are tested with one or many automated tests. This eliminates the possibility of many hacks.
- It helps new team members understand the codebase faster. Looking at what's being tested in a component paints a pretty picture of all of a component's features.
- It provides a much quicker feedback loop for when you break something.
- It prevents a number of bugs from ever leaving your local environment.

CONS:
- It's more code to maintain.

In summary, the pros outweigh the cons. Write unit tests.

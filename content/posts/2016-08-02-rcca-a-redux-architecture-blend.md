---
title: "RCCA: A Redux architecture blend for those that still like MVC"
date: 2016-08-02
slug: rcca-a-redux-architecture-blend
legacy_id: 2
---

MVC was the decades-long preferred architecture for many developers. For this reason and more, not all of us are ready to abandon it for newer flavors. However, Redux has proved its worth in many large-scale applications in its short lifetime. I know this personally. My first Redux app was a complex manufacturing scheduling gantt, designed to track tens to hundreds of thousands of resources, deployed to globally reaching manufacturing companies. 

The documentation says it perfectly: both React and Redux (and especially when used together) make applications amazingly predictable and easy to reason about. I felt this during the development phase and I am still experiencing this today. When production issues surface, even after not looking at the code for months, I'm able to triage the problem quickly and with far less effort than has typically been required in the past.

However, I broke the rules in my Redux implementation. The sexiest part of Redux is that each reducer and each action creator is a "pure" function—one that operates only on its input and produces zero side effects. In my application, I needed a place to put reusable code that triggered state changes. This is the type of code that, in Redux, lives in action creators. In MVC, it's controller code. In my case though, this code was too complex to be constrained to a pure function. I was making API calls, I was calling other action methods; these were out of the scope of the beauty that is functional programming. So, my action creators weren't *returning* actions. My "action creators" were *dispatching* actions. (A note to Redux gurus: I know redux-thunk would have been a huge step in the direction of achieving pure functions, but I had one more constriction: developers on my team with zero JS experience, let alone React, Redux, Node, Enzyme, promises, ES6, Babel, Webpack, etc. At least some parts of the code had to look familiar to JS newcomers.) 

Given this behavior, these segments of code couldn't accurately be called action creators at all. They were more along the lines of action dispatchers, or some special type of controller. Hey! How about ControllerActions? Let's call them that. They are functions that resemble controllers, that also happen to dispatch actions to the Redux store.

Here's a basic example:

    class UserActions {
      static fetchUsers() {
        return axios.get('/users')
          .then((res) => {
            store.dispatch({
              type: SET_USERS,
              users: res.data
            });
            return res;
          })
          .catch((res) => {
            return Promise.reject(new Error('Error fetching users'));
          });      
      }
    }

Note that ControllerActions can be synchronous or asynchronous, since their only requirement is that they result in a call to `store.dispatch()`.

Let's talk M in MVC. Models have data and methods that operate on their data. In RCCA, ControllerActions perform the logic of model methods. Thus, models are now just data, i.e. plain objects. Perfect! Redux calls for a state tree that is composed of plain objects, arrays, and primitives. We now have exactly what we need for the store/reducer side of Redux.

Finally, the V in MVC. RCCA could have been called RVCA, but that abbreviation was taken by a clothing company. Just kidding, kind of. RCCA was the decision because it seems that much of the frontend world today has converged on the idea that component-based design is the preferred paradigm for building user interfaces. Having HTML embedded in Javascript, and not the other way around, has taught us new ways of leveraging the Javascript language. Additionally, placing event handlers and related code directly in a component (or sometimes its parent/ancestor) gives us an easy-to-follow and easy-to-test codebase. For these reasons, it seemed worthwhile to constrain "view" to "component".

There you have it! RCCA is a reasonable blend of two great software architectures. It maintains the functional beauty of Redux in its reducers, yet it allows for complex operations to take place in ControllerActions. Coupled with a component library like React or similar, this architecture provides powerful patterns that allow for rapid and reliable app development, all the while being more reminiscent of traditional MVC than true Redux.

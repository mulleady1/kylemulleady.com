---
title: "A palatable React-based toolkit for modern webapps"
date: 2016-07-30
slug: a-palatable-react-based-toolkit
legacy_id: 1
---

Anyone who's been involved in Javascript over the last few years has been through, and is sick of hearing about, *JS fatigue* and its successor, *JS fatigue fatigue*: people complaining about the people complaining about the explosion in number of JS libraries. Today, we accept that there's a huge number of Javascript tools to choose from, and slightly dread deciding which ones to use for our next project. This is an article about a curated set of tools, ideal for a 2016 web application, that has been meticulously hand-picked from the staggering number of technologies from which to choose.

The short version:

- React
- Redux
- Enzyme
- React Hot Loader
- ASP.NET Core

The long version follows.

**React**

React's implementation of component-based design is a thrill to work with. The lifecycle hooks, the props vs. state paradigm, the render() method's functional description of a component, the virtual DOM—this library offers quite a lot to leverage and enjoy working in. 

Component-based design in itself is a great choice for building user interfaces. As a project evolves, any given component may start to get unnecessarily complex, so we simply break it down into separate, simpler components and move on.

**Redux**

Web applications today maintain a lot of state. Their state can change at any moment. The old ways (e.g. MVC) dictate that application state lives in model objects and collections. MVC is a solid architecture, but state management gets overwhelming in large applications where any given model can be updated by any given controller at any given time. This situation can be difficult to debug and to reproduce production issues.

These days, we have Redux. Redux calls for a single state tree for your entire application, composed of plain objects and arrays, and managed by a single function per "branch". The tree gets updated by dispatching *actions* that tell it how and where to update its data. Actions can be designed such that each one is dispatched in a singular location of the application, which lets developers know exactly where a state change originated. This design allows for creating large systems that are dead simple to write, to debug, and to reproduce live issues.

**Enzyme**

Unit testing the UI used to be a pain. It got better with React. It got *way* better with Enzyme. Enzyme does two things for us. 1) It allows us to render our components in a headless environment (with some jsdom boilerplate), and 2) It provides an abundance of functions for interrogating the render output of the component under test. Included in these functions are event simulators, so all types of event handlers in the application are testable as well.

**React Hot Loader**

React Hot Loader is an awesome aid in the development process. Together with Webpack's Hot Module Replacement, RHL provides the ability to detect a save on the file you're working on, recompile the component, send it to the browser, and replace the old version of it in the app *without losing the state of the component*. Pretty amazing stuff. Forget the full-page refresh and the retracing of steps to get back to the state at which you left off. Those are a thing of the past.

**ASP.NET Core**

ASP.NET Core is a fresh and modern rewrite of Microsoft's original monolithic framework, and is a suitable backend for a React frontend. Core relies heavily on solid, testable design patterns like dependency injection and Options. It reached its 1.0 version this year and is available on Github. Having become open source has done wonders for .NET development—instead of relying on Microsoft's historically sub-par documentation, engineers can now look directly at the source code to discover features and functionality.

Core is a good backend choice because of its reliable customization of application configuration and startup. There is a surplus of extension methods for nearly everything developers could want to bolt on to their app. The extension method format makes Startup.cs just as easy to read as it is to write.

There's only one extra line of code required to use Core with RHL: enabling CORS in development mode so the RHL server can talk to the Kestrel server. (It's a nice convenience to have the two servers running on adjacent ports, e.g. 5000 and 5001.) In dev mode both servers are likely running on localhost, but still, different ports mean different origins. Also, if your app uses cookies make sure to set `{ withCredentials: true }` in the client for cookies work across the two ports.

That covers everything! We discussed how we can build a scalable frontend with React components and Redux state/data management. React components are easy to test with Airbnb's Enzyme library. It's worth mentioning testing Redux couldn't be simpler: with every reducer performing `(state, action) => nextState` this means we have zero side effects to worry about when testing reducers. React Hot Loader is a useful tool to improve efficiency in the development process. And finally, we talked about how and why ASP.NET Core is an exceptional choice for a server to support our React-based client.

These are my go-to technologies for the work I do for my clients. If you have a new project in the pipeline or an existing one that could use renovation, [contact me](/contact) and let's chat about your situation.

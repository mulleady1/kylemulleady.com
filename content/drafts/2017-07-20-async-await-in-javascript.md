---
title: "async/await in Javascript"
date: 2017-07-20
slug: async-await-in-javascript
legacy_id: 5
---

The aesthetics of Javascript code has never seen such a drastic improvement from a new language feature than it has from async/await. Server-side JS gets an even more significant facelift than browser code, since it's common for a single endpoint to perform multiple database interactions, all of which are asynchronous.

Without wasting any time, let's get to an example. A prime instance of this was a recent feature I wrote that involved cloning an object graph. Say you have a new customer and you want to get them started in your system. A complex application will typically involve a lot of boilerplate data for the new customer--a customer record; some users, groups, and permissions; maybe some routes and/or features of the app each user or group will have access to, etc. Older JS code would perform this clone by doing something like this:

```
app.post('/api/Customer/:id/clone', function(req, res) {
  Customer.find(req.query.id, function(err, customer) {
    var newCustomerData = customer.toJSON();
    delete newCustomerData.id;
    newCustomerData.name = req.body.name;
    Customer.create(newCustomerData, function(err, newCustomer) {
      Group.find({ where: { customerId: customer.id }}, function(err, groups) {
        var promises = groups.map(function(group) {
          return new Promise(function(resolve, reject) {
            var newGroupData = group.toJSON();
            delete newGroupData.id;
            newGroupData.customerId = newCustomer.id;
            Group.create(newGroupData, function(err, newGroup) {
              Permission.find({ where: { groupId: group.id }}, function(err, permissions) {
                var promises = permissions.map(function(permission) {
                  return new Promise(function(resolve, reject) {
                    var newPermissionData = permission.toJSON();
                    delete newPermissionData.id;
                    newPermissionData.groupId = newGroup.id;
                    Permission.create(newPermissionData, function(err, newPermission) {
                      resolve(newPermission);
                    });
                  });  
                });

                Promise.all(promises).then(resolve).catch(reject);
              });
            });  
          });  
        });

        Promise.all(promises).then(function() {
          res.sendStatus(200);
        }).catch(function() {
          res.sendStatus(500);
        });
      });
    });
  });
});
```

Callback hell, anyone? And that's just cloning three object types! And not doing error handling, parameter checking, etc.

Now, let's take a look at a more modern approach:

```
app.post('/api/Customer/:id/clone', async function(req, res) {
  try {
    const customer = await Customer.find(req.query.id);
    let newCustomerData = customer.toJSON();
    delete newCustomerData.id;
    newCustomerData.name = req.body.name;
    const newCustomer = await Customer.create(newCustomerData);
    const groups = await Group.find({ where: { customerId: customer.id }});
    const promises = groups.map(group => async () => {
      let newGroupData = group.toJSON();
      delete newGroupData.id;
      newGroupData.customerId = newCustomer.id;
      const newGroup = await Group.create(newGroupData);
      const permissions = await Permission.find({ where: { groupId: group.id }});
      const promises = permissions.map(permission => async () => {
        let newPermissionData = permission.toJSON();
        delete newPermissionData.id;
        newPermissionData.groupId = newGroup.id;
        const newPermission = await Permission.create(newPermissionData);
        return newPermission;
      });

      return await Promise.all(promises);
    });

    await Promise.all(promises);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});
```

Ten fewer lines and a max indentation level of 4 instead of 11. A decent improvement, no?

We can also add some code styling to perhaps make things a little more obvious:

```
app.post('/api/Customer/:id/clone', async function(req, res) {
  const cloneGroupAndPermissions = async (customerId, newCustomerId) => {
    const groups = await Group.find({ where: { customerId }});
    const promises = groups.map(group => async () => {
      let newGroupData = group.toJSON();
      delete newGroupData.id;
      newGroupData.customerId = newCustomerId;
      const newGroup = await Group.create(newGroupData);
      return await clonePermissions(group.id, newGroup.id);
    });

    return await Promise.all(promises);
  };

  const clonePermissions = async (groupId, newGroupId) => {
    const permissions = await Permission.find({ where: { groupId }});
    const promises = permissions.map(permission => async () => {
      let newPermissionData = permission.toJSON();
      delete newPermissionData.id;
      newPermissionData.groupId = newGroupId;
      const newPermission = await Permission.create(newPermissionData);
      return newPermission;
    });

    return await Promise.all(promises);
  };

  try {
    const customer = await Customer.find(req.query.id);
    let newCustomerData = customer.toJSON();
    delete newCustomerData.id;
    newCustomerData.name = req.body.name;
    const newCustomer = await Customer.create(newCustomerData);
    await Promise.all(cloneGroupAndPermissions(customer.id, newCustomer.id));
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});
```

In this fashion, we can break up the work of the endpoint into "tasks" for each clone operation. This works especially well with async/await because an async function implicitly returns a `Promise`, thus is well suited for asynchronous task-based work.

Frontend code gets a beauty-boost as well. A function that gets data over HTTP can now be a little as two lines of code:

```
function fetchCustomer(id) {
  const res = await axios.get(`/api/Customer/${id}`);
  return res.data;
}
```

Doing that in one line is left as an exercise for the reader.

As you can see, async/await makes our JS code much prettier, more concise, and more intuitive. It takes a little bit of time to grasp where to put the `async` keyword (with standard functions, fat-arrow functions, nested functions, etc.), but it becomes second nature in no time. [Drop me a line](/contact) if you need help with the different scenarios. Happy coding!

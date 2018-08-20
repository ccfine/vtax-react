### Use as an ordinary component with props:
```javascript
import { PermissibleRender } from 'Component';

...

render() {
  return (
    <PermissibleRender
      userPermissions={permissions}
      requiredPermissions={requiredPermissions}
      renderOtherwise={AnotherComponent} // optional
      oneperm // optional
    >
      <RestrictedComponent/>
    </PermissibleRender>
  );
}
```

Where:
* `userPermissions` is an **array** of permissions set for current user
* `requiredPermissions` is an **array** of required permissions
* `RestrictedComponent` is a component to render

There are also optional props available:
* `oneperm` - only one of required permissions will be necessary (boolean)
* `renderOtherwise` - another component to be rendered if the permissions do not match (the user isn't permitted).

### Usage as a Higher Order Component:

```javascript
import { Permissible } from 'Component';

...

function callbackFunction({ userPermissions, requiredPermissions }) {
  // do something
}

const RestrictedComponent = (
    <p>Restricted component</p>
);

const PermissibleComponent = Permissible(
  RestrictedComponent,
  userPermissions,
  requiredPermissions,
  callbackFunction,
  oneperm,
);

render() {
  <PermissibleComponent />
}
```

Where:
* `RestrictedComponent` is a **component** to render
* `userPermissions` is an **array** of permissions set for current user
* `requiredPermissions` is an **array** of required permissions

There are also optional props available:
* `oneperm` - **boolean** determining that only one of required permissions will be necessary instead of requiring all passed permissions (default)
* `renderOtherwise` - another **component** to be rendered if the permissions do not match (the user isn't permitted).

## Use cases

### Render component when permissions match:
```javascript
import { PermissibleRender } from 'Component';

...

render() {
  return (
    <PermissibleRender
      userPermissions={['ACCESS_DASHBOARD', 'ACCESS_ADMIN']}
      requiredPermissions={['ACCESS_DASHBOARD', 'ACCESS_ADMIN']}
    >
      <RestrictedComponent/>
    </PermissibleRender>
  );
}
```

```javascript
import { Permissible } from 'Component';

...

const PermissibleComponent = Permissible(
  RestrictedComponent,
  ['ACCESS_ADMIN', 'ACCESS_DASHBOARD'], // userPermissions
  ['ACCESS_ADMIN', 'ACCESS_DASHBOARD'], // requiredPermissions
  null, // no callback
  false, // all permissions have to match
);

render() {
  <PermissibleComponent />
}
```

### Render component when only one permission match:
```javascript
import { PermissibleRender } from 'Component';

...

render() {
  return (
    <PermissibleRender
      userPermissions={['ACCESS_ADMIN']}
      requiredPermissions={['ACCESS_DASHBOARD', 'ACCESS_ADMIN']}
      oneperm
    >
      <RestrictedComponent/>
    </PermissibleRender>
  );
}
```

```javascript
import { Permissible } from 'Component';

...

const PermissibleComponent = Permissible(
  RestrictedComponent,
  ['ACCESS_ADMIN'], // userPermissions
  ['ACCESS_ADMIN', 'ACCESS_DASHBOARD'], // requiredPermissions
  null, // no callback
  true, // one permission has to match
);

render() {
  <PermissibleComponent />
}
```

### Render another component when permission requirements aren't met:
```javascript
import { PermissibleRender } from 'Component';

...

const NotAlowedComponent = (
    <p>User not allowed.</p>
);

render() {
  return (
    <PermissibleRender
      userPermissions={['ACCESS_DASHBOARD']}
      requiredPermissions={['ACCESS_ADMIN']}
      renderOtherwise={NotAllowedComponent}
    >
      <RestrictedComponent/>
    </PermissibleRender>
  );
}
```

### Run callback function when permission requirements aren't met:
```javascript
import { Permissible } from 'Component';

...

function callbackFunction({ userPermissions, requiredPermissions }) {
  console.log('Permissions do not match');
}

const PermissibleComponent = Permissible(
  RestrictedComponent,
  ['ACCESS_DASHBOARD'], // userPermissions
  ['ACCESS_ADMIN'], // requiredPermissions
  callbackFunction, // no callback
  false, // all permissions have to match
);

render() {
  <PermissibleComponent />
}
```

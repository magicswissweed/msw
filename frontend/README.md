# Frontend

## Service

We are using a service to manage the currently displayed locations (-> LocationsService.ts).

There are several advantages for this approach:

1. Single source of truth.
    - The service always holds the current state.
    - If we want to read the locations we can fetch them from here.
    - If we want to change the locations we change them through the service
        - The service then propagates the changes to its subscribers.
2. We can change the locations (which are set from a parent component) from inside a child-component.
    - For example after adding a spot, we can tell the service to refetch the current locations.
3. With this approach we don't need page reloads if the spots changed.
    - Instead, we can use the react-mechanisms to propagate the spots after fetching them.

If there are other blobs of data in the future, using a service is recommended.

## Calls to backend

### Unauthenticated Calls

For unauthenticated calls, we can just use the generated api (here: SpotsApi)

```typescript
new SpotsApi().getPublicSpots()
    .then(this.writeSpotsToState);
```

### Authenticated Calls

For authenticated calls we have to add the users token to the request.
We can do that by adding the token to a configuration and then handing the configuration over to the generated Api.

```typescript
let config = await authConfiguration(token);
new SpotsApi(config).getAllSpots()
    .then(this.writeSpotsToState);
```


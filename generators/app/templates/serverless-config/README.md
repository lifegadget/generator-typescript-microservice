# Serverless Config

This directory is used to configure your serverless deployment. As part of the build process (aka, `/scripts/build.ts`) your master `serverless.yml` file will be composed from the various files contained here. For that reason it is best **not** to directly modify the `serverless.yml` file directly.

## Sections

- **Provider**

  The provider section lets you setup the AWS profile/project you're going to use, specify your default region, and add permissions where needed for your lambda functions. This section tends not to be too large so it typically is just defined in `serverless-config/provider.ts` but can be further decomposed in it's own directory if that's appropriate.

- **Functions**

  This is probably the most import section and will define all the functions in your project. In smaller projects you may decide to define all of these functions in a single `serverless-config/functions.ts` file
  but often further decomposition is desirable so the directory configuration is the default.

  In general it recommended that you define functions at the root level:

  ```typescript
  import { IServerlessFunction, IDictionary } from 'common-types';
  const myFunction: IServerlessFunction = {
    description: "Do incredible things in a non-descript, almost abstract way",
    handler: "lib/handlers/myFunc.handler",
    environment: "${file(env.yml):${self:custom.stage}}",
    timeout: 10,
    memorySize: 1024,
    package: {
      exclude: [...standardExclusions]
    }
  }

  const myOtherFunction: IServerlessFunction = { ... }
  ```

  And then once you've defined your functions you will need to export a dictionary of functions as your default export:

  ```typescript
  const functions: IDictionary<IServerlessFunction> = {
    myFunction,
    myOtherFunction
  };

  export default functions;
  ```


- **Step Functions**

  Obviously not all projects will use step functions but for those that do you can see this as a corralary to the functions definition but for your state machines.


## Serverless Typings

All the _typings_ for serverless functions come from the `common-types` library and can be found here: [typings](https://github.com/lifegadget/common-types/blob/master/src/serverless.ts). The library is **tiny** (almost all just typings) but it is exported as both CommonJS and ES2015 so you should be able to import just the named exports that you're using and tree-shaking will exclude the rest (if you're into that kind of stuff ... arguably in this case it's worth saving a few bytes but heyho).


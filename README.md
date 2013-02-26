# coffee-cache

Caches the contents of required CoffeeScript files so that they are not
recompiled to help improve startup time.

## What it does

In a Node.js application written in CoffeeScript, every time you start the
application, all the relevant files must be compiled when they are required. If
you have a very large application, this process can consume a large portion of
your startup time. By caching the compiled JavaScript files, only those that
have been updated must be recompiled, and the rest can be loaded off of the
disk. In our usage, this has reduced the startup time from 7s to 2s, which means
a lot when you have to restart your application every time you want to test a
change.

## How to use

1. Add to your package.json dependencies and run `npm install` or run `npm install coffee-cache`.

2.  In your entry point file, add the following:

    ```coffee
    require('coffee-cache')
    ```

3. That's it.

## Extra configuration

You can specify the location of the directory to use for the cached files in one
of two ways:

1. Start the process with the `COFFEE_CACHE_DIR` variable set:

    ```sh
    $ COFFEE_CACHE_DIR=/tmp/coffee-cache coffee app.coffee
    ```

2. Use the `setCacheDir` method on the required module:

    ```coffee
    require('coffee-cache').setCacheDir('../cached/')
    ```

Just make sure your process has permission to create the necessary folder or
files.

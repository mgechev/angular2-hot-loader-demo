# WIP

**Note that the project is in very early stage of development. It is still not ready for usage but you can give it a try and share your feedback.**

# Angular2 Hot Loader

Hot loader for Angular 2, inspired by [react-hot-loader](https://github.com/gaearon/react-hot-loader).

[![](http://s12.postimg.org/49uakspe5/Screen_Shot_2015_10_26_at_01_50_48.png)](https://www.youtube.com/watch?v=S9pKbi3WrCM)

## How to use?

The hot loader is in early stage of development, the `angular2-hot-loader` module is still not published on npm but you can try demo based on [angular2-seed](https://github.com/mgechev/angular2-seed) by:

```bash
git clone https://github.com/mgechev/angular2-hot-loader
cd angular2-hot-loader
npm install
node server.js
```

In another terminal session run:

```bash
npm start
```

Now on each edit the changes should be pushed to the client.

## Features

- Add new methods to existing components
- Support changes of external and inline templates
- Allow adding inputs and outputs (events and properties) to the components

## Limitations

- Does not push changes in services & pipes
- Does not update component's constructor

# License

MIT


import {LifeCycle, platformCommon, ViewMetadata, bootstrap, OnDestroy, DynamicComponentLoader, ApplicationRef, AppViewManager, View, ChangeDetectionStrategy, Type, DirectiveMetadata, ComponentMetadata, Directive, ChangeDetectorRef, Component, CORE_DIRECTIVES} from 'angular2/angular2';
import {RouteConfig} from 'angular2/router';
import {TemplateParser} from 'angular2/src/core/compiler/template_parser';
import {Renderer} from 'angular2/render';
import {TemplateCompiler} from 'angular2/src/core/compiler/compiler';
import {ChangeDetectionCompiler} from 'angular2/src/core/compiler/change_detector_compiler';
import {ViewResolver} from 'angular2/src/core/linker/view_resolver';
import {AppProtoView, AppView, ViewType} from 'angular2/src/core/linker/view';
import {RuntimeMetadataResolver} from 'angular2/src/core/compiler/runtime_metadata';
import {internalView} from 'angular2/src/core/linker/view_ref';

let compiler: TemplateCompiler;
let resolver: ViewResolver;
let app: ApplicationRef;
let loader: DynamicComponentLoader;
let runtimeResolver: RuntimeMetadataResolver;
let AppCmp: Type;
let lc: LifeCycle;
let cdInterval;

var ComponentProxy = function (component: Type) {

  let current;

  function updatePrototype(component, current) {
    let currentProto = current.prototype;
    let newProto = component.prototype;
    Object.getOwnPropertyNames(newProto).forEach(name => {
      currentProto[name] = newProto[name];
    });
  }

  function updateMetadata(component, current) {
    let keys = Reflect.getMetadataKeys(component);
    keys.forEach(key => {
      let val = Reflect.getMetadata(key, component);
      Reflect.defineMetadata(key, val, current);
    });
  }

  function update(component: Type) {
    if (!current) {
      current = component;
      return;
    }
    if (Reflect.hasMetadata('__proxy__', component)) {
      return update(Reflect.getMetadata('__proxy__', component));
    }
    updatePrototype(component, current);
    updateMetadata(component, current);
    let annotations = Reflect.getMetadata('annotations', component);
    let isComponent = false;
    let template;
    annotations.forEach(a => {
      if (a instanceof ComponentMetadata) {
        template = a.template;
        isComponent = true;
        return;
      }
    });
    if (isComponent) {
      console.log('Patching components');
      compiler.clearCache();
      resolver._cache = new Map();
      runtimeResolver._cache = new Map();
      let visited;
      function runChangeDetection(view: AppView) {
        if (visited.has(view)) {
          return;
        }
        visited.set(view, true);
        view.changeDetector.detectChanges();
        view.views.forEach(runChangeDetection);
      }
      loader.loadAsRoot(AppCmp, null, app.injector)
      .then(ref => {
        console.log('View patched');
        console.log('Running change detection');
        console.log('-------------------------');
        clearInterval(cdInterval);
        cdInterval = setInterval(_ => {
          let view = internalView(ref.hostView);
          visited = new Map();
          runChangeDetection(view);
        }, 100);
        // let cd = internalView(ref.hostView).changeDetector;
        // lc = ref.injector.get(LifeCycle);
        // lc.registerWith(this._zone, cd);
        // lc.tick();
        // cd.markForCheck();
      });
    }
  }

  function get() {
    return component;
  }

  update(component);

  return { update, get };
};

let proxies = new Map<string, any>();

function proxyDirectives(current: Type | any[]) {
  if (current instanceof Array) {
    current.forEach(proxyDirectives);
  }
  let metadata = Reflect.getMetadata('annotations', current);
  proxies.set(current.name, ComponentProxy(current));
  if (!metadata) return;
  metadata.forEach(current => {
    if ((current instanceof ComponentMetadata || current instanceof ViewMetadata) &&
     current.directives instanceof Array) {
      current.directives.forEach(proxyDirectives);
    }
    if (current.constructor && current.constructor.name === 'RouteConfig') {
      current.configs.map(c => c.component).forEach(proxyDirectives);
    }
  });
}

function connect(url) {
  return new Promise<WebSocket>((resolve, reject) => {
    var ws = new WebSocket(url);
    ws.onopen = function (e) {
      resolve(ws);
    };
  });
}

function reconnect(url) {
  let interval = setInterval(_ => {
    connect(url)
    .then(ws => {
      clearInterval(interval);
      initialize(url);
    });
  }, 3000);
}

let url = 'ws://localhost:5544';
function initialize(url) {
  connect(url)
  .then(ws => {
    let interval = undefined;
    ws.onmessage = function (e) {
      let data = JSON.parse(e.data);
      try {
        let ctx = { exports: {} }
        with (ctx) {
          eval(data.content);
        }
        for (let ex in ctx.exports) {
          if (proxies.has(ex)) {
            proxies.get(ex).update(ctx.exports[ex]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    ws.onclose = reconnect.bind(null, url);
  });
}

export var hotLoaderBootstrap = function (cmp: Type, bindings: any[]) {
  AppCmp = cmp;

  proxyDirectives(cmp);
  initialize(url);
  bootstrap(cmp, bindings);

  let currentApp = platformCommon()._applications[0];

  compiler = currentApp.injector.get(TemplateCompiler);
  resolver = currentApp.injector.get(ViewResolver);
  app = currentApp.injector.get(ApplicationRef);
  loader = currentApp.injector.get(DynamicComponentLoader);
  runtimeResolver = currentApp.injector.get(RuntimeMetadataResolver);
  lc = currentApp.injector.get(LifeCycle);
};

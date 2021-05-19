import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {isolate} from '@cycle/isolate';
import {restart, restartable} from 'cycle-restart';
import App from './root';
import {makeWadDriver} from './drivers/wad-driver';

const drivers = {
  DOM: restartable(makeDOMDriver('#root'), {pauseSinksWhileReplaying: false}),
  Wad: makeWadDriver()
}; //aqui ele define quais os drivers (componentes observados)

const {sinks, sources} = run(App, drivers); ///main recebe uma coleção de "source" Observables (dos drivers) como entrada, e pode passar uma coleção de "sink"  aos drivers, formando
//uma conexão circular 

if (module.hot) { //serve para atualizar um componente sem precisar recarregar toda a página e sim apenas aquele que foi alterado
  module.hot.accept('./root', () => {
    const app = require('./root' ).default;
    restart(app, drivers, {sinks, sources}, isolate);
  });
}

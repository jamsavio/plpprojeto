import {Observable} from 'rx'
import {button, div} from '@cycle/dom'
import Timer from '../components/Timer'
import Stages from '../components/Stages'

const renderButtons = state => {
  let pomodoroTime = (state.pomodoroTotal == state.breakTotal);
  let breakTime = (state.pomodoroTotal > state.breakTotal);
  let stop = (state.actual != 'inactive') ? button('#stopPomodoro', {className: 'btn'}, 'PARAR') : div();
  let startPomodoro = (pomodoroTime && state.actual == 'inactive') ? button('#startPomodoro', {className: 'btn'}, 'INICIAR POMODORO') : div();
  let startShortBreak = (breakTime && state.pomodoroTotal < 4 && state.actual == 'inactive') ? button('#startShortBreak', {className: 'btn'}, 'PAUSA CURTA') : div();
  let startLongBreak = (breakTime && state.pomodoroTotal == 4  && state.actual == 'inactive') ? button('#startLongBreak', {className: 'btn'}, 'PAUSA LONGA') : div();
  
  return (
    div('.control-btns', [
      stop,
      startPomodoro,
      startShortBreak,
      startLongBreak
    ])
  )
}

export const view = state$ => {
  const timer = Timer(state$)
  const stages = Stages(state$.pluck('pomodoroTotal'))
  const render = (state, timerDOM, stagesDOM) =>
    div('.pomocycle', [
      timerDOM,
      stagesDOM,
      renderButtons(state)
    ])
  return Observable
    .combineLatest(state$, timer.DOM, stages.DOM, render)
}

import { atomizify, flagify } from 'atomizify'

// const classes = atomizify({
atomizify({
  custom_classes: {
    lh60: 'line-height: 61px',
    lh45: 'line-height: 45px',
    clamp: `display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;`,
    clamp2: '-webkit-line-clamp: 2',
    clamp1: '-webkit-line-clamp: 1',
    ml_command: 'margin-left: -120px',
    t_40: 'top: -40px',
    r25: 'right: 25px',
  },
})

// console.log(classes)

export const { Component, Div, Span } = flagify()

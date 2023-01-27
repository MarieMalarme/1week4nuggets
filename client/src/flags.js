import { atomizify, flagify } from 'atomizify'

// const classes = atomizify({
atomizify({
  custom_classes: {
    lh45: 'line-height: 45px',
    clamp: `display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;`,
    clamp2: '-webkit-line-clamp: 2',
    clamp1: '-webkit-line-clamp: 1',
    b_rad: 'border-radius: 30px 0 0 30px',
    pb7: 'padding-bottom: 7px',
  },
})

export const { Component, Div, Span } = flagify()

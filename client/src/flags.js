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
    pt2: 'padding-top: 2px',
    pv4: 'padding: 3px 0',
    ml18: 'margin-left: 18px',
  },
})

export const { Component, Div, Span } = flagify()

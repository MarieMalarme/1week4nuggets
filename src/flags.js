import { atomizify, flagify } from 'atomizify'

atomizify({
  custom_classes: {
    lh60: 'line-height: 61px',
    clamp: `display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;`,
    clamp2: `-webkit-line-clamp: 2`,
    clamp1: `-webkit-line-clamp: 1`,
    ml_command: `margin-left: -120px`,
  },
})

export const { Component, Div, Span } = flagify()

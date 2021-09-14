import { useState, useEffect } from 'react'
import { Component } from './flags'

export const UpdateBanner = ({ last_update }) => {
  const [visible, set_visible] = useState(false)

  useEffect(() => {
    set_visible(last_update)
    clearTimeout(timeout_id)
    timeout_id = setTimeout(() => set_visible(false), 2500)
  }, [last_update])

  return (
    <Banner hidden={!visible} t100={visible} o100={visible}>
      <Date>{last_update?.date?.toString().split('GMT')[0]}</Date>
      <br />
      {last_update?.event}
    </Banner>
  )
}

let timeout_id

const Banner =
  Component.zi1.w35p.anim_all.grey8.fixed.o0.t80.r20.text_right.ph10.pv5.fs30.div()
const Date = Component.o30.span()

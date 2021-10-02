import { useState, useEffect } from 'react'
import { Component } from './flags'

export const UpdateBanner = ({ last_update }) => {
  const [visible, set_visible] = useState(false)

  useEffect(() => {
    set_visible(last_update)
    clearTimeout(timeout_id)
    timeout_id = setTimeout(() => set_visible(false), 3000)
  }, [last_update])

  return (
    <Banner hidden={!visible} o90={visible}>
      <Event>{last_update?.event}</Event>
      <Date>{last_update?.date?.toString().split('GMT')[0]}</Date>
    </Banner>
  )
}

let timeout_id

const Banner =
  Component.bg_white.zi1.anim_all.grey8.fixed.o0.t70.r0.pl20.pr15.pt10.pb7.text_right.b_rad.fs13.lh17.div()
const Event = Component.mr10.span()
const Date = Component.o50.span()

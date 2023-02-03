import { Component } from './flags'

export const CloseIcon = ({ close, fixed }) => (
  <CloseWrapper absolute={!fixed} fixed={fixed} onClick={close}>
    ✕ Esc
  </CloseWrapper>
)

export const CloseWrapper =
  Component.pa5.t20.r20.wm_v_rl.text_upright.ls2.fs10.uppercase.c_pointer.div()

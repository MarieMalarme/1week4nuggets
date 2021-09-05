import { Component } from './flags'

export const NewWeekButton = () => {
  return (
    <Wrapper>
      <Button>+</Button>
    </Wrapper>
  )
}

const Wrapper = Component.absolute.b150.w100p.flex.jc_center.div()
const Button =
  Component.ba0.ol_none.bg_white.w60.h60.b_rad50p.fs30.c_pointer.button()

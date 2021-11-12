import { color_harmonies } from './Home'
import { Component } from './flags'

export const Mobile = () => (
  <Wrapper>
    <One
      style={{
        background: color_harmonies[0].visual.background,
        color: color_harmonies[0].visual.color,
      }}
    >
      1 week, 4 nuggets
      <br />
      Weekly index for creative inspirations
    </One>
    <Two>Stay tuned...</Two>
    <Three style={{ background: color_harmonies[0].dates.background }}>
      <Link
        target="_blank"
        href="https://kikoo-playground.studiodev.xyz/"
        style={{
          color: color_harmonies[0].dates.color,
          borderColor: color_harmonies[0].dates.color,
        }}
      >
        Meanwhile, check this out!
      </Link>
    </Three>
    <Four
      style={{
        background: color_harmonies[0].navigation.background,
        color: color_harmonies[0].navigation.color,
      }}
    >
      Mobile version coming soon!
    </Four>
  </Wrapper>
)

const Wrapper = Component.flex.flex_column.fixed.t0.l0.w100vw.h100vh.section()
const One = Component.pa50.div()
const Two = Component.fs30.pa50.div()
const Three = Component.fs17.ph50.pv15.span()
const Four = Component.fs30.pa50.flex1.flex.flex_column.jc_between.div()
const Link = Component.bb.text_dec_none.a()

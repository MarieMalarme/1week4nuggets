import { Component } from './flags'
import { get_nugget_id } from './data'
import { NuggetImage } from './NuggetImage'

export const VisualSection = ({ week, selected_nugget_index, ...props }) => {
  const nugget = week.nuggets.find((nugget) => {
    return Number(nugget.id) === get_nugget_id(week.id, selected_nugget_index)
  })

  return nugget ? (
    <NuggetImage nugget={nugget} week={week} {...props} />
  ) : (
    <Presentation style={{ background: week.color_harmonies.work.background }}>
      <Title>1 week, 4 nuggets</Title>
      <Subtitle>Weekly index for creative inspirations</Subtitle>
    </Presentation>
  )
}

const Presentation = Component.white.ph35.pv30.h100p.w100p.flex1.section()
const Title = Component.fw200.fs13.h1()
const Subtitle = Component.mt5.fw200.fs13.h2()

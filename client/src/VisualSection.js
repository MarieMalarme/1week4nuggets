import { Component } from './flags'
import { get_nugget_id, nuggets_types } from './data'
import { NuggetImage } from './NuggetImage'

export const VisualSection = ({ week, selected_nugget_index, ...props }) => {
  const { background } = week.color_harmonies.visual

  // check if the nugget already exists - if not, create a default nugget object with id & type
  const selected_nugget_id = get_nugget_id(week.id, selected_nugget_index)
  const selected_nugget = week.nuggets.find(
    (nugget) => Number(nugget.id) === selected_nugget_id,
  ) || { id: selected_nugget_id, type: nuggets_types[selected_nugget_index] }

  return selected_nugget_id ? (
    <NuggetImage nugget={selected_nugget} week={week} {...props} />
  ) : (
    <Presentation style={{ background }}>
      <Title>1 week, 4 nuggets</Title>
      <Subtitle>Weekly index for creative inspirations</Subtitle>
    </Presentation>
  )
}

const Presentation = Component.white.ph35.pv30.h100p.w100p.flex1.section()
const Title = Component.fw200.fs13.h1()
const Subtitle = Component.mt5.fw200.fs13.h2()

import { Fragment, useState } from 'react'
import { Component, Span } from './flags'
import { EditableText } from './EditableText'

export const WeekNuggets = ({ week, ...props }) => {
  const nuggets = Object.entries(week.nuggets)

  return (
    <Nuggets>
      {nuggets.map(([type, content], index) => (
        <Nugget
          key={type}
          type={type}
          index={index}
          nuggets={nuggets}
          content={content}
          {...props}
        />
      ))}
    </Nuggets>
  )
}

const Nugget = ({ nuggets, type, content, index, ...props }) => {
  const { name, subtype, subtitle, description, participants } = content

  const { hovered_nugget, set_hovered_nugget } = props
  const { selected_nugget, set_selected_nugget } = props
  const { is_signed_in, set_is_editing, set_last_update } = props

  const is_hovered = hovered_nugget === type
  const is_selected = selected_nugget === type
  const is_not_selected_one = selected_nugget && !is_selected

  const states = { is_selected, is_signed_in, set_is_editing, set_last_update }

  const clear_selected_nugget = () => set_selected_nugget(null)

  return (
    <Container
      key={`nugget-${type}`}
      onMouseOver={() => set_hovered_nugget(type)}
      onClick={() => !is_selected && set_selected_nugget(type)}
      c_pointer={!selected_nugget || !is_selected}
      pv30={!selected_nugget || is_selected}
      bg_grey9={is_hovered && !is_selected}
      white={is_hovered && !is_selected}
      bb={index !== nuggets.length - 1}
      ai_center={is_not_selected_one}
      h5p={is_not_selected_one}
      h25p={!selected_nugget}
      h85p={is_selected}
    >
      {is_selected && <Close onClick={clear_selected_nugget}>✕ Esc</Close>}
      <Tag mt15={!selected_nugget || is_selected}>— {subtype || type}</Tag>
      <Content h100p={is_selected}>
        <EditableText
          initial_value={name}
          row={content.row}
          column="name"
          states={states}
          fs50={!selected_nugget || is_selected}
          fs15={is_not_selected_one}
          clamp={!is_selected}
          clamp2={!is_selected}
          clamp1={is_not_selected_one}
          bg_grey9={is_selected && is_hovered}
          white={is_selected && is_hovered}
          bw2={is_selected && !is_hovered}
          bb={is_selected && !is_hovered}
          bg_white={is_selected && !is_hovered}
          grey9={is_selected && !is_hovered}
        />
        {is_selected && (
          <Fragment>
            <EditableText
              initial_value={subtitle}
              row={content.row}
              column="subtitle"
              states={states}
            />
            <Participants participants={participants} subtype={subtype} />
            <EditableText
              initial_value={description}
              row={content.row}
              column="description"
              states={states}
            />
          </Fragment>
        )}
      </Content>
    </Container>
  )
}

const Participants = ({ participants, subtype }) => {
  const [is_hovered, set_is_hovered] = useState(false)
  if (!participants || !participants.length) return null
  const label = participants_types[subtype]

  return (
    <List
      onMouseOver={() => set_is_hovered(true)}
      onMouseLeave={() => set_is_hovered(false)}
    >
      <Heading>{label}:</Heading>
      {participants.split('\n').map((participant, index) => (
        <Span key={`${label}-${index}`}>
          {index > 0 && <Separator>✽</Separator>}
          {participant}
        </Span>
      ))}
      {is_hovered && <AddButton>+ Add</AddButton>}
    </List>
  )
}

const participants_types = {
  talk: 'speakers',
  project: 'artists',
  exhibition: 'artists',
  book: 'authors',
  quote: 'authors',
}

const Nuggets = Component.w55p.flex.flex_column.div()
const Close =
  Component.pa5.absolute.t20.r20.wm_v_rl.text_upright.ls2.fs10.uppercase.c_pointer.div()
const Container = Component.anim_height.relative.ph30.flex.ai_flex_start.div()
const Content = Component.w100p.flex.flex_column.mr100.div()
const Tag = Component.flex_shrink0.w100.uppercase.mr30.ls2.fs10.span()
const List = Component.fs13.flex.mb30.div()
const AddButton = Component.c_pointer.ml30.grey4.uppercase.ls2.fs10.div()
const Heading = Component.capitalize.bb.mr30.span()
const Separator = Component.mh20.span()

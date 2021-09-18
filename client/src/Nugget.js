import { Fragment } from 'react'
import { Component } from './flags'
import { EditableText } from './EditableText'

export const Nugget = ({ nuggets, type, content, index, font, ...props }) => {
  const { name, subtype, subtitle, date } = content
  const { description, participants, row } = content

  const { hovered_nugget, set_hovered_nugget } = props
  const { selected_nugget, set_selected_nugget } = props
  const { is_signed_in, set_is_editing, set_last_update } = props
  const { nuggets_sheet_columns } = props

  const is_hovered = hovered_nugget === type
  const is_selected = selected_nugget === type
  const is_not_selected_one = selected_nugget && !is_selected

  const variables = { is_selected, is_signed_in, nuggets_sheet_columns }
  const functions = { set_last_update, set_is_editing }
  const states = { variables, functions }

  const clear_selected_nugget = () => set_selected_nugget(null)

  return (
    <Wrapper
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
      {is_selected && (
        <CloseIcon onClick={clear_selected_nugget}>✕ Esc</CloseIcon>
      )}
      <SideNotes mt15={!selected_nugget || is_selected}>
        <Tag>— {subtype || type}</Tag>
        {is_selected && (
          <EditableText
            initial_value={date}
            row={row}
            column="date"
            states={states}
          />
        )}
      </SideNotes>
      <Content h100p={is_selected}>
        <EditableText
          initial_value={name}
          row={row}
          column="name"
          states={states}
          clamp={!is_selected}
          clamp2={!is_selected}
          clamp1={is_not_selected_one}
          bg_grey9={is_selected && is_hovered}
          white={is_selected && is_hovered}
          grey9={is_selected && !is_hovered}
          bw2={is_selected && !is_hovered}
          bb={is_selected && !is_hovered}
          style={{
            fontFamily: font.name,
            fontSize: ((!selected_nugget || is_selected) && font.size) || 15,
            lineHeight: `${font.line_height}px`,
          }}
        />
        {is_selected && (
          <Fragment>
            <EditableText
              initial_value={subtitle}
              row={row}
              column="subtitle"
              states={states}
            />
            <Participants
              participants={participants}
              subtype={subtype}
              row={row}
              states={states}
            />
            <EditableText
              initial_value={description}
              row={row}
              column="description"
              states={states}
            />
          </Fragment>
        )}
      </Content>
    </Wrapper>
  )
}

const Participants = ({ participants, subtype, row, states }) => {
  if (!participants || !participants.length) return null
  const label = participants_types[subtype]

  return (
    <List>
      <Heading>{label}:</Heading>
      <EditableText
        initial_value={participants}
        row={row}
        column="participants"
        states={states}
      />
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

const CloseIcon =
  Component.pa5.absolute.t20.r20.wm_v_rl.text_upright.ls2.fs10.uppercase.c_pointer.div()
const Wrapper = Component.relative.ph30.flex.ai_flex_start.div()
const Content = Component.w100p.flex.flex_column.mr100.div()
const SideNotes = Component.flex.flex_column.flex_shrink0.w100.mr30.w100.div()
const Tag = Component.uppercase.ls2.fs10.span()
const List = Component.fs13.mb30.flex.ai_flex_start.div()
const Heading = Component.capitalize.bb.mr30.span()

import { Fragment } from 'react'
import { Component } from './flags'
import { get_nugget_id, update_nugget_cell } from './data'
import { update_indexes } from './toolbox'
import { EditableText } from './EditableText'
import { Hyperlink } from './Hyperlink'

export const Nugget = ({ nuggets, content, index, ...props }) => {
  const { name, subtitle, date, link, type } = content
  const { description, participants, row } = content

  const { hovered_nugget_index, set_hovered_nugget_index } = props
  const { selected_nugget_index, set_selected_nugget_index } = props
  const { is_signed_in, set_is_editing, set_last_update } = props
  const { nuggets_sheet_coords, week_id, font } = props

  const id = content.id || get_nugget_id(week_id, index)
  const is_hovered = hovered_nugget_index === index
  const is_selected = selected_nugget_index === index
  const no_selected_nugget = selected_nugget_index === null
  const is_not_selected_one = selected_nugget_index !== null && !is_selected

  const variables = { is_selected, is_signed_in, nuggets_sheet_coords }
  const functions = { set_last_update, set_is_editing }
  const states = { variables, functions, week_id, type, id }

  const clear_selected_nugget_index = () => set_selected_nugget_index(null)

  const update_nugget_type = () => {
    if (!is_selected) return
    const nuggets_types = Object.keys(participants_types)
    const type_index = nuggets_types.indexOf(type)
    const { next_index } = update_indexes(type_index, nuggets_types.length)
    update_nugget_cell({
      new_value: nuggets_types[next_index],
      type: nuggets_types[next_index],
      nuggets_sheet_coords,
      set_last_update,
      column: 'type',
      week_id,
      row,
      id,
    })
  }

  return (
    <Wrapper
      key={`nugget-${type}`}
      onMouseOver={() => set_hovered_nugget_index(index)}
      onClick={() => !is_selected && set_selected_nugget_index(index)}
      c_pointer={no_selected_nugget || !is_selected}
      pv30={no_selected_nugget || is_selected}
      bg_grey9={is_hovered && !is_selected}
      white={is_hovered && !is_selected}
      bb={index !== nuggets.length - 1}
      ai_center={is_not_selected_one}
      h5p={is_not_selected_one}
      h25p={no_selected_nugget}
      h85p={is_selected}
    >
      {is_selected && (
        <CloseIcon onClick={clear_selected_nugget_index}>✕ Esc</CloseIcon>
      )}
      <SideNotes h100p={is_selected} pt15={no_selected_nugget || is_selected}>
        <Tag c_pointer={is_selected} onClick={update_nugget_type}>
          — {type}
        </Tag>
        {is_selected && (
          <Fragment>
            <EditableText
              initial_value={date}
              row={row}
              column="date"
              states={states}
            />
            <Hyperlink link={link} row={row} states={states} />
          </Fragment>
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
            fontSize: ((no_selected_nugget || is_selected) && font.size) || 15,
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
              type={type}
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

const Participants = ({ participants, type, row, states }) => {
  const label = participants_types[type]

  if (!participants) return null

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
  event: 'speakers',
  show: 'artists',
}

const CloseIcon =
  Component.pa5.absolute.t20.r20.wm_v_rl.text_upright.ls2.fs10.uppercase.c_pointer.div()
const Wrapper = Component.relative.ph30.flex.ai_flex_start.div()
const Content = Component.w100p.flex.flex_column.mr100.div()
const SideNotes =
  Component.relative.flex.flex_column.ai_flex_start.flex_shrink0.w100.mr30.w100.div()
const Tag = Component.uppercase.ls2.fs10.span()
const List = Component.fs13.mt40.flex.ai_flex_start.div()
const Heading = Component.capitalize.bb.mr30.span()

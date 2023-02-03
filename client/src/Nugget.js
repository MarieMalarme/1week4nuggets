import { Fragment, useState } from 'react'
import { Component } from './flags'
import { get_nugget_id, update_nugget_cell } from './data'
import { CloseIcon } from './components'
import { EditableText } from './EditableText'
import { Hyperlink } from './Hyperlink'

export const Nugget = ({ nuggets, nugget, index, ...props }) => {
  const { name, subtitle, date, link, type, topic } = nugget
  const { description, participants, row } = nugget

  const { hovered_nugget_index, set_hovered_nugget_index } = props
  const { selected_nugget, set_selected_nugget } = props
  const { is_signed_in, set_is_editing, set_last_update } = props
  const { nuggets_sheet_coords, week_id, font } = props

  const id = nugget.id || get_nugget_id(week_id, index)
  const is_hovered = hovered_nugget_index === index
  const matches_id = selected_nugget?.id === id
  const matches_index = selected_nugget?.index === index
  const is_selected = matches_id || matches_index
  const no_selected_nugget = selected_nugget === null
  const is_not_selected_one = selected_nugget && !is_selected

  const variables = { is_selected, is_signed_in, nuggets_sheet_coords }
  const functions = { set_last_update, set_is_editing }
  const states = { variables, functions, week_id, type, topic, id }

  const clear_selected_nugget_index = () => set_selected_nugget(null)

  const update_nugget_tag = (new_value, tag_type) => {
    if (!is_selected) return
    update_nugget_cell({
      id,
      row,
      week_id,
      new_value,
      nuggets_sheet_coords,
      set_last_update,
      column: tag_type,
    })
  }

  return (
    <Wrapper
      key={`nugget-${type}`}
      onMouseOver={() => set_hovered_nugget_index(index)}
      onClick={() => !is_selected && set_selected_nugget({ index: index })}
      c_pointer={no_selected_nugget || !is_selected}
      pv30={no_selected_nugget || is_selected}
      bg_grey9={is_hovered && !is_selected}
      white={is_hovered && !is_selected}
      bb={index !== nuggets.length}
      ai_center={is_not_selected_one}
      h5p={is_not_selected_one}
      h25p={no_selected_nugget}
      h85p={is_selected}
    >
      {is_selected && <CloseIcon close={clear_selected_nugget_index} />}
      <SideNotes h100p={is_selected} pt15={no_selected_nugget || is_selected}>
        <Tags>
          <TagSelect
            tag_type="type"
            current_tag={type}
            tags={nuggets_types}
            is_selected={is_selected}
            update_nugget_tag={update_nugget_tag}
          />
          {!is_not_selected_one && (
            <TagSelect
              tag_type="topic"
              current_tag={topic}
              tags={nuggets_topics}
              is_selected={is_selected}
              update_nugget_tag={update_nugget_tag}
            />
          )}
        </Tags>
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
          row={row}
          column="name"
          states={states}
          initial_value={name}
          grey4={!name}
          b_grey4={!name}
          clamp={!is_selected}
          clamp2={!is_selected}
          clamp1={is_not_selected_one}
          bg_grey9={is_selected && is_hovered}
          white={is_selected && is_hovered}
          grey9={is_selected && !is_hovered}
          b_white={is_selected && is_hovered}
          bw2={is_selected}
          bb={is_selected}
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

const TagSelect = ({ tags, tag_type, current_tag, ...props }) => {
  const [is_open, set_is_open] = useState(false)
  const { update_nugget_tag, is_selected } = props
  const options_tags = tags.filter((tag) => tag !== current_tag)

  const open_select = () => set_is_open(true)
  const close_select = () => set_is_open(false)
  const select_tag = (tag) => {
    update_nugget_tag(tag, tag_type)
    close_select()
  }

  return (
    <Tag
      mt5={tag_type === 'topic'}
      onMouseEnter={open_select}
      onMouseLeave={close_select}
    >
      — {current_tag}
      {is_open && is_selected && (
        <Options>
          {options_tags.map((tag, index) => (
            <Option key={index} onClick={() => select_tag(tag)}>
              {tag}
            </Option>
          ))}
        </Options>
      )}
    </Tag>
  )
}

const Participants = ({ participants, type, row, states }) => {
  const label = participants_types[type]

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

const nuggets_topics = [
  'graphic',
  'typeface',
  'code',
  'webdesign',
  'branding',
  'motion',
  'electronics',
  'textile',
  'design',
  'illustration',
  'editorial',
  'material',
  'photography',
  'dance',
  '3D print',
  'art',
  '3D',
  'game',
  'architecture',
  'dataviz',
  'ceramics',
  'mapping',
  'painting',
  'science',
  'printing',
]

const participants_types = {
  talk: 'speakers',
  research: 'researchers',
  project: 'designers',
  exhibition: 'artists',
  workshop: 'teachers',
  book: 'authors',
  quote: 'authors',
  event: 'speakers',
  show: 'creators',
  'open call': 'organizers',
  people: 'figures',
}

const nuggets_types = Object.keys(participants_types)

const Wrapper = Component.relative.ph30.flex.ai_flex_start.div()
const Content = Component.w100p.flex.flex_column.mr100.div()
const SideNotes =
  Component.relative.flex.flex_column.ai_flex_start.flex_shrink0.w100.mr30.w100.div()
const Tags = Component.uppercase.ls2.fs10.div()
const Tag = Component.ws_nowrap.c_pointer.div()
const Options = Component.pt2.zi10.bg_white.absolute.div()
const Option = Component.pv3.ml18.o40.hover_o100.div()
const List = Component.fs13.flex.ai_flex_start.div()
const Heading = Component.capitalize.bb.mr30.span()

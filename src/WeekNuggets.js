import { Component, Span } from './flags'
import { EditableText } from './EditableText'

export const WeekNuggets = ({ week, ...props }) => {
  const nuggets = Object.entries(week.nuggets)

  return (
    <Nuggets>
      {nuggets.map(([type, content], index) => (
        <Nugget
          key={type}
          nuggets={nuggets}
          type={type}
          content={content}
          index={index}
          {...props}
        />
      ))}
    </Nuggets>
  )
}

const Nugget = ({ nuggets, type, content, index, ...props }) => {
  const { name, subtype, text, subtitle, description, participants } = content

  const { hovered_nugget, set_hovered_nugget } = props
  const { selected_nugget, set_selected_nugget } = props
  const { is_editing, set_is_editing } = props

  const is_hovered = hovered_nugget === type
  const is_selected = selected_nugget === type
  const is_not_selected_one = selected_nugget && !is_selected

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
      h40={is_not_selected_one}
      h25p={!selected_nugget}
      h100p={is_selected}
    >
      {is_selected && <Close onClick={clear_selected_nugget}>✕ Esc</Close>}
      <Tag mt15={!selected_nugget || is_selected}>— {subtype || type}</Tag>
      <Content h100p={is_selected}>
        <Title
          fs50={!selected_nugget || is_selected}
          fs15={is_not_selected_one}
        >
          <Span
            clamp={!is_selected}
            clamp2={!is_selected}
            clamp1={is_not_selected_one}
            bg_grey9={is_selected && is_hovered}
            white={is_selected && is_hovered}
            bw2={is_selected && !is_hovered}
            bb={is_selected && !is_hovered}
            bg_white={is_selected && !is_hovered}
            grey9={is_selected && !is_hovered}
          >
            {name || text}
          </Span>
        </Title>
        {is_selected && (
          <Details>
            <Subtitle>{subtitle}</Subtitle>
            {participants && (
              <Participants participants={participants} subtype={subtype} />
            )}
            {description && (
              <EditableText
                id={`textarea-${type}`}
                value={description}
                is_editing={is_editing}
                set_is_editing={set_is_editing}
              />
            )}
          </Details>
        )}
      </Content>
    </Container>
  )
}

const Participants = ({ participants, subtype }) => {
  if (!participants || !participants.length) return null
  const label = participants_types[subtype]
  return (
    <List>
      <Heading>{label}:</Heading>
      {participants.split('\n').map((participant, index) => (
        <Span key={`${label}-${index}`}>
          {index > 0 && <Separator>✽</Separator>}
          {participant}
        </Span>
      ))}
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
const Container =
  Component.anim_height.relative.h100p.ph30.flex.ai_flex_start.div()
const Content = Component.w100p.flex.flex_column.div()
const Title = Component.lh60.pr30.div()
const Details = Component.flex1.mt10.pr50.flex.flex_column.div()
const Subtitle = Component.mb40.fs40.italic.grey3.div()
const Tag = Component.flex_shrink0.w100.uppercase.mr30.ls2.fs10.span()
const List = Component.fs13.mb30.div()
const Heading = Component.capitalize.bb.mr30.span()
const Separator = Component.mh20.span()

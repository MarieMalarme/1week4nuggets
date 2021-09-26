import { useState } from 'react'
import { Component } from './flags'
import { EditableText } from './EditableText'

export const Hyperlink = ({ link, row, states }) => {
  const [is_hovered, set_is_hovered] = useState(false)
  const url_prefix = (!link.startsWith('http') && 'http://') || ''

  return (
    <HyperlinkWrapper
      onMouseEnter={() => set_is_hovered(true)}
      onMouseLeave={() => set_is_hovered(false)}
    >
      {link && (
        <LinkWrapper href={`${url_prefix}${link}`} target="_blank">
          {ArrowIcon}
          <Link>link</Link>
        </LinkWrapper>
      )}
      {((link && is_hovered) || !link) && (
        <EditableText
          initial_value={link}
          row={row}
          column="link"
          states={states}
        />
      )}
    </HyperlinkWrapper>
  )
}

const ArrowIcon = (
  <svg width="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130">
    <path
      fill="none"
      stroke="var(--grey7)"
      strokeWidth={8}
      d="m72.85 17.6 47.65 47.65-47.65 47.65M5.5 65.25h114.34"
    />
  </svg>
)

const HyperlinkWrapper = Component.w100p.flex.flex_column.div()
const LinkWrapper = Component.flex.ai_center.text_dec_none.mb10.a()
const Link = Component.grey8.fs10.ml10.ls2.uppercase.bb.b_grey6.inline.span()

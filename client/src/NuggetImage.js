import { Component } from './flags'

export const NuggetImage = ({ week, selected_nugget_type }) => {
  const { background, color } = week.color_harmonies.work
  const image = week.nuggets[selected_nugget_type]?.image
  const image_url = `./images/${image}`

  return (
    <Wrapper
      style={{
        background: image ? `center / cover url(${image_url})` : background,
        color,
      }}
    >
      {!image && (
        <input
          onChange={(event) => console.log(event.target.files[0])}
          type="file"
        />
      )}
    </Wrapper>
  )
}

const Wrapper = Component.flex1.pt50.pb80.ph40.div()

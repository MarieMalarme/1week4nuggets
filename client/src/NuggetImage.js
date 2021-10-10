import { Fragment, useState } from 'react'
import { Component } from './flags'
import { update_nugget_cell } from './data'
import { log } from './log'

export const NuggetImage = ({ nugget, week, ...props }) => {
  const { set_last_update, nuggets_sheet_coords } = props
  const { background, color } = week.color_harmonies.visual

  const [form, set_form] = useState(null)
  const [image_hash, set_image_hash] = useState(Date.now())
  const [uploading_image, set_uploading_image] = useState(false)

  const { image_extension, id, type } = nugget
  const image_file_name = `nugget_${id}.${image_extension}`
  const image_url = `${process.env.REACT_APP_API}/images/${image_file_name}`

  return (
    <Form
      elemRef={set_form}
      style={{
        color,
        background:
          !uploading_image && image_extension
            ? `center / cover url(${image_url}?${image_hash})`
            : background,
      }}
    >
      <UploadInput
        nuggets_sheet_coords={nuggets_sheet_coords}
        set_uploading_image={set_uploading_image}
        uploading_image={uploading_image}
        set_last_update={set_last_update}
        set_image_hash={set_image_hash}
        type={type}
        nugget={nugget}
        week_id={week.id}
        color={color}
        form={form}
      />
      {image_extension && (
        <DeleteButton
          week={week}
          nugget={nugget}
          set_last_update={set_last_update}
          nuggets_sheet_coords={nuggets_sheet_coords}
        />
      )}
    </Form>
  )
}

const UploadInput = ({ nugget, type, form, color, ...props }) => {
  const { set_uploading_image, set_last_update, set_image_hash } = props
  const { uploading_image, nuggets_sheet_coords, week_id } = props
  const { image_extension, row } = nugget

  const upload_image = async (event) => {
    // format & send data from the form - image and nugget name - to the server
    const form_data = new FormData()
    const image_file = event.target.files[0]
    form_data.append('uploaded_image', image_file)
    form_data.append('file_name', `nugget_${nugget.id}`)

    const image_file_extension = image_file.name.slice(
      image_file.name.lastIndexOf('.') + 1,
      image_file.name.length,
    )

    try {
      set_uploading_image(true)

      log.write('Uploading image to server')

      // fetch post route to upload the image to the server
      await fetch(`${process.env.REACT_APP_API}/upload`, {
        credentials: 'include',
        method: 'POST',
        body: form_data,
      })

      console.log(
        `%cImage ${image_file.name} successfully uploaded to the server!`,
        'color: cyan',
      )

      // update nugget image extension value in spreadsheet
      // only when the new extension is different from the previous one
      if (image_file_extension !== image_extension) {
        await update_nugget_cell({
          type,
          week_id,
          new_value: image_file_extension,
          column: 'image_extension',
          nuggets_sheet_coords,
          row,
          id: nugget.id,
        })
      }

      // store the last update & re-trigger the data fetching
      set_last_update({
        date: new Date(),
        event: `Uploaded ${nugget.name} pic!`,
      })

      // reset the form & change the form key to refetch the image route
      // - if not, react does not re-render the form since the image path is still the same
      form.reset()
      set_image_hash(Date.now())
      set_uploading_image(false)
    } catch (error) {
      log.error(error, `uploading ${nugget.name} pic!`)

      // store the update error to be displayed in the update banner
      set_last_update({
        date: new Date(),
        event:
          error.code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to upload ${nugget.name} pic!`,
      })
      set_uploading_image(false)
    }
  }

  return (
    <Label
      ai_flex_end={image_extension}
      ai_center={!image_extension}
      jc_flex_end={image_extension}
      jc_center={!image_extension}
      className={image_extension ? '' : 'hover_blend_mode_difference'}
    >
      {uploading_image ? (
        <Loader className="image-loading">Uploading image</Loader>
      ) : (
        <Fragment>
          <Input
            type="file"
            name="uploaded_image"
            onChange={upload_image}
            title="Upload a new pic"
          />
          <UploadIcon image={image_extension} color={color} />
          {!image_extension && <Span>Upload a pic</Span>}
        </Fragment>
      )}
    </Label>
  )
}

const UploadIcon = ({ color, image }) => (
  <IconWrapper
    mr30={image}
    mb100={image}
    bg_white={image}
    w55={image}
    h55={image}
  >
    <svg
      width={`${image ? 26 : 90}px`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 130"
    >
      <path
        fill="none"
        stroke={image ? 'black' : color}
        strokeWidth={image ? 6.5 : 3.4}
        strokeLinecap="round"
        d="M33.5 48.5 65 17l31.5 31.5M65 93.5V17.5M18 115h94"
      />
    </svg>
  </IconWrapper>
)

const DeleteButton = ({ nugget, week, ...props }) => {
  const { set_last_update, nuggets_sheet_coords } = props

  const delete_image = async (event) => {
    event.preventDefault()

    try {
      const file_name = `nugget_${nugget.id}.${nugget.image_extension}`

      // fetch to delete the image file on the server
      await fetch(`${process.env.REACT_APP_API}/delete`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_name }),
        credentials: 'include',
        method: 'DELETE',
      })

      // delete the image_extension value on the spreadsheet
      await update_nugget_cell({
        type: nugget.type,
        week_id: week.id,
        new_value: '',
        column: 'image_extension',
        nuggets_sheet_coords,
        row: nugget.row,
      })

      set_last_update({
        date: new Date(),
        event: `Deleted ${nugget.name} pic!`,
      })
    } catch (error) {
      log.error(error, `uploading ${nugget.name} pic!`)

      set_last_update({
        date: new Date(),
        event: `Failed to delete ${nugget.name} pic!`,
      })
    }
  }

  return <Button onClick={delete_image}>{DeleteIcon}</Button>
}

const DeleteIcon = (
  <svg width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130">
    <path
      fill="none"
      stroke="var(--grey8)"
      strokeWidth={10}
      d="m24 24 82 82M106 24l-82 82"
    />
  </svg>
)

const Form = Component.relative.h100p.w100p.flex1.form()
const Input = Component.absolute.c_pointer.o0.w100p.h100p.input()
const Label =
  Component.block.fs30.text_center.h100p.w100p.flex.flex_column.label()
const Span = Component.mt30.span()
const Loader = Component.div()
const IconWrapper = Component.b_rad50p.flex.ai_center.jc_center.div()
const Button =
  Component.c_pointer.flex.ai_center.jc_center.bg_white.b30.r30.w55.h55.b_rad50p.ba0.absolute.b0.button()

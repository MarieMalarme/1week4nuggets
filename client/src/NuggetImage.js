import { Fragment, useState } from 'react'
import { Component } from './flags'
import { dashcase, log_error } from './toolbox'

export const NuggetImage = ({ week, selected_nugget_type, ...props }) => {
  const [form, set_form] = useState(null)

  const { set_last_update } = props
  const { background, color } = week.color_harmonies.work

  const nugget = week.nuggets[selected_nugget_type]
  const image_extension = nugget?.image_extension
  const image_url =
    nugget &&
    `http://localhost:5000/images/${dashcase(nugget.name)}.${image_extension}`

  const upload_image = async (event) => {
    // format & send data from the form - image and nugget name - to the server
    const form_data = new FormData()
    const image_file = event.target.files[0]
    form_data.append('uploaded_image', image_file)
    form_data.append('nugget_name', dashcase(nugget.name))

    try {
      await fetch('http://localhost:5000/upload', {
        credentials: 'include',
        method: 'POST',
        body: form_data,
      })

      form.reset() // clear the form input

      // store the last update & re-trigger the data fetching
      set_last_update({
        date: new Date(),
        event: `Uploaded ${nugget.name} pic!`,
      })
    } catch (error) {
      log_error(error, `uploading ${nugget.name} pic!`)

      // store the update error to be displayed in the update banner
      set_last_update({
        date: new Date(),
        event:
          error.code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to upload ${nugget.name} pic!`,
      })
    }
  }

  return (
    <Form
      elemRef={set_form}
      key={`form-upload-${Date.now()}`}
      style={{
        color,
        background: image_extension
          ? `center / cover url(${image_url})`
          : background,
      }}
    >
      {nugget && (
        <Fragment>
          <Label className="hover_blend_mode_difference">
            <Input type="file" name="uploaded_image" onChange={upload_image} />
            <UploadIcon color={color} />
            <Span>Upload a pic</Span>
          </Label>
        </Fragment>
      )}
    </Form>
  )
}

const UploadIcon = ({ color }) => {
  return (
    <svg width="90px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130">
      <path
        fill="none"
        stroke={color}
        strokeWidth={3.4}
        d="M33.5 48.5 65 17l31.5 31.5M65 93.5V17.5M18 115h94"
      />
    </svg>
  )
}

const Form = Component.relative.h100p.w100p.flex1.form()
const Input = Component.absolute.c_pointer.o0.w100p.h100p.input()
const Label =
  Component.block.fs30.text_center.h100p.w100p.flex.flex_column.ai_center.jc_center.label()
const Span = Component.mt30.span()

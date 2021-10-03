import { log } from './log'

export const update_nugget_cell = async ({ new_value, week_id, ...props }) => {
  const { id, column, row, type, set_last_update, nuggets_sheet_coords } = props
  const cell_row = row || nuggets_sheet_coords.last_row
  const cell = `${nuggets_sheet_coords.columns[column]}${cell_row}`

  const request = {
    spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
    valueInputOption: 'USER_ENTERED',
    includeValuesInResponse: true,
    data: [
      {
        // update the edited value
        range: `'Nuggets'!${cell}`,
        values: [[new_value]],
        majorDimension: 'ROWS',
      },
      {
        // add the week id
        range: `'Nuggets'!${nuggets_sheet_coords.columns['week_id']}${cell_row}`,
        values: [[week_id]],
        majorDimension: 'ROWS',
      },
      {
        // add the type
        range: `'Nuggets'!${nuggets_sheet_coords.columns['type']}${cell_row}`,
        values: [[type]],
        majorDimension: 'ROWS',
      },
      {
        // add nugget id when creating new nugget
        range: `'Nuggets'!${nuggets_sheet_coords.columns['id']}${cell_row}`,
        values: [[id]],
        majorDimension: 'ROWS',
      },
    ],
  }

  try {
    log.write()

    // send request to google api to update spreadsheet
    const { values } = window.gapi.client.sheets.spreadsheets
    const response = await values.batchUpdate(request)

    // display the success in console
    log.success(response, column, cell)

    if (set_last_update) {
      // store the last update & re-trigger the data fetching
      set_last_update({
        date: new Date(),
        event: `Updated column ${column}`,
      })
    }
  } catch (error) {
    const { code } = error?.result?.error || error
    const message =
      code === 401 // indicate if the error is unauthorized user
        ? 'You need to be signed in as an authorized user to update the data'
        : `Failed to update column ${column}`

    log.error(error, 'updating the spreadsheet')

    if (set_last_update) {
      // store the update error to be displayed in the update banner
      set_last_update({
        date: new Date(),
        event: message,
      })
    } else {
      throw new Error(message)
    }
  }
}

// get a nugget id from its week and its index:
// sum up the total amount of nuggets from the previous weeks
// and add the index of the nugget in the current week
export const get_nugget_id = (week_id, nugget_index) => {
  if (nugget_index === null || nugget_index === undefined) return
  const previous_weeks_nuggets = (Number(week_id) - 1) * 4
  return previous_weeks_nuggets + (Number(nugget_index) + 1)
}

export const nuggets_types = ['talk', 'project', 'book', 'quote']

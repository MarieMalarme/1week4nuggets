import { log } from './log'

export const update_nugget_cell = async ({ new_value, ...props }) => {
  const { column, row, set_last_update, nuggets_sheet_columns } = props
  const cell = `${nuggets_sheet_columns[column]}${row}`

  const request = {
    spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
    includeValuesInResponse: true,
    valueInputOption: 'USER_ENTERED',
    range: `'Nuggets'!${cell}`,
    values: [[new_value]],
    majorDimension: 'ROWS',
  }

  try {
    log.write()

    // send request to google api to update spreadsheet
    const { values } = window.gapi.client.sheets.spreadsheets
    const response = await values.update(request)

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
    log.error(error, 'updating the spreadsheet')

    if (set_last_update) {
      // store the update error to be displayed in the update banner
      const { code } = error?.result?.error || error
      set_last_update({
        date: new Date(),
        event:
          code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to update column ${column}`,
      })
    }
  }
}

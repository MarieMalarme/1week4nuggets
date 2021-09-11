import { useState, useEffect } from 'react'
import { log_error, get_color_harmony, int_to_letter, random } from './toolbox'
import { Component } from './flags'
import { WeekContent } from './WeekContent'
import { Authentication } from './Authentication'
import { UpdateBanner } from './UpdateBanner'

const Home = () => {
  const [weeks_data, set_weeks_data] = useState('loading')
  const [nuggets_sheet_columns, set_nuggets_sheet_columns] = useState([])
  const [gapi_loaded, set_gapi_loaded] = useState(false)
  const [is_signed_in, set_is_signed_in] = useState(false)
  const [last_update, set_last_update] = useState(false)

  // load the google api client library
  useEffect(() => {
    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init(gapi_request_params)
        set_gapi_loaded(true)
      } catch (error) {
        log_error(error, 'loading google API')
      }
    })
  }, [])

  // handle google authentication
  useEffect(() => {
    if (!gapi_loaded) return
    try {
      const { isSignedIn } = window.gapi.auth2.getAuthInstance() // get current auth instance
      isSignedIn.listen(set_is_signed_in) // listen for auth state changes
      set_is_signed_in(isSignedIn.get()) // set the initial auth state
    } catch (error) {
      log_error(error, 'handling google authentication')
    }
  }, [gapi_loaded])

  // fetch the spreadsheet's data
  useEffect(() => {
    if (!gapi_loaded) return
    const fetch_spreadsheet_data = async () => {
      try {
        // send request with the spreadsheet's id and queried ranges
        const { client } = window.gapi
        const response = await client.sheets.spreadsheets.values.batchGet({
          spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
          ranges: ['Weeks', 'Nuggets'],
        })

        // format the fetched data and set it to the state
        const formatted_data = format_spreadsheet_data(response)
        set_weeks_data(formatted_data.nuggets_per_week)
        set_nuggets_sheet_columns(formatted_data.nuggets_sheet_columns)
      } catch (error) {
        log_error(error, 'querying the spreadsheet')
      }
    }
    fetch_spreadsheet_data()
  }, [gapi_loaded, last_update])

  if (weeks_data === 'loading')
    return <Feedback>Loading nuggets from spreadsheet...</Feedback>

  if (!weeks_data.length)
    return <Feedback>No data in the spreadsheet!</Feedback>

  return (
    <Page>
      <Authentication is_signed_in={is_signed_in} />
      <UpdateBanner last_update={last_update} />
      <WeekContent
        weeks_data={weeks_data}
        nuggets_sheet_columns={nuggets_sheet_columns}
        is_signed_in={is_signed_in}
        set_last_update={set_last_update}
      />
    </Page>
  )
}

const format_spreadsheet_data = (response) => {
  // return an empty array if no values are found in the specified range
  if (!response?.result?.valueRanges?.some((range) => range.values)) return []
  // extract data from the 2 queried ranges and format into arrays of objects
  const [weeks, nuggets] = response.result.valueRanges.map((range) => {
    // extract for each range the first row as an array containing column names:
    // example → ['type', 'name', 'date']
    // extract the other rows as an array of arrays containing data:
    // example → [['event', 'The mouse conference', 'May 2019'], ['book', 'Torrent', 'June 2021']]
    const [column_names, ...rows] = range.values

    // convert the rows' arrays into objects
    return rows.map((columns) => {
      const column_entries = columns.map((value, index) =>
        // generate a 2-value array for each column
        // containing the column name and the column value
        // example 1 → ['name', 'The Mouse conference']
        // example 2 → ['subtype', 'talk']
        [column_names[index], value],
      )
      // create an object with key-value pairs from the 2-value arrays
      // from → [['name', 'The Mouse conference'], ['subtype', 'talk']]
      // into → { name: 'The Mouse conference', subtype: 'talk' }
      return Object.fromEntries(column_entries)
    })
  })

  const color_harmonies = generate_color_harmonies(weeks.length)
  const fonts_combinations = generate_fonts_combinations(weeks.length)

  // convert the data into objects assigned by week
  const nuggets_per_week = weeks.map((week, week_index) => ({
    ...week,
    // dispatch & format as an object all the nuggets in their correponding week
    // example → { event: { name: 'The Mouse conference', date: 'May 2019' }, book: { name: 'Torrent', date: 'June 2021' } }
    nuggets: Object.fromEntries(
      nuggets
        .map((nugget, index) => ({ row: index + 2, ...nugget }))
        .filter((nugget) => nugget.week_id === week.id)
        .map((nugget) => {
          // extract & ignore 'week_id' property since each nugget
          // is now contained in the correponding week
          const { week_id, type, subtype, ...nugget_content } = nugget
          // use the 'type' or 'subtype' to be set as key name of the nugget & spread the rest of the object
          // example → ['event', { name: 'The Mouse conference', date: 'May 2019' }]
          return [type || subtype, { ...nugget_content, subtype }]
        }),
    ),
    // assign color harmonies & fonts combinations for each week object
    color_harmonies: color_harmonies[week_index],
    fonts: fonts_combinations[week_index],
  }))

  const nuggets_column_names = response.result.valueRanges[1].values[0]
  const nuggets_sheet_columns = Object.fromEntries(
    nuggets_column_names.map((name, index) => [name, int_to_letter(index)]),
  )

  return { nuggets_per_week, nuggets_sheet_columns }
}

// params to send when initialiazing gapi client to access spreadsheets' content
const gapi_request_params = {
  apiKey: process.env.REACT_APP_API_KEY,
  clientId: process.env.REACT_APP_CLIENT_ID,
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets',
}

// generate a random color harmony (one per section)
const generate_color_harmonies = (amount) =>
  [...Array(amount).keys()].map(() => ({
    dates: get_color_harmony(),
    work: get_color_harmony({ darker: true }),
    navigation: get_color_harmony(),
  }))

// create a combination of 4 fonts (one per nugget type)
// picked randomly among the different available fonts
const generate_fonts_combinations = (amount) =>
  [...Array(amount).keys()].map(() => {
    const fonts_list = [
      { name: 'basier', size: 53, line_height: 69 },
      { name: 'bogam', size: 65, line_height: 62 },
      { name: 'chaney', size: 40, line_height: 54 },
      { name: 'frac', size: 50, line_height: 65 },
      { name: 'migra', size: 53, line_height: 63 },
      { name: 'pluto', size: 53, line_height: 70 },
      { name: 'trash', size: 53, line_height: 57 },
    ]

    const random_fonts = [...Array(4).keys()].map((index) => {
      const random_index = random(0, fonts_list.length - 1)
      const font = fonts_list[random_index]
      fonts_list.splice(random_index, 1)
      return font
    })

    return random_fonts
  })

const Page = Component.fixed.fw200.w100vw.div()
const Feedback = Component.fixed.b70.l80.fs50.div()

export default Home

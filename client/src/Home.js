import { useState, useEffect } from 'react'
import { get_color_harmony, random } from './toolbox'
import { int_to_letter, format_date } from './toolbox'
import { log } from './log'
import { Component } from './flags'
import { Mobile } from './Mobile'
import { WeekContent } from './WeekContent'
import { Authentication } from './Authentication'
import { UpdateBanner } from './UpdateBanner'

const Home = () => {
  var media_query = window.matchMedia('(max-width: 850px)')
  const [mobile, set_mobile] = useState(media_query.matches)

  useEffect(() => {
    const update_mobile = (event) => set_mobile(event.matches)
    media_query.addEventListener('change', update_mobile)
  })

  return mobile ? <Mobile /> : <Desktop />
}

const Desktop = () => {
  const [weeks_data, set_weeks_data] = useState('loading')
  const [nuggets_sheet_coords, set_nuggets_sheet_coords] = useState([])
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
        log.error(error, 'loading google API')
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
      log.error(error, 'handling google authentication')
    }
  }, [gapi_loaded])

  // fetch the spreadsheet's data
  // to do: cache the data (avoid error 429: too many requests)
  useEffect(() => {
    if (!gapi_loaded) return
    const fetch_spreadsheet_data = async () => {
      try {
        // send request with the spreadsheet's id and queried ranges
        const { client } = window.gapi
        const response = await client.sheets.spreadsheets.values.batchGet({
          spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
          ranges: ['Nuggets'],
        })

        // format the fetched data and set it to the state
        const formatted_data = format_spreadsheet_data(response)
        set_weeks_data(formatted_data.nuggets_per_week)
        set_nuggets_sheet_coords(formatted_data.nuggets_sheet_coords)
      } catch (error) {
        log.error(error, 'querying the spreadsheet')
      }
    }
    fetch_spreadsheet_data()
  }, [gapi_loaded, last_update])

  if (!gapi_loaded) return <Feedback>Loading Google API...</Feedback>

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
        nuggets_sheet_coords={nuggets_sheet_coords}
        is_signed_in={is_signed_in}
        set_last_update={set_last_update}
      />
    </Page>
  )
}

// extract data from the queried range and format it into arrays of objects
const format_spreadsheet_data = (response) => {
  // return an empty array if no values are found in the specified range
  if (!response?.result?.valueRanges?.some((range) => range.values)) return []

  // extract the first row of the range as an array containing column names:
  // example → ['type', 'name', 'date']
  // extract the other rows as an array of arrays containing data:
  // example → [['event', 'The mouse conference', 'May 2019'], ['book', 'Torrent', 'June 2021']]
  const [column_names, ...rows] = response.result.valueRanges[0].values

  // convert the rows' arrays into objects
  const nuggets = rows.map((columns, row_index) => {
    // generate a 2-value array for each column containing the column name and the column value
    // example 1 → ['name', 'The Mouse conference']
    // example 2 → ['type', 'talk']
    const column_entries = columns.map((value, i) => [column_names[i], value])

    // create an object with key-value pairs from the 2-value arrays
    // from → [['name', 'The Mouse conference'], ['type', 'talk']]
    // into → { name: 'The Mouse conference', type: 'talk' }
    return { ...Object.fromEntries(column_entries), row: row_index + 2 }
  })

  // convert the data into objects assigned by week
  const nuggets_per_week = weeks
    .map((week, week_index) => {
      // dispatch & format as an object all the nuggets in their correponding week
      // example → { event: { name: 'The Mouse conference', date: 'May 2019' }, book: { name: 'Torrent', date: 'June 2021' } }
      const week_nuggets = nuggets.filter(
        (nugget) => Number(nugget.week_id) === week.id,
      )

      return {
        ...week,
        nuggets: week_nuggets,
        // assign color harmonies & fonts combinations for each week object
        color_harmonies: color_harmonies[week_index],
        fonts: fonts_combinations[week_index],
      }
    })
    .reverse()

  const nuggets_sheet_columns = Object.fromEntries(
    column_names.map((name, index) => [name, int_to_letter(index)]),
  )

  return {
    nuggets_per_week,
    nuggets_sheet_coords: {
      columns: nuggets_sheet_columns,
      last_row: rows.length + 2,
    },
  }
}

// params to send when initialiazing gapi client to access spreadsheets' content
const gapi_request_params = {
  apiKey: process.env.REACT_APP_API_KEY,
  clientId: process.env.REACT_APP_CLIENT_ID,
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets',
}

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

const first_day = new Date('2021-09-13')
const today = new Date()
first_day.setHours(0, 0, 0)
today.setHours(0, 0, 0)

// calculate the amount of weeks that has passed since the beginning of the report
const weeks_amount = Math.ceil((today - first_day) / WEEK)

const weeks = [...Array(weeks_amount).keys()].map((index) => {
  const first_week_day = first_day.getTime() + index * WEEK
  const last_week_day = first_week_day + 7 * DAY - SECOND
  const dates = `${format_date(first_week_day)}\n${format_date(last_week_day)}`
  return { id: index + 1, dates }
})

export const color_harmonies = [...Array(weeks_amount).keys()].map(() => ({
  dates: get_color_harmony(),
  visual: get_color_harmony({ darker: true }),
  navigation: get_color_harmony(),
}))

// create a combination of 4 fonts (one per nugget type)
// picked randomly among the different available fonts
const fonts_combinations = [...Array(weeks_amount).keys()].map(() => {
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

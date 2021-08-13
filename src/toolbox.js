export const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const log_error = (error, event) => {
  const { message, code } = error.result?.error || error
  console.log(`%cOopsie, ${code} error occurred while ${event}!`, 'color: red')
  console.log(`%c✕ ${message}`, 'color: orange')
}

// create a 2-color harmony for page sections:
// one for the background & one for the text;
// a `darker` option can be passed to get a darker background
export const get_color_harmony = ({ darker } = {}) => {
  // set a hue limiter to generate 2 hues that don't overlap
  // so the colors are different enough & produce a constrast
  // that makes the text readable on the background
  const hue_limiter = random(0, 360)
  const hue_chunk_1 = [hue_limiter - 90, hue_limiter + 90]
  const hue_chunk_2 = [hue_limiter + 90, hue_limiter - 90]
  const color_hue = random(...hue_chunk_1)
  const background_hue = random(...hue_chunk_2)

  // also set luminosities to not overlap
  const color_luminosity = !darker ? random(35, 50) : random(70, 90)
  const background_luminosity = darker ? random(35, 50) : random(70, 90)

  const saturations = [random(45, 100), random(45, 100)]

  return {
    color: `hsl(${color_hue}, ${saturations[0]}%, ${color_luminosity}%)`,
    background: `hsl(${background_hue}, ${saturations[1]}%, ${background_luminosity}%)`,
  }
}

// get next & prev indexes of a given current index passed as argument;
export const update_indexes = (current_index, array) => {
  const last_index = array.length - 1
  const is_first_index = current_index === 0
  const is_last_index = current_index === last_index
  const next_index = is_last_index ? 0 : current_index + 1
  const prev_index = is_first_index ? last_index : current_index - 1
  return { next_index, prev_index }
}

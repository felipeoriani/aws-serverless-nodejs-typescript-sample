/**
 * Get unix time format number from a date.
 * @param date Date to be converted into unix time.
 * @returns Unix time format number.
 */
export function toUnixTime(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

export function toDateFromISO(isoDate: string): Date {
  return fromUnixTime(Date.parse(isoDate))
}

/**
 * Get the date from a unix time format number.
 * @param epoch Unix time format number.
 * @returns Date instance represented by epoch number.
 */
export function fromUnixTime(epoch: number): Date {
  return new Date(epoch * 1000)
}

/**
 * Format the date with dashes in the pattern: dd-Mon-yyyy.
 * @param date Date to be formatted.
 * @returns Formatted date string.
 */
export function formatDate(date: Date): string {
  const monthsAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  const formattedDate = `${day}-${monthsAbbr[monthIndex]}-${year}`
  return formattedDate
}

const generalDateProperties = ['date', 'createdAt', 'updatedAt']

export const formatBody = <T>(body: string, dateProps?: string[]): T => {
  const result = JSON.parse(body)
  const allDateProps = [...generalDateProperties, ...(dateProps || [])]
  for (const dateProp of allDateProps) {
    if (result[dateProp]) {
      result[dateProp] = new Date(result[dateProp])
    }
  }
  return result as T
}

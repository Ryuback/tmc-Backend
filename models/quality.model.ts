export interface Quality {
  name: string,
  count: number
}

export function generateQualities(): Quality[] {
  return [
    {
      name: 'helpingOthers',
      count: 0
    },
    {
      name: 'onTask',
      count: 0
    },
    {
      name: 'participating',
      count: 0
    },
    {
      name: 'teamWork',
      count: 0
    }
  ]
}

import React from 'react'

export const useEarliestEffect =
  React.useInsertionEffect || React.useLayoutEffect

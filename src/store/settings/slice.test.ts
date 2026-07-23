import { describe, it, expect } from 'vitest'
import {
  settingsSlice,
  fetchStart,
  fetchSuccess,
  fetchFailure,
  updateSuccess,
} from './slice'

const reducer = settingsSlice.reducer
const initial = reducer(undefined, { type: '@@INIT' })

describe('settingsSlice', () => {
  it('starts with the minimum disabled and no error', () => {
    expect(initial).toEqual({ minOrderAmount: 0, loading: false, error: null })
  })

  it('fetchStart sets loading and clears the error', () => {
    const state = reducer({ ...initial, error: 'boom' }, fetchStart())
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('fetchSuccess stores the minimum and stops loading', () => {
    const state = reducer({ ...initial, loading: true }, fetchSuccess({ minOrderAmount: 1500 }))
    expect(state.loading).toBe(false)
    expect(state.minOrderAmount).toBe(1500)
  })

  it('fetchFailure records the error and stops loading', () => {
    const state = reducer({ ...initial, loading: true }, fetchFailure('network error'))
    expect(state.loading).toBe(false)
    expect(state.error).toBe('network error')
  })

  it('updateSuccess replaces the minimum', () => {
    const state = reducer({ ...initial, minOrderAmount: 1500 }, updateSuccess({ minOrderAmount: 2000 }))
    expect(state.minOrderAmount).toBe(2000)
  })
})

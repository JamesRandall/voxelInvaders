interface ControlSet {
  leftPressed: boolean
  rightPressed: boolean
  firePressed: boolean
}

export interface ControlState {
  current: ControlSet
  previous: ControlSet
}

export function startingControlState() {
  return {
    current: { leftPressed: false, rightPressed: false, firePressed: false },
    previous: { leftPressed: false, rightPressed: false, firePressed: false }
  }
}
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from 'react'

const SET_MODAL = 'SET_MODAL'
const CLOSE_MODAL = 'CLOSE_MODAL'

const INITIAL_MODAL_STATE = {
  currentModal: null
}

export const ModalContext = createContext()

export function useModalContext() {
  return useContext(ModalContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case SET_MODAL: {
      const { currentModal } = payload
      return {
        ...state,
        currentModal
      }
    }
    case CLOSE_MODAL: {
      const { closedModal } = payload
      if (state.currentModal && state.currentModal.name === closedModal.name) {
        return {
          ...state,
          currentModal: null
        }
      } else {
        return state
      }
    }
    default: {
      throw Error(`Unexpected action type in ModalContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_MODAL_STATE)

  const showModal = useCallback(modal => {
    dispatch({ type: SET_MODAL, payload: { currentModal: modal } })
  }, [])

  const closeModal = useCallback(modal => {
    dispatch({ type: CLOSE_MODAL, payload: { closedModal: modal } })
  }, [])

  return (
    <ModalContext.Provider
      value={useMemo(() => [state, { showModal, closeModal }], [
        state,
        showModal,
        closeModal
      ])}
    >
      {children}
    </ModalContext.Provider>
  )
}

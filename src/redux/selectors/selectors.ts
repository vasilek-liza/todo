import { TAppState } from "../../types/redux"

export const todoSelectors = {
  getTasks: (state: TAppState) => state.todo.modifidedtTasks,
  getTask: (state: TAppState) => state.todo.details,
  getLoading: (state: TAppState) => state.todo.loading
}

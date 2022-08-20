import { CollectionsBookmarkRounded } from "@material-ui/icons"
import { AxiosResponse, CancelToken } from "axios"
import { todoAPI } from "../api/todo-api"
import { FilterEnum, ITask, StatusEnum } from "../interface/todo"
import { TInferActions, TBaseThunk } from "../types/redux"
import { AlertifyStatusEnum } from "../types/types"
import { showAlert } from "../utils/showAlert"

export type TInitialState = typeof initialState
type TActions = TInferActions<typeof actions>
type TThunk = TBaseThunk<TActions>

export let initialState = {
  tasks: [] as Array<ITask>,
  details: {} as ITask,
  loading: false,
  filter: "all" as FilterEnum,
  modifidedtTasks: [] as Array<ITask>,
}

export const todoReducer = (
  state = initialState,
  action: TActions
): TInitialState => {
  switch (action.type) {
    case "TODO/SET_TASKS":
      if (state.filter === FilterEnum.All) {
        return {
          ...state,
          tasks: [...action.payload],
          modifidedtTasks: [...action.payload],
        }
      } else if (state.filter === FilterEnum.Done) {
        return {
          ...state,
          tasks: [
            ...action.payload.filter((task) => task.status === StatusEnum.Done),
          ],
          modifidedtTasks:[
            ...action.payload.filter((task) => task.status === StatusEnum.Done),
          ],
        }
      } else {
        return {
          ...state,
          tasks: [
            ...action.payload.filter(
              (task) => task.status === StatusEnum.Doing
            ),
          ],
          modifidedtTasks: [
            ...action.payload.filter(
              (task) => task.status === StatusEnum.Doing
            ),
          ],
        }
      }
    case "TODO/SET_TASK":
      return {
        ...state,
        details: action.payload,
      }
    case "TODO/SEARCH_TASKS":
      return {
        ...state,
        modifidedtTasks: state.tasks.filter((task : any)=> {
          return task.title.includes(action.payload);
        })
      }
    case "TODO/SET_TASK_STATUS":
      const taskId = state.tasks.findIndex((task) => action.payload.id === task.id)
      const task = state.tasks[taskId]
      task.status = action.payload.value
      return {
        ...state,
        tasks: [
          ...state.tasks.slice(0, taskId),
          task,
          ...state.tasks.slice(taskId + 1),
        ],
        modifidedtTasks: [
          ...state.tasks.slice(0, taskId),
          task,
          ...state.tasks.slice(taskId + 1),
        ],
        details: {...task}
      }
    case "TODO/LOADING_TRUE":
      return {
        ...state,
        loading: true,
      }
    case "TODO/LOADING_FALSE":
      return {
        ...state,
        loading: false,
      }
    case "TODO/SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      }
    default:
      return state
  }
}

export const actions = {
  setTasks: (task: Array<ITask>) =>
    ({
      type: "TODO/SET_TASKS",
      payload: task,
    } as const),
  searchTasks: (value: string) =>
  ({
    type: "TODO/SEARCH_TASKS",
    payload: value,
  } as const),
  setTask: (
    name: string,
    title: string,
    description: string,
    status: StatusEnum
  ) =>
    ({
      type: "TODO/SET_TASK",
      payload: { name, title, description, status },
    } as const),
  setStatusTask: (value: StatusEnum, id?: string) =>
    ({
      type: "TODO/SET_TASK_STATUS",
      payload: {value,id},
    } as const),
  loadingTrue: () => ({ type: "TODO/LOADING_TRUE" } as const),
  loadingFalse: () => ({ type: "TODO/LOADING_FALSE" } as const),
  setFilter: (filter: FilterEnum) =>
    ({ type: "TODO/SET_FILTER", payload: filter } as const),
}

export const getTasks = (CancelToken?: CancelToken): TThunk => async (
  dispatch
) => {
  try {
    dispatch(actions.loadingTrue())
    const response = (await todoAPI.getTasks(CancelToken)) as AxiosResponse
    let data: Array<ITask> = []
    if (response.data !== null) {
      data = Object.keys(response.data).map((key) => ({
        ...response.data[key],
        id: key,
      }))
    }
    dispatch(actions.setTasks(data))
    dispatch(actions.loadingFalse())
  } catch (error) {
    console.log("An error has occurred")
  }
}

export const getTask = (
  id: string,
  CancelToken?: CancelToken
): TThunk => async (dispatch) => {
  try {
    dispatch(actions.loadingTrue())
    const response = await todoAPI.getTask(id, CancelToken)
    const { name, title, description, status } = response?.data
    await dispatch(actions.setTask(name, title, description, status))
    dispatch(actions.loadingFalse())
  } catch (error) {
    showAlert(AlertifyStatusEnum.error, "Не удалось загрузить задачи")
  }
}

export const createTask = (data: ITask): TThunk => async (dispatch) => {
  try {
    await todoAPI.createTask(data)
    showAlert(AlertifyStatusEnum.success, "Задача создана")
    dispatch(getTasks())
  } catch (error) {
    showAlert(AlertifyStatusEnum.error, "Задачу не удалось создать")
  }
}

export const editTask = (data: ITask, id: string): TThunk => async (
  dispatch
) => {
  try {
    await todoAPI.editTask(data, id)
    await dispatch(getTasks())
    showAlert(AlertifyStatusEnum.success, "Задача успешно изменена")
  } catch (error) {
    showAlert(AlertifyStatusEnum.error, "Задачу не удалось изменить")
  }
}

// export const editStatus = (value: StatusEnum, id: string): TThunk => async (dispatch, getState) => {
//   const task: ITask | undefined = getState().todo.tasks.find((task) => task.id === id)
//   await todoAPI.changeStatusTask(value, id)
//   dispatch(actions.setStatusTask(value,id))
// }

export const deleteTask = (id: string): TThunk => async (dispatch) => {
  try {
    await todoAPI.deleteTask(id)
    showAlert(AlertifyStatusEnum.success, "Задача удалена")
    await dispatch(getTasks())
  } catch (error) {
    showAlert(AlertifyStatusEnum.error, "Задачу не удалось удалить")
  }
}

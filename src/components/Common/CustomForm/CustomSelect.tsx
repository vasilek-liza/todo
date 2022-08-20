import React from "react"
import { StatusEnum } from "../../../interface/todo"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core"
import s from "../../Todo/Filter/Filter.module.scss"
import { useDispatch } from "react-redux"
import { actions } from "../../../redux/todo-reducer"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: "block",
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
)
interface ICustomSelectProps {
    id: string,
    value: string;
}

export const CustomSelect: React.FC<ICustomSelectProps> = ({id, value}) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleChange = (
    event: React.ChangeEvent<{ value: StatusEnum | unknown }>
  ) => {
    dispatch(actions.setStatusTask(event.target.value as StatusEnum, id))
  }

  return (
      <div className={s.filterPage}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-controlled-open-select-label">Статус</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={value}
            onChange={(e) => handleChange(e)}
          >
            <MenuItem value={StatusEnum.Waiting}>
              <em>Waiting</em>
            </MenuItem>
            <MenuItem value={StatusEnum.Doing}>Doing</MenuItem>
            <MenuItem value={StatusEnum.Done}>Done</MenuItem>
          </Select>
        </FormControl>
      </div>
  )
}
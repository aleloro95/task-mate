import Link from "next/link"
import React from "react"
import { Task } from "../generated/graphql-frontend"
import TaskItem from "./TaskItem"

interface TaskListProps {
  tasks: Task[] | undefined
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <ul className="task-list">
      {tasks?.map((task) => {
        return (
          <TaskItem key={task.id} task={task}/>
        )
      })}
    </ul>
  )
}

export default TaskList

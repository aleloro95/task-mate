import Link from "next/link"
import React, { useEffect } from "react"
import {
  Task,
  TaskStatus,
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from "../generated/graphql-frontend"
import { updateCache } from "../lib/helpers"

interface Props {
  task: Task
}

const errorMessage = 'An error ocurred, please try again'

const TaskItem: React.FC<Props> = ({ task }) => {
  // Hooks
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    variables: { id: task.id },
    update: updateCache
  })
  const [updateTask, { loading: updateLoading, error: updateError }] =
    useUpdateTaskMutation({ errorPolicy: "all" })

  useEffect(() => {
    if(updateError) {
      alert(errorMessage)
    }
  }, [updateError])
  
  useEffect(() => {
    if (error) {
      alert(errorMessage)
    }
  }, [error])

  // Handlers
  const handleDelete = async () => {
    try {
      await deleteTask()
    } catch (error) {
      console.error(error)
    }
  }
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked
      ? TaskStatus.Completed
      : TaskStatus.Active
    updateTask({ variables: { input: { id: task.id, status: newStatus } } })
  }

  return (
    <li key={task.id} className="task-list-item">
      <label className="checkbox">
        <input
          type="checkbox"
          onChange={handleCheck}
          checked={task.status === TaskStatus.Completed}
          disabled={updateLoading}
        />
        <span className="checkbox-mark">&#10003;</span>
      </label>
      <Link href="/update/[id]" as={`/update/${task.id}`}>
        <a className="task-list-item-title">{task.title}</a>
      </Link>
      <button
        disabled={loading}
        className="task-list-item-delete"
        onClick={handleDelete}
      >
        &times;
      </button>
    </li>
  )
}

export default TaskItem

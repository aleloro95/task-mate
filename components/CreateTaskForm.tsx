import React, { useState } from "react"
import { useCreateTaskMutation } from "../generated/graphql-frontend"

interface Props {
  onSuccess: () => void
}

const CreateTaskForm: React.FC<Props> = ({ onSuccess }) => {
  const [title, setTitle] = useState("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const [createTask, { loading, error }] = useCreateTaskMutation({
    onCompleted: () => {
      onSuccess()
      setTitle("")
    }
  })
  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!loading) {
      try {
        let newTask = { input: { title: title } }
        await createTask({ variables: newTask })
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <form onSubmit={handleSumbit}>
      {error && <p>An error ocurred</p>}
      <input
        type="text"
        name="title"
        placeholder="What would you like to get done?"
        autoComplete="off"
        className="text-input new-task-text-input"
        value={title}
        onChange={handleChange}
      />
    </form>
  )
}

export default CreateTaskForm

import { useRouter } from "next/router"
import React, { useState } from "react"
import { useUpdateTaskMutation } from "../generated/graphql-frontend"

interface FormValues {
  title: string
}

interface Props {
  id: number
  initialValues: FormValues
}

const UpdateTaskForm: React.FC<Props> = ({ initialValues, id }) => {
  // Hooks
  const [values, setValues] = useState<FormValues>({
    title: initialValues.title
  })
  const [updateTask, {loading, error}] = useUpdateTaskMutation({
    variables: { input: { id, title: values.title } }
  })
  const router = useRouter()

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const result = await updateTask()
      if(result.data?.updateTask){
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="alert-error">{error.message}</p>}
      <p>
        <label className="field-label">Title</label>
        <input
          type="text"
          name="title"
          className="text-input"
          value={values.title}
          onChange={handleChange}
        />
      </p>
      <p>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Save'}
        </button>
      </p>
    </form>
  )
}

export default UpdateTaskForm

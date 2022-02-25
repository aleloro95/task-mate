import Link from "next/link"
import React from "react"
import { TaskStatus } from "../generated/graphql-frontend"

interface Props {
  status?: TaskStatus
}

const TaskFilter: React.FC<Props> = ({status}) => {
  return (
    <ul className="task-filter">
      <li>
        <Link href="/" shallow>
          <a className={!status ? 'task-filter-active' : ''}>All</a>
        </Link>
      </li>
      <li>
        <Link href="/[status]" as="/active" scroll={false} shallow>
          <a className={status === 'active' ? 'task-filter-active' : ''}>Active</a>
        </Link>
      </li>
      <li>
        <Link href="/[status]" as="/completed" scroll={false} shallow>
          <a className={status === 'completed' ? 'task-filter-active' : ''}>Completed</a>
        </Link>
      </li>
    </ul>
  )
}

export default TaskFilter

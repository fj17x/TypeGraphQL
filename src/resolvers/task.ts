import { Query, Resolver, Mutation, Arg, Int } from "type-graphql"
import { Task } from "../entities/Task"

@Resolver()
export class TaskResolver {
  @Query(() => String) //GraphQL return type String
  hello(): string {
    return "hello world"
  }
  @Query(() => [Task])
  tasks(): Promise<Task[]> {
    return Task.find({})
  }
  @Query(() => Task, { nullable: true })
  task(
    @Arg("id", () => Int)
    id: number
  ): Promise<Task | undefined> {
    return Task.findOne({ where: { id } })
  }

  @Mutation(() => Boolean)
  deleteTask(
    @Arg("id", () => Int)
    id: number
  ): boolean {
    try {
      Task.delete({ id })
      return true
    } catch {
      return false
    }
  }

  @Mutation(() => Task)
  createTask(
    @Arg("title", () => String)
    title: string
  ): Promise<Task> {
    return Task.create({ title, isComplete: false }).save()
  }

  @Mutation(() => Boolean, { nullable: true })
  updateTask(
    @Arg("id", () => Int)
    id: number,
    @Arg("isComplete", () => Boolean)
    isComplete: boolean
  ): boolean | null {
    try {
      Task.update({ id }, { isComplete })
      return true
    } catch {
      return false
    }
  }
}

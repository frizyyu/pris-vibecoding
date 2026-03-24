import { createPrismaTaskRepository } from "@/src/lib/task-repository.prisma";
import { createTaskService } from "@/src/lib/tasks";

export const taskService = createTaskService(createPrismaTaskRepository());

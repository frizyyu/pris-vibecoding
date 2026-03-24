import { PrismaClient, TaskPriority, TaskStatus } from "@/src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: "Подготовить структуру MVP",
        description: "Собрать Next.js, Prisma, SQLite и базовые страницы лабораторного проекта.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        title: "Описать ограничения проекта в README",
        description: "Зафиксировать функции, запуск и ограничения прототипа для защиты.",
        status: TaskStatus.PLANNED,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Проверить overdue-логику",
        description: "Создать задачу с прошедшим дедлайном и убедиться, что она выделяется автоматически.",
        status: TaskStatus.PLANNED,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        title: "Подготовить демонстрацию для защиты",
        description: "Собрать сценарий показа CRUD, фильтров, сортировки и статистики.",
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ],
  });
}

main()
  .catch(async (error) => {
    console.error("Prisma seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
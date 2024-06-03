import { PrismaClient, Task } from "@prisma/client";
import { Request, Response } from "express";
import { handled_error } from "../utils/errorPrisma";
import { handled_response, verif_body } from "../utils/function";
import { TaskModel } from "../models";

const taskTable = new PrismaClient().task;
const categoryTable = new PrismaClient().category;

export const createTask = async (req: Request, res: Response) => {
  try{
    if (verif_body(req,res, TaskModel)){
      const taskData : Task = req.body;

      const task = await taskTable.create({
        data: {
          ...taskData
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });
      return handled_response(res, 201, task);
    }
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try{
    if (verif_body(req,res, TaskModel)){
      const taskId: string = req.params.id as string;
      const taskData : Task = req.body;

      const selectCategory = await categoryTable.findFirst({
        where: {
          id: taskData.categoryId as string
        }
      });

      if (selectCategory === null){
        return handled_response(res, 404, {msg: 'nenhum dado encontrado na tabela para o id: ' + [taskData.categoryId]});
      }
      if(selectCategory && selectCategory.userId !== taskData.userId){
        return handled_response(res, 403, {msg: 'você não tem permissão para usar essa categoria'});
      }

      const selectTask = await taskTable.findFirst({
        where: {
          id: taskId
        },
        select: {
          userId: true
        },
      });

      if (selectTask === null){
        return handled_response(res, 404, { msg: 'nenhum dado encontrado na tabela para o id: ' + [taskId] });
      }
      if (selectTask.userId !== taskData.userId){
        return handled_response(res, 403, { msg: 'você não tem permissão para alterar esse dado' });
      }

      const task = await taskTable.update({
        data: {
          ...taskData
        },
        where: {
          id: taskId ,
          userId: taskData.userId
        },
        select:{
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      return handled_response(res, 201, task);
    }
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const findByIdTask = async (req: Request, res: Response) => {
  try{
    const userId: string = req.query.userId as string;
    const taskId: string = req.params.id as string;
    const task = await taskTable.findUnique({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      where: {
        id: taskId ,
        userId: userId
      }
    });

    if (task === null){
      return handled_response(res, 404, { msg: 'nenhum dado encontrado na tabela para o id: ' + [taskId] });
    }

    return handled_response(res, 200, task);
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const getAllTask = async (req: Request, res: Response) => {
  try{
    const userId: string = req.query.userId as string;
    const task = await taskTable.findMany(
      { 
        where: { userId: userId },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'asc' },
      }
    );

    return handled_response(res, 200, { _embedded: { list: task? task: [] } });
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
    try{
      const userId: string = req.query.userId as string;
      const taskId: string = req.params.id as string;
      const selectTask = await taskTable.findFirst({
        where: {
          id: taskId
        },
        select: {
          userId: true
        },
      });

      if (selectTask === null){
        return handled_response(res, 404, { msg: 'nenhum dado encontrado na tabela para o id: ' + [taskId] });
      }
      if (selectTask.userId !== userId){
        return handled_response(res, 403, { msg: 'você não tem permissão para deletar esse dado' });
      }

      const task = await taskTable.delete({
        where: {
          id: taskId ,
          userId: userId
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      if (task === null){
        return handled_response(res, 404, { msg: 'nenhum dado encontrado na tabela para o id: ' + [taskId] });
      }
  
      return handled_response(res, 200, task);
    }catch(e){
      console.log(new Date(), e);
      return handled_error(e, res);
    }
};

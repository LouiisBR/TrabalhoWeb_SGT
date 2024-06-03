import { PrismaClient, Category } from "@prisma/client";
import { Request, Response } from "express";
import { handled_error } from "../utils/errorPrisma";
import { handled_response, verif_body } from "../utils/function";
import { CategoryModel } from "../models";

const categoryTable = new PrismaClient().category;

export const createCategory = async (req: Request, res: Response) => {
  try{
    if (verif_body(req,res, CategoryModel)){
      const categoryData : Category = req.body;
      const category = await categoryTable.create({
        data: {
          ...categoryData
        },
        select: {
          id: true,
          name: true,
          user:{
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      return handled_response(res, 201, category);
    }
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try{
    if (verif_body(req,res, CategoryModel)){
      const categoryId:string = req.params.id as string;
      const categoryData : Category = req.body as Category;
      const userId: string = categoryData.userId as string;
      const selectCategory = await categoryTable.findUnique({
        where: {
          id: categoryId
        },
        select:{
          userId: true
        }
      });

      if(selectCategory === null){
        return handled_response(res, 404, {msg: 'nenhum dado encontrado na tabela para o id: ' + [categoryId]});
      }
      if(selectCategory.userId !== userId){
        return handled_response(res, 403, {msg: 'você não tem permissão para alterar esse dado'});
      }

      const category = await categoryTable.update({
        data: {
          ...categoryData
        },
        where: {
          id: categoryId,
          userId: userId
        },
        select: {
          id: true,
          name: true,
          user:{
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      return handled_response(res, 201, category);
    }
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const findByIdCategory = async (req: Request, res: Response) => {
  try{
    const userId: string = req.query.userId as string;
    const categoryId: string = req.params.id as string;
    const category = await categoryTable.findUnique({
      where: {
        id: categoryId,
        userId: userId
      },
      select: {
        id: true,
        name: true,
        user:{
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (category === null){
      return handled_response(res, 404, { msg: 'nenhum dado encontrado na tabela para o id: ' + [categoryId] } );
    }

    return handled_response(res, 200, category);
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const getAllCategory = async (req: Request, res: Response) => {
  try{
    const userId: string = req.query.userId as string;
    const category = await categoryTable.findMany(
      {
        where: {
          userId: userId
        },
        select: {
          id: true,
          name: true,
          user:{
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      }
    );

    return handled_response(res, 200, { _embedded: { list: category? category: [] } });
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try{
      const userId: string = req.query.userId as string;
      const categoryId: string = req.params.id as string;
      const selectCategory = await categoryTable.findUnique({
        where: {
          id: categoryId
        },
        select:{
          userId: true
        }
      });

      if(selectCategory === null){
        return handled_response(res, 404, {msg: 'nenhum dado encontrado na tabela para o id: ' + [categoryId]});
      }
      if(selectCategory.userId !== userId){
        return handled_response(res, 403, {msg: 'você não tem permissão para deletar esse dado'});
      }

      const category = await categoryTable.delete({
        where: {
          id: categoryId,
          userId: userId
        },
        select: {
          id: true,
          name: true,
          user:{
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });
  
      return handled_response(res, 200, category);
    }catch(e){
      console.log(new Date(), e);
      return handled_error(e, res);
    }
};

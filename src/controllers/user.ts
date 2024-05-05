import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { handled_error } from "../utils/errorPrisma";
import { handled_response, verif_body } from "../utils/function";
import { UserModel, UserPassModel } from "../models";

const userTable = new PrismaClient().user;

export const createUser = async (req: Request, res: Response) => {
  try{
    if (verif_body(req,res, UserModel)){
      const userData : User = req.body;
      const user = await userTable.create({
        data: {
          ...userData
        },
        select: {
          id: true,
          username: true,
          email: true,
        }
      });
      return handled_response(res, 201, user);
    }
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const updatePassUser = async (req: Request, res: Response) => {
  try{
    if (verif_body(req,res, UserPassModel)){
      const userData : UserPassModel = req.body;
      const userId = req.params.id;
      const dataUser = await userTable.findFirst({
        where: {
          id: userId
        }
      });
      if(dataUser === null){
        return handled_response(res, 404, {msg: 'nenhum dado encontrado na tabela para o id: ' + [userId]});
      }


      if (dataUser.password !== userData.password){
        return handled_response(res, 400, {msg: 'senha atual incorreta'});
      }

      dataUser.password = userData.newPassword;

      const user = await userTable.update({
        data: {
          ...dataUser
        },
        where: {
          id: userId
        },
        select: {
          id: true,
          username: true,
          email: true,
        }
      });
      return handled_response(res, 201, user);
    }
  }catch(e){
    console.log(new Date(), e);
    return handled_error(e, res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
    try{
      const userId= req.params.id;
      const user = await userTable.delete({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
          email: true,
        }
      });
  
      return handled_response(res, 200, user);
    }catch(e){
      console.log(new Date(), e);
      return handled_error(e, res);
    }
};

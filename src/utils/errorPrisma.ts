import { Prisma } from "@prisma/client";
import { Response } from "express";
import { handled_response } from "./function";

export function handled_error(e: any, res: Response){
  if(e instanceof Prisma.PrismaClientKnownRequestError){
    switch(e.code){
      case 'P2025':
        handled_response(res, 404,
          { error: ['O registro a ser excluído não existe'] });
        break;
      case 'P2002':
        handled_response(res, 400,
          { error: ['Erro de duplicidade de dados']});
        break;
      case 'P2003':
        handled_response(res, 400,
          { error: ['O registro já foi utilizado em outros cadastros,'
                    + ' então não pode ser excluido']});
        break;
      default:
        handled_response(res, 500,
          { messagem: 'Erro não tratado', error: [e] });
        break; 
    }
  }
}
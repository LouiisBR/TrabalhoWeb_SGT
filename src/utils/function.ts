import { Request, Response } from "express";

export function handled_response(
    res : Response,
    status: number, 
    body: Object){
    return res.status(status).json(body);
} 

export function verif_body(req: Request, res: Response, model: any = undefined){
	let errors: Array<object> = new Array<object>();
	if (!(typeof model === undefined)){
		if(isNullObject(req.body)){ 
      errors.push({error: 'O corpo da requisição não foi informado'});
    } else {
			Object.keys(new model()).forEach((key)=>{
				if (typeof req.body[key] === 'undefined'){
					errors.push({ [key]: 'Não foi informado ou está como indefinido' });
				}else if (typeof key !== typeof req.body[key]){
					errors.push({ [key]: 'Tipo inválido, Tipo correto { "'+ typeof key +'" }'});
				}
			})
		}
		if (errors.length > 0){
			handled_response(res, 400, {error: errors})
			return false;
		}
	}
	return true;
}

function isNullObject(obj: any = undefined): boolean{
    if (!(obj === undefined)){
        return JSON.stringify(obj) == '{}';
    }
    return false;
}
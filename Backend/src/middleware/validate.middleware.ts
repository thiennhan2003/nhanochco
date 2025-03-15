// import {AnySchema, ValidationError} from 'yup';
// import { NextFunction, Request, Response } from 'express';

// const validateSchemaYup = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     await schema.validate({
//       body: req.body,
//       query: req.query,
//       params: req.params,
//     }, 
//     { 
//       abortEarly: false, // abortEarly: false để lấy tất cả lỗi thay vì chỉ lấy lỗi đầu tiên
//       stripUnknown: true // stripUnknown: true để loại bỏ các trường không được định nghĩa trong schema
//     }  
//   );

//   next();

//   } catch (err: any) {
//     //console.log(err);
//     if (err instanceof Error) {
//       //console.error(err);
//       res.status(400).json({
//         statusCode: 400,
//         message: err.errors, // err.errors chứa tất cả các thông điệp lỗi
//         typeError: 'validateSchema'
//       });
//     }
//     next(err); //next lỗi ra cho app handle
//     // res.status(500).json({
//     //   statusCode: 500,
//     //   message: 'validate Yup Error',
//     //   typeError: 'validateSchemaUnknown'
//     // });
//   }
// };

// export default validateSchemaYup;
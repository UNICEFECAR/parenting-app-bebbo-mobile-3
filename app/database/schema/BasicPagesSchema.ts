import { ObjectSchema } from "realm";

  export type BasicPagesEntity = {
    id: number,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    body: string,
    mandatory: string,
    unique_name:string
  };


  export const BasicPagesSchema: ObjectSchema = {
    name: 'BasicPagesEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string' },
      mandatory: { type: 'string' },
      unique_name: { type: 'string' },
    }
  };

  
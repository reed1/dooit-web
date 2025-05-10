type DooitSchema = {
  name: string;
  label: string;
};

type Workspace = {
  id: number;
  description: string;
  ord: number;
};

type Todo = {
  id: number;
  description: string;
  ord: number;
};

export type { Workspace, DooitSchema, Todo };


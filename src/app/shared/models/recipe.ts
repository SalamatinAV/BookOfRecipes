export interface Recipe {
  id?: string;
  title: string;
  ingredients?: Ingrediends[];
  instructions?: string;
  categoryId: string;
  userId: string;
}

export interface Ingrediends {
  ingredient: string;
  quantity: string;
}

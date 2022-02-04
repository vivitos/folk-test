export interface UserDAO {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface PostDAO {
  id: number;
  authorID: number;
  text: string;
}

export interface Post extends Omit<PostDAO, 'authorID'> {
  author: UserDAO;
  mentions?: UserDAO[];
}

export interface Message {
  menuId: string | number;
  payload: {
    pageInfo: {
      url: string;
      title: string;
    };
    content: string;
  };
}
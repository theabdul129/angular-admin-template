export const GLOBALS = {

  pageActions: { create: 'create', update: 'update', view: 'view'},

   // As per backend is configured with pagination so we need to set limit
   dropdownRecordLimit: 100,
};

export  const setPaginator = (recordLimit) => {
  const paginator = {} as any;
  paginator.pageSizeOptions = paginatorSizes();
  paginator.pageSize = recordLimit ? recordLimit : 10;
  return paginator;
}
export const paginatorSizes = () => {
  return [10, 20, 50, 100, 200];
}
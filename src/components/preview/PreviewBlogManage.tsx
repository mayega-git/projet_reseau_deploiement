// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { Button } from '../ui/button';
// import { BlogInterface } from '@/types/blog';
// import BlogContent from '../Blog/BlogContent';

// interface PageProps {
//   data: BlogInterface;
//   showDialog: boolean;
//   setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
// }
// const PreviewBlogManage: React.FC<PageProps> = ({
//   showDialog,
//   setShowDialog,
//   data
// }) => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-50">
//       <div className="flex flex-col gap-6 bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
//         {/* Dialog Header */}
//         <div className="flex flex-col gap-1">
//           <h2 className="paragraph-large-medium font-semibold">Blog Preview</h2>
//         </div>

//         {/* Dialog BODY */}
//         <div>
//             <BlogContent blog={data} images={} userData={}/>
//         </div>
//         {/* Dialog Footer */}
//         <div className="flex justify-end gap-2">
//           <Button
//             variant={'outline'}
//             onClick={() => setShowDialog(false)}
//             className=" bg-red-600 hover:bg-red-700 text-white rounded-md"
//           >
//             Refuse
//           </Button>

//           <Button className="">
//             Publish
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreviewBlogManage;

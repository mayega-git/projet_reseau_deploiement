/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { TagInterface } from '@/types/tag';

interface DataTableProps<TData> {
  data: TagInterface[];
  type: 'category' | 'tag';
}

export function DataTable<TData>({ data }: DataTableProps<TData>) {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-start w-[30%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
              Name
            </th>
            <th className="text-start w-[70%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={
                index === data.length - 1
                  ? 'rounded-b-[20px] overflow-hidden'
                  : ''
              }
            >
              <td className="text-start w-[30%] paragraph-xmedium-normal px-4 py-2 border-b">
                {row.name}
              </td>
              <td className="text-start w-[70%] paragraph-xmedium-normal px-4 py-2 border-b">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

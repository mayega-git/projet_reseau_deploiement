/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { TagInterface } from '@/types/tag';

interface DataTableProps<TData> {
  data: TagInterface[];
  type: 'category' | 'tag';
}

export function DataTable<TData>({ data }: DataTableProps<TData>) {
  return (
    <div className="rounded-md border bg-white">
      <div className="md:hidden divide-y">
        {data.map((row) => (
          <div key={row.id} className="p-4 space-y-2">
            <p className="paragraph-medium-medium break-words">{row.name}</p>
            <p className="paragraph-small-normal text-black-300 break-words">
              {row.description}
            </p>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
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
    </div>
  );
}

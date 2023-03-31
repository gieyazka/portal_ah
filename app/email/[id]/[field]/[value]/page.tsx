"use client";

export default function EmailPage({ params }: { params: any }) {
  console.log(params);

  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <div className=" text-center">
        <b>Remark :</b>
        <textarea
          rows={3}
          // value={filterStore.filterStr}
          // onChange={(e) => filterStore.handleChangeFilterStr(e.target.value)}
          placeholder="Note"
          className="mt-2 py-2 pr-24 pl-2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pt-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
          Button
        </button>
      </div>
    </div>
  );
}

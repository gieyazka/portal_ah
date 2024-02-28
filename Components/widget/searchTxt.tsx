import React, { useEffect } from "react";

import { filterStore } from "@/types/next-auth";
import { useFilterStore } from "@/store/store";

const SearchTxt = (props: any) => {
  // const { label } = props;
  const filterStore = useFilterStore();
  const { label, value, handleChange } = props;

  const handleChangeInput = (e) => {
    const newValue = e.target.value;
    filterStore.handleChangeFilterStr(newValue);
  };
  const memoize = React.useMemo(() => {
    return (
      <input
        type='text'
        style={{
          width: "300px",
          height: "46px",
          filter: "drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.15))",
        }}
        value={value}
        onChange={handleChangeInput}
        placeholder={label}
        className=' text-base text-[#1D366D] py-0     font-semibold   mt-[5px] bg-[#F5F5F5]   rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      />
    );
  }, [filterStore.filterStr]);
  return memoize;
};

export default SearchTxt;

// type SearchTxtProps = {
//   label: string;
//   // filterStore: filterStore;
//   value: string | undefined;
//   handleChange: any;
//   // handleChange: (str: string | undefined) => void;
// };

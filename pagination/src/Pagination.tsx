import { useEffect, useState, useRef } from "react";

type Image = {
  download_url: string;
  id: string;
};

const Pagination = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const cache = useRef<Map<number, Image[]>>(new Map());

  const fetchData = async (pageNo: number) => {
    if (cache.current.has(pageNo)) {
      setImages(cache.current.get(pageNo) as Image[]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetch(
        `https://picsum.photos/v2/list?page=${pageNo}&limit=4`
      );
      const res = await data.json();
      cache.current.set(pageNo, res);
      setImages(res);
      setLoading(false);

      // Prefetch next page
      const nextPage = pageNo + 1;
      if (!cache.current.has(nextPage)) {
        const nextData = await fetch(
          `https://picsum.photos/v2/list?page=${nextPage}&limit=4`
        );
        const nextRes = await nextData.json();
        cache.current.set(nextPage, nextRes);
      }
    } catch (error) {
      console.log("🚀 ~ fetchData ~ error:", error);
    }
  };

  const updateCount = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).innerText === "Previous") {
      setCount((prev) => (count > 1 ? prev - 1 : 1));
    } else {
      setCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchData(count);
  }, [count]);

  return (
    <div className="flex justify-center items-center w-full h-full flex-col">
      <div className="w-full h-[80%] flex gap-3 overflow-auto rounded-none justify-center items-center">
        {loading
          ? "Loading..."
          : images?.map((image: Image) => (
              <img
                key={image.id}
                src={image.download_url}
                alt={image.id}
                className="object-cover h-full w-[23%] duration-300 hover:scale-105 hover:h-[95%] hover:rounded-xl"
              />
            ))}
      </div>

      <div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4 w-full">
        <div className="lg:w-1/2 w-full flex items-center justify-between border-t border-gray-200">
          <div
            onClick={updateCount}
            className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer">
            <svg
              width={14}
              height={8}
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.1665 4H12.8332"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.1665 4L4.49984 7.33333"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.1665 4.00002L4.49984 0.666687"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm ml-3 font-medium leading-none">Previous</p>
          </div>
          <div className="sm:flex hidden">
            <p className="text-xl font-medium leading-none cursor-pointer text-indigo-700 border-t border-indigo-400 pt-3 mr-4 px-2">
              {count}
            </p>
          </div>
          <div
            onClick={updateCount}
            className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer">
            <p className="text-sm font-medium leading-none mr-3">Next</p>
            <svg
              width={14}
              height={8}
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.1665 4H12.8332"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 7.33333L12.8333 4"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 0.666687L12.8333 4.00002"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

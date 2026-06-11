import { IoFlashSharp } from "react-icons/io5";
export const Loading = () => {
    return (
        <div className=" flex justify-center items-center">
            <IoFlashSharp size={70} className="text-primary  animate-pulse loading"  />
        </div>
    )
};

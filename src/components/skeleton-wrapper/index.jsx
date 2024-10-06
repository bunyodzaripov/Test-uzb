import { Skeleton } from "antd";

const SkeletonWrapper = ({ isLoading, children, skeletonProps }) => {
   return (
      <>
         {isLoading ? (
            <Skeleton
               className="mt-10"
               active
               title
               paragraph={{ rows: 5 }}
               {...skeletonProps}
            />
         ) : (
            children
         )}
      </>
   );
};

export default SkeletonWrapper;

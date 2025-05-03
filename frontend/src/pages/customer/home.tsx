import StoreInfoSidebar from "@/components/shared/store-info";
import { PostFeed } from "@/features/post/components/post-feed";

const CustomerHome = () => {
  return (
    <div className="relative w-full flex">
     <div className="w-full md:w-2/3 order-1 md:order-2">
        <PostFeed />
      </div>

      <div className="w-full md:w-1/3 order-3">
        <StoreInfoSidebar />
      </div>
    </div>
  );
};

export default CustomerHome;

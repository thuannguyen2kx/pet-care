import { Button } from "@/components/ui/button";
import PostFirstImage from "@/assets/images/post-1.jpg";
import PostSecondImage from "@/assets/images/post-2.jpg";
import PostThirdImage from "@/assets/images/post-3.jpg";

const posts = [
    { 
      id: 1, 
      title: "Những món đồ chơi tốt nhất cho thú cưng khỏe mạnh", 
      image: PostFirstImage,
      date: "15 Tháng 3, 2025"
    },
    { 
      id: 2, 
      title: "Bí quyết chọn đồ chơi phù hợp cho chó mèo", 
      image: PostSecondImage,
      date: "10 Tháng 3, 2025"
    },
    { 
      id: 3, 
      title: "Top đồ chơi giúp thú cưng phát triển thể chất", 
      image: PostThirdImage,
      date: "5 Tháng 3, 2025"
    }
];

const NewsCard = ({ title, image, date }: { title: string; image: string; date: string; }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="p-6">
        <span className="text-sm text-gray-500 mb-2 block">{date}</span>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <Button variant="link" className="text-orange-500 p-0 h-auto hover:text-orange-600">
          Xem thêm
        </Button>
      </div>
    </div>
  );
};

const LatestNews = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-start mb-12">
          <div className="text-xs uppercase text-primary mb-2 font-bold ">
            Bài viết nổi bật
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Cập nhật tin tức
            <br />& bài viết mới nhất
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              image={item.image}
              date={item.date}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
            Xem tất cả tin tức
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;

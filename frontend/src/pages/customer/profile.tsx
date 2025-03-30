import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Check,
  Grid,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { UpdateProfileInfoForm } from "@/features/user/components/update-info-form";
import { useGetProfile } from "@/features/user/hooks/queries/user-get-profile";
import { useParams } from "react-router-dom";
import { GlobalLoading } from "@/components/shared/global-loading";
import { ProfileNotFound } from "@/features/user/components/profile-not-found";
import ProfileAvatar from "@/features/user/components/profile-avatar";
import { formatDate } from "@/lib/helper";
import { useAuthContext } from "@/context/auth-provider";

interface Vaccination {
  name: string;
  date: Date;
  expiryDate: Date;
}

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: string;
  profilePicture: string | null;
  vaccinations: Vaccination[];
  allergies: string[];
  specialNeeds: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  comments: number;
  image: string;
}

const samplePets = [
  {
    _id: "pet1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 30,
    gender: "Male",
    profilePicture: null,
    vaccinations: [
      {
        name: "Rabies",
        date: new Date("2023-05-15"),
        expiryDate: new Date("2024-05-15"),
      },
    ],
    allergies: ["Chicken"],
    specialNeeds: "None",
  },
  {
    _id: "pet2",
    name: "Whiskers",
    species: "Cat",
    breed: "Siamese",
    age: 2,
    weight: 4.5,
    gender: "Female",
    profilePicture: null,
    vaccinations: [
      {
        name: "FVRCP",
        date: new Date("2023-07-20"),
        expiryDate: new Date("2024-07-20"),
      },
    ],
    allergies: [],
    specialNeeds: "Sensitive stomach",
  },
];

const samplePosts = [
  {
    _id: "post1",
    title: "First visit to the vet",
    content: "Buddy had his first checkup today and everything looks great!",
    createdAt: new Date("2023-06-10"),
    likes: 42,
    comments: 7,
    image: "/api/placeholder/800/600",
  },
  {
    _id: "post2",
    title: "New toy day",
    content: "Got Whiskers a new mouse toy and she loves it!",
    createdAt: new Date("2023-08-05"),
    likes: 38,
    comments: 5,
    image: "/api/placeholder/800/600",
  },
  {
    _id: "post3",
    title: "Beach day with Buddy",
    content: "Had an amazing day at the beach with Buddy. He loves the water!",
    createdAt: new Date("2023-07-15"),
    likes: 64,
    comments: 12,
    image: "/api/placeholder/800/600",
  },
  {
    _id: "post4",
    title: "Whiskers on the window",
    content:
      "Caught Whiskers enjoying the sun by the window. Perfect spot for a nap!",
    createdAt: new Date("2023-09-01"),
    likes: 51,
    comments: 8,
    image: "/api/placeholder/800/600",
  },
];

const SocialProfile = () => {
  const { profileId } = useParams();
  const { user } = useAuthContext();

  const { data, isLoading: isProfileLoading } = useGetProfile(profileId!);
  const profile = data?.user;

  const [petsData] = useState<Pet[]>(samplePets);
  const [postsData] = useState<Post[]>(samplePosts);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const [showFullPost, setShowFullPost] = useState<Post | null>(null);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast("Chưa đủ thông tin", {
        description: "Vui lòng nhập tiêu đề và nội dung cho bài viết",
      });
      return;
    }
  };

  const handleViewPost = (post: Post) => {
    setShowFullPost(post);
  };

  const isLoading = isProfileLoading;

  if (isLoading) return <GlobalLoading />;
  if (!profile) return <ProfileNotFound />;
  const initialsData = {
    fullName: profile.fullName,
    email: profile.email,
    phoneNumber: profile?.phoneNumber || "",
    gender: profile.gender,
  };
  const isAuthor = user?._id === profile._id;
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Profile Header - Instagram style */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <ProfileAvatar
          fullName={profile.fullName}
          profilePicture={profile.profilePicture}
          editable={isAuthor}
        />

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.fullName}
            </h1>

            {isAuthor && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 hover:bg-orange-50 text-gray-800"
                  onClick={() => setEditMode(true)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Chỉnh sửa hồ sơ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 hover:bg-orange-50"
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            )}
          </div>

          {!editMode ? (
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">
                {profile.role === "CUSTOMER" ? "KHÁCH HÀNG" : profile.role}
                <Badge className="ml-2 bg-orange-500 text-white">
                  {profile.status === "ACTIVE"
                    ? "ĐANG HOẠT ĐỘNG"
                    : profile.status}
                </Badge>
              </p>
              <p className="text-gray-500 text-sm">
                Thành viên từ {formatDate(new Date(profile.createdAt))}
              </p>
            </div>
          ) : (
            <UpdateProfileInfoForm
              data={initialsData}
              onCancel={() => setEditMode(false)}
            />
          )}
        </div>
      </div>

      {/* Pet Stories - Instagram style */}
      <div className="overflow-x-auto mb-8">
        <div className="flex gap-4 py-2">
          {petsData.map((pet) => (
            <Dialog key={pet._id}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center gap-1">
                  <Avatar className="h-16 w-16 border-2 border-orange-400">
                    <AvatarImage src={pet.profilePicture || ""} />
                    <AvatarFallback className="bg-orange-300 text-white">
                      {pet.name?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{pet.name}</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>{pet.name}</span>
                    <Badge className="bg-orange-500 text-white text-xs">
                      {pet.species}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-orange-200">
                      <AvatarImage src={pet.profilePicture || ""} />
                      <AvatarFallback className="bg-orange-300 text-white">
                        {pet.name?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-700">
                        {pet.breed || "Giống lai"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {pet.age} tuổi • {pet.weight} kg • {pet.gender}
                      </p>
                    </div>
                  </div>

                  {pet.vaccinations?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Tiêm phòng
                      </p>
                      <div className="space-y-1">
                        {pet.vaccinations.map((vaccination, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{vaccination.name}</span>
                            <span className="text-gray-500 text-xs">
                              (Có hiệu lực đến{" "}
                              {formatDate(vaccination.expiryDate)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pet.allergies?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Dị ứng
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pet.allergies.map((allergy, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-orange-200 bg-orange-50"
                          >
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {pet.specialNeeds && pet.specialNeeds !== "Không có" && (
                    <div>
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Nhu cầu đặc biệt
                      </p>
                      <p className="text-gray-700 text-sm">
                        {pet.specialNeeds}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    Xem hồ sơ đầy đủ
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}

          <button className="flex flex-col items-center gap-1">
            <div className="h-16 w-16 rounded-full border-2 border-dashed border-orange-400 flex items-center justify-center bg-orange-50">
              <Plus className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-xs font-medium">Thêm thú cưng</span>
          </button>
        </div>
      </div>

      {/* Create Post Button - Instagram style */}
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="grid" className="flex-1">
          <TabsList className="bg-orange-50 border-orange-200 border">
            <TabsTrigger
              value="grid"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Grid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
              value="pets"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <User className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Camera className="h-4 w-4 mr-2" /> Tạo bài viết
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo bài viết mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <Input
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  placeholder="Thêm tiêu đề..."
                  className="border-orange-200 focus-visible:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  placeholder="Viết nội dung..."
                  className="border-orange-200 focus-visible:ring-orange-500 min-h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-200 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-3 text-orange-500" />
                      <p className="mb-1 text-sm text-gray-700">
                        <span className="font-medium">Nhấn để tải lên</span>{" "}
                        hoặc kéo thả
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG hoặc JPEG (Tối đa 10MB)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewPost({ ...newPost, image: file });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
                onClick={() => setShowPostModal(false)}
                disabled={false}
              >
                Hủy
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleCreatePost}
                disabled={!newPost.title || !newPost.content}
              >
                Chia sẻ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Grid - Instagram style */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {postsData.map((post) => (
          <Dialog
            key={post._id}
            open={showFullPost?._id === post._id}
            onOpenChange={(open) => !open && setShowFullPost(null)}
          >
            <DialogTrigger asChild>
              <div
                className="aspect-square bg-gray-100 relative cursor-pointer overflow-hidden group"
                onClick={() => handleViewPost(post)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="h-5 w-5 fill-white" />
                      <span className="font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-5 w-5 fill-white" />
                      <span className="font-medium">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-3/5 bg-black flex items-center justify-center">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-contain max-h-96 md:max-h-full w-full"
                  />
                </div>
                <div className="w-full md:w-2/5 p-4 flex flex-col h-full">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.profilePicture?.url || ""} />
                      <AvatarFallback className="bg-orange-400 text-white text-xs">
                        {profile.fullName
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profile.fullName}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="py-3 flex-1">
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-700">{post.content}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 pt-2 border-t mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 px-2"
                      >
                        <Heart className="h-6 w-6 mr-1" />
                        <span>{post.likes} likes</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 px-2"
                      >
                        <MessageCircle className="h-6 w-6 mr-1" />
                        <span>{post.comments} comments</span>
                      </Button>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Posted on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {postsData.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-orange-50 inline-flex rounded-full p-4 mb-4">
            <Camera className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Share photos and updates about your pets with the community.
          </p>
          <Button
            variant="default"
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setShowPostModal(true)}
          >
            <Camera className="h-4 w-4 mr-2" /> Create Your First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialProfile;

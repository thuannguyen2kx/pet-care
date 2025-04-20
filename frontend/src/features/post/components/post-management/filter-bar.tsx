/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostQueryParams } from "@/features/post/types/api.types";

interface PostFilterBarProps {
  onFilterChange: (filters: Partial<PostQueryParams>) => void;
  initialFilters?: Partial<PostQueryParams>;
  showStatusFilter?: boolean;
  showVisibilityFilter?: boolean;
  showSortOptions?: boolean;
}

export function PostFilterBar({
  onFilterChange,
  initialFilters = {},
  showStatusFilter = true,
  showVisibilityFilter = true,
  showSortOptions = true,
}: PostFilterBarProps) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "");
  const [visibility, setVisibility] = useState(initialFilters.visibility || "");
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "createdAt");
  const [sortDirection, setSortDirection] = useState(
    initialFilters.sortDirection || "desc"
  );

  // Cập nhật trạng thái khi initialFilters thay đổi
  useEffect(() => {
    setSearch(initialFilters.search || "");
    setStatus(initialFilters.status || "");
    setVisibility(initialFilters.visibility || "");
    setSortBy(initialFilters.sortBy || "createdAt");
    setSortDirection(initialFilters.sortDirection || "desc");
  }, [initialFilters]);

  const handleSearch = () => {
    const filters: Partial<PostQueryParams> = { search };
    
    if (status) filters.status = status;
    if (visibility) filters.visibility = visibility;
    if (sortBy) filters.sortBy = sortBy;
    if (sortDirection) filters.sortDirection = sortDirection;
    
    onFilterChange(filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: keyof PostQueryParams
  ) => {
    setter(value);
    
    const filters: Partial<PostQueryParams> = { 
      search,
      [field]: value 
    };
    
    if (field !== "status" && status) filters.status = status;
    if (field !== "visibility" && visibility) filters.visibility = visibility === "ALL" ? "": visibility;
    if (field !== "sortBy" && sortBy) filters.sortBy = sortBy;
    if (field !== "sortDirection" && sortDirection) filters.sortDirection = sortDirection;
    
    onFilterChange(filters);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Tìm kiếm bài viết..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {showStatusFilter && (
          <Select
            value={status}
            onValueChange={(value) => 
              handleSelectChange(value, setStatus, "status")
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="resolved">Hoạt động</SelectItem>
              <SelectItem value="pending">Đang xét duyệt</SelectItem>
              <SelectItem value="rejected">Đã chặn</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {showVisibilityFilter && (
          <Select
            value={visibility}
            onValueChange={(value) => 
              handleSelectChange(value, setVisibility, "visibility")
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Hiển thị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="public">Công khai</SelectItem>
              <SelectItem value="private">Riêng tư</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {showSortOptions && (
          <>
            <Select
              value={sortBy}
              onValueChange={(value) => 
                handleSelectChange(value, setSortBy, "sortBy")
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Ngày tạo</SelectItem>
                <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
                <SelectItem value="stats.viewCount">Lượt xem</SelectItem>
                <SelectItem value="stats.likeCount">Lượt thích</SelectItem>
                <SelectItem value="stats.commentCount">Lượt bình luận</SelectItem>
                <SelectItem value="stats.reportCount">Lượt báo cáo</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortDirection}
              onValueChange={(value) => 
                handleSelectChange(value as 'asc' | 'desc', setSortDirection as any, "sortDirection")
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Tăng dần</SelectItem>
                <SelectItem value="desc">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        
        <Button onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
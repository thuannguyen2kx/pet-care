import { getPaginationItems } from '@/shared/lib/helper';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
export function AdminBookingListPagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages);
  return (
    <Pagination className="mt-6 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {items.map((item, index) => {
          if (item.type === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item.page} className="cursor-pointer">
              <PaginationLink isActive={item.page === page} onClick={() => onPageChange(item.page)}>
                {item.page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

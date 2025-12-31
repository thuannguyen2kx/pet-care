import { useNavigate } from 'react-router';

import { employeeFilterToSearchParams } from '@/features/employee/mapping';
import type { TEmployeeFilter } from '@/features/employee/shemas';
import { paths } from '@/shared/config/paths';
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
  filter: TEmployeeFilter;
  totalPages: number;
};
export function EmployeesListPagination({ filter, totalPages }: Props) {
  const navigate = useNavigate();
  const page = filter.page;

  if (totalPages <= 1) return null;

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    navigate({
      pathname: paths.admin.employees.path,
      search: employeeFilterToSearchParams({
        ...filter,
        page: nextPage,
      }).toString(),
    });
  };
  const items = getPaginationItems(page, totalPages);
  return (
    <Pagination className="mt-6 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(page - 1)}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
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
            <PaginationItem key={item.page}>
              <PaginationLink isActive={item.page === page} onClick={() => goToPage(item.page)}>
                {item.page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(page + 1)}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const CustomPagination = ({ currentPage, totalPages, onPageChange }: CustomPaginationProps) => {
  const maxPagesToShow = 3; // 🔥 Mostra solo 5 pagine alla volta

  // 🔥 Calcola quali numeri di pagina mostrare
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* Pulsante "Precedente" */}
          <PaginationItem>
            <PaginationPrevious
              href={"#"}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Prima Pagina */}
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink href={"#"} onClick={() => onPageChange(1)} isActive={currentPage === 1}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
            </>
          )}

          {/* Pagine Visibili */}
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <PaginationItem key={startPage + i}>
              <PaginationLink
                href={"#"}
                onClick={() => onPageChange(startPage + i)}
                isActive={currentPage === startPage + i}
              >
                {startPage + i}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Ultima Pagina */}
          {endPage < totalPages && (
            <>
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={"#"} onClick={() => onPageChange(totalPages)} isActive={currentPage === totalPages}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Pulsante "Successivo" */}
          <PaginationItem>
            <PaginationNext
              href={"#"}
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;

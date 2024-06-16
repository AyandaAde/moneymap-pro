import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  length: number;
  results: number;
  setResults: (results: number) => void;
};

export default function PaginationComp({ length, results, setResults }: Props) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className={`${results === 0 && "hidden"}`}>
          <PaginationPrevious
            href="#"
            onClick={() => {
              if (results >= 5) setResults(results - 5);
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => {
              setResults(0);
            }}
            isActive={results === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>
        {length >= 5 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => {
                setResults(5);
              }}
              isActive={results === 5}
            >
              2
            </PaginationLink>
          </PaginationItem>
        )}
        {length >= 10 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => {
                setResults(10);
              }}
              isActive={results === 10}
            >
              3
            </PaginationLink>
          </PaginationItem>
        )}
        {length >= 15 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem
          className={`${
            length <= 5 ? "hidden" : results >= length - 2 && "hidden"
          }`}
        >
          <PaginationNext
            href="#"
            onClick={() => {
              if (results < length - 1) setResults(results + 5);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

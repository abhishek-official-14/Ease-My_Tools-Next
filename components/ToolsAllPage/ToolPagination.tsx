"use client"

type ToolPaginationProps = {
    currentPage: number
    totalPages: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function ToolPagination({
    currentPage,
    totalPages,
    setCurrentPage,
}: ToolPaginationProps) {
    if (totalPages <= 1) {
        return null
    }

    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <button
                type="button"
                className="rounded border px-3 py-2 disabled:opacity-50"
                disabled={currentPage === 1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setCurrentPage((p) => p - 1)}
            >
                Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    type="button"
                    className={`rounded border px-3 py-2 ${
                        page === currentPage
                            ? "bg-primary text-primary-foreground"
                            : ""
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                className="rounded border px-3 py-2 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setCurrentPage((p) => p + 1)}
            >
                Next
            </button>
        </div>
    )
}

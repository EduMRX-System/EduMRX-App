"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
    totalCount: number;
    page: number;
    totalPages: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
}

export default function PaginationControl({
    totalCount,
    page,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
}: PaginationProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [5, 10, 30];

    // Select ro'yxatidan tashqariga bosilganda uni yopish logikasi
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 select-none">

            {/* Chap tomon: Umumiylik info + Custom Page Size Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="text-xs font-medium text-foreground-muted">
                    {t("pagination.total_prefix")}{" "}
                    <span className="font-bold text-foreground">{totalCount}</span>{" "}
                    {t("pagination.total_suffix")}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-foreground-muted font-semibold">
                        {t("pagination.show")}
                    </span>

                    {/* CUSTOM SELECT DROPDOWN START */}
                    <div className="relative inline-block text-left" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 text-[13px] font-bold border border-border rounded-xl px-3 py-1.5 outline-none text-foreground bg-surface cursor-pointer hover:border-foreground-subtle focus:border-primary transition-all shadow-2xs"
                        >
                            <span>{pageSize}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-foreground-subtle transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""
                                    }`}
                            />
                        </button>

                        {isOpen && (
                            <div className="absolute bottom-full left-0 mb-1.5 w-20 rounded-xl bg-surface border border-border/80 shadow-lg py-1 z-50 animate-in fade-in slide-in-from-bottom-1 duration-150">
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setPageSize(option);
                                            setPage(1);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${option === pageSize
                                            ? "bg-primary-soft/60 text-primary"
                                            : "text-foreground-muted hover:bg-hover hover:text-foreground"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* CUSTOM SELECT DROPDOWN END */}
                </div>
            </div>

            {/* O'ng tomon: Sahifalar navigatsiyasi */}
            <ReactPaginate
                previousLabel={<ChevronLeft className="w-4 h-4" />}
                nextLabel={<ChevronRight className="w-4 h-4" />}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={(selectedItem) => setPage(selectedItem.selected + 1)}
                forcePage={page - 1}
                containerClassName={"flex items-center gap-1"}
                pageClassName={"border border-border rounded-lg hover:bg-hover transition-colors"}
                pageLinkClassName={"w-9 h-9 flex items-center justify-center text-sm font-semibold text-foreground"}
                activeClassName={"!bg-primary !border-primary"}
                activeLinkClassName={"!text-primary-fg"}
                previousClassName={"w-9 h-9 flex items-center justify-center border border-border rounded-lg hover:bg-hover text-foreground-muted transition-colors cursor-pointer"}
                nextClassName={"w-9 h-9 flex items-center justify-center border border-border rounded-lg hover:bg-hover text-foreground-muted transition-colors cursor-pointer"}
                breakClassName={"px-2 text-foreground-subtle font-bold"}
                disabledClassName={"opacity-40 cursor-not-allowed pointer-events-none"}
            />
        </div>
    );
}
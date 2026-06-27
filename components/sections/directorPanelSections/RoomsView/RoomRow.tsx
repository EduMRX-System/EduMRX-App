"use client";

import { Room } from "@/types/room";
import { DoorOpen, Users, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    room: Room;
    onEdit: (r: Room) => void;
    onDelete: (r: Room) => void;
}

export default function RoomRow({ room, onEdit, onDelete }: Props) {
    const { t } = useTranslation();
    return (
        <tr className="transition hover:bg-hover/50">
            {/* Xona */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <DoorOpen className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">{room.name}</span>
                </div>
            </td>

            {/* Sig'im */}
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-foreground-muted">
                    <Users className="h-3.5 w-3.5 text-foreground-subtle" />
                    {t("director.rooms.capacity_seats", { count: room.capacity })}
                </span>
            </td>

            {/* Amallar */}
            <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => onEdit(room)}
                        className="rounded-lg p-2 text-foreground-subtle transition hover:bg-hover hover:text-primary"
                        title={t("common.edit")}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(room)}
                        className="rounded-lg p-2 text-foreground-subtle transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title={t("common.delete")}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
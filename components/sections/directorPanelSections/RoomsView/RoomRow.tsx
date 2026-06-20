"use client";

import { Room } from "@/types/room";
import { DoorOpen, Users, Pencil, Trash2 } from "lucide-react";

interface Props {
    room: Room;
    onEdit: (r: Room) => void;
    onDelete: (r: Room) => void;
}

export default function RoomRow({ room, onEdit, onDelete }: Props) {
    return (
        <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {/* Xona */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <DoorOpen className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{room.name}</span>
                </div>
            </td>

            {/* Sig'im */}
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {room.capacity} o'rin
                </span>
            </td>

            {/* Amallar */}
            <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => onEdit(room)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        title="Tahrirlash"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(room)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title="O'chirish"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
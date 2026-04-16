"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createMeeting,
  createRoom,
  deleteRoom,
  ensureSeed,
  updateRoom,
} from "@/lib/virtual-office/store";

export async function createRoomAction(formData: FormData) {
  ensureSeed();
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  try {
    const room = createRoom({ name, description });
    revalidatePath("/rooms");
    revalidatePath("/");
    redirect(`/rooms/${room.id}`);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return { error: message } as const;
  }
}

export async function updateRoomAction(roomId: string, formData: FormData) {
  ensureSeed();
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  try {
    const room = updateRoom(roomId, { name, description });
    if (!room) return { error: "Room not found" } as const;
    revalidatePath("/rooms");
    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return { error: message } as const;
  }
}

export async function deleteRoomAction(roomId: string) {
  ensureSeed();
  const ok = deleteRoom(roomId);
  if (!ok) return { error: "Room not found" } as const;
  revalidatePath("/rooms");
  revalidatePath("/schedule");
  revalidatePath("/");
  redirect("/rooms");
}

export async function deleteRoomFromFormAction(formData: FormData) {
  const roomId = String(formData.get("roomId") ?? "");
  return deleteRoomAction(roomId);
}

export async function createMeetingAction(formData: FormData) {
  ensureSeed();
  const roomId = String(formData.get("roomId") ?? "");
  const title = String(formData.get("title") ?? "");
  const startsAt = String(formData.get("startsAt") ?? "");
  const endsRaw = formData.get("endsAt");
  const endsAt =
    endsRaw === "" || endsRaw === null
      ? undefined
      : String(endsRaw);
  try {
    createMeeting({
      roomId,
      title,
      startsAt,
      endsAt,
    });
    revalidatePath("/schedule");
    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return { error: message } as const;
  }
}

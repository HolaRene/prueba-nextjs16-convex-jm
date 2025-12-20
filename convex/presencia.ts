import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { ConvexError, v } from "convex/values";
import { Presence } from "@convex-dev/presence";
import { authComponent } from "./auth";

export const presence = new Presence(components.presence);

export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    // TODO: Add your auth checks here.

    const user = await authComponent.safeGetAuthUser(ctx)
    if(!user || user._id !== userId){
        throw new ConvexError("No autorizado")
    }
    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    // Avoid adding per-user reads so all subscriptions can share same cache.
    const entradas = await presence.list(ctx, roomToken);
    return await Promise.all(
        entradas.map(async(entrada)=>{
            const user = await authComponent.getAnyUserById(ctx, entrada.userId)
            if(!user){
                return entrada
            }
            return {
                ...entrada,
                name:user.name
            }
        })
    )
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    // Can't check auth here because it's called over http from sendBeacon.
    return await presence.disconnect(ctx, sessionToken);
  },
});
export const obtenerUserId = query({
  args: {},
  handler: async (ctx,) => {
    // Can't check auth here because it's called over http from sendBeacon.
    const user = await authComponent.safeGetAuthUser(ctx)
    return user?._id
  },
});
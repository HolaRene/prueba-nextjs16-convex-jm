"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";

interface PresenciaProps {
    roomId: Id<"blogs">
    usuarioId: string
}

const BlogsPresence = ({ roomId, usuarioId }: PresenciaProps) => {

    const presenceState = usePresence(api.presencia, roomId, usuarioId);
    if (!presenceState || presenceState.length === 0) {
        return null
    }
    return (
        <div className='flex items-center gap-2'>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Viendo ahora</p>
            <div className="text-black">
                <FacePile presenceState={presenceState ?? []} />
            </div>
        </div>
    )
}

export default BlogsPresence